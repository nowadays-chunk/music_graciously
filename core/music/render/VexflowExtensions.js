// core/music/render/VexflowExtensions.js
import Vex from "vexflow";

const {
  StaveNote,
  TabNote,
  Accidental,
} = Vex;

/* -------------------- Convert Pitch → Vex Key -------------------- */
export function pitchToVexKey(pitch) {
  const steps = { C: "c", D: "d", E: "e", F: "f", G: "g", A: "a", B: "b" };
  const accidental =
    pitch.alter === 1 ? "#" :
    pitch.alter === -1 ? "b" :
    pitch.alter === 2 ? "##" :
    pitch.alter === -2 ? "bb" : "";

  return `${steps[pitch.step]}${accidental}/${pitch.octave}`;
}

/* -------------------- Convert Duration Object → VexFlow Duration -------------------- */
export function durationToVex(duration) {
  const map = {
    1: "q",     // quarter
    0.5: "8",   // eighth
    0.25: "16", // sixteenth
    2: "h",     // half
    4: "w"      // whole
  };

  const base = map[duration.value] || "q";
  return base + (duration.dots ? "d".repeat(duration.dots) : "");
}

/* -------------------- Create Stave Note -------------------- */
export function createVexNote(note) {
  const key = pitchToVexKey(note.pitch);
  const dur = durationToVex(note.duration);

  const vfNote = new StaveNote({
    keys: [key],
    duration: dur,
    clef: "treble",
  });

  if (note.pitch.alter === 1) vfNote.addModifier(new Accidental("#"), 0);
  if (note.pitch.alter === -1) vfNote.addModifier(new Accidental("b"), 0);
  if (note.pitch.alter === 2) vfNote.addModifier(new Accidental("##"), 0);
  if (note.pitch.alter === -2) vfNote.addModifier(new Accidental("bb"), 0);

  return vfNote;
}

/* -------------------- Create Rest -------------------- */
export function createVexRest(rest) {
  const dur = durationToVex(rest.duration);
  return new StaveNote({ keys: ["b/4"], duration: dur + "r" });
}

/* -------------------- Create TAB Note -------------------- */
export function createVexTab(note) {
  return new TabNote({
    positions: [{ str: note.string, fret: note.fret }],
    duration: durationToVex(note.duration),
  });
}
