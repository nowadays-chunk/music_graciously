import Voice from "./Voice";
import TimeSignature from "./TimeSignature";
import KeySignature from "./KeySignature";
import Clef from "./Clef";
import Barline from "./Barline";

export default class Measure {
  constructor(index, timeSignature) {
    this.index = index;
    this.timeSignature = timeSignature;
    this.keySignature = new KeySignature("C");
    this.clef = new Clef("treble");
    this.leftBarline = new Barline("single");
    this.rightBarline = new Barline("single");

    this.voices = [];

    // Tempo markings for this measure
    this.tempoMarkings = []; // e.g. [{ beat: 0, bpm: 120, text: "Allegro" }]

    // Is this measure a pickup measure (anacrusis)?
    this.isPickup = false;
    // Structure & Navigation
    this.rehearsalMark = null; // e.g. "A", "B", "Verse 1"
    this.coda = false;
    this.segno = false;
    this.fine = false;
  }

  addVoice() {
    const v = new Voice();
    this.voices.push(v);
    return v;
  }

  serialize() {
    return {
      index: this.index,
      timeSignature: this.timeSignature.serialize(),
      keySignature: this.keySignature.serialize(),
      clef: this.clef.serialize(),
      leftBarline: this.leftBarline.serialize(),
      rightBarline: this.rightBarline.serialize(),
      voices: this.voices.map(v => v.serialize()),
      tempoMarkings: this.tempoMarkings,
      isPickup: this.isPickup,

      rehearsalMark: this.rehearsalMark,
      coda: this.coda,
      segno: this.segno,
      fine: this.fine
    };
  }

  static deserialize(json) {
    const m = new Measure(
      json.index,
      TimeSignature.deserialize(json.timeSignature)
    );

    m.keySignature = KeySignature.deserialize(json.keySignature);
    m.clef = Clef.deserialize(json.clef);

    if (json.leftBarline) m.leftBarline = Barline.deserialize(json.leftBarline);
    if (json.rightBarline) m.rightBarline = Barline.deserialize(json.rightBarline);

    m.voices = json.voices.map(v => Voice.deserialize(v));

    m.tempoMarkings = json.tempoMarkings || [];
    m.isPickup = json.isPickup || false;

    m.rehearsalMark = json.rehearsalMark || null;
    m.coda = json.coda || false;
    m.segno = json.segno || false;
    m.fine = json.fine || false;

    return m;
  }
}
