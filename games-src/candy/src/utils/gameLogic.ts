import { Gem, GemType, SpecialType, MatchGroup, MatchResult } from '../types/game';

export const GRID_SIZE = 8;

export const GEM_TYPES: GemType[] = ['k_gem', 'rm_gem', 'waves_gem', 'tm_gem', 'c_gem'];

let idCounter = 0;
export function createGemId(): string {
  return `gem-${Date.now()}-${++idCounter}`;
}

export function getRandomGemType(): GemType {
  return GEM_TYPES[Math.floor(Math.random() * GEM_TYPES.length)];
}

/**
 * Creates an initial 8x8 board with NO pre-existing 3-matches,
 * and guaranteed at least one valid move.
 */
export function createInitialBoard(): (Gem | null)[][] {
  let board: (Gem | null)[][] = [];
  let attempts = 0;

  do {
    board = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: (Gem | null)[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const forbidden: GemType[] = [];
        if (c >= 2 && row[c - 1]?.type === row[c - 2]?.type) {
          forbidden.push(row[c - 1]!.type);
        }
        if (r >= 2 && board[r - 1][c]?.type === board[r - 2][c]?.type) {
          forbidden.push(board[r - 1][c]!.type);
        }

        const allowed = GEM_TYPES.filter((t) => !forbidden.includes(t));
        const pickedType = allowed[Math.floor(Math.random() * allowed.length)] || getRandomGemType();

        row.push({
          id: createGemId(),
          type: pickedType,
          special: 'none',
          row: r,
          col: c,
        });
      }
      board.push(row);
    }
    attempts++;
  } while (!hasValidMoves(board) && attempts < 50);

  return board;
}

/**
 * Checks if two positions are orthogonal neighbors
 */
export function isAdjacent(r1: number, c1: number, r2: number, c2: number): boolean {
  const dr = Math.abs(r1 - r2);
  const dc = Math.abs(c1 - c2);
  return (dr === 1 && dc === 0) || (dr === 0 && dc === 1);
}

interface RawRun {
  type: GemType;
  gems: Gem[];
  orientation: 'H' | 'V';
}

/**
 * Find all matches on the board, merging intersecting horizontal/vertical runs
 * of the same GemType so 4-gem, 5-gem, and 6+ gem combinations accurately spawn:
 * - 4 gems: Rectangular Line-Blaster Prize ('blaster_h' | 'blaster_v')
 * - 5 gems: Mega Gem ('mega_5') - 5x5 huge area blast
 * - 6+ gems: Supernova Gem ('supernova_6') - clears all of one color
 */
