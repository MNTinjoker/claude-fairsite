/**
 * Core Arkanoid / Paranoid Types & Interfaces
 */

export type PowerUpType = 
  | 'laser' 
  | 'expand' 
  | 'catch' 
  | 'slow' 
  | 'multiball' 
  | 'fireball' 
  | 'life' 
  | 'warp';

export type BrickColor = 'cyan' | 'pink' | 'green' | 'yellow' | 'orange' | 'red' | 'blue';

export type BrickType = 
  | BrickColor
  | 'silver' 
  | 'gold' 
  | 'tnt'
  | 'boss';

export interface Brick {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: BrickType;
  maxHp: number;
  hp: number;
  powerUp?: PowerUpType;
  points: number;
  highlightTimer?: number;
}

export interface Ball {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  speed: number;
  isStuckToPaddle: boolean;
  stuckOffset: number; // offset from paddle center
  isFireball: boolean;
  trail: { x: number; y: number; alpha: number }[];
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  targetX: number;
  speed: number;
  hasLaser: boolean;
  hasCatch: boolean;
  laserCooldown: number;
  squashStretch: number; // 1 = normal, >1 wide/flat, <1 tall/squished
}

export interface LaserBolt {
  id: string;
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
}

export interface PowerUpPill {
  id: string;
  x: number;
  y: number;
  vy: number;
  width: number;
  height: number;
  type: PowerUpType;
  rotation: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
  shape?: 'square' | 'circle' | 'spark';
}

export interface BossEnemy {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  hp: number;
  maxHp: number;
  shootCooldown: number;
  phase: number;
  hitFlash: number;
}

export interface BossProjectile {
  id: string;
  x: number;
  y: number;
  vy: number;
  radius: number;
}

export interface LevelConfig {
  name: string;
  nameFa: string;
  grid: (string | null)[][]; // 2D layout representation
  hasBoss?: boolean;
  bossHp?: number;
  backgroundColor?: string;
  gridColor?: string;
}

export type VisualTheme = 'nebula' | 'cyber' | 'solar' | 'matrix' | 'arcade';

export interface GameSettings {
  theme: VisualTheme;
  scanlines: boolean;
  particles: 'high' | 'medium' | 'low';
  screenShake: 'normal' | 'subtle' | 'off';
  bloom: boolean;
  trail: boolean;
  touchControls: boolean;
  soundVolume: number;
}

export type GameState = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export interface DiagnosticInfo {
  fps: number;
  canvasMode: 'native_roundrect' | 'fallback_poly';
  lastError: string | null;
  recoveryCount: number;
  nanGuardedCount: number;
  statusMessageFa: string;
}

export interface GameMetrics {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  bricksDestroyed: number;
  combo: number;
  highestCombo: number;
  ballsInPlay: number;
  activePowerUp: PowerUpType | null;
  powerUpTimeLeft: number;
  diagnostics?: DiagnosticInfo;
}
