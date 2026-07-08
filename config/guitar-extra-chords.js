const CAGED_SHAPES = ["C", "A", "G", "E", "D"];
const STANDARD_TUNING = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, E

const SHAPE_PROFILES = {
  // Standard physical CAGED fret windows (relative to root = 0):
  // These define WHERE on the neck a shape lives, not which specific frets to press.
  C: { min: 0, max: 3,  preferred: [0, 3, 2, 0, 1, 0] },
  A: { min: 2, max: 5,  preferred: [null, 3, 5, 5, 5, 3] },
  G: { min: 4, max: 8,  preferred: [8, 7, 5, 5, 8, 8] },
  E: { min: 7, max: 10, preferred: [8, 10, 10, 9, 8, 8] },
  D: { min: 9, max: 13, preferred: [null, null, 10, 12, 13, 12] },
};

const INTERVAL_STEPS = {
  "1": 0,
  "b2": 1,
  "2": 2,
  "b3": 3,
  "3": 4,
  "4": 5,
  "b5": 6,
  "#4": 6,
  "5": 7,
  "#5": 8,
  "b6": 8,
  "6": 9,
  "bb7": 9,
  "b7": 10,
  "7": 11,
  "b9": 13,
  "9": 14,
  "#9": 15,
  "11": 17,
  "#11": 18,
  "13": 21,
};

const EXTRA_INTERVAL_LABELS = {
  "b2": "flat second",
  "#5": "augmented fifth",
};

