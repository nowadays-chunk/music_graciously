// core/music/score/Note.js
import Pitch from "./Pitch";
import Duration from "./Duration";

export default class Note {
  constructor(pitch, duration) {
    this.pitch = pitch;
    this.duration = duration;
    this.isRest = false;

    // Advanced Note Forms
    this.notehead = "normal"; // "normal", "cross", "diamond", "diamond-wide", "triangle", "x", "slash"
    this.isGrace = false;
    this.tie = null; // "start", "stop", "start-stop", null
    this.slur = null; // "start", "stop", "start-stop", null

    // Guitar metadata
    this.string = null;
    this.fret = null;

    this.midi = null;
    this.velocity = 1;
    this.id = Math.random().toString(36).substr(2, 9);

    // Techniques & Expressions
    this.technique = null; // "slide", "bend", "hammer", "pull", "vibrato", "harmonic", "arco", "pizzicato", "palm-mute", "legato", "staccato" (often technique and articulation blur)
    this.bend = null;      // if technique is bend

    this.dynamics = [];      // e.g. ["p", "f", "mf", "crescendo", "decrescendo"]
    this.articulations = []; // e.g. ["staccato", "accent", "tenuto", "marcato", "fermata", "up-bow", "down-bow"]
    this.ornaments = [];     // e.g. ["trill", "mordent", "turn", "arpeggio", "glissando"]

    // Chord & Harmony
    this.chordSymbol = null; // e.g. "Cmaj7", "V7/ii"
  }

  serialize() {
    return {
      id: this.id,
      pitch: this.pitch?.serialize() || null,
      duration: this.duration?.serialize() || null,
      isRest: this.isRest,

      notehead: this.notehead,
      isGrace: this.isGrace,
      tie: this.tie,
      slur: this.slur,

      string: this.string,
      fret: this.fret,
      technique: this.technique,
      bend: this.bend,

      dynamics: this.dynamics,
      articulations: this.articulations,
      ornaments: this.ornaments,
      chordSymbol: this.chordSymbol,

      midi: this.midi,
      velocity: this.velocity
    };
  }

  static deserialize(json) {
    const n = new Note(
      Pitch.deserialize(json.pitch),
      Duration.deserialize(json.duration)
    );
    if (json.id) n.id = json.id;

    n.isRest = json.isRest;

    n.notehead = json.notehead ?? "normal";
    n.isGrace = json.isGrace ?? false;
    n.tie = json.tie ?? null;
    n.slur = json.slur ?? null;

    n.string = json.string ?? null;
    n.fret = json.fret ?? null;
    n.technique = json.technique ?? null;
    n.bend = json.bend ?? null;

    n.dynamics = json.dynamics ?? [];
    n.articulations = json.articulations ?? [];
    n.ornaments = json.ornaments ?? [];
    n.chordSymbol = json.chordSymbol ?? null;

    n.midi = json.midi ?? null;
    n.velocity = json.velocity ?? 1;

    return n;
  }
}
