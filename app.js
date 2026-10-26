const cfg = window.APP_CONFIG;
const sb = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
const $ = (s) => document.querySelector(s);
const view = $('#view');

let user = null;
let scores = {}; // activity_id -> points

const SEGMENTS = {
  wheel:  { title: 'دایره وایز', activity: 'game:wheel',     src: 'games/wheel/index.html' },
  arkanoid: { title: 'پارانویید', activity: 'game:match3', src: 'games/arkanoid/index.html' }, // activity id kept: allowed by submit_score
  quiz:   { title: 'تست دانش',    activity: 'test:knowledge', src: 'games/quiz/index.html' },
};

// Hotspots traced over the 1916x821 background image.
const HOTSPOTS = [
  { route: 'apps',   label: 'اپ‌های ما',  lx: 955,  ly: 110, shape: '<path d="M822 168 L905 132 L995 185 L1082 140 L1086 310 L995 356 L905 302 L824 350 Z"/>' },
  { route: 'wheel',  label: 'دایره وایز', lx: 705, ly: 680, shape: '<path d="M600 428 L812 428 Q852 438 862 520 L872 592 Q872 640 828 632 L758 576 L652 576 L582 632 Q538 640 542 592 L552 520 Q562 438 600 428 Z"/>' },
  { route: 'quiz',   label: 'تست دانش',   lx: 1220, ly: 680, shape: '<ellipse cx="1220" cy="526" rx="138" ry="116"/>' },
  { route: 'arkanoid', label: 'پارانویید', lx: 490,  ly: 220, shape: '<path d="M490 242 Q512 334 607 355 Q512 376 490 472 Q468 376 373 355 Q468 334 490 242 Z"/>' },
  { route: 'arkanoid', label: 'پارانویید', lx: 1428, ly: 220, shape: '<path d="M1428 242 Q1450 334 1545 355 Q1450 376 1428 472 Q1406 376 1310 355 Q1406 334 1428 242 Z"/>' },
];

// Profile questions asked at sign-up. Stored in auth user_metadata; a trigger copies them to public.profiles.
const ROLES = ['مدیر', 'کارشناس', 'مسئول فنی', 'مدیر اصلی سازمان'];
const ICON = {
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/></svg>',
  org: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 7h1M14 7h1M9 11h1M14 11h1M10 21v-4h4v4"/></svg>',
};
// full=false → returning user: only name + phone.
const profileFields = (full = true) => `
  <div class="row2">
    <div class="field">${ICON.user}<input id="p-name" required autocomplete="name" class="rtl" placeholder="اسم شما" aria-label="اسم"></div>
    <div class="field">${ICON.phone}<input type="tel" id="p-phone" required autocomplete="tel" placeholder="شماره موبایل" aria-label="شماره تلفن" pattern="[0-9۰-۹+ ]{10,15}"></div>
  </div>
  <p class="hint">${full ? 'شماره برای ارسال پیامک «دریافت جایزه» استفاده می‌شود.' : 'با همان اسم و شماره‌ای که ثبت‌نام کردی وارد شو.'}</p>
  ${full ? `
  <label>نام سازمان‌تان چیست؟</label><div class="field">${ICON.org}<input id="p-org" autocomplete="organization" class="rtl" placeholder="نام سازمان"></div>
  <label>کدام عنوان بیشتر مشغولیت شما را توصیف می‌کند؟</label>
  <select id="p-role"><option value="">انتخاب کنید</option>${ROLES.map((r) => `<option>${r}</option>`).join('')}</select>
  <label>تمایل دارید برای دمو رایگان اپ‌ها و پیاده‌سازی رایگان یک‌ماهه با شما تماس بگیریم؟</label>
  <div class="opts row">${['بله', 'خیر'].map((o) => `<label><input type="radio" name="p-demo" value="${o}"> ${o}</label>`).join('')}</div>` : ''}`;
