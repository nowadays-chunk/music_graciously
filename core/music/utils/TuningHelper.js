// core/music/utils/TuningHelper.js
import guitar from '@/config/guitar';
import Pitch from '@/core/music/score/Pitch';

/**
 * Calculate pitch from string and fret position based on tuning
 * @param {number} string - String number (1-6, where 1 is highest/thinnest)
 * @param {number} fret - Fret number (0 = open string)
 * @param {Array<number>} tuning - Tuning array (default: standard tuning)
 * @param {number} accidental - Accidental preference: 0=natural, 1=sharp, -1=flat
 * @returns {Pitch} Pitch object with step, alter, octave
 */
export function getPitchFromStringFret(string, fret, tuning = guitar.tuning, accidental = 0) {
    // Validate inputs
    if (string < 1 || string > 6) throw new Error('String must be between 1 and 6');
    if (fret < 0) throw new Error('Fret must be non-negative');

    // Convert string number to array index (string 1 = High E = index 0)
    const stringIndex = string - 1;

    // Calculate note index (0-11)
    const openStringNote = tuning[stringIndex];
    const noteIndex = (openStringNote + fret) % 12;

    // Calculate octave
    // Standard tuning base octaves from High E to Low E: [E4, B3, G3, D3, A2, E2]
    const baseOctaves = [4, 3, 3, 3, 2, 2];
    const baseOctave = baseOctaves[stringIndex];
    // Adding fret/12 isn't strictly correct for guitar because octaves start at C, 
    // but the original logic was: baseOctave + Math.floor((openStringNote + fret) / 12)
    // A simpler way: every 12 frets adds an octave.
    let currentNoteIndex = openStringNote % 12;
    let octave = baseOctave;
    const notes = guitar.notes.sharps;

    for (let i = 0; i <= fret; i++) {
        const note = notes[(currentNoteIndex + i) % 12];
        if (note === 'C' && i > 0) octave++; // Octave increments on C
    }

    // Get note name based on accidental preference
    let noteName;
    if (accidental === -1) {
        // Prefer flats
        noteName = guitar.notes.flats[noteIndex];
    } else {
        // Prefer sharps or natural
        noteName = guitar.notes.sharps[noteIndex];
    }

    // Parse note name to get step and alter
    let step = noteName[0];
    let alter = 0;

    if (noteName.length > 1) {
        if (noteName[1] === '#') alter = 1;
        else if (noteName[1] === 'b') alter = -1;
    }

    return new Pitch(step, alter, octave);
}

/**
 * Get MIDI number from string and fret
 */
export function getMidiFromStringFret(string, fret, tuning = guitar.tuning) {
    const stringIndex = string - 1;
    const pitch = getPitchFromStringFret(string, fret, tuning, 0);
    // MIDI = (octave + 1) * 12 + note_index_from_C
    const noteIndex = guitar.notes.sharps.indexOf(pitch.step + (pitch.alter === 1 ? '#' : pitch.alter === -1 ? 'b' : ''));
    return (pitch.octave + 1) * 12 + noteIndex;
}
