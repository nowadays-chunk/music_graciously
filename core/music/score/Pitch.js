const STEP_TO_SEMITONE = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

export default class Pitch {
  constructor(step = "C", alter = 0, octave = 4) {
    this.step = step;   // C, D, E, F, G, A, B
    this.alter = alter; // -1, 0, +1
    this.octave = octave;
  }

  // Convert to MIDI number
  toMidi() {
    const base = STEP_TO_SEMITONE[this.step] + this.alter;
    return (this.octave + 1) * 12 + base;
  }

  // Static helper to rebuild a Pitch instance
  static fromMidi(midi) {
    const octave = Math.floor(midi / 12) - 1;
    const semitone = midi % 12;

    const steps = Object.entries(STEP_TO_SEMITONE);
    let step = "C";
    let alter = 0;

    // Find the closest natural note or #
    for (const [s, val] of steps) {
      if (val === semitone) {
        step = s;
        alter = 0;
        break;
      }
      if (val === semitone - 1) {
        step = s;
        alter = 1;
      }
    }

    return new Pitch(step, alter, octave);
  }

  clone() {
    return new Pitch(this.step, this.alter, this.octave);
  }

  serialize() {
    return {
      step: this.step,
      alter: this.alter,
      octave: this.octave,
    };
  }

  static deserialize(d) {
    if (!d || typeof d !== "object") {
      // fallback safe default: middle C
      return new Pitch("C", 0, 4);
    }
    return new Pitch(d.step, d.alter, d.octave);
  }
}