const readProfile = () => ({
  name: $('#p-name').value.trim(),
  org: $('#p-org')?.value.trim() || '',
  phone: $('#p-phone').value.trim(),
  role: $('#p-role')?.value || '',
  wants_demo: $('input[name=p-demo]:checked')?.value === 'بله',
});
const profileComplete = (p) => p.name && p.phone && p.org && p.role && $('input[name=p-demo]:checked');

// No email/password: the phone number is the account id and name + phone is the password.
const phoneDigits = (phone) => phone.replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/\D/g, '').slice(-10);
const credsFor = (name, phone) => ({
  email: `u${phoneDigits(phone)}@fair-login.app`,
  password: `${phoneDigits(phone)}:${name.replace(/\s+/g, ' ').trim()}`,
});
const userName = () => user?.user_metadata?.name || '';
const hi = (msg) => (userName() ? `${userName()}، ${msg}` : msg);

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast.t); toast.t = setTimeout(() => (t.hidden = true), 3000);
}

async function loadScores() {
  const { data } = await sb.from('scores').select('activity_id, points');
  scores = Object.fromEntries((data || []).map((r) => [r.activity_id, r.points]));
  $('#total').textContent = Object.values(scores).reduce((a, b) => a + b, 0);
}

// Only the first play counts; the server ignores repeats.
async function submit(activity, percent = null) {
  const first = !(activity in scores);
  const { data, error } = await sb.rpc('submit_score', { p_activity: activity, p_percent: percent });
  if (error) return toast('خطا در ثبت امتیاز');
  await loadScores();
  toast(hi(first ? `+${data} امتیاز` : 'امتیاز فقط برای بار اول ثبت می‌شود'));
}

const needsSurvey = () => !('survey' in scores) && Object.keys(scores).length > 0;

/* ---------- Views ---------- */

function renderLogin(mode = 'up') {
  view.innerHTML = `
    <section class="login">
      <div class="intro">
        <img src="assets/logo.png" alt="Pars Project" class="logo">
        <h2>با هم، آینده‌ای سبزتر می‌سازیم</h2>
        <p>ما در شرکت مدیریت پروژه پارس باور داریم که یادگیری می‌تواند جذاب و سرگرم‌کننده باشد. به همین دلیل، با ترکیب فناوری، آموزش و بازی، فضایی ساخته‌ایم تا آگاهی درباره محیط‌زیست و کاهش انتشار کربن را به تجربه‌ای متفاوت تبدیل کنیم.</p>
      </div>
      <form class="panel" id="f">
        <div class="tabs">
          <button type="button" data-m="up" class="${mode === 'up' ? 'on' : ''}">ثبت‌نام</button>
          <button type="button" data-m="in" class="${mode === 'in' ? 'on' : ''}">ورود</button>
        </div>
        <h1>${mode === 'up' ? 'ساخت حساب' : 'خوش برگشتی'}</h1>
        ${profileFields(mode === 'up')}
        <button class="btn block" id="go">${mode === 'up' ? 'ساخت حساب' : 'ورود'}</button>
        <div class="err" id="err"></div>
      </form>
    </section>`;
  view.querySelectorAll('.tabs button').forEach((b) => { b.onclick = () => renderLogin(b.dataset.m); });
  $('#f').onsubmit = async (e) => {
    e.preventDefault();
    const label = $('#go').textContent;
    const err = (m) => { $('#go').disabled = false; $('#go').textContent = label; $('#err').textContent = m; };
    $('#go').disabled = true; $('#go').textContent = 'لطفاً صبر کن...'; $('#err').textContent = '';
    const p = readProfile();
    if (phoneDigits(p.phone).length < 10) return err('شماره تلفن درست نیست.');
    const creds = credsFor(p.name, p.phone);
    if (mode === 'in') {
      const { error } = await sb.auth.signInWithPassword(creds);
      if (error) return err('اسم یا شماره درست نیست. اگر بار اول است، «ثبت‌نام» را بزن.');
      return;
    }
    if (!profileComplete(p)) return err('لطفاً به همه سوال‌ها جواب بده.');
    const { data, error } = await sb.auth.signUp({ ...creds, options: { data: p } });
    if (error) return err(/registered|exists/i.test(error.message) ? 'این شماره قبلاً ثبت شده. از «ورود» استفاده کن.' : error.message);
    if (!data.session) return err('ثبت‌نام انجام شد ولی ورود نشد. تایید ایمیل در Supabase باید خاموش باشد.');
  };
}

