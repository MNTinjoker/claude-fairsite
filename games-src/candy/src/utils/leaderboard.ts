import { LeaderboardEntry } from '../types/game';

const STORAGE_KEY = 'candy_logo_cyber_leaderboard_v1';

const DEFAULT_SCORES: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    name: 'CyberMatrix_99',
    score: 24850,
    maxCombo: 9,
    movesUsed: 28,
    timeRemaining: 14,
    date: '2026-10-20',
  },
  {
    id: 'seed-2',
    name: 'NeonSupernova',
    score: 19420,
    maxCombo: 7,
    movesUsed: 30,
    timeRemaining: 9,
    date: '2026-10-21',
  },
  {
    id: 'seed-3',
    name: 'EmeraldRush',
    score: 15800,
    maxCombo: 6,
    movesUsed: 29,
    timeRemaining: 6,
    date: '2026-10-22',
  },
  {
    id: 'seed-4',
    name: 'MegaBlaster5x5',
    score: 12600,
    maxCombo: 5,
    movesUsed: 30,
    timeRemaining: 11,
    date: '2026-10-23',
  },
  {
    id: 'seed-5',
    name: 'RectPrizeHunter',
    score: 9450,
    maxCombo: 4,
    movesUsed: 26,
    timeRemaining: 0,
    date: '2026-10-24',
  },
];

export function getLeaderboard(): LeaderboardEntry[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const list: LeaderboardEntry[] = data ? JSON.parse(data) : DEFAULT_SCORES;
    return list.sort((a, b) => b.score - a.score);
  } catch {
    return DEFAULT_SCORES;
  }
}

export function saveLeaderboard(list: LeaderboardEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {}
}

export function addLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'date'>
): LeaderboardEntry {
  const current = getLeaderboard();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `score-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
  };

  const updated = [...current, newEntry].sort((a, b) => b.score - a.score).slice(0, 30);
  saveLeaderboard(updated);
  return newEntry;
}

export function resetLeaderboard(): void {
  saveLeaderboard(DEFAULT_SCORES);
}