const EXTRA_CHORD_DEFINITIONS = {
  "5": {
    name: "Power 5",
    intervals: ["1", "5"],
    quality: "Power",
    degree: "Neutral",
  },
  "7sus4": {
    name: "Dominant 7sus4",
    intervals: ["1", "4", "5", "b7"],
    quality: "Dominant",
    degree: "Mixolydian",
  },
  "maj9": {
    name: "Major 9th",
    intervals: ["1", "3", "5", "7", "9"],
    quality: "Major",
    degree: "Major",
  },
  "maj11": {
    name: "Major 11th",
    intervals: ["1", "3", "5", "7", "9", "11"],
    quality: "Major",
    degree: "Major",
  },
  "maj13": {
    name: "Major 13th",
    intervals: ["1", "3", "5", "7", "9", "13"],
    quality: "Major",
    degree: "Major",
  },
  "maj9#11": {
    name: "Major 9#11",
    intervals: ["1", "3", "5", "7", "9", "#11"],
    quality: "Major",
    degree: "Lydian",
  },
  "maj13#11": {
    name: "Major 13#11",
    intervals: ["1", "3", "5", "7", "9", "#11", "13"],
    quality: "Major",
    degree: "Lydian",
  },
  "add9": {
    name: "add9",
    intervals: ["1", "3", "5", "9"],
    quality: "Major",
    degree: "Major",
  },
  "6add9": {
    name: "6add9",
    intervals: ["1", "3", "5", "6", "9"],
    quality: "Major",
    degree: "Major",
  },
  "maj7b5": {
    name: "Major 7b5",
    intervals: ["1", "3", "b5", "7"],
    quality: "Major",
    degree: "Major",
  },
  "maj7#5": {
    name: "Major 7#5",
    intervals: ["1", "3", "#5", "7"],
    quality: "Major",
    degree: "Major",
  },
  "m9": {
    name: "Minor 9th",
    intervals: ["1", "b3", "5", "b7", "9"],
    quality: "Minor",
    degree: "Minor",
  },
  "m11": {
    name: "Minor 11th",
    intervals: ["1", "b3", "5", "b7", "9", "11"],
    quality: "Minor",
    degree: "Minor",
  },
  "m13": {
    name: "Minor 13th",
    intervals: ["1", "b3", "5", "b7", "9", "11", "13"],
    quality: "Minor",
    degree: "Minor",
  },
  "madd9": {
    name: "Minor add9",
    intervals: ["1", "b3", "5", "9"],
    quality: "Minor",
    degree: "Minor",
  },
  "m6add9": {
    name: "Minor 6add9",
    intervals: ["1", "b3", "5", "6", "9"],
    quality: "Minor",
    degree: "Minor",
  },
  "mmaj9": {
    name: "Minor Major 9th",
    intervals: ["1", "b3", "5", "7", "9"],
    quality: "Minor",
    degree: "Minor",
  },
  "m7#5": {
    name: "Minor 7#5",
    intervals: ["1", "b3", "#5", "b7"],
    quality: "Minor",
    degree: "Minor",
  },
  "7b9": {
    name: "Dominant 7b9",
    intervals: ["1", "3", "5", "b7", "b9"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "7#9": {
    name: "Dominant 7#9",
    intervals: ["1", "3", "5", "b7", "#9"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "7(b5,b9)": {
    name: "Dominant 7(b5,b9)",
    intervals: ["1", "3", "b5", "b7", "b9"],
    quality: "Dominant",
    degree: "Altered",
  },
  "7(b5,#9)": {
    name: "Dominant 7(b5,#9)",
    intervals: ["1", "3", "b5", "b7", "#9"],
    quality: "Dominant",
    degree: "Altered",
  },
  "7(#5,b9)": {
    name: "Dominant 7(#5,b9)",
    intervals: ["1", "3", "#5", "b7", "b9"],
    quality: "Dominant",
    degree: "Altered",
  },
  "7(#5,#9)": {
    name: "Dominant 7(#5,#9)",
    intervals: ["1", "3", "#5", "b7", "#9"],
    quality: "Dominant",
    degree: "Altered",
  },
  "9b5": {
    name: "Dominant 9b5",
    intervals: ["1", "3", "b5", "b7", "9"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "9#5": {
    name: "Dominant 9#5",
    intervals: ["1", "3", "#5", "b7", "9"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "13#11": {
    name: "Dominant 13#11",
    intervals: ["1", "3", "5", "b7", "9", "#11", "13"],
    quality: "Dominant",
    degree: "Lydian dominant",
  },
  "13b9": {
    name: "Dominant 13b9",
    intervals: ["1", "3", "5", "b7", "b9", "13"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "11b9": {
    name: "Dominant 11b9",
    intervals: ["1", "3", "5", "b7", "b9", "11"],
    quality: "Dominant",
    degree: "Dominant",
  },
  "sus2sus4": {
    name: "sus2sus4",
    intervals: ["1", "2", "4", "5"],
    quality: "Suspended",
    degree: "Suspended",
  },
  "-5": {
    name: "Flat 5",
    intervals: ["1", "3", "b5"],
    quality: "Major",
    degree: "Major",
  },
};

function getIntervalStep(interval) {
  if (INTERVAL_STEPS[interval] === undefined) {
    throw new Error(`Unknown guitar interval: ${interval}`);
  }

  return INTERVAL_STEPS[interval];
}

function buildFormula(intervals) {
  const steps = intervals.map(getIntervalStep);

  return steps.slice(1).map((step, index) => step - steps[index]);
}

function buildPitchMap(intervals) {
  return intervals.reduce((map, interval) => {
    const pitchClass = getIntervalStep(interval) % 12;
    if (!map.has(pitchClass)) {
      map.set(pitchClass, interval);
    }

    return map;
  }, new Map());
}

function getCandidatesForString(profile, stringIndex, pitchMap) {
  const candidates = [{ fret: null, interval: null }];

  for (let fret = profile.min; fret <= profile.max; fret += 1) {
    const pitchClass = (STANDARD_TUNING[stringIndex] + fret) % 12;
    const interval = pitchMap.get(pitchClass);
    if (interval) {
      candidates.push({ fret, interval });
    }
  }

  return candidates;
}

function scoreVoicing(voicing, intervals, preferred) {
  const active = voicing.filter((note) => note.fret !== null);
  const covered = new Set(active.map((note) => note.interval));
  const activeFrets = active.map((note) => note.fret);
  const minFret = activeFrets.length ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length ? Math.max(...activeFrets) : 0;
  const span = maxFret - minFret;
  const hasRoot = covered.has("1");
  const coreCoverage = ["1", "3", "b3", "4", "5", "b5", "#5", "b7", "7", "6"]
    .filter((interval) => intervals.includes(interval) && covered.has(interval))
    .length;

  const distance = voicing.reduce((total, note, index) => {
    const target = preferred[index];
    if (note.fret === null || target === null) {
      return total + (note.fret === target ? 0 : 3);
    }

    return total + Math.abs(note.fret - target);
  }, 0);

  return (
    covered.size * 1000
    + coreCoverage * 120
    + (hasRoot ? 250 : 0)
    + active.length * 20
    - span * 15
    - distance * 3
  );
}

function pickVoicing(candidateSets, intervals, preferred) {
  let best = null;
  let bestScore = -Infinity;

  function visit(index, current) {
    if (index === candidateSets.length) {
      const score = scoreVoicing(current, intervals, preferred);
      if (score > bestScore) {
        bestScore = score;
        best = current;
      }
      return;
    }

    candidateSets[index].forEach((candidate) => {
      visit(index + 1, current.concat(candidate));
    });
  }

  visit(0, []);

  return best.map((note) => note.fret);
}

function buildCagedShapes(intervals) {
  const pitchMap = buildPitchMap(intervals);

  return CAGED_SHAPES.reduce((shapes, shape) => {
    const profile = SHAPE_PROFILES[shape];
    const candidateSets = STANDARD_TUNING.map((_, stringIndex) =>
      getCandidatesForString(profile, stringIndex, pitchMap)
    );

    shapes[shape] = pickVoicing(candidateSets, intervals, profile.preferred);
    return shapes;
  }, {});
}

function buildShapeIndexes(cagedShapes) {
  // Always return the standard physical CAGED fret windows.
  // The window defines WHERE on the neck we look; the cagedShapes frets
  // define WHICH frets to actually finger within that region.
  return CAGED_SHAPES.map((shape) => {
    const profile = SHAPE_PROFILES[shape];
    return { start: profile.min, end: profile.max };
  });
}

function getAbsoluteNotes(entity) {
  let current = 0;
  const notes = [current];

  entity.formula.forEach((step) => {
    current = (current + step) % 12;
    notes.push(current);
  });

  return [...new Set(notes)];
}

function getScaleNotes(scale, modeIndex = 0) {
  const notes = getAbsoluteNotes(scale);

  if (!modeIndex) {
    return notes;
  }

  return notes.slice(modeIndex).concat(notes.slice(0, modeIndex));
}

function containsAll(targetNotes, sourceNotes) {
  return sourceNotes.every((note) => targetNotes.includes(note));
}

function populateMatches(guitar, chordKeys) {
  chordKeys.forEach((key) => {
    const chord = guitar.arppegios[key];
    const chordNotes = getAbsoluteNotes(chord);

    chord.matchingScales = Object.values(guitar.scales).flatMap((scale) => {
      if (scale.modes?.length) {
        return scale.modes
          .filter((mode, index) => containsAll(getScaleNotes(scale, index), chordNotes))
          .map((mode) => mode.name);
      }

      return containsAll(getScaleNotes(scale), chordNotes) ? [scale.name] : [];
    });

    chord.matchingArpeggios = Object.values(guitar.arppegios)
      .filter((arp) => arp.name !== chord.name && containsAll(getAbsoluteNotes(arp), chordNotes))
      .map((arp) => arp.name);
  });
}

function applyExtraChords(guitar) {
  Object.assign(guitar.intervalMap, EXTRA_INTERVAL_LABELS);

  const addedKeys = [];

  Object.entries(EXTRA_CHORD_DEFINITIONS).forEach(([key, definition]) => {
    if (guitar.arppegios[key]) {
      return;
    }

    const cagedShapes = buildCagedShapes(definition.intervals);
    const chord = {
      name: definition.name,
      intervals: definition.intervals,
      formula: buildFormula(definition.intervals),
      quality: definition.quality,
      degree: definition.degree,
      cagedShapes,
      matchingScales: [],
      matchingArpeggios: [],
    };

    guitar.arppegios[key] = chord;
    guitar.shapes.indexes[key] = buildShapeIndexes(cagedShapes);
    addedKeys.push(key);
  });

  populateMatches(guitar, addedKeys);

  return guitar;
}

module.exports = {
  EXTRA_CHORD_DEFINITIONS,
  applyExtraChords,
};
