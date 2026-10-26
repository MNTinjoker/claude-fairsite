import { Brick, BrickType, PowerUpType } from './types';

export interface CollisionResult {
  collided: boolean;
  normalX: number;
  normalY: number;
  penetration: number;
}

/**
 * Circle to AABB Rectangle collision detection.
 * Returns whether collision occurred and collision normal vector.
 */
export function checkCircleRectCollision(
  cx: number,
  cy: number,
  radius: number,
  rx: number,
  ry: number,
  rw: number,
  rh: number
): CollisionResult {
  // Nearest point on rect to circle center
  const nearestX = Math.max(rx, Math.min(cx, rx + rw));
  const nearestY = Math.max(ry, Math.min(cy, ry + rh));

  const dx = cx - nearestX;
  const dy = cy - nearestY;
  const distanceSq = dx * dx + dy * dy;

  if (distanceSq >= radius * radius) {
    return { collided: false, normalX: 0, normalY: 0, penetration: 0 };
  }

  const distance = Math.sqrt(distanceSq);

  // If circle center is strictly inside the rectangle
  if (distance === 0) {
    // Find closest edge
    const distLeft = cx - rx;
    const distRight = rx + rw - cx;
    const distTop = cy - ry;
    const distBottom = ry + rh - cy;

    const minDist = Math.min(distLeft, distRight, distTop, distBottom);
    if (minDist === distLeft) return { collided: true, normalX: -1, normalY: 0, penetration: radius + distLeft };
    if (minDist === distRight) return { collided: true, normalX: 1, normalY: 0, penetration: radius + distRight };
    if (minDist === distTop) return { collided: true, normalX: 0, normalY: -1, penetration: radius + distTop };
    return { collided: true, normalX: 0, normalY: 1, penetration: radius + distBottom };
  }

  const normalX = dx / distance;
  const normalY = dy / distance;
  const penetration = radius - distance;

  return {
    collided: true,
    normalX,
    normalY,
    penetration
  };
}

/**
 * Calculate paddle bounce angle.
 * In classic Arkanoid, hitting the center bounces straight up,
 * while hitting the outer edges bounces at sharp angles up to ~65 degrees.
 */
export function calculatePaddleBounce(
  ballX: number,
  paddleX: number,
  paddleWidth: number,
  ballSpeed: number
): { vx: number; vy: number } {
  const safePaddleWidth = Math.max(20, paddleWidth || 100);
  const safeSpeed = Math.max(100, ballSpeed || 350);
  const safeBallX = isNaN(ballX) ? paddleX + safePaddleWidth / 2 : ballX;

  const paddleCenter = paddleX + safePaddleWidth / 2;
  const rawRatio = (safeBallX - paddleCenter) / (safePaddleWidth / 2);
  const hitRatio = Math.max(-1, Math.min(1, isNaN(rawRatio) ? 0 : rawRatio));

  // Maximum bounce angle: ~65 degrees (1.134 radians)
  const maxAngle = (65 * Math.PI) / 180;
  const bounceAngle = hitRatio * maxAngle;

  // New velocities (vy must always be negative: upward)
  const vx = safeSpeed * Math.sin(bounceAngle);
  const vy = -safeSpeed * Math.cos(bounceAngle);

  return {
    vx: isNaN(vx) ? 0 : vx,
    vy: isNaN(vy) ? -safeSpeed : vy
  };
}

/**
 * Damage rules for bricks.
 * Silver bricks take multiple hits; Gold bricks are indestructible to standard balls;
 * Fireballs destroy standard & silver bricks in one blow.
 */
export function applyBrickDamage(
  brick: Brick,
  isFireball: boolean = false,
  damage: number = 1
): { destroyed: boolean; pointsAwarded: number; newHp: number } {
  if (brick.type === 'gold') {
    // Gold is indestructible unless hit by laser/special
    if (isFireball) {
      const newHp = Math.max(0, brick.hp - 1);
      return {
        destroyed: newHp === 0,
        pointsAwarded: newHp === 0 ? 250 : 0,
        newHp
      };
    }
    return { destroyed: false, pointsAwarded: 0, newHp: brick.hp };
  }

  if (isFireball) {
    return {
      destroyed: true,
      pointsAwarded: brick.points * 1.5,
      newHp: 0
    };
  }

  const newHp = Math.max(0, brick.hp - damage);
  const destroyed = newHp === 0;
  const pointsAwarded = destroyed ? brick.points : 20;

  return { destroyed, pointsAwarded, newHp };
}

/**
 * Score calculation with combo multipliers.
 */
export function calculateScore(basePoints: number, combo: number): number {
  const multiplier = 1 + Math.min(5, Math.floor(combo / 3) * 0.5);
  return Math.round(basePoints * multiplier);
}

/**
 * Power-up drop selection.
 * Controlled probability for fun balanced arcade gameplay.
 */
export function getRandomPowerUp(): PowerUpType {
  const roll = Math.random();
  if (roll < 0.22) return 'laser';
  if (roll < 0.40) return 'expand';
  if (roll < 0.55) return 'multiball';
  if (roll < 0.70) return 'slow';
  if (roll < 0.82) return 'catch';
  if (roll < 0.92) return 'fireball';
  if (roll < 0.97) return 'life';
  return 'warp';
}

/**
 * Fast box-box intersection.
 */
export function checkAABB(
  ax: number,
  ay: number,
  aw: number,
  ah: number,
  bx: number,
  by: number,
  bw: number,
  bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

/**
 * Calculate paddle vertical positioning.
 * On mobile devices, the paddle is situated directly at the extreme bottom edge
 * (4px margin from edge) to maximize the playfield and match user touch ergonomics.
 * On desktop, comfortable breathing room is reserved.
 */
export function getPaddleY(canvasHeight: number, paddleHeight: number, isMobile: boolean): number {
  const bottomMargin = isMobile ? Math.max(40, canvasHeight * 0.1) : Math.max(34, canvasHeight * 0.065);
  return canvasHeight - paddleHeight - bottomMargin;
}

