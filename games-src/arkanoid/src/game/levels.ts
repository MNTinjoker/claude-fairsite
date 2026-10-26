import { LevelConfig, Brick, BrickType, PowerUpType } from './types';
import { getRandomPowerUp } from './physics';

export const PRESET_LEVELS: LevelConfig[] = [
  // Level 1: Classic Genesis Wall
  {
    name: 'Sector 01: Genesis Wall',
    nameFa: 'بخش ۱: دیوار آغازین',
    gridColor: 'rgba(6, 182, 212, 0.15)',
    grid: [
      ['silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver', 'silver'],
      ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red', 'red'],
      ['orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange', 'orange'],
      ['yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow', 'yellow'],
      ['green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'],
      ['blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue'],
      ['pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink', 'pink'],
    ]
  },
  // Level 2: Cyber Fortress
  {
    name: 'Sector 02: Cyber Fortress',
    nameFa: 'بخش ۲: دژ سایبری',
    gridColor: 'rgba(168, 85, 247, 0.15)',
    grid: [
      ['gold', 'silver', null, 'silver', 'gold', 'gold', 'silver', null, 'silver', 'gold'],
      ['silver', 'cyan', 'cyan', 'cyan', 'silver', 'silver', 'cyan', 'cyan', 'cyan', 'silver'],
      ['tnt', 'blue', 'tnt', 'blue', 'silver', 'silver', 'blue', 'tnt', 'blue', 'tnt'],
      [null, 'yellow', 'yellow', 'yellow', 'gold', 'gold', 'yellow', 'yellow', 'yellow', null],
      ['silver', 'pink', 'pink', 'pink', 'silver', 'silver', 'pink', 'pink', 'pink', 'silver'],
      [null, 'green', 'green', null, 'silver', 'silver', null, 'green', 'green', null],
    ]
  },
  // Level 3: Space Invader Matrix
  {
    name: 'Sector 03: Invader Glyph',
    nameFa: 'بخش ۳: نقش اینویدر فضایی',
    gridColor: 'rgba(34, 197, 94, 0.15)',
    grid: [
      [null, null, 'green', null, null, null, null, 'green', null, null],
      [null, null, null, 'green', null, null, 'green', null, null, null],
      [null, null, 'green', 'green', 'green', 'green', 'green', 'green', null, null],
      [null, 'green', 'green', 'yellow', 'green', 'green', 'yellow', 'green', 'green', null],
      ['tnt', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'tnt'],
      ['silver', null, 'green', 'green', 'green', 'green', 'green', 'green', null, 'silver'],
      ['silver', null, 'green', null, null, null, null, 'green', null, 'silver'],
      [null, null, null, 'green', 'green', 'green', 'green', null, null, null],
    ]
  },
  // Level 4: The Diamond Vault
  {
    name: 'Sector 04: Diamond Vault',
    nameFa: 'بخش ۴: گاوصندوق الماسی',
    gridColor: 'rgba(234, 179, 8, 0.15)',
    grid: [
      [null, null, null, null, 'gold', 'gold', null, null, null, null],
      [null, null, null, 'silver', 'red', 'red', 'silver', null, null, null],
      [null, null, 'silver', 'orange', 'yellow', 'yellow', 'orange', 'silver', null, null],
      [null, 'silver', 'cyan', 'pink', 'tnt', 'tnt', 'pink', 'cyan', 'silver', null],
      ['gold', 'silver', 'blue', 'green', 'silver', 'silver', 'green', 'blue', 'silver', 'gold'],
      [null, 'silver', 'cyan', 'pink', 'tnt', 'tnt', 'pink', 'cyan', 'silver', null],
      [null, null, 'silver', 'orange', 'yellow', 'yellow', 'orange', 'silver', null, null],
      [null, null, null, 'silver', 'red', 'red', 'silver', null, null, null],
      [null, null, null, null, 'gold', 'gold', null, null, null, null],
    ]
  },
  // Level 5: DOH Cyber Guardian Boss
  {
    name: 'Sector 05: D.O.H. Core Guardian',
    nameFa: 'بخش ۵: نگهبان رباتیک D.O.H',
    hasBoss: true,
    bossHp: 30,
    gridColor: 'rgba(239, 68, 68, 0.18)',
    grid: [
      ['silver', 'silver', null, null, null, null, null, null, 'silver', 'silver'],
      ['cyan', 'cyan', 'silver', null, null, null, null, 'silver', 'cyan', 'cyan'],
      [null, 'gold', 'pink', 'pink', null, null, 'pink', 'pink', 'gold', null],
      [null, null, 'gold', 'tnt', 'red', 'red', 'tnt', 'gold', null, null],
    ]
  }
];