// Label as a glass pill. fs = font size in the svg's own units; tall=true nudges labels further off the shapes.
const hotLabel = (h, fs, tall) => {
  const w = h.label.length * fs * 0.55 + fs * 1.6, ht = fs * 1.7;
  const y = h.ly + (tall ? (h.ly < 400 ? -24 : 18) : 0);
  // Narrow phones crop the sides of the tall image (visible ≈ 420..1500 here), so pull edge labels inward.
  const x = tall ? Math.min(Math.max(h.lx, 420 + w / 2), 1500 - w / 2) : h.lx;
  return `<g class="hot-label" transform="translate(${x} ${y})">
    <ellipse cx="0" cy="${-fs * 0.32}" rx="${w * (tall ? 0.6 : 0.7)}" ry="${ht * (tall ? 0.7 : 0.95)}" class="shade"/>
    <text font-size="${fs}">${h.label}</text></g>`;
};
const hotspots = (fs, tall) => HOTSPOTS.map((h) => `
  <a href="#/${h.route}" class="hotgroup" data-route="${h.route}" aria-label="${h.label}">
    <g class="hot" tabindex="-1">${h.shape}</g>${hotLabel(h, fs, tall)}
  </a>`).join('');

function renderLanding() {
  // Wide screens use the 1916x821 image; portrait phones use the 941x1672 one. The mobile image has the
  // same shapes, smaller and lower, so the same hotspots are reused through one transform.
  view.innerHTML = `
    <section class="landing">
      <svg viewBox="0 0 1916 821" preserveAspectRatio="xMidYMid slice" class="land wide">
        <image href="assets/landing-bg.webp" width="1916" height="821"/>
        ${hotspots(28, false)}
      </svg>
      <svg viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice" class="land tall">
        <image href="assets/landing-bg-mobile.webp" width="941" height="1672"/>
        <g transform="translate(-193 659) scale(0.69)">${hotspots(50, true)}</g>
      </svg>
    </section>`;
  let seen = false;
  try { seen = sessionStorage.getItem('poster-seen') === '1'; } catch {}
  if (seen) { if (needsSurvey()) showSurvey(); return; }
  showPoster();
}

// Poster once per visit; a tap anywhere closes it and starts the segment tour.
function showPoster() {
  const m = $('#modal');
  m.innerHTML = `
    <picture class="poster">
      <source media="(max-aspect-ratio: 1/1)" srcset="assets/poster-tall.webp">
      <img src="assets/poster-wide.webp" alt="سبز بازی کن، سبز فکر کن!">
    </picture>
    <p class="poster-hint">برای ادامه هر جای صفحه را لمس کن</p>`;
  m.classList.add('poster-modal');
  m.hidden = false;
  m.onclick = () => {
    m.onclick = null; m.hidden = true; m.classList.remove('poster-modal');
    try { sessionStorage.setItem('poster-seen', '1'); } catch {}
    tourSegments();
  };
}

// Light each segment in turn with its name, then hand the page back.
function tourSegments() {
  const routes = [...new Set(HOTSPOTS.map((h) => h.route))];
  const land = $('.landing');
  if (!land) return;
  land.classList.add('touring');
  routes.forEach((r, i) => setTimeout(() => {
    land.querySelectorAll('.hotgroup').forEach((g) => g.classList.toggle('lit', g.dataset.route === r));
  }, i * 1300));
  setTimeout(() => {
    land.classList.remove('touring');
    land.querySelectorAll('.lit').forEach((g) => g.classList.remove('lit'));
    if (needsSurvey()) showSurvey();
  }, routes.length * 1300);
}

