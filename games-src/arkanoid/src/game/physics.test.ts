import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  checkCircleRectCollision, 
  calculatePaddleBounce, 
  applyBrickDamage, 
  calculateScore,
  checkAABB,
  getPaddleY
} from './physics.ts';
import { Brick } from './types.ts';

test('checkCircleRectCollision detects clear miss', () => {
  const result = checkCircleRectCollision(10, 10, 5, 50, 50, 40, 20);
  assert.equal(result.collided, false);
});

test('checkCircleRectCollision detects direct hit from top', () => {
  // Ball at (100, 48), radius 5, rect from (80, 50) to (120, 70)
  // Distance from (100, 48) to nearest point (100, 50) is 2, less than radius 5
  const result = checkCircleRectCollision(100, 48, 5, 80, 50, 40, 20);
  assert.equal(result.collided, true);
  assert.equal(result.normalY < 0, true); // normal pointing upwards
});

test('calculatePaddleBounce angles correctly', () => {
  const paddleX = 100;
  const paddleWidth = 100; // center is at 150
  const speed = 10;

  // Center hit -> straight up
  const centerBounce = calculatePaddleBounce(150, paddleX, paddleWidth, speed);
  assert.ok(Math.abs(centerBounce.vx) < 0.001);
  assert.ok(centerBounce.vy < 0);
  assert.ok(Math.abs(centerBounce.vy - (-10)) < 0.001);

  // Far right hit -> positive vx, negative vy
  const rightBounce = calculatePaddleBounce(200, paddleX, paddleWidth, speed);
  assert.ok(rightBounce.vx > 0);
  assert.ok(rightBounce.vy < 0);

  // Far left hit -> negative vx, negative vy
  const leftBounce = calculatePaddleBounce(100, paddleX, paddleWidth, speed);
  assert.ok(leftBounce.vx < 0);
  assert.ok(leftBounce.vy < 0);
});

test('applyBrickDamage handles standard single-hit brick', () => {
  const brick: Brick = {
    id: 'b1',
    x: 0,
    y: 0,
    width: 40,
    height: 20,
    type: 'cyan',
    maxHp: 1,
    hp: 1,
    points: 100
  };

  const outcome = applyBrickDamage(brick, false, 1);
  assert.equal(outcome.destroyed, true);
  assert.equal(outcome.newHp, 0);
  assert.equal(outcome.pointsAwarded, 100);
});

test('applyBrickDamage handles silver armored brick needing multiple hits', () => {
  const silverBrick: Brick = {
    id: 's1',
    x: 0,
    y: 0,
    width: 40,
    height: 20,
    type: 'silver',
    maxHp: 2,
    hp: 2,
    points: 200
  };

  // First hit
  const hit1 = applyBrickDamage(silverBrick, false, 1);
  assert.equal(hit1.destroyed, false);
  assert.equal(hit1.newHp, 1);
  assert.equal(hit1.pointsAwarded, 20);

  // Second hit
  silverBrick.hp = hit1.newHp;
  const hit2 = applyBrickDamage(silverBrick, false, 1);
  assert.equal(hit2.destroyed, true);
  assert.equal(hit2.newHp, 0);
  assert.equal(hit2.pointsAwarded, 200);
});

test('applyBrickDamage handles gold indestructible brick', () => {
  const goldBrick: Brick = {
    id: 'g1',
    x: 0,
    y: 0,
    width: 40,
    height: 20,
    type: 'gold',
    maxHp: 999,
    hp: 999,
    points: 0
  };

  const outcome = applyBrickDamage(goldBrick, false, 1);
  assert.equal(outcome.destroyed, false);
  assert.equal(outcome.newHp, 999);
  assert.equal(outcome.pointsAwarded, 0);
});

test('calculateScore scales with combo', () => {
  assert.equal(calculateScore(100, 0), 100);
  assert.equal(calculateScore(100, 3), 150);
  assert.equal(calculateScore(100, 6), 200);
});

test('checkAABB bounding box detection', () => {
  assert.equal(checkAABB(0, 0, 10, 10, 5, 5, 10, 10), true);
  assert.equal(checkAABB(0, 0, 10, 10, 20, 20, 10, 10), false);
});

test('getPaddleY places paddle at extreme bottom on mobile', () => {
  const canvasHeight = 800;
  const paddleHeight = 16;
  // On mobile (isMobile = true), bottom margin is strictly 4px
  const mobileY = getPaddleY(canvasHeight, paddleHeight, true);
  assert.equal(mobileY, 800 - 16 - 4);
  assert.equal(mobileY, 780);

  // On desktop (isMobile = false), bottom margin is scaled (here 800 * 0.065 = 52px)
  const desktopY = getPaddleY(canvasHeight, paddleHeight, false);
  assert.equal(desktopY, 800 - 16 - 52);
  assert.equal(desktopY, 732);
});

