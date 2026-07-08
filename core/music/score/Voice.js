// core/music/score/Voice.js
import Note from "./Note";

export default class Voice {
  constructor() {
    this.elements = []; // entries: { beat, note }
  }

  addNote(beat, note) {
    this.elements.push({ beat, note });
  }

  serialize() {
    return {
      elements: this.elements.map(e => ({
        beat: e.beat,
        note: e.note.serialize()
      }))
    };
  }

  static deserialize(json) {
    const v = new Voice();

    for (const e of json.elements || []) {
      v.elements.push({
        beat: e.beat,
        note: Note.deserialize(e.note)
      });
    }
    return v;
  }
}
