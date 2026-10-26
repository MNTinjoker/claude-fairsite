export type Language = 'en' | 'fa';

const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

export function formatNumber(value: number | string, lang: Language): string {
  const str = typeof value === 'number' ? value.toLocaleString('en-US') : String(value);
  if (lang !== 'fa') return str;
  return str
    .replace(/\d/g, (d) => PERSIAN_DIGITS[Number(d)])
    .replace(/,/g, '٬');
}

export function getSavedLanguage(): Language {
  if (typeof window === 'undefined') return 'fa';
  const saved = localStorage.getItem('candy_logo_lang');
  if (saved === 'fa' || saved === 'en') return saved;
  return 'fa';
}

export function saveLanguage(lang: Language): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('candy_logo_lang', lang);
  }
}

export const TRANSLATIONS = {
  en: {
    langToggleLabel: 'فارسی',
    titlePart1: 'CANDY',
    titlePart2: 'LOGO',
    launchBtn: 'START',
    hudScore: 'SCORE',
    hudCombo: 'COMBO',
    hudMoves: 'MOVES',
    hudTime: 'TIME',
    noMovesTitle: 'SHUFFLING...',
    noMovesSub: 'Resetting board',
    countdownGo: 'شروع!',
    pauseTitle: 'PAUSED',
    audioOn: 'SOUND ON',
    audioOff: 'SOUND OFF',
    resumeBtn: 'RESUME',
    restartBtn: 'RESTART',
    mainMenuBtn: 'MAIN MENU',
    endReasonTime: 'TIME UP',
    endReasonMoves: 'OUT OF MOVES',
    gameOverTitle: 'عالی بازی کردی!',
    statMovesTime: 'MOVES / TIME',
    statMaxCombo: 'MAX COMBO',
    playAgainBtn: 'START',
    mainMenuShort: 'MAIN MENU',
  },
  fa: {
    langToggleLabel: 'EN',
    titlePart1: 'کندی',
    titlePart2: 'لوگو',
    launchBtn: 'بازی رو شروع کن!',
    hudScore: 'امتیاز',
    hudCombo: 'کمبو',
    hudMoves: 'حرکت',
    hudTime: 'زمان',
    noMovesTitle: 'چیدمان مجدد...',
    noMovesSub: 'در حال ترکیب مهره‌ها',
    countdownGo: 'شروع!',
    pauseTitle: 'توقف بازی',
    audioOn: 'صدا: روشن',
    audioOff: 'صدا: خاموش',
    resumeBtn: 'ادامه بازی',
    restartBtn: 'شروع دوباره',
    mainMenuBtn: 'صفحه اصلی',
    endReasonTime: 'پایان زمان!',
    endReasonMoves: 'پایان حرکت‌ها!',
    gameOverTitle: 'عالی بازی کردی!',
    statMovesTime: 'حرکت / زمان',
    statMaxCombo: 'بیشترین کمبو',
    playAgainBtn: 'بازی رو شروع کن!',
    mainMenuShort: 'صفحه اصلی',
  },
} as const;
