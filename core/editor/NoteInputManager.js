// core/editor/NoteInputManager.js
import Duration from "@/core/music/score/Duration";

export default class NoteInputManager {
  constructor() {
    this.activeDuration = new Duration("q");
    this.override = false; // overwrite mode

    // Accidental selection (0 = natural, 1 = sharp, -1 = flat)
    this.activeAccidental = 0;

    // String/Fret input mode
    this.activeString = null;
    this.activeFret = null;

    // Advanced Note Forms
    this.activeNotehead = "normal"; // "normal", "cross", "diamond", "triangle", "x", "slash"
    this.activeTuplets = null; // e.g. { num_notes: 3, notes_occupied: 2 }
    this.isTieActive = false;
    this.isSlurActive = false;
    this.isGraceActive = false;

    // Modifiers
    this.activeArticulations = [];
    this.activeDynamics = [];
    this.activeOrnaments = [];
    this.activeVexTabTechnique = null;
    this.activeChordSymbol = null;
  }

  setDuration(q, tuplets = null) {
    this.activeDuration = new Duration(q, tuplets);
    this.activeTuplets = tuplets;
  }

  setAccidental(alter) {
    // Toggle: if same accidental clicked, set to natural
    this.activeAccidental = (this.activeAccidental === alter) ? 0 : alter;
  }

  setStringFret(string, fret) {
    this.activeString = string;
    this.activeFret = fret;
  }

  toggleTie() {
    this.isTieActive = !this.isTieActive;
  }

  toggleSlur() {
    this.isSlurActive = !this.isSlurActive;
  }

  toggleGrace() {
    this.isGraceActive = !this.isGraceActive;
  }

  setNotehead(type) {
    this.activeNotehead = type;
  }

  // Modifiers
  toggleArticulation(type) {
    if (this.activeArticulations.includes(type)) {
      this.activeArticulations = this.activeArticulations.filter(a => a !== type);
    } else {
      this.activeArticulations.push(type);
    }
  }

  toggleDynamic(type) {
    if (this.activeDynamics.includes(type)) {
      this.activeDynamics = this.activeDynamics.filter(a => a !== type);
    } else {
      this.activeDynamics.push(type);
    }
  }

  toggleOrnament(type) {
    if (this.activeOrnaments.includes(type)) {
      this.activeOrnaments = this.activeOrnaments.filter(a => a !== type);
    } else {
      this.activeOrnaments.push(type);
    }
  }

  // VexTab Syntax Parser for technique
  // e.g., type "b" -> sets activeVexTabTechnique = "bend"
  // e.g., type "v" -> sets activeVexTabTechnique = "vibrato"
  // e.g., type "h" -> sets activeVexTabTechnique = "hammer"
  parseVexTab(char) {
    const map = {
      'b': 'bend',
      'v': 'vibrato',
      's': 'slide',
      'h': 'hammer',
      'p': 'pull',
      't': 'tap'
    };
    if (map[char]) {
      this.activeVexTabTechnique = map[char];
    } else {
      this.activeVexTabTechnique = null;
    }
  }

  setChordSymbol(symbol) {
    this.activeChordSymbol = symbol;
  }

  clearModifiers() {
    this.activeArticulations = [];
    this.activeDynamics = [];
    this.activeOrnaments = [];
    this.activeVexTabTechnique = null;
    this.activeChordSymbol = null;
    this.isTieActive = false;
    this.isSlurActive = false;
  }
}
