/**
 * Procedural Web Audio API sound generator for Kardone Match-3
 * Zero external audio files required, instantaneous and reliable.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    // Read user mute preference
    const saved = localStorage.getItem('kardone_audio_muted');
    if (saved !== null) {
      this.muted = saved === 'true';
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    localStorage.setItem('kardone_audio_muted', String(mute));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * Snappy click/whoosh for gem swap
   */
  public playSwap() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.07);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext policy fallback
    }
  }

  /**
   * Subtle dull bonk for invalid swap
   */
  public playInvalid() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const now = this.ctx.currentTime;

      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(90, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  }

  /**
   * Harmonious chime for match, climbing higher with combo multipliers
   */
  public playMatch(combo: number = 1, matchCount: number = 3) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Musical pentatonic / chord frequencies
      const baseFreqs = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
      const noteIdx = Math.min(combo - 1, baseFreqs.length - 1);
      const root = baseFreqs[Math.max(0, noteIdx)];

      // Main chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(root, now);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);

      // Harmony overtone
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(root * 1.5, now + 0.03);

      gain2.gain.setValueAtTime(0.12, now + 0.03);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);

      osc2.start(now + 0.03);
      osc2.stop(now + 0.27);

      // If 4-match or 5-match, add explosion sound
      if (matchCount >= 4) {
        this.playExplosion(matchCount >= 5);
      }
    } catch {}
  }

  /**
   * Explosive blast for 4-match and 5-match combos
   */
  public playExplosion(isSupernova: boolean = false) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sub-bass boom impact
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';

      const startFreq = isSupernova ? 160 : 120;
      subOsc.frequency.setValueAtTime(startFreq, now);
      subOsc.frequency.exponentialRampToValueAtTime(28, now + (isSupernova ? 0.45 : 0.3));

      subGain.gain.setValueAtTime(isSupernova ? 0.4 : 0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + (isSupernova ? 0.5 : 0.35));

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + (isSupernova ? 0.52 : 0.38));

      // 2. Synthesized noise burst for crunch / shatter
      const bufferSize = this.ctx.sampleRate * (isSupernova ? 0.4 : 0.25);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      // Lowpass filter to keep noise punchy and weighty
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(isSupernova ? 1800 : 1200, now);
      filter.frequency.linearRampToValueAtTime(200, now + (isSupernova ? 0.4 : 0.25));

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(isSupernova ? 0.3 : 0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + (isSupernova ? 0.38 : 0.24));

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);

      // 3. Supernova extra celestial riser & sparkle
      if (isSupernova) {
        const sweepOsc = this.ctx.createOscillator();
        const sweepGain = this.ctx.createGain();
        sweepOsc.type = 'sawtooth';
        sweepOsc.frequency.setValueAtTime(220, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.35);

        sweepGain.gain.setValueAtTime(0.12, now);
        sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        sweepOsc.connect(sweepGain);
        sweepGain.connect(this.ctx.destination);

        sweepOsc.start(now);
        sweepOsc.stop(now + 0.42);
      }
    } catch {}
  }

  /**
   * Shuffle sound
   */
  public playShuffle() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const t = now + i * 0.06;
        osc.frequency.setValueAtTime(400 + i * 90, t);
        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.09);
      }
    } catch {}
  }

  /**
   * Crisp cyberpunk synth pulse for 3 - 2 - 1 countdown
   */
  public playCountdownTick(num: number) {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freq = num === 3 ? 440 : num === 2 ? 554.37 : 659.25;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.12, now + 0.14);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    } catch {}
  }

  /**
   * Massive BOOM! start blast when countdown finishes
   */
  public playCountdownBoom() {
    if (this.muted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.playExplosion(true);
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.44);
      });
    } catch {}
  }
}

export const sound = new SoundEngine();