export function checkMatches(
  board: (Gem | null)[][],
  originR?: number,
  originC?: number
): MatchResult {
  const runs: RawRun[] = [];

  // 1. Collect all horizontal runs >= 3
  for (let r = 0; r < GRID_SIZE; r++) {
    let matchLength = 1;
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = board[r][c];
      const next = c < GRID_SIZE - 1 ? board[r][c + 1] : null;

      if (current && next && current.type === next.type) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current) {
          const matchGems: Gem[] = [];
          for (let k = matchLength - 1; k >= 0; k--) {
            const g = board[r][c - k];
            if (g) matchGems.push(g);
          }
          runs.push({ type: current.type, gems: matchGems, orientation: 'H' });
        }
        matchLength = 1;
      }
    }
  }

  // 2. Collect all vertical runs >= 3
  for (let c = 0; c < GRID_SIZE; c++) {
    let matchLength = 1;
    for (let r = 0; r < GRID_SIZE; r++) {
      const current = board[r][c];
      const next = r < GRID_SIZE - 1 ? board[r + 1][c] : null;

      if (current && next && current.type === next.type) {
        matchLength++;
      } else {
        if (matchLength >= 3 && current) {
          const matchGems: Gem[] = [];
          for (let k = matchLength - 1; k >= 0; k--) {
            const g = board[r - k][c];
            if (g) matchGems.push(g);
          }
          runs.push({ type: current.type, gems: matchGems, orientation: 'V' });
        }
        matchLength = 1;
      }
    }
  }

  // 3. Merge intersecting or overlapping runs of the same GemType into connected groups
  const usedRun = new Array(runs.length).fill(false);
  const groups: MatchGroup[] = [];
  const matchedSet = new Set<string>();

  for (let i = 0; i < runs.length; i++) {
    if (usedRun[i]) continue;
    usedRun[i] = true;

    const clusterRuns: RawRun[] = [runs[i]];
    const gemMap = new Map<string, Gem>();
    runs[i].gems.forEach((g) => gemMap.set(`${g.row},${g.col}`, g));

    let added = true;
    while (added) {
      added = false;
      for (let j = 0; j < runs.length; j++) {
        if (usedRun[j] || runs[j].type !== runs[i].type) continue;
        // Check if runs[j] shares a tile or is orthogonally adjacent to any gem in gemMap
        const sharesOrTouches = runs[j].gems.some((g) => {
          if (gemMap.has(`${g.row},${g.col}`)) return true;
          return Array.from(gemMap.values()).some(
            (existing) => isAdjacent(existing.row, existing.col, g.row, g.col)
          );
        });

        if (sharesOrTouches) {
          usedRun[j] = true;
          clusterRuns.push(runs[j]);
          runs[j].gems.forEach((g) => gemMap.set(`${g.row},${g.col}`, g));
          added = true;
        }
      }
    }

    const combinedGems = Array.from(gemMap.values());
    combinedGems.forEach((g) => matchedSet.add(`${g.row},${g.col}`));

    // Determine spawn anchor (prefer user swap origin if inside the group)
    let bestGem = combinedGems[Math.floor(combinedGems.length / 2)];
    if (originR !== undefined && originC !== undefined) {
      const originMatch = combinedGems.find((g) => g.row === originR && g.col === originC);
      if (originMatch) bestGem = originMatch;
    }

    // Determine special created based on total matched gems in this group:
    // - 6+ gems => Supernova ('supernova_6')
    // - 5 gems => Mega Gem ('mega_5')
    // - 4 gems => Rectangular Line-Blaster Prize ('blaster_h' or 'blaster_v')
    let specialCreated: SpecialType | undefined = undefined;
    if (combinedGems.length >= 6) {
      specialCreated = 'supernova_6';
    } else if (combinedGems.length === 5) {
      specialCreated = 'mega_5';
    } else if (combinedGems.length === 4) {
      const isHorizontalFour = clusterRuns.some((r) => r.orientation === 'H');
      specialCreated = isHorizontalFour ? 'blaster_h' : 'blaster_v';
    }

    groups.push({
      type: runs[i].type,
      count: combinedGems.length,
      gems: combinedGems,
      centerRow: bestGem.row,
      centerCol: bestGem.col,
      specialCreated,
    });
  }

  // 4. Process special gem chain explosions triggered by being part of a match
  const finalMatchedGems: Gem[] = [];
  const processedSpecials = new Set<string>();
  const triggeredBlasters: { row: number; col: number; isHorizontal: boolean }[] = [];
  const triggeredMegas: { row: number; col: number; type: GemType }[] = [];

  const triggerSpecial = (gem: Gem) => {
    const key = `${gem.row},${gem.col}`;
    if (processedSpecials.has(key)) return;
    processedSpecials.add(key);

    if (gem.special === 'blaster_h') {
      triggeredBlasters.push({ row: gem.row, col: gem.col, isHorizontal: true });
      for (let c = 0; c < GRID_SIZE; c++) {
        matchedSet.add(`${gem.row},${c}`);
        const blastGem = board[gem.row][c];
        if (blastGem && blastGem.special !== 'none' && !processedSpecials.has(`${gem.row},${c}`)) {
          triggerSpecial(blastGem);
        }
      }
    } else if (gem.special === 'blaster_v') {
      triggeredBlasters.push({ row: gem.row, col: gem.col, isHorizontal: false });
      for (let r = 0; r < GRID_SIZE; r++) {
        matchedSet.add(`${r},${gem.col}`);
        const blastGem = board[r][gem.col];
        if (blastGem && blastGem.special !== 'none' && !processedSpecials.has(`${r},${gem.col}`)) {
          triggerSpecial(blastGem);
        }
      }
    } else if (gem.special === 'mega_5') {
      // 5-Gem Mega Gem: Huge 5x5 area blast!
      triggeredMegas.push({ row: gem.row, col: gem.col, type: gem.type });
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const nr = gem.row + dr;
          const nc = gem.col + dc;
          if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            matchedSet.add(`${nr},${nc}`);
            const blastGem = board[nr][nc];
            if (blastGem && blastGem.special !== 'none' && !processedSpecials.has(`${nr},${nc}`)) {
              triggerSpecial(blastGem);
            }
          }
        }
      }
    } else if (gem.special === 'supernova_6') {
      // 6-Gem Supernova: Clears all gems of its color across the entire board!
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          const target = board[r][c];
          if (target && target.type === gem.type) {
            matchedSet.add(`${r},${c}`);
            if (target.special !== 'none' && !processedSpecials.has(`${r},${c}`)) {
              triggerSpecial(target);
            }
          }
        }
      }
    }
  };

  // Trigger specials on any initially matched gem
  Array.from(matchedSet).forEach((key) => {
    const [rStr, cStr] = key.split(',');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);
    const g = board[r]?.[c];
    if (g && g.special !== 'none') {
      triggerSpecial(g);
    }
  });

  // Collect all resolved matched gems
  matchedSet.forEach((key) => {
    const [rStr, cStr] = key.split(',');
    const r = parseInt(rStr, 10);
    const c = parseInt(cStr, 10);
    const g = board[r]?.[c];
    if (g) finalMatchedGems.push(g);
  });

  let maxComboMatch = 3;
  groups.forEach((grp) => {
    if (grp.count > maxComboMatch) maxComboMatch = grp.count;
  });

  // Calculate score (including Rectangular Prize bonus, Mega bonus, and Supernova bonus)
  let score = 0;
  groups.forEach((grp) => {
    if (grp.count >= 6) {
      score += 600; // Supernova creation bonus
    } else if (grp.count === 5) {
      score += 350; // Mega Gem creation bonus
    } else if (grp.count === 4) {
      score += 220; // 4-Rectangle Gem Prize bonus
    } else {
      score += 75;
    }
  });

  // Extra points for tiles blasted by specials
  const baseCount = groups.reduce((acc, g) => acc + g.count, 0);
  const extraCleared = Math.max(0, finalMatchedGems.length - baseCount);
  score += extraCleared * 55;
  score += triggeredBlasters.length * 180;
  score += triggeredMegas.length * 320;

  return {
    matchedGems: finalMatchedGems,
    groups,
    score,
    maxComboMatch,
    triggeredBlasters,
    triggeredMegas,
  };
}

