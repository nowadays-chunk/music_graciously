import guitar from "./guitar.js";
import { newLayout } from "../redux/actions.js";

// ------------------------------
// GET NOTE FROM FRETBOARD
// ------------------------------
function getNoteAt(stringIndex, fretIndex, tuning) {
  const open = tuning[stringIndex];
  return guitar.notes.sharps[(open + fretIndex) % 12];
}

// ------------------------------
// SCALE NOTES
// ------------------------------
export function getScaleNotes(scaleName, keyIndex) {
  const { formula } = guitar.scales[scaleName];
  let notes = [guitar.notes.sharps[keyIndex]];
  let idx = keyIndex;

  formula.forEach(step => {
    idx = (idx + step) % 12;
    notes.push(guitar.notes.sharps[idx]);
  });

  return notes;
}

export function getScaleIntervals(scaleName) {
  return guitar.scales[scaleName].intervals || [];
}

// ------------------------------
// MODE NOTES
// ------------------------------
export function getModeNotes(scaleNotes, modeIndex) {
  if (modeIndex === "" || modeIndex === null) return scaleNotes;
  return scaleNotes.slice(modeIndex).concat(scaleNotes.slice(0, modeIndex));
}

// ------------------------------
// ARPEGGIOS
// ------------------------------
export function getArpNotes(arpName, keyIndex) {
  const { formula } = guitar.arppegios[arpName];
  let notes = [guitar.notes.sharps[keyIndex]];
  let idx = keyIndex;

  formula.forEach(step => {
    idx = (idx + step) % 12;
    notes.push(guitar.notes.sharps[idx]);
  });

  return notes;
}

export function getArpIntervals(arpName) {
  return guitar.arppegios[arpName].intervals || [];
}

// ------------------------------
// APPLY SHAPE
// ------------------------------
function applyShape({
  fretboard,
  notes,
  intervals,
  keyIndex,
  shape,
  shapeIntervals,
  tuning
}) {
  const fretCount = 25;

  fretboard.forEach((string, stringIndex) => {
    for (let fretIndex = 0; fretIndex < fretCount; fretIndex++) {
      const noteName = getNoteAt(stringIndex, fretIndex, tuning);

      if (!notes.includes(noteName)) continue;

      const start = shapeIntervals.start + keyIndex;
      const end = shapeIntervals.end + keyIndex;

      if (fretIndex < start || fretIndex > end) continue;

      const interval = intervals[notes.indexOf(noteName)];

      string[fretIndex].show = true;
      string[fretIndex].interval = interval;
      string[fretIndex].current = noteName;
    }
  });

  return fretboard;
}

// ------------------------------
// MAIN PROCESSOR
// ------------------------------
export function processFretboard({
  keyIndex,
  type,      // "scale" | "arppegio" | "chord"
  scaleName,
  arpName,
  chordName,
  shape,
  modeIndex = "",
  tuning = guitar.tuning
}) {
  const fretboard = newLayout(6, 25, tuning);

  let notes = [];
  let intervals = [];

  // --------------------------------------------------
  // SCALE
  // --------------------------------------------------
  if (type === "scale" && scaleName) {
    notes = getScaleNotes(scaleName, keyIndex);
    intervals = getScaleIntervals(scaleName);

    if (guitar.scales[scaleName].isModal && modeIndex !== "") {
      notes = getModeNotes(notes, modeIndex);
    }

    const shapeIndex = guitar.shapes.names.indexOf(shape);
    const shapeIntervals = guitar.scales[scaleName].indexes[shapeIndex];

    return applyShape({
      fretboard,
      notes,
      intervals,
      keyIndex,
      shape,
      shapeIntervals,
      tuning
    });
  }

  // --------------------------------------------------
  // ARPEGGIOS
  // --------------------------------------------------
  if (type === "arppegio" && arpName) {
    notes = getArpNotes(arpName, keyIndex);
    intervals = getArpIntervals(arpName);

    const shapeIndex = guitar.shapes.names.indexOf(shape);
    const shapeIntervals = guitar.shapes.indexes[arpName][shapeIndex];

    return applyShape({
      fretboard,
      notes,
      intervals,
      keyIndex,
      shape,
      shapeIntervals,
      tuning
    });
  }

  // --------------------------------------------------
  // CHORDS (CAGED positions)
  // --------------------------------------------------
  if (type === "chord" && chordName) {
    const caged = guitar.arppegios[chordName].cagedShapes[shape];

    const realFrets = caged.map(fret =>
      fret === null ? null : fret + keyIndex
    ).reverse();

    const chordIntervals = guitar.arppegios[chordName].intervals;

    fretboard.forEach((string, stringIndex) => {
      const target = realFrets[stringIndex];
      if (target === null) return;

      const noteName = getNoteAt(stringIndex, target, tuning);
      const index = guitar.arppegios[chordName].intervals.indexOf(
        chordIntervals[chordIntervals.indexOf(chordIntervals[0])]
      );

      string[target].show = true;
      string[target].interval = chordIntervals[index];
      string[target].current = noteName;
    });

    return fretboard;
  }

  return fretboard;
}
