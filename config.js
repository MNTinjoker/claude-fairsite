// Fill these from Supabase → Project Settings → API
window.APP_CONFIG = {
  SUPABASE_URL: 'https://YOUR-PROJECT.supabase.co',
  SUPABASE_ANON_KEY: 'YOUR-ANON-KEY',

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

  // Survey shown after the user's first finished segment. 4 questions about the apps.
  SURVEY: [
    { q: 'سوال ۱ درباره اپ‌ها؟', options: ['گزینه ۱', 'گزینه ۲', 'گزینه ۳', 'گزینه ۴'] },
    { q: 'سوال ۲ درباره اپ‌ها؟', options: ['گزینه ۱', 'گزینه ۲', 'گزینه ۳', 'گزینه ۴'] },
    { q: 'سوال ۳ درباره اپ‌ها؟', options: ['گزینه ۱', 'گزینه ۲', 'گزینه ۳', 'گزینه ۴'] },
    { q: 'سوال ۴ درباره اپ‌ها؟', options: ['گزینه ۱', 'گزینه ۲', 'گزینه ۳', 'گزینه ۴'] },
  ],
};
