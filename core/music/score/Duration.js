// core/music/score/Duration.js

export default class Duration {
  /** symbol = "w" | "h" | "q" | "8" | "16" | "32" | "64" | "128" | "qd" | "8d" etc. */
  constructor(symbol = "q", tuplets = null) {
    this.symbol = symbol;
    this.tuplets = tuplets; // e.g. { num_notes: 3, notes_occupied: 2 } for triplet

    // Parse base duration and dots
    const baseMatch = symbol.match(/^([a-z0-9]+)(d*)$/);
    this.baseSymbol = baseMatch ? baseMatch[1] : symbol;
    this.dots = baseMatch ? baseMatch[2].length : 0;

    this.total = this.calculateBeats(); // required for playback
  }

  calculateBeats() {
    let baseBeats = Duration.toBeats(this.baseSymbol);

    // Add dots value
    let currentDotValue = baseBeats / 2;
    for (let i = 0; i < this.dots; i++) {
      baseBeats += currentDotValue;
      currentDotValue /= 2;
    }

    // Apply tuplet modifier
    if (this.tuplets) {
      baseBeats = baseBeats * (this.tuplets.notes_occupied / this.tuplets.num_notes);
    }

    return baseBeats;
  }

  static toBeats(symbol) {
    switch (symbol) {
      case "w": return 4;
      case "h": return 2;
      case "q": return 1;
      case "8": return 0.5;
      case "16": return 0.25;
      case "32": return 0.125;
      case "64": return 0.0625;
      case "128": return 0.03125;
      default: return 1;
    }
  }

  toVexflow() {
    return this.symbol; // VexFlow accepts "qd", "8d", etc.
  }

  clone() {
    return new Duration(this.symbol);
  }

  serialize() {
    return { symbol: this.symbol };
  }

  // -----------------------------
  // SAFE DESERIALIZATION FIX
  // -----------------------------
  static deserialize(d) {
    if (!d || typeof d !== "object") {
      // fallback to quarter note
      return new Duration("q");
    }
    return new Duration(d.symbol);
  }
}
