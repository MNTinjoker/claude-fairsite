import { Ball, Brick, LaserBolt, Paddle, Particle, PowerUpPill, PowerUpType, GameState, GameMetrics, BossEnemy, BossProjectile } from './types';
import { checkCircleRectCollision, calculatePaddleBounce, applyBrickDamage, calculateScore, checkAABB, getPaddleY } from './physics';
import { buildLevelBricks } from './levels';
import { soundManager } from './audio';
import { GameSettings, VisualTheme, DEFAULT_SETTINGS, THEME_DETAILS } from './settings';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
}

/**
 * Universal Cross-Browser Canvas roundRect Polyfill
 * Prevents TypeError crashes on mobile browsers, older WebViews, and desktop clients without native Canvas roundRect support.
 */
function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radii: number | number[]
) {
  if (typeof ctx.roundRect === 'function') {
    try {
      ctx.roundRect(x, y, w, h, radii);
      return;
    } catch {
      // Fallback if radii format is unsupported
    }
  }
  const r = typeof radii === 'number' ? radii : (Array.isArray(radii) ? (radii[0] || 0) : 0);
  const radius = Math.min(Math.abs(r), Math.abs(w) / 2, Math.abs(h) / 2);
  if (radius <= 0) {
    ctx.rect(x, y, w, h);
    return;
  }
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

export class ArkanoidEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animId: number | null = null;
  private lastTime: number = 0;

  // Viewport & Scale
  public width: number = 800;
  public height: number = 600;
  public dpr: number = 1;

  // Game Settings & Visuals
  public settings: GameSettings = { ...DEFAULT_SETTINGS };

  // Game States
  public state: GameState = 'title';
  public level: number = 0;
  public score: number = 0;
  public highScore: number = 0;
  public lives: number = 3;
  public combo: number = 0;
  public highestCombo: number = 0;
  public bricksDestroyed: number = 0;

  // Entities
  private paddle!: Paddle;
  private balls: Ball[] = [];
  private bricks: Brick[] = [];
  private levelBricks = 0;
  private laserBolts: LaserBolt[] = [];
  private powerUps: PowerUpPill[] = [];
  private particles: Particle[] = [];
  private boss: BossEnemy | null = null;
  private bossProjectiles: BossProjectile[] = [];

  // Power-up active states
  private activePowerUp: PowerUpType | null = null;
  private powerUpTimer: number = 0;

  // Juice & FX
  private hitstopTimer: number = 0;
  private screenTrauma: number = 0;
  private stars: Star[] = [];
  private floatingTexts: { x: number; y: number; text: string; color: string; life: number; vy: number }[] = [];

  // Input & Tracking
  private mouseX: number = 0;
  private touchActive: boolean = false;
  private lastInputType: 'pointer' | 'keyboard' | 'touch' = 'pointer';
  private keysHeld: Set<string> = new Set();
  private eventAbort: AbortController = new AbortController();
  private canvasRect: DOMRect | null = null;

  // Callbacks
  public onMetricsUpdate?: (metrics: GameMetrics) => void;
  public onStateChange?: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Could not get 2D context');
    this.ctx = context;

    // Load High Score
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('arkanoid_highscore');
      this.highScore = saved ? parseInt(saved, 10) || 0 : 0;
    }

    this.initStars();
    this.bindEvents();
    this.resize();
    this.resetPaddle();
  }

  private initStars() {
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * 1200,
        y: Math.random() * 1000,
        size: Math.random() < 0.2 ? 2.5 : Math.random() < 0.6 ? 1.5 : 1,
        speed: 15 + Math.random() * 35,
        alpha: 0.3 + Math.random() * 0.7
      });
    }
  }

  public resize() {
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const oldWidth = this.width || 800;
    const oldHeight = this.height || 600;

    const rect = parent.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.resetTransform?.();
    this.ctx.scale(this.dpr, this.dpr);
    this.canvasRect = this.canvas.getBoundingClientRect();

    const isMobile = this.width < 640;
    const basePaddleWidth = this.basePaddleWidth();
    const paddleHeight = Math.max(12, Math.min(18, this.height * 0.024));

    if (this.paddle) {
      this.paddle.height = paddleHeight;
      this.paddle.width = this.activePowerUp === 'expand' ? this.expandedPaddleWidth() : basePaddleWidth;
      this.paddle.y = getPaddleY(this.height, paddleHeight, isMobile);
      this.paddle.x = Math.max(6, Math.min(this.width - this.paddle.width - 6, this.paddle.x * (this.width / oldWidth)));
      this.paddle.targetX = this.paddle.x;
    }

    // Adapt active bricks layout if width changed significantly
    if (this.bricks.length > 0 && Math.abs(oldWidth - this.width) > 10) {
      const cols = 10;
      const brickMargin = 4;
      const sidePadding = isMobile ? 12 : 20;
      const usableWidth = this.width - sidePadding * 2;
      const newBrickWidth = Math.floor((usableWidth - (cols - 1) * brickMargin) / cols);
      const newBrickHeight = Math.max(16, Math.min(24, Math.floor(this.width * 0.045)));
      const topOffset = Math.max(50, this.height * 0.08);

      // Re-align bricks by column and row
      for (const b of this.bricks) {
        const parts = b.id.split('_');
        if (parts.length >= 3) {
          const r = parseInt(parts[1], 10);
          const c = parseInt(parts[2], 10);
          if (!isNaN(r) && !isNaN(c)) {
            b.x = sidePadding + c * (newBrickWidth + brickMargin);
            b.y = topOffset + r * (newBrickHeight + brickMargin);
            b.width = newBrickWidth;
            b.height = newBrickHeight;
          }
        }
      }
    }
  }

  // One source for the paddle size so power-ups always return it to its start width.
  private basePaddleWidth() {
    const isMobile = this.width < 640;
    return Math.max(isMobile ? 70 : 85, Math.min(130, this.width * (isMobile ? 0.22 : 0.16)));
  }

  private expandedPaddleWidth() {
    return Math.max(this.basePaddleWidth(), Math.min(this.width * 0.32, 160));
  }

  // Resize the paddle around its center and keep it inside the walls.
  private setPaddleWidth(w: number) {
    const shift = (this.paddle.width - w) / 2;
    const maxX = Math.max(6, this.width - w - 6);
    this.paddle.x = Math.max(6, Math.min(maxX, this.paddle.x + shift));
    this.paddle.targetX = Math.max(6, Math.min(maxX, this.paddle.targetX + shift));
    this.paddle.width = w;
  }

  private resetPaddle() {
    const isMobile = this.width < 640;
    const baseWidth = this.basePaddleWidth();
    const paddleHeight = Math.max(12, Math.min(18, this.height * 0.024));

    this.paddle = {
      x: (this.width - baseWidth) / 2,
      y: getPaddleY(this.height, paddleHeight, isMobile),
      width: baseWidth,
      height: paddleHeight,
      targetX: (this.width - baseWidth) / 2,
      speed: 850,
      hasLaser: false,
      hasCatch: false,
      laserCooldown: 0,
      squashStretch: 1
    };
  }

  private spawnBall(stuckToPaddle: boolean = true) {
    const speed = Math.max(340, Math.min(480, this.height * 0.6));
    const radius = Math.max(5.5, Math.min(8, this.width * 0.012));
    const ball: Ball = {
      id: `ball_${Math.random()}`,
      x: this.paddle.x + this.paddle.width / 2,
      y: this.paddle.y - radius - 2,
      vx: (Math.random() - 0.5) * speed * 0.5,
      vy: -speed,
      radius,
      speed,
      isStuckToPaddle: stuckToPaddle,
      stuckOffset: 0,
      isFireball: this.activePowerUp === 'fireball',
      trail: []
    };
    this.balls.push(ball);
  }

  public startRun(startLevel: number = 0) {
    this.level = startLevel;
    this.score = 0;
    this.lives = 3;
    this.combo = 0;
    this.highestCombo = 0;
    this.bricksDestroyed = 0;
    this.activePowerUp = null;
    this.powerUpTimer = 0;
    this.laserBolts = [];
    this.powerUps = [];
    this.particles = [];
    this.floatingTexts = [];
    this.bossProjectiles = [];

    this.loadLevel(this.level);
    this.setState('playing');
    this.resetPaddle();
    this.balls = [];
    this.spawnBall(true);

    if (!this.animId) {
      this.lastTime = performance.now();
      this.animId = requestAnimationFrame(this.loop);
    }
  }

  public nextLevel() {
    this.level++;
    this.activePowerUp = null;
    this.powerUpTimer = 0;
    this.laserBolts = [];
    this.powerUps = [];
    this.bossProjectiles = [];
    this.loadLevel(this.level);
    this.resetPaddle();
    this.balls = [];
    this.spawnBall(true);
    soundManager.playLevelComplete();
    this.addFloatingText(this.width / 2, this.height / 2, `SECTOR ${this.level + 1}!`, '#22d3ee');
    this.notifyMetrics();
  }

  public retry() {
    this.startRun(0);
  }

  public pause() {
    if (this.state === 'playing') {
      this.setState('paused');
    }
  }

  public resume() {
    if (this.state === 'paused') {
      this.setState('playing');
      this.lastTime = performance.now();
      if (!this.animId) {
        this.animId = requestAnimationFrame(this.loop);
      }
    }
  }

  // Run progress 0-100: share of the single level's bricks cleared.
  public progress(): number {
    if (this.state === 'victory') return 100;
    const left = this.bricks.filter(b => b.type !== 'gold' && b.hp > 0).length;
    const part = this.levelBricks ? 1 - left / this.levelBricks : 0;
    return Math.round(part * 100);
  }

  private setState(newState: GameState) {
    this.state = newState;
    if (typeof document !== 'undefined') {
      document.body.dataset.state = newState;
    }
    this.onStateChange?.(newState);
  }

  private loadLevel(levelIdx: number) {
    const { bricks, config } = buildLevelBricks(levelIdx, this.width, Math.max(50, this.height * 0.08));
    this.bricks = bricks;
    this.levelBricks = bricks.filter(b => b.type !== 'gold').length;

    if (config.hasBoss) {
      this.boss = {
        x: this.width / 2 - 45,
        y: Math.max(60, this.height * 0.1),
        width: 90,
        height: 48,
        vx: 120,
        hp: config.bossHp || 30,
        maxHp: config.bossHp || 30,
        shootCooldown: 2.0,
        phase: 1,
        hitFlash: 0
      };
    } else {
      this.boss = null;
    }
  }

  public launchStuckBalls() {
    let launched = false;
    for (const ball of this.balls) {
      if (ball.isStuckToPaddle) {
        ball.isStuckToPaddle = false;
        const angle = (ball.stuckOffset / (this.paddle.width / 2)) * (55 * Math.PI / 180);
        ball.vx = ball.speed * Math.sin(angle);
        ball.vy = -Math.abs(ball.speed * Math.cos(angle));
        launched = true;
      }
    }
    if (launched) {
      soundManager.playPaddleBounce();
    }
  }

  public shootLasers() {
    if (!this.paddle.hasLaser || this.paddle.laserCooldown > 0) return;

    this.paddle.laserCooldown = 0.22; // rapid arcade fire rate
    const boltWidth = 4;
    const boltHeight = 16;
    const vy = -680;

    // Twin laser bolts
    this.laserBolts.push({
      id: `l1_${Math.random()}`,
      x: this.paddle.x + 8,
      y: this.paddle.y - boltHeight,
      vy,
      width: boltWidth,
      height: boltHeight
    });
    this.laserBolts.push({
      id: `l2_${Math.random()}`,
      x: this.paddle.x + this.paddle.width - 8 - boltWidth,
      y: this.paddle.y - boltHeight,
      vy,
      width: boltWidth,
      height: boltHeight
    });

    soundManager.playLaserShot();

    // Muzzle flash particles
    this.createMuzzleSparks(this.paddle.x + 10, this.paddle.y);
    this.createMuzzleSparks(this.paddle.x + this.paddle.width - 10, this.paddle.y);
  }

  private applyPowerUp(type: PowerUpType) {
    soundManager.playPowerupCollect();
    this.addFloatingText(this.paddle.x + this.paddle.width / 2, this.paddle.y - 20, type.toUpperCase(), '#38bdf8');

    // Extra life is instant and leaves the running power-up alone.
    if (type === 'life' || type === 'warp') {
      this.lives++;
      this.addFloatingText(this.paddle.x + this.paddle.width / 2, this.paddle.y - 40, '+1 UP', '#4ade80');
      this.notifyMetrics();
      return;
    }

    // A new timed power-up replaces the old one, so effects never stack unseen.
    if (this.activePowerUp && this.activePowerUp !== type) this.resetPowerUpEffects();
    this.activePowerUp = type;
    this.powerUpTimer = 16; // 16 seconds duration

    switch (type) {
      case 'laser':
        this.paddle.hasLaser = true;
        break;
      case 'expand': {
        this.setPaddleWidth(this.expandedPaddleWidth());
        this.paddle.squashStretch = 1.3;
        break;
      }
      case 'catch':
        this.paddle.hasCatch = true;
        break;
      case 'slow':
        for (const ball of this.balls) {
          ball.speed = Math.max(260, ball.speed * 0.75);
          const currentVel = Math.hypot(ball.vx, ball.vy);
          if (currentVel > 0) {
            ball.vx = (ball.vx / currentVel) * ball.speed;
            ball.vy = (ball.vy / currentVel) * ball.speed;
          }
        }
        break;
      case 'multiball': {
        const referenceBall = this.balls[0] || { x: this.paddle.x + this.paddle.width / 2, y: this.paddle.y - 12, speed: 380 };
        const baseSpeed = referenceBall.speed || 380;
        this.balls.push({
          id: `ball_m1_${Math.random()}`,
          x: referenceBall.x,
          y: referenceBall.y,
          vx: -baseSpeed * 0.65,
          vy: -baseSpeed * 0.75,
          radius: referenceBall.radius || 6,
          speed: baseSpeed,
          isStuckToPaddle: false,
          stuckOffset: 0,
          isFireball: referenceBall.isFireball || false,
          trail: []
        });
        this.balls.push({
          id: `ball_m2_${Math.random()}`,
          x: referenceBall.x,
          y: referenceBall.y,
          vx: baseSpeed * 0.65,
          vy: -baseSpeed * 0.75,
          radius: referenceBall.radius || 6,
          speed: baseSpeed,
          isStuckToPaddle: false,
          stuckOffset: 0,
          isFireball: referenceBall.isFireball || false,
          trail: []
        });
        break;
      }
      case 'fireball':
        for (const ball of this.balls) {
          ball.isFireball = true;
        }
        break;
    }
    this.notifyMetrics();
  }

  private resetPowerUpEffects() {
    this.paddle.hasLaser = false;
    this.paddle.hasCatch = false;
    this.setPaddleWidth(this.basePaddleWidth());
    for (const ball of this.balls) {
      ball.isFireball = false;
    }
  }

  private clearPowerUp() {
    this.activePowerUp = null;
    this.resetPowerUpEffects();
    this.notifyMetrics();
  }

  // Diagnostic & Error Self-Healing Monitors
  private fpsCounter: number = 60;
  private frameTimes: number[] = [];
  private lastError: string | null = null;
  private recoveryCount: number = 0;
  private nanGuardedCount: number = 0;
  private statusMessageFa: string = 'سیستم کاملاً پایدار و فعال است';

  private notifyMetrics() {
    this.onMetricsUpdate?.({
      score: this.score,
      highScore: this.highScore,
      lives: this.lives,
      level: this.level + 1,
      bricksDestroyed: this.bricksDestroyed,
      combo: this.combo,
      highestCombo: this.highestCombo,
      ballsInPlay: this.balls.length,
      activePowerUp: this.activePowerUp,
      powerUpTimeLeft: Math.max(0, this.powerUpTimer),
      diagnostics: {
        fps: this.fpsCounter,
        canvasMode: typeof this.ctx?.roundRect === 'function' ? 'native_roundrect' : 'fallback_poly',
        lastError: this.lastError,
        recoveryCount: this.recoveryCount,
        nanGuardedCount: this.nanGuardedCount,
        statusMessageFa: this.lastError
          ? `خطای شناسایی شده: ${this.lastError.slice(0, 45)} (بازنشانی خودکار انجام شد)`
          : (this.recoveryCount > 0 ? `بازیابی پایداری (${this.recoveryCount} بار)` : 'سیستم فیزیک کاملاً پایدار و روان است')
      }
    });
  }

  // --- Main 60 FPS Resilient Game Loop ---
  private loop = (time: number) => {
    try {
      const rawDt = this.lastTime ? (time - this.lastTime) / 1000 : 0.016;
      this.lastTime = time;

      // Realtime FPS Counter calculation
      if (rawDt > 0) {
        const instantFps = Math.min(120, Math.max(1, 1 / rawDt));
        this.frameTimes.push(instantFps);
        if (this.frameTimes.length > 30) this.frameTimes.shift();
        this.fpsCounter = Math.round(this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length);
      }

      // Safe DT clamp preventing huge skips after tab sleeping
      const dt = Math.min(Math.max(0.001, rawDt), 0.05);

      if (this.state === 'playing') {
        this.update(dt);
      }
      this.render();
    } catch (err) {
      this.recoveryCount++;
      const errMsg = err instanceof Error ? err.message : String(err);
      this.lastError = errMsg;
      console.error('[Arkanoid Engine Self-Healing Recovery]:', err);

      // Auto-recover physics anomalies
      this.autoRecoverEntities();
      this.notifyMetrics();
    } finally {
      // GUARANTEED RE-SCHEDULE: The game loop can NEVER die or permanently hang
      this.animId = requestAnimationFrame(this.loop);
    }
  };

  public autoRecoverEntities() {
    const minX = 6;
    const maxX = Math.max(minX, this.width - (this.paddle?.width || 100) - 6);
    if (!this.paddle || isNaN(this.paddle.x) || isNaN(this.paddle.targetX) || isNaN(this.paddle.y)) {
      this.resetPaddle();
      this.nanGuardedCount++;
    } else {
      this.paddle.x = Math.max(minX, Math.min(maxX, this.paddle.x));
      this.paddle.targetX = Math.max(minX, Math.min(maxX, this.paddle.targetX));
    }

    if (!this.balls || this.balls.length === 0) {
      if (this.state === 'playing') {
        this.spawnBall(true);
      }
    } else {
      for (let i = this.balls.length - 1; i >= 0; i--) {
        const ball = this.balls[i];
        if (isNaN(ball.x) || isNaN(ball.y) || isNaN(ball.vx) || isNaN(ball.vy) || !isFinite(ball.x) || !isFinite(ball.y)) {
          this.nanGuardedCount++;
          ball.x = this.paddle.x + this.paddle.width / 2;
          ball.y = this.paddle.y - 12;
          ball.vx = 0;
          ball.vy = -ball.speed;
          ball.isStuckToPaddle = true;
        }
      }
    }
  }

  private updatePaddle(dt: number) {
    // Keyboard paddle control
    let moveDir = 0;
    if (this.keysHeld.has('ArrowLeft') || this.keysHeld.has('KeyA')) moveDir -= 1;
    if (this.keysHeld.has('ArrowRight') || this.keysHeld.has('KeyD')) moveDir += 1;

    if (moveDir !== 0) {
      this.lastInputType = 'keyboard';
      this.paddle.targetX += moveDir * this.paddle.speed * dt;
    }

    // Border clamping
    const minX = 6;
    const maxX = Math.max(minX, this.width - this.paddle.width - 6);
    this.paddle.targetX = Math.max(minX, Math.min(maxX, this.paddle.targetX));

    // Snappy, silky-smooth paddle tracking (no lag, no rubber-banding)
    const diff = this.paddle.targetX - this.paddle.x;
    if (Math.abs(diff) < 0.25) {
      this.paddle.x = this.paddle.targetX;
    } else {
      // 48 * dt gives immediate, crisp follow-through for rapid mouse sweeps & mobile drags
      this.paddle.x += diff * Math.min(1, 48 * dt);
    }
    this.paddle.x = Math.max(minX, Math.min(maxX, this.paddle.x));

    // Paddle squash damping
    if (this.paddle.squashStretch !== 1) {
      this.paddle.squashStretch += (1 - this.paddle.squashStretch) * Math.min(1, 12 * dt);
    }

    // Laser cooldown
    if (this.paddle.laserCooldown > 0) {
      this.paddle.laserCooldown -= dt;
    }
  }

  private update(dt: number) {
    // CRITICAL FIX: Always update paddle and player input FIRST so player controls never hitch or freeze
    this.updatePaddle(dt);

    // Hitstop freeze (renders, particles & camera shake continue ticking, simulation pauses)
    if (this.hitstopTimer > 0) {
      this.hitstopTimer -= dt;
      this.updateJuiceOnly(dt);
      return;
    }

    // Power-up countdown
    if (this.activePowerUp && this.activePowerUp !== 'life' && this.activePowerUp !== 'warp') {
      this.powerUpTimer -= dt;
      if (this.powerUpTimer <= 0) {
        this.clearPowerUp();
      }
    }

    // Update Balls
    this.updateBalls(dt);

    // Update Lasers
    this.updateLasers(dt);

    // Update Power-up Pills
    this.updatePowerUps(dt);

    // Update Boss (if active)
    if (this.boss) {
      this.updateBoss(dt);
    }

    // Update Juice (Screen shake, Particles, Floating Texts, Stars)
    this.updateJuiceOnly(dt);

    // Win condition check (all non-gold bricks destroyed)
    const destructibleLeft = this.bricks.filter(b => b.type !== 'gold' && b.hp > 0).length;
    if (destructibleLeft === 0 && (!this.boss || this.boss.hp <= 0)) {
      if (this.level >= 0) { // Single level: clearing it wins
        this.setState('victory');
        soundManager.playLevelComplete();
      } else {
        this.nextLevel();
      }
    }
  }

  private updateBalls(dt: number) {
    for (let i = this.balls.length - 1; i >= 0; i--) {
      const ball = this.balls[i];

      // Sanity check NaN or Infinity coordinates
      if (isNaN(ball.x) || isNaN(ball.y) || isNaN(ball.vx) || isNaN(ball.vy)) {
        ball.x = this.paddle.x + this.paddle.width / 2;
        ball.y = this.paddle.y - 12;
        ball.vx = 0;
        ball.vy = -ball.speed;
        ball.isStuckToPaddle = true;
        this.nanGuardedCount++;
        continue;
      }

      // If stuck to paddle
      if (ball.isStuckToPaddle) {
        ball.x = this.paddle.x + this.paddle.width / 2 + ball.stuckOffset;
        ball.y = this.paddle.y - ball.radius - 2;
        continue;
      }

      // Anti-stuck vertical velocity nudge (prevents infinite horizontal bouncing loop)
      if (Math.abs(ball.vy) < 40) {
        ball.vy = ball.vy < 0 ? -60 : 60;
      }

      // Ball trail history
      ball.trail.unshift({ x: ball.x, y: ball.y, alpha: 0.6 });
      if (ball.trail.length > 8) ball.trail.pop();
      for (const t of ball.trail) {
        t.alpha -= dt * 2.5;
      }

      // Movement
      ball.x += ball.vx * dt;
      ball.y += ball.vy * dt;

      // Wall Collisions
      const minX = ball.radius + 4;
      const maxX = this.width - ball.radius - 4;
      const minY = ball.radius + 4;

      if (ball.x <= minX) {
        ball.x = minX;
        ball.vx = Math.abs(ball.vx);
        soundManager.playWallBounce();
        this.createWallSparks(ball.x, ball.y, 1, 0);
      } else if (ball.x >= maxX) {
        ball.x = maxX;
        ball.vx = -Math.abs(ball.vx);
        soundManager.playWallBounce();
        this.createWallSparks(ball.x, ball.y, -1, 0);
      }

      if (ball.y <= minY) {
        ball.y = minY;
        ball.vy = Math.abs(ball.vy);
        soundManager.playWallBounce();
        this.createWallSparks(ball.x, ball.y, 0, 1);
      }

      // Paddle Collision
      if (ball.vy > 0 && ball.y + ball.radius >= this.paddle.y && ball.y - ball.radius <= this.paddle.y + this.paddle.height) {
        if (ball.x >= this.paddle.x - 4 && ball.x <= this.paddle.x + this.paddle.width + 4) {
          // If paddle has catch mode
          if (this.paddle.hasCatch) {
            ball.isStuckToPaddle = true;
            ball.stuckOffset = Math.max(-this.paddle.width / 2 + 6, Math.min(this.paddle.width / 2 - 6, ball.x - (this.paddle.x + this.paddle.width / 2)));
            ball.y = this.paddle.y - ball.radius - 2;
            soundManager.playPaddleBounce();
            continue;
          }

          // Arkanoid classic angular bounce
          const bounce = calculatePaddleBounce(ball.x, this.paddle.x, this.paddle.width, ball.speed);
          ball.vx = bounce.vx;
          ball.vy = bounce.vy;
          ball.y = this.paddle.y - ball.radius - 1;

          // Squash paddle slightly
          this.paddle.squashStretch = 1.25;

          // Reset combo streak on paddle catch
          this.combo = 0;
          this.notifyMetrics();

          soundManager.playPaddleBounce();
          this.createPaddleSparks(ball.x, this.paddle.y);
        }
      }

      // Brick Collisions
      this.checkBallBrickCollisions(ball);

      // Boss Collision
      if (this.boss && this.boss.hp > 0) {
        const col = checkCircleRectCollision(
          ball.x, ball.y, ball.radius,
          this.boss.x, this.boss.y, this.boss.width, this.boss.height
        );
        if (col.collided) {
          if (Math.abs(col.normalX) > Math.abs(col.normalY)) {
            ball.vx = -ball.vx;
          } else {
            ball.vy = -ball.vy;
          }
          this.damageBoss(ball.isFireball ? 3 : 1);
        }
      }

      // Ball fell out of play
      if (ball.y > this.height + 40) {
        this.balls.splice(i, 1);
        this.notifyMetrics();
      }
    }

    // Check if ALL balls lost
    if (this.balls.length === 0) {
      this.lives--;
      this.combo = 0;
      this.screenTrauma = 0.6;
      soundManager.playLifeLost();

      if (this.lives <= 0) {
        this.setState('gameover');
        soundManager.playGameOver();
      } else {
        this.clearPowerUp();
        this.resetPaddle();
        this.spawnBall(true);
      }
      this.notifyMetrics();
    }
  }

  private checkBallBrickCollisions(ball: Ball) {
    let collisionCount = 0;
    for (let i = 0; i < this.bricks.length; i++) {
      const brick = this.bricks[i];
      if (brick.hp <= 0) continue;

      const col = checkCircleRectCollision(
        ball.x, ball.y, ball.radius,
        brick.x, brick.y, brick.width, brick.height
      );

      if (col.collided) {
        collisionCount++;
        // Fireball passes through without bouncing unless hitting gold
        if (!ball.isFireball || brick.type === 'gold') {
          if (Math.abs(col.normalX) > Math.abs(col.normalY)) {
            ball.vx = -ball.vx;
            ball.x += col.normalX * (col.penetration + 1);
          } else {
            ball.vy = -ball.vy;
            ball.y += col.normalY * (col.penetration + 1);
          }
        }

        // Damage the brick
        this.damageBrick(brick, ball.isFireball, 1);

        // Cap collisions per frame to prevent trapping inside multiple bricks
        if (collisionCount >= 3) break;
      }
    }
  }

  private damageBrick(brick: Brick, isFireball: boolean, damage: number = 1) {
    const outcome = applyBrickDamage(brick, isFireball, damage);
    brick.hp = outcome.newHp;

    if (brick.type === 'silver') {
      soundManager.playSilverHit();
      this.hitstopTimer = 0.03;
      this.screenTrauma = Math.min(0.5, this.screenTrauma + 0.15);
      this.createDebris(brick.x + brick.width / 2, brick.y + brick.height / 2, '#94a3b8', 6);
    } else if (brick.type === 'gold') {
      soundManager.playGoldBounce();
      this.hitstopTimer = 0.02;
      this.createDebris(brick.x + brick.width / 2, brick.y + brick.height / 2, '#facc15', 5);
    } else {
      this.combo++;
      if (this.combo > this.highestCombo) this.highestCombo = this.combo;
      soundManager.playBrickHit(this.combo);
    }

    if (outcome.destroyed) {
      this.bricksDestroyed++;
      const points = calculateScore(outcome.pointsAwarded, this.combo);
      this.score += points;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        if (typeof window !== 'undefined') {
          localStorage.setItem('arkanoid_highscore', this.highScore.toString());
        }
      }

      this.createDebris(
        brick.x + brick.width / 2,
        brick.y + brick.height / 2,
        this.getBrickColorHex(brick.type),
        16
      );

      // TNT Brick chain explosion
      if (brick.type === 'tnt') {
        this.detonateTNT(brick);
      }

      // Power-up capsule spawn
      if (brick.powerUp) {
        this.spawnPowerUp(brick.x + brick.width / 2 - 14, brick.y, brick.powerUp);
      }

      // Floating score popup on high combo
      if (this.combo >= 3) {
        this.addFloatingText(brick.x + brick.width / 2, brick.y, `x${this.combo}`, '#fef08a');
      }
    }

    this.notifyMetrics();
  }

  private detonateTNT(centerBrick: Brick) {
    soundManager.playExplosion();
    this.screenTrauma = 0.6;
    this.hitstopTimer = 0.06;

    const explosionRadius = Math.max(centerBrick.width, centerBrick.height) * 2.2;
    const cx = centerBrick.x + centerBrick.width / 2;
    const cy = centerBrick.y + centerBrick.height / 2;

    for (const b of this.bricks) {
      if (b.id === centerBrick.id || b.hp <= 0) continue;
      const bx = b.x + b.width / 2;
      const by = b.y + b.height / 2;
      const dist = Math.hypot(bx - cx, by - cy);
      if (dist <= explosionRadius) {
        this.damageBrick(b, true, 2);
      }
    }
  }

  private updateLasers(dt: number) {
    for (let i = this.laserBolts.length - 1; i >= 0; i--) {
      const bolt = this.laserBolts[i];
      bolt.y += bolt.vy * dt;

      let hit = false;
      for (const brick of this.bricks) {
        if (brick.hp <= 0) continue;
        if (checkAABB(bolt.x, bolt.y, bolt.width, bolt.height, brick.x, brick.y, brick.width, brick.height)) {
          this.damageBrick(brick, false, 1);
          this.createLaserImpact(bolt.x, bolt.y);
          hit = true;
          break;
        }
      }

      if (!hit && this.boss && this.boss.hp > 0) {
        if (checkAABB(bolt.x, bolt.y, bolt.width, bolt.height, this.boss.x, this.boss.y, this.boss.width, this.boss.height)) {
          this.damageBoss(1);
          this.createLaserImpact(bolt.x, bolt.y);
          hit = true;
        }
      }

      if (hit || bolt.y < -20) {
        this.laserBolts.splice(i, 1);
      }
    }
  }

  private updatePowerUps(dt: number) {
    for (let i = this.powerUps.length - 1; i >= 0; i--) {
      const pill = this.powerUps[i];
      pill.y += pill.vy * dt;
      pill.rotation += dt * 3.5;

      // Check paddle catch
      if (checkAABB(pill.x, pill.y, pill.width, pill.height, this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height)) {
        this.applyPowerUp(pill.type);
        this.powerUps.splice(i, 1);
        continue;
      }

      // Fell off screen
      if (pill.y > this.height + 30) {
        this.powerUps.splice(i, 1);
      }
    }
  }

  private updateBoss(dt: number) {
    if (!this.boss) return;

    this.boss.x += this.boss.vx * dt;
    if (this.boss.x <= 15) {
      this.boss.x = 15;
      this.boss.vx = Math.abs(this.boss.vx);
    } else if (this.boss.x + this.boss.width >= this.width - 15) {
      this.boss.x = this.width - 15 - this.boss.width;
      this.boss.vx = -Math.abs(this.boss.vx);
    }

    if (this.boss.hitFlash > 0) {
      this.boss.hitFlash -= dt;
    }

    // Boss firing projectiles
    this.boss.shootCooldown -= dt;
    if (this.boss.shootCooldown <= 0) {
      this.boss.shootCooldown = 1.8 + Math.random() * 1.2;
      this.bossProjectiles.push({
        id: `bp_${Math.random()}`,
        x: this.boss.x + this.boss.width / 2,
        y: this.boss.y + this.boss.height,
        vy: 180 + Math.random() * 60,
        radius: 6
      });
    }

    // Update Boss Projectiles
    for (let i = this.bossProjectiles.length - 1; i >= 0; i--) {
      const bp = this.bossProjectiles[i];
      bp.y += bp.vy * dt;

      // Hit paddle?
      if (bp.y >= this.paddle.y && bp.y <= this.paddle.y + this.paddle.height) {
        if (bp.x >= this.paddle.x && bp.x <= this.paddle.x + this.paddle.width) {
          // Paddle takes hit -> loses current powerup or loses life
          soundManager.playExplosion();
          this.screenTrauma = 0.5;
          this.bossProjectiles.splice(i, 1);
          if (this.activePowerUp) {
            this.clearPowerUp();
          }
          continue;
        }
      }

      if (bp.y > this.height + 20) {
        this.bossProjectiles.splice(i, 1);
      }
    }
  }

  private damageBoss(dmg: number) {
    if (!this.boss) return;
    this.boss.hp = Math.max(0, this.boss.hp - dmg);
    this.boss.hitFlash = 0.15;
    this.hitstopTimer = 0.05;
    this.screenTrauma = 0.35;
    soundManager.playSilverHit();

    if (this.boss.hp <= 0) {
      soundManager.playExplosion();
      this.screenTrauma = 0.8;
      this.score += 5000;
      this.createDebris(this.boss.x + this.boss.width / 2, this.boss.y + this.boss.height / 2, '#ef4444', 40);
      this.boss = null;
    }
    this.notifyMetrics();
  }

  private spawnPowerUp(x: number, y: number, type: PowerUpType) {
    this.powerUps.push({
      id: `p_${Math.random()}`,
      x,
      y,
      vy: 110,
      width: 28,
      height: 14,
      type,
      rotation: 0
    });
  }

  private updateJuiceOnly(dt: number) {
    // Screen shake decay
    if (this.screenTrauma > 0) {
      this.screenTrauma = Math.max(0, this.screenTrauma - dt * 2.0);
    }

    // Stars scrolling
    for (const star of this.stars) {
      star.y += star.speed * dt;
      if (star.y > this.height) {
        star.y = 0;
        star.x = Math.random() * this.width;
      }
    }

    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text popups
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      if (ft.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  // --- Rendering Pipeline ---
  private render() {
    this.ctx.save();

    const themeKey = (this.settings.theme || 'nebula') as VisualTheme;
    const theme = THEME_DETAILS[themeKey] || THEME_DETAILS.nebula;

    // Screen Shake Offset
    let shakeFactor = 1.0;
    if (this.settings.screenShake === 'subtle') shakeFactor = 0.4;
    else if (this.settings.screenShake === 'off') shakeFactor = 0;

    if (this.screenTrauma > 0 && shakeFactor > 0) {
      const shakeMag = this.screenTrauma * this.screenTrauma * 14 * shakeFactor;
      const offsetX = (Math.random() - 0.5) * shakeMag;
      const offsetY = (Math.random() - 0.5) * shakeMag;
      this.ctx.translate(offsetX, offsetY);
    }

    // Clear background with theme color
    this.ctx.fillStyle = theme.bgHex;
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Starfield Parallax with theme star color
    this.renderStars(theme.starColor);

    // Cyber Arena Grid Floor with theme grid color
    this.renderArenaGrid(theme.gridHex);

    // Bricks
    this.renderBricks();

    // Boss (if active)
    if (this.boss && this.boss.hp > 0) {
      this.renderBoss();
    }

    // Power-up Pills
    this.renderPowerUps();

    // Laser Bolts & Boss Projectiles
    this.renderProjectiles();

    // Paddle
    this.renderPaddle();

    // Balls & Trails
    this.renderBalls();

    // Particles & FX
    this.renderParticles();

    // Floating Text
    this.renderFloatingTexts();

    this.ctx.restore();
  }

  private renderStars(starColorHex: string) {
    this.ctx.save();
    for (const star of this.stars) {
      this.ctx.fillStyle = starColorHex;
      this.ctx.globalAlpha = star.alpha;
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    }
    this.ctx.restore();
  }

  private renderArenaGrid(gridColorHex: string) {
    this.ctx.save();
    const horizon = this.height * 0.65;
    const gridCols = 12;
    this.ctx.strokeStyle = gridColorHex;
    this.ctx.lineWidth = 1;

    // Perspective floor lines
    for (let i = 0; i <= gridCols; i++) {
      const topX = (this.width / gridCols) * i;
      const bottomX = (this.width / gridCols) * i * 1.4 - (this.width * 0.2);
      this.ctx.beginPath();
      this.ctx.moveTo(topX, horizon);
      this.ctx.lineTo(bottomX, this.height);
      this.ctx.stroke();
    }

    // Horizontal lines
    for (let y = horizon; y < this.height; y += 32) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  private renderBricks() {
    for (const brick of this.bricks) {
      if (brick.hp <= 0) continue;

      this.ctx.save();
      const color = this.getBrickColorHex(brick.type);

      // Glow & Base
      this.ctx.fillStyle = color;
      this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

      // 3D Bevel highlight & shadow (classic retro arcade brick look)
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      this.ctx.fillRect(brick.x, brick.y, brick.width, 2.5); // top highlight
      this.ctx.fillRect(brick.x, brick.y, 2.5, brick.height); // left highlight

      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(brick.x, brick.y + brick.height - 2.5, brick.width, 2.5); // bottom shadow
      this.ctx.fillRect(brick.x + brick.width - 2.5, brick.y, 2.5, brick.height); // right shadow

      // Metallic sheen for silver/gold
      if (brick.type === 'silver' || brick.type === 'gold') {
        const grad = this.ctx.createLinearGradient(brick.x, brick.y, brick.x + brick.width, brick.y + brick.height);
        grad.addColorStop(0, 'rgba(255,255,255,0.3)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.3)');
        this.ctx.fillStyle = grad;
        this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);

        // Cracks on damaged silver
        if (brick.type === 'silver' && brick.hp < brick.maxHp) {
          this.ctx.strokeStyle = '#1e293b';
          this.ctx.lineWidth = 1.5;
          this.ctx.beginPath();
          this.ctx.moveTo(brick.x + 4, brick.y + brick.height / 2);
          this.ctx.lineTo(brick.x + brick.width * 0.4, brick.y + 4);
          this.ctx.lineTo(brick.x + brick.width - 4, brick.y + brick.height - 4);
          this.ctx.stroke();
        }
      }

      // TNT icon
      if (brick.type === 'tnt') {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 9px monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('TNT', brick.x + brick.width / 2, brick.y + brick.height / 2);
      }

      this.ctx.restore();
    }
  }

  private renderPaddle() {
    this.ctx.save();
    const p = this.paddle;
    const squashedWidth = p.width * p.squashStretch;
    const squashedHeight = p.height / p.squashStretch;
    const px = p.x - (squashedWidth - p.width) / 2;
    const py = p.y + (p.height - squashedHeight);

    // Thruster plasma glow
    const thrusterGrad = this.ctx.createRadialGradient(
      px + squashedWidth / 2, py + squashedHeight, 2,
      px + squashedWidth / 2, py + squashedHeight + 10, 18
    );
    thrusterGrad.addColorStop(0, 'rgba(56, 189, 248, 0.8)');
    thrusterGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
    this.ctx.fillStyle = thrusterGrad;
    this.ctx.fillRect(px + 4, py + squashedHeight, squashedWidth - 8, 12);

    // Paddle body (sleek Vaus spacecraft aesthetic)
    const bodyGrad = this.ctx.createLinearGradient(px, py, px, py + squashedHeight);
    bodyGrad.addColorStop(0, '#f8fafc');
    bodyGrad.addColorStop(0.3, p.hasLaser ? '#f43f5e' : p.hasCatch ? '#10b981' : '#38bdf8');
    bodyGrad.addColorStop(0.8, '#0f172a');
    bodyGrad.addColorStop(1, '#020617');

    this.ctx.fillStyle = bodyGrad;
    this.ctx.beginPath();
    const cornerRadius = 5;
    drawRoundRect(this.ctx, px, py, squashedWidth, squashedHeight, [cornerRadius, cornerRadius, 2, 2]);
    this.ctx.fill();

    // Chrome rim
    this.ctx.strokeStyle = p.hasLaser ? '#fb7185' : '#7dd3fc';
    this.ctx.lineWidth = 1.5;
    this.ctx.stroke();

    // Laser cannons on wings
    if (p.hasLaser) {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(px - 2, py - 4, 6, 6);
      this.ctx.fillRect(px + squashedWidth - 4, py - 4, 6, 6);
    }

    this.ctx.restore();
  }

  private renderBalls() {
    for (const ball of this.balls) {
      this.ctx.save();

      // Trail
      if (this.settings.trail) {
        for (const t of ball.trail) {
          this.ctx.beginPath();
          this.ctx.arc(t.x, t.y, Math.max(1, ball.radius * 0.75), 0, Math.PI * 2);
          this.ctx.fillStyle = ball.isFireball 
            ? `rgba(239, 68, 68, ${t.alpha * 0.6})` 
            : `rgba(56, 189, 248, ${t.alpha * 0.5})`;
          this.ctx.fill();
        }
      }

      // Ball Aura Bloom
      if (this.settings.bloom) {
        const auraGrad = this.ctx.createRadialGradient(
          ball.x, ball.y, Math.max(0.1, ball.radius * 0.4),
          ball.x, ball.y, Math.max(1, ball.radius * 2.2)
        );
        if (ball.isFireball) {
          auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
          auraGrad.addColorStop(0.5, 'rgba(249, 115, 22, 0.4)');
          auraGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
        } else {
          auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
          auraGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
          auraGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        }
        this.ctx.fillStyle = auraGrad;
        this.ctx.beginPath();
        this.ctx.arc(ball.x, ball.y, Math.max(1, ball.radius * 2.2), 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Ball Core
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, Math.max(1, ball.radius), 0, Math.PI * 2);
      this.ctx.fillStyle = ball.isFireball ? '#f97316' : '#ffffff';
      this.ctx.fill();

      this.ctx.restore();
    }
  }

  private renderPowerUps() {
    for (const pill of this.powerUps) {
      this.ctx.save();
      this.ctx.translate(pill.x + pill.width / 2, pill.y + pill.height / 2);
      this.ctx.rotate(Math.sin(pill.rotation) * 0.2);

      const color = this.getPowerUpColor(pill.type);
      const letter = pill.type[0].toUpperCase();

      // Capsule body
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      drawRoundRect(this.ctx, -pill.width / 2, -pill.height / 2, pill.width, pill.height, 8);
      this.ctx.fill();

      this.ctx.strokeStyle = '#ffffff';
      this.ctx.lineWidth = 1.2;
      this.ctx.stroke();

      // Letter inside
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = 'bold 9px monospace';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(letter, 0, 1);

      this.ctx.restore();
    }
  }

  private renderProjectiles() {
    this.ctx.save();
    // Lasers
    this.ctx.fillStyle = '#f43f5e';
    this.ctx.shadowColor = '#f43f5e';
    this.ctx.shadowBlur = 8;
    for (const bolt of this.laserBolts) {
      this.ctx.fillRect(bolt.x, bolt.y, bolt.width, bolt.height);
    }

    // Boss orbs
    this.ctx.shadowColor = '#a855f7';
    this.ctx.fillStyle = '#c084fc';
    for (const bp of this.bossProjectiles) {
      this.ctx.beginPath();
      this.ctx.arc(bp.x, bp.y, bp.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  private renderBoss() {
    if (!this.boss) return;
    this.ctx.save();
    const b = this.boss;

    // Flash when hit
    this.ctx.fillStyle = b.hitFlash > 0 ? '#ffffff' : '#475569';
    this.ctx.beginPath();
    drawRoundRect(this.ctx, b.x, b.y, b.width, b.height, 8);
    this.ctx.fill();

    this.ctx.strokeStyle = '#ef4444';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Glowing Core Eye
    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc(b.x + b.width / 2, b.y + b.height / 2, 10, 0, Math.PI * 2);
    this.ctx.fill();

    // HP Bar
    const hpRatio = b.hp / b.maxHp;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(b.x, b.y - 12, b.width, 6);
    this.ctx.fillStyle = '#ef4444';
    this.ctx.fillRect(b.x, b.y - 12, b.width * hpRatio, 6);

    this.ctx.restore();
  }

  private renderParticles() {
    this.ctx.save();
    for (const p of this.particles) {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  private renderFloatingTexts() {
    this.ctx.save();
    for (const ft of this.floatingTexts) {
      this.ctx.fillStyle = ft.color;
      this.ctx.globalAlpha = Math.max(0, ft.life);
      this.ctx.font = 'bold 12px "Press Start 2P", monospace';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(ft.text, ft.x, ft.y);
    }
    this.ctx.restore();
  }

  // --- FX Helpers ---
  private createDebris(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 180;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1.5 + Math.random() * 3,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        alpha: 1
      });
    }
  }

  private createPaddleSparks(x: number, y: number) {
    for (let i = 0; i < 6; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 120,
        vy: -20 - Math.random() * 80,
        color: '#38bdf8',
        size: 1.5,
        life: 0.25,
        maxLife: 0.25,
        alpha: 1
      });
    }
  }

  private createWallSparks(x: number, y: number, nx: number, ny: number) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: nx * (30 + Math.random() * 50) + (Math.random() - 0.5) * 30,
        vy: ny * (30 + Math.random() * 50) + (Math.random() - 0.5) * 30,
        color: '#94a3b8',
        size: 1.2,
        life: 0.2,
        maxLife: 0.2,
        alpha: 1
      });
    }
  }

  private createMuzzleSparks(x: number, y: number) {
    for (let i = 0; i < 4; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 60,
        vy: -40 - Math.random() * 60,
        color: '#f43f5e',
        size: 2,
        life: 0.15,
        maxLife: 0.15,
        alpha: 1
      });
    }
  }

  private createLaserImpact(x: number, y: number) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 100,
        color: '#fb7185',
        size: 2,
        life: 0.2,
        maxLife: 0.2,
        alpha: 1
      });
    }
  }

  private addFloatingText(x: number, y: number, text: string, color: string) {
    this.floatingTexts.push({
      x,
      y,
      text,
      color,
      life: 0.8,
      vy: -45
    });
  }

  private getBrickColorHex(type: string): string {
    switch (type) {
      case 'cyan': return '#06b6d4';
      case 'pink': return '#ec4899';
      case 'green': return '#22c55e';
      case 'yellow': return '#eab308';
      case 'orange': return '#f97316';
      case 'red': return '#ef4444';
      case 'blue': return '#3b82f6';
      case 'silver': return '#94a3b8';
      case 'gold': return '#eab308';
      case 'tnt': return '#dc2626';
      default: return '#06b6d4';
    }
  }

  private getPowerUpColor(type: PowerUpType): string {
    switch (type) {
      case 'laser': return '#ef4444';
      case 'expand': return '#3b82f6';
      case 'catch': return '#10b981';
      case 'slow': return '#f59e0b';
      case 'multiball': return '#06b6d4';
      case 'fireball': return '#ea580c';
      case 'life': return '#e2e8f0';
      case 'warp': return '#8b5cf6';
    }
  }

  public updateSettings(newSettings: GameSettings) {
    this.settings = { ...newSettings };
  }

  // --- Input Bindings ---
  private bindEvents() {
    const signal = this.eventAbort.signal;

    const getCanvasRect = () => {
      if (!this.canvasRect) {
        this.canvasRect = this.canvas.getBoundingClientRect();
      }
      return this.canvasRect;
    };

    const updatePointerPos = (clientX: number) => {
      const rect = getCanvasRect();
      const relativeX = clientX - rect.left;
      this.paddle.targetX = relativeX - this.paddle.width / 2;
    };

    // Window-level Pointer Move: Guarantees paddle keeps tracking even if cursor moves fast, leaves canvas, or hovers HUD
    window.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return; // Handled directly by touch listeners
      this.lastInputType = 'pointer';
      updatePointerPos(e.clientX);
    }, { signal, passive: true });

    // Pointer Down (Launch ball or fire lasers - mouse/stylus)
    this.canvas.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'touch') return;
      if (this.state === 'playing') {
        this.launchStuckBalls();
        this.shootLasers();
      }
    }, { signal });

    // Dedicated Mobile Touch Controls with zero drift, no browser gesture fight, and continuous edge tracking
    const handleTouch = (touch: Touch) => {
      this.touchActive = true;
      this.lastInputType = 'touch';
      const rect = getCanvasRect();
      const relativeX = touch.clientX - rect.left;
      this.paddle.targetX = relativeX - this.paddle.width / 2;
    };

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.cancelable) e.preventDefault();
      this.canvasRect = this.canvas.getBoundingClientRect(); // Fresh rect on touch contact
      if (e.touches.length > 0) {
        handleTouch(e.touches[0]);
      }
      if (this.state === 'playing') {
        this.launchStuckBalls();
        this.shootLasers();
      }
    }, { signal, passive: false });

    // Listen on window for touchmove so dragging finger outside bottom/top edge never stops or stutters
    window.addEventListener('touchmove', (e) => {
      if (this.touchActive && e.touches.length > 0) {
        if (e.cancelable) e.preventDefault();
        handleTouch(e.touches[0]);
      }
    }, { signal, passive: false });

    window.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.touchActive = false;
      } else {
        handleTouch(e.touches[0]);
      }
    }, { signal, passive: true });

    window.addEventListener('touchcancel', () => {
      this.touchActive = false;
    }, { signal, passive: true });

    // Window Resize / Scroll
    window.addEventListener('resize', () => {
      this.canvasRect = null;
      this.resize();
    }, { signal, passive: true });

    window.addEventListener('scroll', () => {
      this.canvasRect = null;
    }, { signal, passive: true });

    // Keyboard Listeners
    window.addEventListener('keydown', (e) => {
      this.keysHeld.add(e.code);

      if (e.code === 'ArrowLeft' || e.code === 'KeyA' || e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.lastInputType = 'keyboard';
      }

      if (e.code === 'Space') {
        if (this.state === 'playing') {
          this.launchStuckBalls();
          this.shootLasers();
        } else if (this.state === 'title') {
          this.startRun();
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        if (this.state === 'playing') {
          this.pause();
        } else if (this.state === 'paused') {
          this.resume();
        }
      }
    }, { signal });

    window.addEventListener('keyup', (e) => {
      this.keysHeld.delete(e.code);
    }, { signal });

    // Window Blur (Clear inputs, do not pause automatically per ultra-mode rule)
    window.addEventListener('blur', () => {
      this.keysHeld.clear();
      this.touchActive = false;
    }, { signal });
  }

  public setPaddleTargetFromTouch(touchXPercent: number) {
    this.lastInputType = 'touch';
    const target = touchXPercent * this.width - this.paddle.width / 2;
    const minX = 6;
    const maxX = Math.max(minX, this.width - this.paddle.width - 6);
    this.paddle.targetX = Math.max(minX, Math.min(maxX, target));
  }

  public destroy() {
    this.eventAbort.abort();
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
