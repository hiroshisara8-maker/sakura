/**
 * Web Audio API Ambient Sound Synthesizer
 * Generates offline, non-dependent procedural soundscapes:
 * - Rain (pink noise + water drops filter)
 * - Cozy Cafe (warm acoustic brown/pink lo-fi texture)
 * - Breeze (sweeping wind resonance)
 * - Japanese Wind Chime (Furin pentatonic bell strikes)
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private currentTrack: string = 'off';
  private activeNodes: { stop?: () => void; timer?: number }[] = [];
  private volume: number = 0.4;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public stop() {
    this.activeNodes.forEach(item => {
      if (item.stop) item.stop();
      if (item.timer) clearInterval(item.timer);
    });
    this.activeNodes = [];
    this.currentTrack = 'off';
  }

  public play(track: 'rain' | 'cafe' | 'breeze' | 'windchime' | 'off') {
    this.stop();
    if (track === 'off') return;

    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    this.currentTrack = track;

    if (track === 'rain') {
      this.playRain();
    } else if (track === 'cafe') {
      this.playCafe();
    } else if (track === 'breeze') {
      this.playBreeze();
    } else if (track === 'windchime') {
      this.playWindChime();
    }
  }

  public getCurrentTrack(): string {
    return this.currentTrack;
  }

  private playRain() {
    if (!this.ctx || !this.masterGain) return;

    // Buffer for pink noise (gentle rain)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Lowpass filter for cozy muffled rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(900, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.masterGain);

    whiteNoise.start();
    this.activeNodes.push({
      stop: () => {
        try {
          whiteNoise.stop();
          whiteNoise.disconnect();
          filter.disconnect();
          rainGain.disconnect();
        } catch {
          // Ignore
        }
      },
    });
  }

  private playCafe() {
    if (!this.ctx || !this.masterGain) return;

    // Cafe ambient: warm rumble + soft mid-range texture
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 1.2;
    }

    const brownNoise = this.ctx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

    const cafeGain = this.ctx.createGain();
    cafeGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    brownNoise.connect(filter);
    filter.connect(cafeGain);
    cafeGain.connect(this.masterGain);

    brownNoise.start();
    this.activeNodes.push({
      stop: () => {
        try {
          brownNoise.stop();
          brownNoise.disconnect();
          filter.disconnect();
          cafeGain.disconnect();
        } catch {
          // Ignore
        }
      },
    });
  }

  private playBreeze() {
    if (!this.ctx || !this.masterGain) return;

    // Pink noise with oscillating lowpass filter (wind gusts)
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.08;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    filter.Q.setValueAtTime(3, this.ctx.currentTime);

    // LFO for swaying breeze
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(150, this.ctx.currentTime);

    lfo.connect(filter.frequency);
    noise.connect(filter);
    filter.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          noise.stop();
          lfo.stop();
          noise.disconnect();
          lfo.disconnect();
          filter.disconnect();
        } catch {
          // Ignore
        }
      },
    });
  }

  private playWindChime() {
    if (!this.ctx || !this.masterGain) return;

    // Background soft whisper
    this.playBreeze();

    // Pentatonic scale frequencies for Japanese Furin (Wind Bell)
    const notes = [1046.5, 1174.66, 1318.51, 1567.98, 1760.0, 2093.0]; // C6, D6, E6, G6, A6, C7

    const strikeChime = () => {
      if (!this.ctx || !this.masterGain || this.currentTrack !== 'windchime') return;
      const freq = notes[Math.floor(Math.random() * notes.length)];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Bell envelope
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 3.1);
    };

    // Initial strike
    strikeChime();

    // Intermittent bell strikes
    const intervalTimer = window.setInterval(() => {
      if (Math.random() > 0.35) {
        strikeChime();
        if (Math.random() > 0.6) {
          setTimeout(strikeChime, 300);
        }
      }
    }, 2800);

    this.activeNodes.push({
      timer: intervalTimer,
      stop: () => {
        clearInterval(intervalTimer);
      },
    });
  }
}

export const soundEngine = new SoundEngine();
