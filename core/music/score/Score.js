import Measure from "./Measure";
import TimeSignature from "./TimeSignature";
import KeySignature from "./KeySignature";
import Clef from "./Clef";

export default class Score {
  constructor() {
    this.title = "";
    this.composer = "";
    this.timeSignature = new TimeSignature(4, 4);
    this.keySignature = new KeySignature("C");
    this.clef = new Clef("treble");

    this.measures = [];
  }

  addMeasure() {
    const m = new Measure(this.measures.length, this.timeSignature.clone());
    m.keySignature = this.keySignature.clone();
    m.clef = this.clef.clone();
    m.addVoice();
    this.measures.push(m);
    return m;
  }

  addNote(beat, note) {
    let accumulatedBeats = 0;
    let measureIndex = 0;

    // 1. Try to find in existing measures
    while (measureIndex < this.measures.length) {
      const m = this.measures[measureIndex];
      const beatsInMeasure = m.timeSignature.beats;

      if (beat < accumulatedBeats + beatsInMeasure) {
        // Found the target measure
        const localBeat = beat - accumulatedBeats;
        m.voices[0].addNote(localBeat, note);
        return;
      }

      accumulatedBeats += beatsInMeasure;
      measureIndex++;
    }

    // 2. If not found, add new measures until we cover the beat
    while (true) {
      const m = this.addMeasure();
      const beatsInMeasure = m.timeSignature.beats;

      if (beat < accumulatedBeats + beatsInMeasure) {
        const localBeat = beat - accumulatedBeats;
        m.voices[0].addNote(localBeat, note);
        return;
      }

      accumulatedBeats += beatsInMeasure;
    }
  }

  serialize() {
    return {
      title: this.title,
      composer: this.composer,
      timeSignature: this.timeSignature.serialize(),
      keySignature: this.keySignature.serialize(),
      clef: this.clef.serialize(),
      measures: this.measures.map(m => m.serialize())
    };
  }

  static deserialize(json) {
    const s = new Score();
    s.title = json.title || "";
    s.composer = json.composer || "";
    s.timeSignature = TimeSignature.deserialize(json.timeSignature);
    s.keySignature = KeySignature.deserialize(json.keySignature);
    s.clef = Clef.deserialize(json.clef);

    s.measures = json.measures.map(m => Measure.deserialize(m));
    return s;
  }

  clone() {
    return Score.deserialize(this.serialize());
  }
}
