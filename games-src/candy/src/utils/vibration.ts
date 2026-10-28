/**
 * Screen Vibration and Shake Controller
 * Handles visual camera/screen shake trauma and hardware device vibration (navigator.vibrate)
 */

type ShakeListener = (x: number, y: number, rotation: number) => void;

class ScreenVibrationSystem {
  private listeners: Set<ShakeListener> = new Set();
  private trauma: number = 0; // 0 to 1
  private isLoopRunning: boolean = false;
  private hapticsEnabled: boolean = true;

  constructor() {
    const saved = localStorage.getItem('kardone_haptics_enabled');
    if (saved !== null) {
      this.hapticsEnabled = saved === 'true';
    }
  }

  public isHapticsEnabled(): boolean {
    return this.hapticsEnabled;
  }

  public toggleHaptics(): boolean {
    this.hapticsEnabled = !this.hapticsEnabled;
    localStorage.setItem('kardone_haptics_enabled', String(this.hapticsEnabled));
    return this.hapticsEnabled;
  }

  public subscribe(listener: ShakeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Trigger screen vibration according to match intensity
   * @param matchCount 3 (standard), 4 (explosion), 5 (supernova)
   */
  public triggerMatchVibration(matchCount: number = 3, comboMultiplier: number = 1) {
    let addedTrauma = 0.25; // standard 3-match
    let hapticPattern: number | number[] = 30;

    if (matchCount === 4) {
      addedTrauma = 0.65;
      hapticPattern = [50, 25, 75];
    } else if (matchCount >= 5) {
      addedTrauma = 1.0;
      hapticPattern = [90, 30, 110, 30, 140];
    } else if (comboMultiplier > 2) {
      addedTrauma = Math.min(0.85, 0.25 + comboMultiplier * 0.12);
      hapticPattern = [40, 20, 50];
    }

    this.addTrauma(addedTrauma);

    // Hardware vibration if supported
    if (this.hapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(hapticPattern);
      } catch {
        // Safe fallback
      }
    }
  }

  public addTrauma(amount: number) {
    this.trauma = Math.min(1.0, this.trauma + amount);
    if (!this.isLoopRunning) {
      this.startLoop();
    }
  }

  private startLoop() {
    this.isLoopRunning = true;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (this.trauma > 0.005) {
        // Shake magnitude is trauma squared for non-linear impactful feel
        const shake = this.trauma * this.trauma;
        const maxOffset = 18; // Max 18px offset
        const maxAngle = 1.6; // Max 1.6 deg tilt

        const x = (Math.random() * 2 - 1) * maxOffset * shake;
        const y = (Math.random() * 2 - 1) * maxOffset * shake;
        const rot = (Math.random() * 2 - 1) * maxAngle * shake;

        this.listeners.forEach((fn) => fn(x, y, rot));

        // Exponential decay
        this.trauma = Math.max(0, this.trauma - dt * 2.8);
        requestAnimationFrame(frame);
      } else {
        this.trauma = 0;
        this.listeners.forEach((fn) => fn(0, 0, 0));
        this.isLoopRunning = false;
      }
    };

    requestAnimationFrame(frame);
  }
}

export const vibrationSystem = new ScreenVibrationSystem();
