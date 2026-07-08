import { Midi } from "@tonejs/midi";
import Score from "../score/Score";
import Note from "../score/Note";
import Pitch from "../score/Pitch";
import Duration from "../score/Duration";

export default class MidiImport {
  static parse(arrayBuffer) {
    const midi = new Midi(arrayBuffer);
    const score = new Score();

    // 1. Setup Global Info
    // Assuming 4/4 for MVP or read from MIDI
    let timeSig = { beats: 4, beatType: 4 };
    if (midi.header.timeSignatures.length > 0) {
      timeSig = {
        beats: midi.header.timeSignatures[0].timeSignature[0],
        beatType: midi.header.timeSignatures[0].timeSignature[1],
      };
    }
    // Note: We don't have TimeSignature class exposed here easily? 
    // Score defaults to 4/4. We'll leave it or assume user edits it.

    const bpm = midi.header.tempos[0]?.bpm || 120;

    // 2. Select Track (Find first track with notes)
    const track = midi.tracks.find((t) => t.notes.length > 0);
    if (!track) return score;

    // 3. Process Events
    // Map to { beat, durationBeats, midi }
    const events = track.notes.map((n) => ({
      beat: n.time * (bpm / 60),
      duration: n.duration * (bpm / 60),
      midi: n.midi,
    }));

    // Sort by beat
    events.sort((a, b) => a.beat - b.beat);

    // 4. Quantize & Fill
    let cursor = 0;
    const END_TOLERANCE = 0.01;

    // We process events chronologically.
    // If we have chords, they share 'beat'.

    // Group by beat (approximate)
    const grouped = [];
    const QUANTIZE = 0.25; // 16th note grid

    events.forEach(e => {
      // Quantize start time
      const qBeat = Math.round(e.beat / QUANTIZE) * QUANTIZE;
      // Quantize duration
      let qDur = Math.round(e.duration / QUANTIZE) * QUANTIZE;
      if (qDur < QUANTIZE) qDur = QUANTIZE;

      // Add to group
      let group = grouped.find(g => Math.abs(g.beat - qBeat) < 0.01);
      if (!group) {
        group = { beat: qBeat, notes: [], duration: qDur };
        grouped.push(group);
      }

      // Take min duration of group? Or allow variance (handled by truncation later)
      // For simple chord logic, we assume same duration
      group.notes.push(e);
      // group.duration = Math.max(group.duration, qDur); // Keep max?
    });

    // Sort groups
    grouped.sort((a, b) => a.beat - b.beat);

    // Fill logic
    for (let i = 0; i < grouped.length; i++) {
      const group = grouped[i];
      const nextGroup = grouped[i + 1];

      // Gap before this group?
      if (group.beat > cursor + END_TOLERANCE) {
        const gap = group.beat - cursor;
        addRests(score, cursor, gap);
        cursor = group.beat;
      }

      // Determine Duration
      // Clamped by next event start
      let playDur = group.duration;
      if (nextGroup && (group.beat + playDur > nextGroup.beat)) {
        playDur = nextGroup.beat - group.beat;
      }

      // Add Notes
      group.notes.forEach(raw => {
        const pitch = Pitch.fromMidi(raw.midi);
        const symbols = beatToSymbols(playDur);
        // Assume simple duration for now (taking largest component)
        // e.g. 3 -> h (2) + q (1).
        // We only support creating ONE Note object per event currently in this simplified loop.
        // If we split notes, we need ties. 
        // We will take the primary symbol and ignore remainder for MVP.
        const symbol = symbols[0];

        const note = new Note(pitch, new Duration(symbol));
        const tab = calculateTab(raw.midi);
        note.string = tab.string;
        note.fret = tab.fret;

        score.addNote(cursor, note);
      });

      cursor += Duration.toBeats(beatToSymbols(playDur)[0]); // Advance by actual inserted duration
    }

    // Fill to end of measure
    // Calculate total duration needed?
    // Just leave it optional.

    return score;
  }
}

function addRests(score, startBeat, totalDuration) {
  let remaining = totalDuration;
  let cursor = startBeat;

  const symbols = beatToSymbols(remaining); // e.g. ['h', 'q']

  symbols.forEach(sym => {
    const durVal = Duration.toBeats(sym);
    const note = new Note(new Pitch("B", 0, 4), new Duration(sym)); // Pitch ignored for rest
    note.isRest = true;
    score.addNote(cursor, note);
    cursor += durVal;
  });
}

function beatToSymbols(beats) {
  const syms = [];
  let rem = beats;
  const TOLERANCE = 0.01;

  while (rem >= 4 - TOLERANCE) { syms.push("w"); rem -= 4; }
  while (rem >= 2 - TOLERANCE) { syms.push("h"); rem -= 2; }
  while (rem >= 1 - TOLERANCE) { syms.push("q"); rem -= 1; }
  while (rem >= 0.5 - TOLERANCE) { syms.push("8"); rem -= 0.5; }
  while (rem >= 0.25 - TOLERANCE) { syms.push("16"); rem -= 0.25; }

  if (syms.length === 0) syms.push("16"); // Minimum
  return syms;
}

function calculateTab(midi) {
  const strings = [64, 59, 55, 50, 45, 40]; // E4...E2

  // 1. Try to find in position 0-4
  for (let i = 0; i < strings.length; i++) {
    const fret = midi - strings[i];
    if (fret >= 0 && fret <= 4) return { string: i + 1, fret };
  }

  // 2. Try to find in position 0-12
  for (let i = 0; i < strings.length; i++) {
    const fret = midi - strings[i];
    if (fret >= 0 && fret <= 12) return { string: i + 1, fret };
  }

  // 3. Fallback
  for (let i = 0; i < strings.length; i++) {
    const fret = midi - strings[i];
    if (fret >= 0) return { string: i + 1, fret };
  }

  return { string: 1, fret: 0 };
}
