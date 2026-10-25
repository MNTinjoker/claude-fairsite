// Fill these from Supabase → Project Settings → API
window.APP_CONFIG = {
  SUPABASE_URL: 'https://gyturwiuuncwgygquvim.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_R4PqdgAWBR2OE6-OQewyuQ_s6q0CPQ6',

  // 9 apps. Put each tour video in /tours and set `tour` (e.g. 'tours/app1.mp4'), or a YouTube/Aparat embed URL.
  APPS: [
    { id: 1, name: 'اپ ۱', tour: null },
    { id: 2, name: 'اپ ۲', tour: null },
    { id: 3, name: 'اپ ۳', tour: null },
    { id: 4, name: 'اپ ۴', tour: null },
    { id: 5, name: 'اپ ۵', tour: null },
    { id: 6, name: 'اپ ۶', tour: null },
    { id: 7, name: 'اپ ۷', tour: null },
    { id: 8, name: 'اپ ۸', tour: null },
    { id: 9, name: 'اپ ۹', tour: null },
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
