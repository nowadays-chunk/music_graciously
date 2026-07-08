export default class TimeSignature {
  constructor(beats = 4, beatValue = 4) {
    this.beats = beats;
    this.beatValue = beatValue;
  }

  toString() {
    return `${this.beats}/${this.beatValue}`;
  }

  clone() {
    return new TimeSignature(this.beats, this.beatValue);
  }

  serialize() {
    return {
      beats: this.beats,
      beatValue: this.beatValue,
    };
  }

  static deserialize(d) {
    return new TimeSignature(d.beats, d.beatValue);
  }
}
