// core/music/playback/InstrumentManager.js
import Soundfont from "soundfont-player";

export default class InstrumentManager {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.instruments = new Map();
    this.currentInstrument = null;
  }

  async load(name = "acoustic_grand_piano") {
    if (this.instruments.has(name)) {
      this.currentInstrument = this.instruments.get(name);
      return;
    }

    const inst = await Soundfont.instrument(this.ctx, name);
    this.instruments.set(name, inst);
    this.currentInstrument = inst;
  }

  play(midi, time, { gain = 1, duration = 1 } = {}) {
    if (!this.currentInstrument) return;

    this.currentInstrument.play(midi, time, {
      gain,
      duration,
    });
  }
}
