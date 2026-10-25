// Web Audio API procedural sound synthesizer (Zero external MP3 dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazily initialized on first user interaction
    const saved = localStorage.getItem('esg_puzzle_sound_muted');
    this.isMuted = saved === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('esg_puzzle_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('esg_puzzle_sound_muted', String(muted));
  }

  // Soft organic tap
  public playTap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Audio fallback silent
    }
  }

  // Harmonic correct placement chime with ascending combo pitch
  public playCorrect(combo: number = 1) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic scale base frequencies
      const baseFreqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const pitchMultiplier = Math.min(1 + (combo - 1) * 0.08, 1.6);

      baseFreqs.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const delay = i * 0.055;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq * pitchMultiplier, now + delay);

        gain.gain.setValueAtTime(0.001, now + delay);
        gain.gain.linearRampToValueAtTime(0.12, now + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.36);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Soft low buzz for incorrect placement
  public playMistake() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch {
      // Audio fallback silent
    }
  }

  // Quadrant complete fanfare
  public playQuadrantComplete() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.001, start);
        gain.gain.linearRampToValueAtTime(0.15, start + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.65);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Grand Victory celestial chords
  public playVictory() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],          // C major
        [587.33, 739.99, 880.00],          // D major
        [659.25, 830.61, 987.77],          // E major
        [783.99, 987.77, 1174.66, 1567.98] // G major triumphant
      ];
      const now = this.ctx.currentTime;

      chords.forEach((chord, step) => {
        const stepTime = now + step * 0.22;
        chord.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, stepTime);

          const dur = step === chords.length - 1 ? 1.4 : 0.4;
          gain.gain.setValueAtTime(0.001, stepTime);
          gain.gain.linearRampToValueAtTime(0.12, stepTime + 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + dur);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(stepTime);
          osc.stop(stepTime + dur);
        });
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Wheel rotate swoosh
  public playRotate() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.16);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Audio fallback silent
    }
  }

  // Hint twinkle
  public playHint() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [880, 1174.66, 1760];
      freqs.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.26);
      });
    } catch {
      // Audio fallback silent
    }
  }

  public playSuccess() {
    this.playVictory();
  }

  public playError() {
    this.playMistake();
  }
}

export const sound = new SoundEngine();