const BRICK_POINT_MAP: Record<BrickType, number> = {
  cyan: 70,
  pink: 80,
  green: 90,
  yellow: 100,
  orange: 110,
  red: 120,
  blue: 60,
  silver: 150,
  gold: 0,
  tnt: 180,
  boss: 1000
};

/**
 * Builds active Brick instances from a level definition fitted to the playfield width and height.
 */
export function buildLevelBricks(
  levelIndex: number,
  fieldWidth: number,
  fieldTopOffset: number = 70
): { bricks: Brick[]; config: LevelConfig } {
  const isPreset = levelIndex < PRESET_LEVELS.length;
  const config = isPreset ? PRESET_LEVELS[levelIndex] : generateProceduralLevel(levelIndex);

  const cols = 10;
  const brickMargin = 4;
  const sidePadding = 20;
  const usableWidth = fieldWidth - sidePadding * 2;
  const brickWidth = Math.floor((usableWidth - (cols - 1) * brickMargin) / cols);
  const brickHeight = Math.max(16, Math.min(24, Math.floor(fieldWidth * 0.045)));

  const bricks: Brick[] = [];
  const grid = config.grid;

  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      const typeStr = grid[r][c];
      if (!typeStr) continue;

      const type = typeStr as BrickType;
      const x = sidePadding + c * (brickWidth + brickMargin);
      const y = fieldTopOffset + r * (brickHeight + brickMargin);

      // Max HP
      let maxHp = 1;
      if (type === 'silver') {
        maxHp = 2 + Math.floor(levelIndex / 2);
      } else if (type === 'gold') {
        maxHp = 999;
      }

      // Drop rate: approx 22% of destructible bricks hold a power-up
      let powerUp: PowerUpType | undefined = undefined;
      if (type !== 'gold' && Math.random() < 0.22) {
        powerUp = getRandomPowerUp();
      }

      bricks.push({
        id: `b_${r}_${c}_${levelIndex}_${Math.random()}`,
        x,
        y,
        width: brickWidth,
        height: brickHeight,
        type,
        maxHp,
        hp: maxHp,
        powerUp,
        points: BRICK_POINT_MAP[type] || 50
      });
    }
  }

  return { bricks, config };
}

/**
 * Procedural infinite generator for sector 6 and beyond
 */
function generateProceduralLevel(levelIndex: number): LevelConfig {
  const colors: BrickType[] = ['cyan', 'pink', 'green', 'yellow', 'orange', 'red', 'blue'];
  const rows = Math.min(10, 6 + (levelIndex % 4));
  const cols = 10;
  const grid: (string | null)[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: (string | null)[] = [];
    for (let c = 0; c < cols; c++) {
      const distFromCenter = Math.abs(c - 4.5);
      // Symmetrical patterns
      const roll = Math.random();
      if (roll < 0.15 && r > 2) {
        row.push(null);
      } else if (roll < 0.25) {
        row.push('silver');
      } else if (roll < 0.32 && distFromCenter > 3) {
        row.push('gold');
      } else if (roll < 0.40) {
        row.push('tnt');
      } else {
        const color = colors[(r + levelIndex) % colors.length];
        row.push(color);
      }
    }
    grid.push(row);
  }

  return {
    name: `Sector ${String(levelIndex + 1).padStart(2, '0')}: Deep Space`,
    nameFa: `بخش ${levelIndex + 1}: ژرفای کهکشان`,
    gridColor: 'rgba(59, 130, 246, 0.15)',
    grid
  };
}
