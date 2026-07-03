/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class AudioSynth {
  private ctx: AudioContext | null = null;
  private muted: boolean = true; // Default muted to comply with browser autoplay policies

  constructor() {
    // Lazy loaded to prevent browser security warnings on initial load
  }

  public setMute(isMuted: boolean) {
    this.muted = isMuted;
    if (!isMuted && this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public getIsMuted(): boolean {
    return this.muted;
  }

  private init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public playChime() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Create oscillator nodes for a luxury glass chime chord
    const freqs = [523.25, 659.25, 783.99, 987.77]; // C5, E5, G5, B5 (Maj7 chord)
    
    freqs.forEach((freq, index) => {
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      // Fine-tune wave types for premium resonance
      osc.type = index % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, now);
      
      // Stagger slightly for a luxurious strumming/harping effect
      const delay = index * 0.04;
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.12 / freqs.length, now + delay + 0.02);
      // Soft release to simulate organic premium glass
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.5);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start(now + delay);
      osc.stop(now + delay + 2.6);
    });
  }

  public playLowHum() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(110, now); // A2 warm drone
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.015, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 1.6);
  }

  public playWishRelease() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Sweep-up frequency to represent rising wishes
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 3.0);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(330, now);
    osc2.frequency.exponentialRampToValueAtTime(1320, now + 3.0);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.05, now + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

    osc.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 3.1);
    osc2.stop(now + 3.1);
  }

  private pianoTimer: any = null;
  private pianoSequenceStep = 0;
  private isPianoPlaying = false;

  public playPianoNote(freq: number, duration: number = 2.5, volume: number = 0.08) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // Low pass filter to make it sound incredibly warm and soft like a felt piano
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(450, now); // Warm cut-off
    filter.Q.setValueAtTime(1, now);

    // Primary oscillator (sine for pure round tone)
    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq, now);

    // Subtle second oscillator (triangle for string woodiness, octaves down or harmonics)
    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    // Detune slightly for lush chorus
    osc2.frequency.setValueAtTime(freq * 0.998, now);

    const gainNode = this.ctx.createGain();
    
    // Gentle velocity-based attack and decay envelopes
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(volume, now + 0.12); // Soft attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Long felt decay

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  public startPianoLoop() {
    // Disabled to let Google Drive background music play instead.
    this.isPianoPlaying = false;
  }

  public stopPianoLoop() {
    this.isPianoPlaying = false;
    if (this.pianoTimer) {
      clearTimeout(this.pianoTimer);
      this.pianoTimer = null;
    }
  }

  public playHeartbeat() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    
    // First thump "lub"
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(55, now); // Low bass A1
    osc1.frequency.exponentialRampToValueAtTime(10, now + 0.25);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.4, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.3);

    // Second thump "dub"
    const delay = 0.18;
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(58, now + delay); // Low bass A#1
    osc2.frequency.exponentialRampToValueAtTime(10, now + delay + 0.25);
    gain2.gain.setValueAtTime(0, now + delay);
    gain2.gain.linearRampToValueAtTime(0.45, now + delay + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.25);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + delay);
    osc2.stop(now + delay + 0.3);
  }
}

export const audioSynth = new AudioSynth();

