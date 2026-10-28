export type CategoryId = 'economic' | 'environmental' | 'social' | 'governance';

export interface WordItem {
  id: string;
  categoryId: CategoryId;
  fa: string;
  en: string;
  tag: string;
  descriptionFa: string;
  descriptionEn: string;
  iconName: string;
}

export type LanguageMode = 'fa' | 'en';

export interface Category {
  id: CategoryId;
  fa: string;
  en: string;
  color: {
    primary: string;
    border: string;
    bg: string;
    glow: string;
    gradient: string;
    accent: string;
  };
  startAngle: number; // in degrees
  endAngle: number;   // in degrees
  iconName: string;
  taglineFa: string;
  taglineEn: string;
  explanationFa: string;
  explanationEn: string;
}

export type GameMode = 'zen' | 'timed' | 'master';
export type AppState = 'TITLE' | 'PLAYING' | 'PAUSED' | 'VICTORY' | 'GAMEOVER';

export interface SlotState {
  slotIndex: number;
  categoryId: CategoryId;
  placedWordId: string | null;
}

export interface GameStats {
  score: number;
  combo: number;
  maxCombo: number;
  correctCount: number;
  mistakesCount: number;
  startTime: number;
  elapsedSeconds: number;
  hintsUsed: number;
}
