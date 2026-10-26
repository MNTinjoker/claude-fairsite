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
  // Reports a raw score (not a percent); the server adds score / 1000 points.
  candy:  { title: 'پارس کندی',  activity: 'game:candy',     src: 'games/candy/index.html', raw: true },
};

// Soft blur behind labels as an SVG filter (iOS Safari ignores CSS blur on SVG shapes). Ids differ per
// SVG because one of the two is display:none, and a reference into a hidden SVG does not render.
// The green glow on the label letters is an SVG filter too, for the same reason. k scales it to screen size.
const labelBlur = (id, sd, k) => `<defs>
  <filter id="${id}" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="${sd}"/></filter>
  <filter id="${id}-glow" x="-50%" y="-80%" width="200%" height="260%">
    <feFlood flood-color="#39ff6a"/><feComposite in2="SourceAlpha" operator="in" result="g"/>
    <feGaussianBlur in="g" stdDeviation="${3 * k}" result="b1"/>
    <feGaussianBlur in="g" stdDeviation="${8 * k}" result="b2"/>
    <feGaussianBlur in="g" stdDeviation="${16 * k}" result="b3"/>
    <feMerge><feMergeNode in="b3"/><feMergeNode in="b2"/><feMergeNode in="b1"/><feMergeNode in="b1"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter></defs>`;

// Hotspots traced over the 1916x821 background image.
const HOTSPOTS = [
  { route: 'apps',   label: 'اپ‌های ما',  lx: 955,  ly: 110, shape: '<path d="M822 168 L905 132 L995 185 L1082 140 L1086 310 L995 356 L905 302 L824 350 Z"/>' },
  { route: 'wheel',  label: 'دایره وایز', lx: 705, ly: 680, shape: '<path d="M600 428 L812 428 Q852 438 862 520 L872 592 Q872 640 828 632 L758 576 L652 576 L582 632 Q538 640 542 592 L552 520 Q562 438 600 428 Z"/>' },
  { route: 'quiz',   label: 'تست دانش',   lx: 1220, ly: 680, shape: '<ellipse cx="1220" cy="526" rx="138" ry="116"/>' },
  { route: 'arkanoid', label: 'پارانویید', lx: 490,  ly: 220, shape: '<path d="M490 242 Q512 334 607 355 Q512 376 490 472 Q468 376 373 355 Q468 334 490 242 Z"/>' },
  { route: 'candy', label: 'پارس کندی', lx: 1428, ly: 220, shape: '<path d="M1428 242 Q1450 334 1545 355 Q1450 376 1428 472 Q1406 376 1310 355 Q1406 334 1428 242 Z"/>' },
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
  <div class="opts row">${['بله', 'خیر'].map((o) => `<label><input type="radio" name="p-demo" value="${o}"> ${o}</label>`).join('')}</div>
  <label>آواتار خودت را انتخاب کن</label>
  <div class="ava-pick">${Array.from({ length: 10 }, (_, i) => `<label><input type="radio" name="p-ava" value="${i + 1}"><img src="assets/avatars/a${i + 1}.webp" alt="آواتار ${i + 1}"></label>`).join('')}</div>` : ''}`;
const readProfile = () => ({
  name: $('#p-name').value.trim(),
  org: $('#p-org')?.value.trim() || '',
  phone: $('#p-phone').value.trim(),
  role: $('#p-role')?.value || '',
  wants_demo: $('input[name=p-demo]:checked')?.value === 'بله',
  avatar: Number($('input[name=p-ava]:checked')?.value) || null,
});
const profileComplete = (p) => p.name && p.phone && p.org && p.role && p.avatar && $('input[name=p-demo]:checked');

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
  $('#total').textContent = fa(Object.values(scores).reduce((a, b) => a + b, 0));
  const { data: lb } = await sb.rpc('get_leaderboard');
  const me = lb?.find((r) => r.is_me);
  $('#rank-txt').textContent = me ? `رتبه‌ی ${fa(me.rank)} از ${fa(lb.length)}` : '';
}

// Header: current page name and the user's chip.
const PAGE_NAMES = { '': 'خانه', league: 'لیگ امتیازات', admin: 'پنل مدیریت', apps: 'اپ‌های ما' };
function updateHeader(h) {
  const key = h.split('/')[0];
  $('#crumb').textContent = SEGMENTS[key]?.title || PAGE_NAMES[key] || 'خانه';
  document.querySelectorAll('#topbar .nav a').forEach((a) => a.classList.toggle('on', a.dataset.r === (key || 'home')));
  $('#hello').textContent = userName();
  $('#me-ava').src = avatarSrc({ avatar: user.user_metadata?.avatar, user_id: user.id });
}


