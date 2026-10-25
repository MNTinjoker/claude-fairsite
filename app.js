const cfg = window.APP_CONFIG;
const sb = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
const $ = (s) => document.querySelector(s);
const view = $('#view');

let user = null;
let scores = {}; // activity_id -> points

const SEGMENTS = {
  wheel:  { title: 'دایره وایز', activity: 'game:wheel',     src: 'games/wheel/index.html' },
  match3: { title: 'بازی ۳ تایی', activity: 'game:match3',    src: 'games/match3/index.html' },
  quiz:   { title: 'تست دانش',    activity: 'test:knowledge', src: 'games/quiz/index.html' },
};

// Hotspots traced over the 1916x821 background image.
const HOTSPOTS = [
  { route: 'apps',   label: 'اپ‌های ما',  lx: 955,  ly: 110, shape: '<path d="M822 168 L905 132 L995 185 L1082 140 L1086 310 L995 356 L905 302 L824 350 Z"/>' },
  { route: 'wheel',  label: 'دایره وایز', lx: 705, ly: 680, shape: '<path d="M600 428 L812 428 Q852 438 862 520 L872 592 Q872 640 828 632 L758 576 L652 576 L582 632 Q538 640 542 592 L552 520 Q562 438 600 428 Z"/>' },
  { route: 'quiz',   label: 'تست دانش',   lx: 1220, ly: 680, shape: '<ellipse cx="1220" cy="526" rx="138" ry="116"/>' },
  { route: 'match3', label: 'بازی ۳ تایی', lx: 490,  ly: 220, shape: '<path d="M490 242 Q512 334 607 355 Q512 376 490 472 Q468 376 373 355 Q468 334 490 242 Z"/>' },
  { route: 'match3', label: 'بازی ۳ تایی', lx: 1428, ly: 220, shape: '<path d="M1428 242 Q1450 334 1545 355 Q1450 376 1428 472 Q1406 376 1310 355 Q1406 334 1428 242 Z"/>' },
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
    const err = (m) => { $('#go').disabled = false; $('#err').textContent = m; };
    $('#go').disabled = true; $('#err').textContent = '';
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

function renderLanding() {
  view.innerHTML = `
    <section class="landing">
      <svg viewBox="0 0 1916 821" preserveAspectRatio="xMidYMid slice" id="land">
        <image href="assets/landing-bg.png" width="1916" height="821"/>
        ${HOTSPOTS.map((h) => `
          <a href="#/${h.route}" class="hotgroup" aria-label="${h.label}">
            <g class="hot" tabindex="-1">${h.shape}</g>
            <text class="hot-label" x="${h.lx}" y="${h.ly}">${h.label}</text>
          </a>`).join('')}
      </svg>
    </section>`;
  if (needsSurvey()) showSurvey();
}


function renderSegment(key) {
  const seg = SEGMENTS[key];
  // Full screen: the game owns the whole viewport; only a small home button floats on top.
  $('#topbar').hidden = true;
  view.innerHTML = `
    <section class="fullscreen">
      <iframe src="${seg.src}" title="${seg.title}" allow="autoplay; fullscreen"></iframe>
      <a href="#/" class="home-fab" aria-label="خانه">خانه</a>
    </section>`;
  toast(seg.activity in scores ? `امتیاز ثبت‌شده: ${scores[seg.activity]}` : 'امتیاز: ۱۰ تا ۲۰ بر اساس درصد. فقط بار اول ثبت می‌شود.');
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
  else if (h.startsWith('apps/')) renderTour(Number(h.split('/')[1]));
  else renderLanding();
}

addEventListener('hashchange', route);
$('#logout').onclick = () => sb.auth.signOut();

let ready = false;
route(); // show the login right away; the auth callback re-renders once the session is known
sb.auth.onAuthStateChange(async (_e, session) => {
  const was = user?.id;
  user = session?.user || null;
  if (ready && user?.id === was) return;
  ready = true;
  if (user) await loadScores();
  if (user && !was && location.hash.startsWith('#/login')) location.hash = '#/';
  route();
});