/**
 * Checks if the player has at least one valid swap on the current board
 */
export function hasValidMoves(board: (Gem | null)[][]): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = board[r][c];
      if (!current) continue;

      if (current.special === 'supernova_6' || current.special === 'mega_5') {
        return true;
      }

      if (c < GRID_SIZE - 1 && board[r][c + 1]) {
        if (wouldMatch(board, r, c, r, c + 1)) return true;
      }
      if (r < GRID_SIZE - 1 && board[r + 1][c]) {
        if (wouldMatch(board, r, c, r + 1, c)) return true;
      }
    }
  }
  return false;
}

/**
 * Returns a valid swappable pair of gems to hint the player
 */
export function getHint(board: (Gem | null)[][]): { r1: number; c1: number; r2: number; c2: number } | null {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = board[r][c];
      if (!current) continue;

      if (
        (current.special === 'supernova_6' || current.special === 'mega_5') &&
        c < GRID_SIZE - 1 &&
        board[r][c + 1]
      ) {
        return { r1: r, c1: c, r2: r, c2: c + 1 };
      }

      if (c < GRID_SIZE - 1 && board[r][c + 1] && wouldMatch(board, r, c, r, c + 1)) {
        return { r1: r, c1: c, r2: r, c2: c + 1 };
      }
      if (r < GRID_SIZE - 1 && board[r + 1][c] && wouldMatch(board, r, c, r + 1, c)) {
        return { r1: r, c1: c, r2: r + 1, c2: c };
      }
    }
  }
  return null;
}

/**
 * Checks if swapping (r1, c1) with (r2, c2) creates a match
 */
function wouldMatch(board: (Gem | null)[][], r1: number, c1: number, r2: number, c2: number): boolean {
  const g1 = board[r1][c1];
  const g2 = board[r2][c2];
  if (!g1 || !g2) return false;

  if (
    g1.special === 'supernova_6' ||
    g2.special === 'supernova_6' ||
    g1.special === 'mega_5' ||
    g2.special === 'mega_5'
  ) {
    return true;
  }

  const testBoard: (Gem | null)[][] = board.map((row) => [...row]);
  testBoard[r1][c1] = { ...g2, row: r1, col: c1 };
  testBoard[r2][c2] = { ...g1, row: r2, col: c2 };

  if (hasMatchAt(testBoard, r1, c1)) return true;
  if (hasMatchAt(testBoard, r2, c2)) return true;

  return false;
}

function hasMatchAt(board: (Gem | null)[][], r: number, c: number): boolean {
  const gem = board[r][c];
  if (!gem) return false;
  const t = gem.type;

  let hCount = 1;
  for (let i = c - 1; i >= 0 && board[r][i]?.type === t; i--) hCount++;
  for (let i = c + 1; i < GRID_SIZE && board[r][i]?.type === t; i++) hCount++;
  if (hCount >= 3) return true;

  let vCount = 1;
  for (let i = r - 1; i >= 0 && board[i][c]?.type === t; i--) vCount++;
  for (let i = r + 1; i < GRID_SIZE && board[i][c]?.type === t; i++) vCount++;
  if (vCount >= 3) return true;

  return false;
}

/**
 * Shuffles current board gems when no moves remain
 */
export function shuffleBoard(board: (Gem | null)[][]): (Gem | null)[][] {
  const gems: Gem[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c]) gems.push({ ...board[r][c]! });
    }
  }

  let attempts = 0;
  let newBoard: (Gem | null)[][] = [];

  do {
    for (let i = gems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gems[i], gems[j]] = [gems[j], gems[i]];
    }

    newBoard = [];
    let idx = 0;
    for (let r = 0; r < GRID_SIZE; r++) {
      const row: (Gem | null)[] = [];
      for (let c = 0; c < GRID_SIZE; c++) {
        const g = gems[idx++];
        row.push({
          ...g,
          row: r,
          col: c,
        });
      }
      newBoard.push(row);
    }
    attempts++;
  } while ((checkMatches(newBoard).matchedGems.length > 0 || !hasValidMoves(newBoard)) && attempts < 40);

  return newBoard;
}