// Only the first play counts; the server ignores repeats.
async function submit(activity, percent = null) {
  const first = !(activity in scores);
  const { data, error } = await sb.rpc('submit_score', { p_activity: activity, p_percent: percent });
  if (error) return toast('خطا در ثبت امتیاز');
  await loadScores();
  toast(hi(first ? `+${data} امتیاز` : 'امتیاز فقط برای بار اول ثبت می‌شود'));
}

// After a game or tour ends, the exit button leads to the league once.
let leagueOnExit = false;

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
    <ellipse cx="0" cy="${-fs * 0.32}" rx="${w * (tall ? 0.6 : 0.7)}" ry="${ht * (tall ? 0.7 : 0.95)}" class="shade" filter="url(#${tall ? 'lb-t' : 'lb-w'})"/>
    <text font-size="${fs}" filter="url(#${tall ? 'lb-t' : 'lb-w'}-glow)">${h.label}</text></g>`;
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
        ${labelBlur('lb-w', 10, 1.4)}
        <image href="assets/landing-bg.webp" width="1916" height="821"/>
        ${hotspots(28, false)}
      </svg>
      <svg viewBox="0 0 941 1672" preserveAspectRatio="xMidYMid slice" class="land tall">
        ${labelBlur('lb-t', 22, 2.8)}
        <image href="assets/landing-bg-mobile.webp" width="941" height="1672"/>
        <g transform="translate(-193 659) scale(0.69)">${hotspots(50, true)}</g>
      </svg>
      <h2 class="slogan">سبز فکر کن،<br>سبز بازی کن!</h2>
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
  // Full screen: the game owns the whole viewport; only the back-to-games button floats on top.
  // Each game can be played once: a finished game shows its result instead.
  if (seg.activity in scores) return segmentDone(seg);
  $('#topbar').hidden = true;
  view.innerHTML = `
    <section class="fullscreen">
      <iframe src="${seg.src}" title="${seg.title}" allow="autoplay; fullscreen"></iframe>
    </section>`;
  toast(seg.raw ? 'هر ۱۰۰۰ امتیاز بازی = ۱ امتیاز. فقط یک بار می‌توانی بازی کنی.' : 'امتیاز: ۱۰ تا ۲۰ بر اساس درصد. فقط یک بار می‌توانی بازی کنی.');
}

function segmentDone(seg) {
  $('#topbar').hidden = false;
  $('#to-games').classList.remove('in-game');
  const pts = scores[seg.activity];
  view.innerHTML = `
    <section class="page done-page">
      <div class="panel">
        <img src="assets/logo.png" alt="" class="done-logo">
        <h1>${seg.title}</h1>
        <p>${pts != null ? `این بازی را انجام دادی و <b>${fa(pts)}</b> امتیاز گرفتی.` : 'این بازی تمام شد.'}</p>
        <p class="hint">هر بازی فقط یک بار انجام می‌شود.</p>
      </div>
    </section>`;
}

const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);

// League: everyone's total and rank, with the current player highlighted.
// The avatar the user picked at sign-up; older accounts get one derived from their id.
function avatarSrc(r) {
  let n = r.avatar;
  if (!n) { let h = 0; for (const c of String(r.user_id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; n = (h % 10) + 1; }
  return `assets/avatars/a${n}.webp`;
}
const avatar = (r, cls = '') => `<img class="ava ${cls}" src="${avatarSrc(r)}" alt="">`;
const LAUREL = `<svg class="laurel" viewBox="0 0 64 42" fill="currentColor"><ellipse cx="26.2" cy="37.0" rx="5" ry="2.2" transform="rotate(-142 26.2 37.0)"/><ellipse cx="19.4" cy="32.4" rx="5" ry="2.2" transform="rotate(-114 19.4 32.4)"/><ellipse cx="15.5" cy="25.1" rx="5" ry="2.2" transform="rotate(-86 15.5 25.1)"/><ellipse cx="15.5" cy="16.9" rx="5" ry="2.2" transform="rotate(-58 15.5 16.9)"/><ellipse cx="19.4" cy="9.6" rx="5" ry="2.2" transform="rotate(-30 19.4 9.6)"/><ellipse cx="37.8" cy="37.0" rx="5" ry="2.2" transform="rotate(142 37.8 37.0)"/><ellipse cx="44.6" cy="32.4" rx="5" ry="2.2" transform="rotate(114 44.6 32.4)"/><ellipse cx="48.5" cy="25.1" rx="5" ry="2.2" transform="rotate(86 48.5 25.1)"/><ellipse cx="48.5" cy="16.9" rx="5" ry="2.2" transform="rotate(58 48.5 16.9)"/><ellipse cx="44.6" cy="9.6" rx="5" ry="2.2" transform="rotate(30 44.6 9.6)"/></svg>`;
const GIFT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8h18v4H3zM4 12h7v9H4zM13 12h7v9h-7zM11 8h2v13h-2zM12 8C9 8 7 4 9 3s3 3 3 5zm0 0c3 0 5-4 3-5s-3 3-3 5z"/></svg>';

// Gold confetti: a burst from the podium, then slow drifting sparkles.
function confetti(box) {
  const W = box.clientWidth, H = box.clientHeight;
  for (let i = 0; i < 70; i++) {
    const p = document.createElement('i');
    const big = Math.random() < .3;
    p.className = 'cf' + (big ? ' big' : '');
    box.appendChild(p);
    const a = Math.random() * Math.PI * 2, v = 80 + Math.random() * 220;
    const x0 = W / 2, y0 = H * .45, dx = Math.cos(a) * v, dy = Math.sin(a) * v * .7 - 60;
    p.animate([
      { transform: `translate(${x0}px, ${y0}px) rotate(0) scale(.2)`, opacity: 1 },
      { transform: `translate(${x0 + dx}px, ${y0 + dy}px) rotate(${180 + Math.random() * 360}deg) scale(1)`, opacity: 1, offset: .35 },
      { transform: `translate(${x0 + dx * 1.2}px, ${H + 40}px) rotate(${540 + Math.random() * 360}deg) scale(.8)`, opacity: 0 },
    ], { duration: 2600 + Math.random() * 1800, delay: 250 + Math.random() * 250, easing: 'cubic-bezier(.15,.7,.4,1)', fill: 'both' })
      .finished.then(() => drift(p, W, H));
  }
}
function drift(p, W, H) {
  if (!p.isConnected) return;
  const x = Math.random() * W, y = Math.random() * H;
  p.animate([
    { transform: `translate(${x}px, ${y}px) rotate(0) scale(.3)`, opacity: 0 },
    { transform: `translate(${x + 10}px, ${y - 30}px) rotate(180deg) scale(1)`, opacity: .9, offset: .5 },
    { transform: `translate(${x + 20}px, ${y - 60}px) rotate(360deg) scale(.3)`, opacity: 0 },
  ], { duration: 2500 + Math.random() * 3000, fill: 'both' }).finished.then(() => drift(p, W, H));
}

let leagueTab = 'all';
async function renderLeague() {
  view.innerHTML = `
    <section class="page league">
      <div class="lg-card">
        <div class="lg-tabs"><button data-t="all">همه</button><button data-t="org">سازمان من</button></div>
        <div id="lg"><div class="lg-loading">در حال بارگذاری...</div></div>
      </div>
    </section>`;
  const { data, error } = await sb.rpc('get_leaderboard');
  if (!$('#lg')) return;
  if (error) return ($('#lg').innerHTML = '<div class="lg-loading">خطا در بارگذاری لیگ</div>');
  const draw = () => {
    view.querySelectorAll('.lg-tabs button').forEach((b) => b.classList.toggle('on', b.dataset.t === leagueTab));
    const me = data.find((r) => r.is_me);
    let rows = leagueTab === 'org' && me ? data.filter((r) => r.org === me.org) : data;
    rows = rows.map((r, i) => ({ ...r, pos: i + 1 }));
    if (!rows.length) return ($('#lg').innerHTML = '<div class="lg-loading">هنوز کسی امتیاز نگرفته. اولین نفر باش!</div>');
    const pod = (r, n) => r ? `
      <div class="pod p${n} ${r.is_me ? 'me' : ''}">
        <div class="who">${avatar(r, 'big')}<div class="nm">${esc(r.name)}</div><div class="pill">${GIFT}${fa(r.total)}</div></div>
        <div class="box"><div class="top"></div><div class="front">${LAUREL}<b>${fa(n)}</b><span class="shine"></span></div></div>
      </div>` : `<div class="pod p${n} vacant"><div class="box"><div class="top"></div><div class="front">${LAUREL}<b>${fa(n)}</b></div></div></div>`;
    $('#lg').innerHTML = `
      <div class="stage"><div class="podium">${pod(rows[1], 2)}${pod(rows[0], 1)}${pod(rows[2], 3)}</div></div>
      <div class="lg-title"><h1>لیگ امتیازات</h1>${me ? `<p>رتبه‌ی تو <b>${fa(rows.find((r) => r.is_me)?.pos ?? me.rank)}</b> از ${fa(rows.length)} نفر</p>` : ''}</div>
      <div class="ranks">
        <div class="head"><span>رتبه</span><span>کاربر</span><span>امتیاز</span></div>
        ${rows.map((r, i) => `
          <div class="row ${r.is_me ? 'me' : ''}" style="--d:${(1 + i * .07).toFixed(2)}s">
            <span class="rk r${Math.min(r.pos, 4)}">${r.pos <= 3 ? LAUREL : ''}<b>${fa(r.pos)}</b></span>
            ${avatar(r)}
            <span class="nm">${esc(r.name)}<small>${esc(r.org)}</small></span>
            <span class="pts">${fa(r.total)}</span>
          </div>`).join('')}
      </div>`;
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const fx = document.createElement('div');
      fx.className = 'fx';
      $('#lg').appendChild(fx);
      confetti(fx);
    }
  };
  view.querySelectorAll('.lg-tabs button').forEach((b) => (b.onclick = () => { leagueTab = b.dataset.t; draw(); }));
  draw();
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
  if (vid) vid.onended = () => submit(activity).then(() => { leagueOnExit = true; });
  const w = $('#watched');
  if (w) w.onclick = () => { w.disabled = true; submit(activity).then(() => { leagueOnExit = true; }); };
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
     then parent.postMessage({ type: 'game-done' }, '*') once its end animations are over.
*/
addEventListener('message', (e) => {
  if (e.origin !== location.origin) return;
  const seg = SEGMENTS[location.hash.replace('#/', '')];
  if (!seg) return;
  // game-result records the score; game-done comes once the game's end animations are over.
  if (e.data?.type === 'game-result') {
    const v = seg.raw ? Number(e.data.score) : Number(e.data.percent);
    submit(seg.activity, Math.round(v || 0));
  }
  if (e.data?.type === 'game-done') {
    leagueOnExit = true;
    segmentDone(seg);
  }
});

$('#to-games').addEventListener('click', (e) => {
  if (!leagueOnExit) return;
  e.preventDefault();
  leagueOnExit = false;
  location.hash = '#/league';
});

/* ---------- Router ---------- */

function route() {
  $('#modal').hidden = true;
  if (!user) { $('#topbar').hidden = true; $('#to-games').hidden = true; return renderLogin(); }
  $('#topbar').hidden = false;
  updateHeader(location.hash.replace('#/', ''));
  const page = location.hash.replace('#/', '').split('/')[0];
  $('#to-games').hidden = !page;
  $('#to-games').classList.toggle('in-game', !!SEGMENTS[page]);
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
// Local sign-out clears the session at once, without waiting on the network.
$('#logout').onclick = async () => {
  await sb.auth.signOut({ scope: 'local' }).catch(() => {});
  user = null; isAdmin = false; scores = {};
  $('#admin-link').hidden = true;
  history.replaceState(null, '', location.pathname + location.search);
  route();
};

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
sb.auth.onAuthStateChange((event, session) => {
  const was = user?.id;
  user = session?.user || null;
  if (ready && user?.id === was) return;
  ready = true;
  // Entering the app always starts on the landing; a fresh login shows the poster again.
  if (user && !was) {
    if (event === 'SIGNED_IN') try { sessionStorage.removeItem('poster-seen'); } catch {}
    history.replaceState(null, '', location.pathname + location.search);
  }
  route();
  if (!user) { isAdmin = false; $('#admin-link').hidden = true; }
  if (user) setTimeout(async () => {
    loadRole();
    await loadScores();
    if (!$('#modal').hidden || !$('.landing')) return;
    if (needsSurvey()) showSurvey();
  }, 0);
});