function renderSegment(key) {
  const seg = SEGMENTS[key];
  // Full screen: the game owns the whole viewport; only a small home button floats on top.
  $('#topbar').hidden = true;
  view.innerHTML = `
    <section class="fullscreen">
      <iframe src="${seg.src}" title="${seg.title}" allow="autoplay; fullscreen"></iframe>
      <a href="#/" class="home-fab" aria-label="خانه"><img src="assets/logo.png" alt="">خانه</a>
    </section>`;
  toast(seg.activity in scores ? `امتیاز ثبت‌شده: ${scores[seg.activity]}` : 'امتیاز: ۱۰ تا ۲۰ بر اساس درصد. فقط بار اول ثبت می‌شود.');
}

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// League: everyone's total and rank, with the current player highlighted.
async function renderLeague() {
  view.innerHTML = `<section class="page"><h1>لیگ امتیازات</h1><div class="panel wide-panel" id="lg">در حال بارگذاری...</div></section>`;
  const { data, error } = await sb.rpc('get_leaderboard');
  if (!$('#lg')) return;
  if (error) return ($('#lg').textContent = 'خطا در بارگذاری لیگ');
  const me = data.find((r) => r.is_me);
  $('#lg').innerHTML = `
    ${me ? `<div class="my-rank">رتبه‌ی تو: <b>${fa(me.rank)}</b> از ${fa(data.length)} نفر · امتیاز: <b>${fa(me.total)}</b></div>` : ''}
    <table class="table">
      <thead><tr><th>رتبه</th><th>نام</th><th>سازمان</th><th>امتیاز</th></tr></thead>
      <tbody>${data.map((r) => `
        <tr class="${r.is_me ? 'me' : ''}">
          <td>${r.rank <= 3 ? ['🥇', '🥈', '🥉'][r.rank - 1] : fa(r.rank)}</td>
          <td>${esc(r.name)}</td><td>${esc(r.org)}</td><td><b>${fa(r.total)}</b></td>
        </tr>`).join('')}</tbody>
    </table>`;
}

// Admin: users (scores, reset, delete) and survey answers.
async function renderAdmin(tab) {
  if (!isAdmin) await loadRole();
  if (!isAdmin) return (location.hash = '#/');
  view.innerHTML = `
    <section class="page">
      <h1>پنل مدیریت</h1>
      <div class="tabs"><a href="#/admin/users" class="${tab === 'users' ? 'on' : ''}">کاربران</a><a href="#/admin/survey" class="${tab === 'survey' ? 'on' : ''}">نظرسنجی</a></div>
      <div class="panel wide-panel" id="ad">در حال بارگذاری...</div>
    </section>`;
  if (tab === 'survey') {
    const { data, error } = await sb.rpc('admin_survey');
    if (!$('#ad')) return;
    if (error) return ($('#ad').textContent = 'خطا: ' + error.message);
    $('#ad').innerHTML = data.length ? `
      <table class="table">
        <thead><tr><th>نام</th><th>سازمان</th><th>شغل</th><th>پاسخ‌ها</th></tr></thead>
        <tbody>${data.map((r) => `
          <tr><td>${esc(r.name)}</td><td>${esc(r.org)}</td><td>${esc(r.role)}</td>
            <td class="answers">${(r.answers || []).map((a) => `<div><span>${esc(a.q)}</span> ${esc(a.a)}</div>`).join('')}</td></tr>`).join('')}</tbody>
      </table>` : 'هنوز پاسخی ثبت نشده.';
    return;
  }
  const { data, error } = await sb.rpc('admin_list_users');
  if (!$('#ad')) return;
  if (error) return ($('#ad').textContent = 'خطا: ' + error.message);
  $('#ad').innerHTML = data.length ? `
    <table class="table">
      <thead><tr><th>نام</th><th>تلفن</th><th>سازمان</th><th>شغل</th><th>دمو</th><th>امتیاز</th><th></th></tr></thead>
      <tbody>${data.map((u) => `
        <tr><td>${esc(u.name)}</td><td dir="ltr">${esc(u.phone)}</td><td>${esc(u.org)}</td><td>${esc(u.role)}</td>
          <td>${u.wants_demo ? 'بله' : 'خیر'}</td><td><b>${fa(u.total)}</b></td>
          <td class="actions"><button class="link" data-reset="${u.user_id}">ریست امتیاز</button>
            <button class="link danger" data-del="${u.user_id}">حذف</button></td></tr>`).join('')}</tbody>
    </table>` : 'هنوز کاربری ثبت‌نام نکرده.';
  const act = async (fn, id, msg) => {
    if (!confirm(msg)) return;
    const { error: e } = await sb.rpc(fn, { p_user: id });
    toast(e ? 'خطا: ' + e.message : 'انجام شد');
    renderAdmin('users');
  };
  view.querySelectorAll('[data-reset]').forEach((b) => { b.onclick = () => act('admin_reset_score', b.dataset.reset, 'امتیاز و نظرسنجی این کاربر پاک شود؟'); });
  view.querySelectorAll('[data-del]').forEach((b) => { b.onclick = () => act('admin_delete_user', b.dataset.del, 'حساب این کاربر برای همیشه حذف شود؟'); });
}

