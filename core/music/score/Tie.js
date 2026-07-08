// core/music/score/Tie.js

export default class Tie {
  constructor({
    startNoteId = null,
    endNoteId = null,
  } = {}) {
    this.startNoteId = startNoteId; // unique ID of start note
    this.endNoteId = endNoteId;     // unique ID of end note
  }

  serialize() {
    return {
      startNoteId: this.startNoteId,
      endNoteId: this.endNoteId,
    };
  }

  static deserialize(d) {
    return new Tie({
      startNoteId: d.startNoteId,
      endNoteId: d.endNoteId,
    });
  }
}
