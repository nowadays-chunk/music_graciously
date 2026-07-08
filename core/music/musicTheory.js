import guitar from '../../config/guitar';

/**
 * Gets the index (0-11) for a given note name, searching both sharps and flats.
 * @param {string} noteName 
 * @returns {number} 0-11, or -1 if not found
 */
export const getNoteIndex = (noteName) => {
    if (!noteName) return -1;
    let idx = guitar.notes.sharps.indexOf(noteName);
    if (idx === -1) {
        idx = guitar.notes.flats.indexOf(noteName);
    }
    return idx;
};

/**
 * Calculates absolute note indices (0-11) for a given musical entity.
 * 
 * @param {string} type - 'scale', 'chord', or 'arppegio'
 * @param {string} subType - The key name in guitar config (e.g., 'major', 'M', '7')
 * @param {number} keyIndex - The root note index (0-11, where 0 is C)
 * @param {number} modeIndex - Optional mode index for scales (0-indexed)
 * @returns {number[]} Array of absolute note indices in ascending order
 */
export const getAbsoluteNotes = (type, subType, keyIndex, modeIndex = 0) => {
    let formula = [];
    if (type === 'scale') {
        const scaleData = guitar.scales[subType];
        if (!scaleData) return [];
        formula = scaleData.formula || [];
    } else if (type === 'chord' || type === 'arppegio' || type === 'arp') {
        const arpData = guitar.arppegios[subType];
        if (!arpData) return [];
        formula = arpData.formula || [];
    }

    let current = keyIndex;
    let notes = [current];
    formula.forEach(step => {
        current = (current + step) % 12;
        notes.push(current);
    });

    // Handle Modes for scales
    if (type === 'scale' && modeIndex > 0) {
        // The notes array contains the notes of the parent scale starting from keyIndex.
        // To get the mode, we shift the starting point to the modeIndex-th note.
        // Array.from(new Set(notes)) perfectly maintains musical insertion order of scale degrees
        const uniqueNotes = Array.from(new Set(notes));
        const shifted = uniqueNotes.slice(modeIndex).concat(uniqueNotes.slice(0, modeIndex));
        return shifted;
    }

    // Returning unique notes from Root up to 7th without sorting absolute pitch
    return Array.from(new Set(notes));
};

/**
 * Checks if the notes of a chord are a subset of the notes of a target pattern.
 * 
 * @param {number[]} chordNotes - Absolute indices of chord notes
 * @param {number[]} targetNotes - Absolute indices of target notes (scale/arpeggio)
 * @returns {boolean} True if all chord notes are present in the target
 */
export const checkMatch = (chordNotes, targetNotes) => {
    if (!chordNotes?.length || !targetNotes?.length) return false;
    return chordNotes.every(note => targetNotes.includes(note));
};

/**
 * Gets the note name for a given index.
 * @param {number} index - 0-11
 * @param {boolean} preferFlats - Whether to use the flats array
 * @returns {string}
 */
export const getNoteName = (index, preferFlats = false) => {
    const idx = (index + 12) % 12;
    return preferFlats ? guitar.notes.flats[idx] : guitar.notes.sharps[idx];
};

/**
 * Maps semitone distance to interval notation (root, b3, 3, etc.)
 */
const semitoneToInterval = {
    0: "root", 1: "b2", 2: "2", 3: "b3", 4: "3", 5: "4", 6: "b5", 7: "5", 8: "b6", 9: "6", 10: "b7", 11: "7"
};

export const getIntervalName = (semitones) => semitoneToInterval[semitones % 12] || semitones.toString();

/**
 * Compares two sets of notes and returns common and differing notes.
 */
export const getAnalysis = (notes1, notes2, root1, root2) => {
    const set1 = new Set(notes1);
    const set2 = new Set(notes2);

    const common = notes1.filter(n => set2.has(n));
    const only1 = notes1.filter(n => !set2.has(n));
    const only2 = notes2.filter(n => !set1.has(n));

    // Calculate intervals relative to their respective roots
    const intervals1 = notes1.map(n => (n - root1 + 12) % 12);
    const intervals2 = notes2.map(n => (n - root2 + 12) % 12);

    // Relative to root1 (the main pivot)
    const commonIntervals = common.map(n => getIntervalName((n - root1 + 12) % 12));
    const only1Intervals = only1.map(n => getIntervalName((n - root1 + 12) % 12));
    const only2Intervals = only2.map(n => getIntervalName((n - root1 + 12) % 12));

    return {
        commonNotes: common.map(n => getNoteName(n)),
        only1Notes: only1.map(n => getNoteName(n)),
        only2Notes: only2.map(n => getNoteName(n)),
        commonIntervals,
        only1Intervals,
        only2Intervals
    };
};