function renderApps() {
  view.innerHTML = `
    <section class="page">
      <h1>اپ‌های ما</h1>
      <div class="apps">
        ${cfg.APPS.map((a) => `
          <a class="app-btn" href="#/apps/${a.id}">
            ${'tour:' + a.id in scores ? '<span class="done">✓ دیده شد</span>' : ''}
            ${a.name}
          </a>`).join('')}
      </div>
      <p class="note">دیدن هر تور ۱۰ امتیاز.</p>
    </section>`;
}

function renderTour(id) {
  const app = cfg.APPS.find((a) => a.id === id);
  if (!app) return (location.hash = '#/apps');
  const activity = 'tour:' + id;
  let body;
  if (!app.tour) body = `<div class="empty">تور این اپ به‌زودی اضافه می‌شود.</div>`;
  else if (/\.(mp4|webm|ogg)$/i.test(app.tour)) body = `<video id="vid" src="${app.tour}" controls playsinline></video>`;
  else body = `<iframe class="tour-embed" src="${app.tour}" allowfullscreen></iframe>
               <button class="btn block" id="watched">تور را کامل دیدم</button>`;
  view.innerHTML = `
    <section class="page">
      <h1>${app.name}</h1>
      ${body}
      <p class="note"><a href="#/apps">← بازگشت به اپ‌ها</a></p>
    </section>`;
  const vid = $('#vid');
  if (vid) vid.onended = () => submit(activity);
  const w = $('#watched');
  if (w) w.onclick = () => { w.disabled = true; submit(activity); };
}

// Users who signed up before the profile questions existed answer them once after login.
function showProfile() {
  const m = $('#modal');
  m.innerHTML = `
    <form class="panel" id="pf">
      <h1>چند سوال کوتاه</h1>
      ${profileFields()}
      <button class="btn block">ادامه</button>
      <div class="err" id="pf-err"></div>
    </form>`;
  m.hidden = false;
  $('#pf').onsubmit = async (e) => {
    e.preventDefault();
    if (!profileComplete(readProfile())) return ($('#pf-err').textContent = 'لطفاً به همه سوال‌ها جواب بده.');
    const { data, error } = await sb.auth.updateUser({ data: readProfile() });
    if (error) return ($('#pf-err').textContent = error.message);
    user = data.user;
    route();
  };
}

