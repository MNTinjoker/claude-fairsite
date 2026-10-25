const cfg = window.APP_CONFIG;
const sb = supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY);
const $ = (s) => document.querySelector(s);
const view = $('#view');

let user = null;
let scores = {}; // activity_id -> points

const SEGMENTS = {
  wheel:  { title: 'گردونه شانس', activity: 'game:wheel',     src: 'games/wheel/index.html' },
  match3: { title: 'بازی ۳ تایی', activity: 'game:match3',    src: 'games/match3/index.html' },
  quiz:   { title: 'تست دانش',    activity: 'test:knowledge', src: 'games/quiz/index.html' },
};

// Hotspots traced over the 1916x821 background image.
const HOTSPOTS = [
  { route: 'apps',   label: 'اپ‌های ما',  lx: 955,  ly: 110, shape: '<path d="M822 168 L905 132 L995 185 L1082 140 L1086 310 L995 356 L905 302 L824 350 Z"/>' },
  { route: 'wheel',  label: 'گردونه شانس', lx: 705, ly: 680, shape: '<path d="M600 428 L812 428 Q852 438 862 520 L872 592 Q872 640 828 632 L758 576 L652 576 L582 632 Q538 640 542 592 L552 520 Q562 438 600 428 Z"/>' },
  { route: 'quiz',   label: 'تست دانش',   lx: 1220, ly: 680, shape: '<ellipse cx="1220" cy="526" rx="138" ry="116"/>' },
  { route: 'match3', label: 'بازی ۳ تایی', lx: 490,  ly: 220, shape: '<path d="M490 242 Q512 334 607 355 Q512 376 490 472 Q468 376 373 355 Q468 334 490 242 Z"/>' },
  { route: 'match3', label: 'بازی ۳ تایی', lx: 1428, ly: 220, shape: '<path d="M1428 242 Q1450 334 1545 355 Q1450 376 1428 472 Q1406 376 1310 355 Q1406 334 1428 242 Z"/>' },
];

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
  toast(first ? `+${data} امتیاز` : 'امتیاز فقط برای بار اول ثبت می‌شود');
}

const needsSurvey = () => !('survey' in scores) && Object.keys(scores).length > 0;

/* ---------- Views ---------- */

function renderLogin() {
  let mode = 'in';
  const draw = () => {
    view.innerHTML = `
      <section class="login">
        <form class="panel" id="f">
          <h1>${mode === 'in' ? 'ورود' : 'ثبت‌نام'}</h1>
          <label>ایمیل</label><input type="email" id="email" required autocomplete="email">
          <label>رمز عبور</label><input type="password" id="pass" required minlength="6" autocomplete="${mode === 'in' ? 'current-password' : 'new-password'}">
          <button class="btn block" id="go">${mode === 'in' ? 'ورود' : 'ثبت‌نام'}</button>
          <div class="err" id="err"></div>
          <div class="switch">${mode === 'in' ? 'حساب نداری؟' : 'حساب داری؟'} <a href="#" id="sw">${mode === 'in' ? 'ثبت‌نام' : 'ورود'}</a></div>
        </form>
      </section>`;
    $('#sw').onclick = (e) => { e.preventDefault(); mode = mode === 'in' ? 'up' : 'in'; draw(); };
    $('#f').onsubmit = async (e) => {
      e.preventDefault();
      $('#go').disabled = true; $('#err').textContent = '';
      const creds = { email: $('#email').value.trim(), password: $('#pass').value };
      const { data, error } = mode === 'in' ? await sb.auth.signInWithPassword(creds) : await sb.auth.signUp(creds);
      $('#go').disabled = false;
      if (error) return ($('#err').textContent = error.message);
      if (mode === 'up' && !data.session) $('#err').textContent = 'ایمیل تایید را چک کن.';
    };
  };
  draw();
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
  fitLanding();
  if (needsSurvey()) showSurvey();
}

// Wide screens: fill (crop top/bottom). Tall screens: show the whole image so no shape is cut off.
function fitLanding() {
  const s = $('#land');
  if (s) s.setAttribute('preserveAspectRatio', innerWidth / innerHeight > 1.6 ? 'xMidYMid slice' : 'xMidYMid meet');
}
addEventListener('resize', fitLanding);

function renderSegment(key) {
  const seg = SEGMENTS[key];
  view.innerHTML = `
    <section class="page">
      <h1>${seg.title}</h1>
      <iframe class="frame" src="${seg.src}" title="${seg.title}" allow="autoplay; fullscreen"></iframe>
      <p class="note">${seg.activity in scores ? `امتیاز ثبت‌شده: ${scores[seg.activity]}` : 'امتیاز: ۱۰ تا ۲۰ بر اساس درصد. فقط بار اول ثبت می‌شود.'}</p>
    </section>`;
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
    m.innerHTML = `<div class="panel"><h1>${cfg.SURVEY_THANKS}</h1><button class="btn block" id="sv-ok">بستن</button></div>`;
    $('#sv-ok').onclick = () => { m.hidden = true; };
    await loadScores();
    toast('+۲۰ امتیاز');
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
  const h = location.hash.replace('#/', '');
  if (SEGMENTS[h]) renderSegment(h);
  else if (h === 'apps') renderApps();
  else if (h.startsWith('apps/')) renderTour(Number(h.split('/')[1]));
  else renderLanding();
}

addEventListener('hashchange', route);
$('#logout').onclick = () => sb.auth.signOut();

let ready = false;
sb.auth.onAuthStateChange(async (_e, session) => {
  const was = user?.id;
  user = session?.user || null;
  if (ready && user?.id === was) return;
  ready = true;
  if (user) await loadScores();
  if (user && !was && location.hash.startsWith('#/login')) location.hash = '#/';
  route();
});
