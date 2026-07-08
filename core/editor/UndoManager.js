// core/editor/UndoManager.js
export default class UndoManager {
  constructor() {
    this.stack = [];
    this.pointer = -1;
  }

  snapshot(score) {
    if (!score || typeof score.serialize !== "function") {
      return;                             // ✅ FIX: prevent calling serialize() on null
    }

    this.stack = this.stack.slice(0, this.pointer + 1);

    this.stack.push(
      JSON.stringify(score.serialize())
    );

    this.pointer++;
  }

  undo(currentScore) {
    if (this.pointer <= 0) return currentScore;

    this.pointer--;
    return JSON.parse(this.stack[this.pointer]);
  }

  redo(currentScore) {
    if (this.pointer >= this.stack.length - 1) return currentScore;

    this.pointer++;
    return JSON.parse(this.stack[this.pointer]);
  }
}
