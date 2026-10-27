// Fill these from Supabase → Project Settings → API
window.APP_CONFIG = {
  SUPABASE_URL: 'https://gyturwiuuncwgygquvim.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_R4PqdgAWBR2OE6-OQewyuQ_s6q0CPQ6',

  // App tours: each video lives in /tours.
  APPS: [
    { id: 1, name: 'دستیار هوشمند پروژه', tour: 'tours/pm.mp4' },
    { id: 2, name: 'آموزش PMBOK 8', tour: 'tours/pmbok.mp4' },
    { id: 3, name: 'امکان‌سنجی پروژه‌ها', tour: 'tours/fs.mp4' },
    { id: 4, name: 'ارزیابی عملکرد سازمانی', tour: 'tours/okr.mp4' },
    { id: 5, name: 'کارت امتیازی متوازن', tour: 'tours/bsc.mp4' },
    { id: 6, name: 'مدیریت وظایف', tour: 'tours/tm.mp4' },
  ],

  // Survey shown after the user's first finished segment.
  // `options` → radio buttons; no `options` → text box. `showIf: [i, answer]` shows a question only when question i got that answer.
  SURVEY: [
    { q: 'آیا تا به حال از اپ‌های مدیریت تسک یا پروژه استفاده کرده‌اید؟', options: ['بله', 'خیر'] },
    { q: 'مهم‌ترین درخواست شما از آن اپ مدیریت پروژه چه بود؟', showIf: [0, 'بله'] },
    { q: 'آیا آن اپ نیاز شما را کاملاً پاسخ داد؟', options: ['بله', 'خیر'], showIf: [0, 'بله'] },
    { q: 'کدام نیاز شما را یک اپ مدیریت پروژه باید برطرف کند؟', showIf: [0, 'خیر'] },
    { q: 'آیا تمایل به استفاده یک‌ماهه رایگان از اپ‌های مدیریت پروژه ما را دارید؟', options: ['بله', 'خیر'] },
  ],
  SURVEY_THANKS: 'از همکاری شما سپاسگزارم',
};
