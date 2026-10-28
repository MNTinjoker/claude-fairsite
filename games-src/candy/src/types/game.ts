/**
 * Game types for Candy Logo — Cyberpunk Match-3 Puzzle Game
 */

export type GemType = 'k_gem' | 'rm_gem' | 'waves_gem' | 'tm_gem' | 'c_gem';

export type SpecialType = 'none' | 'blaster_h' | 'blaster_v' | 'mega_5' | 'supernova_6';

export interface Gem {
  id: string;
  type: GemType;
  special: SpecialType;
  row: number;
  col: number;
  isMatched?: boolean;
  isNew?: boolean;
}

export type GameMode = 'RUSH';

export type GameScreen = 'TITLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface MatchGroup {
  type: GemType;
  count: number;
  gems: Gem[];
  centerRow: number;
  centerCol: number;
  specialCreated?: SpecialType;
}

export interface MatchResult {
  matchedGems: Gem[];
  groups: MatchGroup[];
  score: number;
  maxComboMatch: number; // 3, 4, 5, 6+
  triggeredBlasters: { row: number; col: number; isHorizontal: boolean }[];
  triggeredMegas: { row: number; col: number; type: GemType }[];
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  maxCombo: number;
  movesUsed: number;
  timeRemaining: number;
  date: string;
}

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  opacity: number;
  scale: number;
  createdAt: number;
}