function showSurvey() {
  const m = $('#modal');
  m.innerHTML = `
    <form class="panel" id="sv">
      <h1>نظرسنجی (۲۰ امتیاز)</h1>
      ${cfg.SURVEY.map((s, i) => `
        <div class="q" data-i="${i}"><p>${s.q}</p>
          ${s.options
            ? s.options.map((o) => `<label><input type="radio" name="q${i}" value="${o}" required> ${o}</label>`).join('')
            : `<textarea name="q${i}" rows="3" required></textarea>`}
        </div>`).join('')}
      <button class="btn block">ارسال</button>
    </form>`;
  m.hidden = false;
  const form = $('#sv');
  const visible = (s) => !s.showIf || new FormData(form).get('q' + s.showIf[0]) === s.showIf[1];
  const refresh = () => form.querySelectorAll('.q').forEach((el) => {
    const on = visible(cfg.SURVEY[el.dataset.i]);
    el.hidden = !on;
    el.querySelectorAll('input, textarea').forEach((inp) => { inp.disabled = !on; });
  });
  form.onchange = refresh;
  refresh();
  form.onsubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const answers = cfg.SURVEY.filter(visible).map((s) => ({ q: s.q, a: fd.get('q' + cfg.SURVEY.indexOf(s)) }));
    const { error } = await sb.rpc('submit_survey', { p_answers: answers });
    if (error) return toast('خطا در ارسال');
    m.innerHTML = `<div class="panel"><h1 id="sv-thanks"></h1><button class="btn block" id="sv-ok">بستن</button></div>`;
    $('#sv-thanks').textContent = hi(cfg.SURVEY_THANKS);
    $('#sv-ok').onclick = () => { m.hidden = true; };
    await loadScores();
    toast(hi('+۲۰ امتیاز'));
  };
}

/* ---------- Game bridge ----------
   Game/test pages inside the iframe report results with:
     parent.postMessage({ type: 'game-result', percent: 0..100 }, '*')
*/
addEventListener('message', (e) => {
  if (e.origin !== location.origin || e.data?.type !== 'game-result') return;
  const seg = SEGMENTS[location.hash.replace('#/', '')];
  if (seg) submit(seg.activity, Math.round(Number(e.data.percent) || 0));
});

/* ---------- Router ---------- */

function route() {
  $('#modal').hidden = true;
  if (!user) { $('#topbar').hidden = true; return renderLogin(); }
  $('#topbar').hidden = false;
  $('#hello').textContent = userName() ? `سلام ${userName()}` : '';
  if (!userName()) { view.innerHTML = ''; return showProfile(); }
  const h = location.hash.replace('#/', '');
  if (SEGMENTS[h]) renderSegment(h);
  else if (h === 'apps') renderApps();
  else if (h === 'league') renderLeague();
  else if (h.startsWith('admin')) renderAdmin(h.split('/')[1] || 'users');
  else if (h.startsWith('apps/')) renderTour(Number(h.split('/')[1]));
  else renderLanding();
}

addEventListener('hashchange', route);
$('#logout').onclick = () => sb.auth.signOut();

let ready = false;
let isAdmin = false;
async function loadRole() {
  const { data } = await sb.rpc('is_admin');
  isAdmin = data === true;
  $('#admin-link').hidden = !isAdmin;
}
route(); // show the login right away; the auth callback re-renders once the session is known
// Never await Supabase calls inside this callback: supabase-js holds its auth lock while it runs,
// which stalls signIn/signUp. Show the page first, then load scores in the background.
sb.auth.onAuthStateChange((_e, session) => {
  const was = user?.id;
  user = session?.user || null;
  if (ready && user?.id === was) return;
  ready = true;
  if (user && !was && location.hash.startsWith('#/login')) location.hash = '#/';
  route();
  if (!user) { isAdmin = false; $('#admin-link').hidden = true; }
  if (user) setTimeout(async () => {
    loadRole();
    await loadScores();
    if (!$('#modal').hidden || !$('.landing')) return;
    if (needsSurvey()) showSurvey();
  }, 0);
});
