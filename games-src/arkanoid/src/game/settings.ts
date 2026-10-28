import { GameSettings, VisualTheme } from './types';
export type { GameSettings, VisualTheme };

export const DEFAULT_SETTINGS: GameSettings = {
  theme: 'nebula',
  scanlines: true,
  particles: 'high',
  screenShake: 'normal',
  bloom: true,
  trail: true,
  touchControls: false,
  soundVolume: 1.0,
};

export const THEME_DETAILS: Record<VisualTheme, {
  nameEn: string;
  nameFa: string;
  bgHex: string;
  gridHex: string;
  starColor: string;
  accentHex: string;
  descEn: string;
  descFa: string;
}> = {
  nebula: {
    nameEn: 'Deep Nebula',
    nameFa: 'سحابی کیهانی',
    bgHex: '#030712',
    gridHex: 'rgba(30, 58, 138, 0.28)',
    starColor: '#ffffff',
    accentHex: '#38bdf8',
    descEn: 'Classic cosmic indigo with bright stars and cyan grid',
    descFa: 'آبی سرمه‌ای و بنفش کهکشانی با ستاره‌های درخشان و شبکه فیروزه‌ای'
  },
  cyber: {
    nameEn: 'Cyber Synthwave',
    nameFa: 'سایبر سینت‌ویو',
    bgHex: '#090514',
    gridHex: 'rgba(217, 70, 239, 0.32)',
    starColor: '#f472b6',
    accentHex: '#ec4899',
    descEn: '80s retro neon with magenta perspective grid and hot pink flares',
    descFa: 'نئون بنفش و صورتی رترو دهه ۸۰ با افکت سینت‌ویو پرانرژی'
  },
  solar: {
    nameEn: 'Solar Flare',
    nameFa: 'شراره‌های خورشیدی',
    bgHex: '#0f0502',
    gridHex: 'rgba(234, 88, 12, 0.32)',
    starColor: '#fde047',
    accentHex: '#f97316',
    descEn: 'Scorched volcanic space with molten ember grid and amber aura',
    descFa: 'فضای داغ آتشفشانی با شبکه گداخته نارنجی و اخگرهای طلایی'
  },
  matrix: {
    nameEn: 'Matrix Emerald',
    nameFa: 'ماتریکس زمردین',
    bgHex: '#021206',
    gridHex: 'rgba(34, 197, 94, 0.32)',
    starColor: '#86efac',
    accentHex: '#10b981',
    descEn: 'Cybernetic tactical terminal with glowing digital emerald grid',
    descFa: 'ترمینال تاکتیکی سایبرنتیک با شبکه دیجیتال سبز زمردی'
  },
  arcade: {
    nameEn: 'Classic Monochrome',
    nameFa: 'آرکید سیاه و سفید',
    bgHex: '#000000',
    gridHex: 'rgba(148, 163, 184, 0.22)',
    starColor: '#e2e8f0',
    accentHex: '#cbd5e1',
    descEn: 'Minimalist high-contrast pure arcade aesthetic from 1986',
    descFa: 'استایل نوستالژیک سال ۱۹۸۶ با کنتراست بالا و شبکه مینیمال خاکستری'
  }
};

const STORAGE_KEY = 'arkanoid_settings_v1';

export function loadSavedSettings(): GameSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: GameSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}
