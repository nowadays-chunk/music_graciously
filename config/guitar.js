import extraChordConfig from './guitar-extra-chords.js';

const guitar = {
  "notes": {
    "sharps": [
      "C", // 0
      "C#", // 1
      "D",  // 2
      "D#", // 3
      "E",  // 4
      "F",  // 5
      "F#", // 6
      "G",  // 7
      "G#", // 8
      "A",  // 9
      "A#", // 10
      "B"  // 11
    ],
    "flats": [
      "C",
      "Db",
      "D",
      "Eb",
      "E",
      "F",
      "Gb",
      "G",
      "Ab",
      "A",
      "Bb",
      "B"
    ]
  },
  "circleOfFifths": [
    { "key": "C", "relative": "Am" },
    { "key": "G", "relative": "Em" },
    { "key": "D", "relative": "Bm" },
    { "key": "A", "relative": "F#m" },
    { "key": "E", "relative": "Dbm" },
    { "key": "B", "flat": "Cb", "relative": "Abm" },
    { "key": "Gb", "sharp": "F#", "relative": "Ebm" },
    { "key": "Db", "sharp": "C#", "relative": "Bbm" },
    { "key": "Ab", "relative": "Fm" },
    { "key": "Eb", "relative": "Cm" },
    { "key": "Bb", "relative": "Gm" },
    { "key": "F", "relative": "Dm" }
  ],
  "numberOfStrings": 6,
  "numberOfFrets": 25,
  "tuning": [4, 11, 7, 2, 9, 4], // E, A, D, G, B, E standard tuning
  "shapes": {
    "names": ["C", "A", "G", "E", "D"],
    "intervals": [0, 3, 5, 8, 10, 12],
    "indexes": {
      // Standard CAGED physical fret windows (relative to key root = 0):
      // C: 0-3 | A: 2-5 | G: 4-8 | E: 7-10 | D: 9-13
      // All chord types use the same windows — the window defines WHERE on the
      // neck we look; the cagedShapes values inside each arpeggio define WHICH
      // frets to actually finger.
      "M": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "min": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "aug": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "dim": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "sus2": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "sus4": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "add2": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "add4": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "6": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "min6": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "min7": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "7": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "M7": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "min7b5": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "dim7": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "9": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "11": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "13": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "minMaj7": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "7#5": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ],
      "7b5": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ]
    }
  },
  "intervalMap": {
    "1": "root",
    "2": "second",
    "b3": "minor third",
    "3": "major third",
    "4": "fourth",
    "#4": "augmented fourth",
    "5": "fifth",
    "b5": "diminished fifth",
    "b6": "minor sixth",
    "6": "sixth",
    "7": "seventh",
    "b7": "minor seventh",
    "b9": "flat ninth",
    "9": "ninth",
    "#9": "sharp ninth",
    "11": "eleventh",
    "#11": "sharp eleventh",
    "13": "thirteenth"
  },
  "scales": {
    "major": {
      "name": "Major",
      "degree": "Major",
      "formula": [2, 2, 1, 2, 2, 2, 1],
      "intervals": ["1", "2", "3", "4", "5", "6", "7"],
      "isModal": true,
      "modes": [
        { "name": "Ionian", "intervals": ["1", "2", "3", "4", "5", "6", "7"] },
        { "name": "Dorian", "intervals": ["1", "2", "b3", "4", "5", "6", "b7"] },
        { "name": "Phrygian", "intervals": ["1", "b2", "b3", "4", "5", "b6", "b7"] },
        { "name": "Lydian", "intervals": ["1", "2", "3", "#4", "5", "6", "7"] },
        { "name": "Mixolydian", "intervals": ["1", "2", "3", "4", "5", "6", "b7"] },
        { "name": "Aeolian", "intervals": ["1", "2", "b3", "4", "5", "b6", "b7"] },
        { "name": "Locrian", "intervals": ["1", "b2", "b3", "4", "b5", "b6", "b7"] }
      ],
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 6 },  // A shape
        { "start": 4, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ]
    },
    "minor": {
      "name": "Minor",
      "degree": "Minor",
      "formula": [2, 1, 2, 2, 1, 2, 2],
      "intervals": ["1", "2", "b3", "4", "5", "b6", "b7"],
      "isModal": false,
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 3, "end": 6 },  // A shape
        { "start": 5, "end": 9 },  // G shape
        { "start": 8, "end": 11 }, // E shape
        { "start": 10, "end": 13 }  // D shape
      ]
    },
    "harmonic": {
      "name": "Harmonic",
      "degree": "Minor",
      "formula": [2, 1, 2, 2, 1, 3, 1],
      "intervals": ["1", "2", "b3", "4", "5", "b6", "7"],
      "isModal": true,
      "modes": [
        { "name": "Harmonic minor", "intervals": ["1", "2", "b3", "4", "5", "b6", "7"] },
        { "name": "Locrian #6", "intervals": ["1", "b2", "b3", "4", "b5", "6", "b7"] },
        { "name": "Ionian augmented", "intervals": ["1", "2", "3", "#4", "5", "6", "7"] },
        { "name": "Romanian", "intervals": ["1", "2", "b3", "#4", "5", "6", "7"] },
        { "name": "Phrygian dominant", "intervals": ["1", "b2", "3", "4", "5", "b6", "b7"] },
        { "name": "Lydian #2", "intervals": ["1", "#2", "3", "#4", "5", "6", "7"] },
        { "name": "Ultra locrian", "intervals": ["1", "b2", "b3", "b4", "b5", "b6", "bb7"] }
      ],
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 3, "end": 6 },  // A shape
        { "start": 6, "end": 9 },  // G shape
        { "start":7, "end": 10  }, // E shape
        { "start": 10, "end": 13 }  // D shape
      ]
    },
    "melodic": {
      "name": "Melodic",
      "degree": "Minor",
      "formula": [2, 1, 2, 2, 2, 2, 1],
      "intervals": ["1", "2", "b3", "4", "5", "6", "7"],
      "isModal": true,
      "modes": [
        { "name": "Melodic minor", "intervals": ["1", "2", "b3", "4", "5", "6", "7"] },
        { "name": "Javanese", "intervals": ["1", "b2", "b3", "4", "5", "6", "b7"] },
        { "name": "Lydian augmented", "intervals": ["1", "2", "b", "#4", "#5", "6", "7"] },
        { "name": "Lydian dominant", "intervals": ["1", "2", "3", "#4", "5", "6", "7"] },
        { "name": "Hindu", "intervals": ["1", "2", "b3", "4", "5", "6", "7"] },
        { "name": "Locrian #2", "intervals": ["1", "2", "b3", "4", "b5", "b6", "b7"] },
        { "name": "Super locrian", "intervals": ["1", "b2", "b3", "3", "b5", "b6", "b7"] }
      ],
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 5, "end": 8 },  // G shape
        { "start": 7, "end": 10 }, // E shape
        { "start": 10, "end": 13 }  // D shape
      ]
    },
    "blues-minor": {
      "name": "Blues minor",
      "degree": "Minor",
      "isModal": false,
      "intervals": ["1", "b3", "4", "b5", "5"],
      "formula": [3, 2, 2, 3, 2],
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 5, "end": 8 },  // G shape
        { "start": 8, "end": 11 }, // E shape
        { "start": 10, "end": 14 }  // D shape
      ]
    },
    "blues-major": {
      "name": "Blues major",
      "degree": "Major",
      "formula": [2, 2, 3, 2, 3],
      "isModal": false,
      "intervals": ["1", "2", "b3", "3", "5"],
      "indexes": [
        { "start": 0, "end": 3 },  // C shape
        { "start": 2, "end": 5 },  // A shape
        { "start": 5, "end": 8 },  // G shape
        { "start": 7, "end": 11  }, // E shape
        { "start": 9, "end": 13 }  // D shape
      ]
    }
  },
  "cagedIntervals": [0, 3, 5],
  "arppegios": {
    "6": {
      "name": "6th",
      "intervals": [
        "1",
        "3",
        "5",
        "6"
      ],
      "formula": [
        4,
        3,
        2,
        3
      ],
      "quality": "Major",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          0,
          3,
          2,
          2,
          1,
          0
        ],
        "A": [
          null,
          3,
          5,
          4,
          5,
          3
        ],
        "G": [
          8,
          7,
          5,
          7,
          8,
          8
        ],
        "E": [
          8,
          10,
          10,
          9,
          10,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          12,
          12
        ]
      },
      "matchingScales": [
        "Ionian",
        "Lydian",
        "Mixolydian",
        "Ionian augmented",
        "Lydian #2",
        "Lydian dominant"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Major 7th",
        "Minor 7b5"
      ]
    },
    "7": {
      "name": "Dominant 7th",
      "formula": [
        4,
        3,
        3
      ],
      "intervals": [
        "1",
        "3",
        "5",
        "b7"
      ],
      "quality": "Dominant",
      "degree": "Mixolydian",

      "cagedShapes": {
        "C": [
          0,
          3,
          2,
          3,
          1,
          0
        ],
        "A": [
          null,
          3,
          5,
          3,
          5,
          3
        ],
        "G": [
          8,
          7,
          5,
          8,
          8,
          8
        ],
        "E": [
          8,
          10,
          8,
          9,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          11,
          12
        ]
      },
      "matchingScales": [
        "Mixolydian",
        "Phrygian dominant"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Augmented",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Dominant 7#5"
      ]
    },
    "9": {
      "name": "9th",
      "intervals": [
        "1",
        "3",
        "5",
        "b7",
        "9"
      ],
      "formula": [
        4,
        3,
        3,
        3,
        2
      ],
      "quality": "Dominant",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          null,
          3,
          2,
          3,
          3,
          3
        ],
        "A": [
          null,
          3,
          2,
          3,
          3,
          3
        ],
        "G": [
          8,
          7,
          5,
          7,
          8,
          8
        ],
        "E": [
          8,
          10,
          8,
          9,
          10,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          10,
          12
        ]
      },
      "matchingScales": [
        "Mixolydian"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "sus2",
        "sus4",
        "add2",
        "add4"
      ]
    },
    "11": {
      "name": "11th",
      "intervals": [
        "1",
        "3",
        "5",
        "b7",
        "9",
        "11"
      ],
      "formula": [
        4,
        3,
        3,
        2,
        4,
        5
      ],
      "quality": "Dominant",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          null,
          3,
          3,
          3,
          1,
          1
        ],
        "A": [
          null,
          3,
          5,
          3,
          6,
          3
        ],
        "G": [
          8,
          7,
          5,
          5,
          6,
          8
        ],
        "E": [
          8,
          8,
          8,
          8,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          13,
          13
        ]
      },
      "matchingScales": [
        "Mixolydian"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "sus2",
        "sus4",
        "add2",
        "add4"
      ]
    },
    "13": {
      "name": "13th",
      "intervals": [
        "1",
        "3",
        "5",
        "b7",
        "9",
        "13"
      ],
      "formula": [
        4,
        3,
        3,
        2,
        4,
        9
      ],
      "quality": "Dominant",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          null,
          3,
          2,
          3,
          5,
          5
        ],
        "A": [
          null,
          3,
          5,
          3,
          5,
          5
        ],
        "G": [
          8,
          7,
          5,
          7,
          8,
          8
        ],
        "E": [
          8,
          10,
          8,
          9,
          10,
          10
        ],
        "D": [
          null,
          null,
          10,
          12,
          12,
          12
        ]
      },
      "matchingScales": [
        "Mixolydian"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "sus2",
        "sus4",
        "add2",
        "add4"
      ]
    },
    "M": {
      "name": "Major",
      "formula": [
        4,
        3,
        5
      ],
      "intervals": [
        "1",
        "3",
        "5"
      ],
      "quality": "Major",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          0,
          3,
          2,
          0,
          1,
          0
        ],
        "A": [
          null,
          3,
          5,
          5,
          5,
          3
        ],
        "G": [
          8,
          7,
          5,
          5,
          8,
          8
        ],
        "E": [
          8,
          10,
          10,
          9,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          13,
          12
        ]
      },
      "matchingScales": [
        "Ionian",
        "Lydian",
        "Mixolydian",
        "Ionian augmented",
        "Phrygian dominant",
        "Lydian #2",
        "Lydian dominant",
        "Blues major"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "min": {
      "name": "Minor",
      "formula": [
        3,
        4,
        5
      ],
      "intervals": [
        "1",
        "b3",
        "5"
      ],
      "quality": "Minor",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          null,
          3,
          1,
          0,
          1,
          3
        ],
        "A": [
          null,
          3,
          5,
          5,
          4,
          3
        ],
        "G": [
          8,
          6,
          5,
          5,
          8,
          8
        ],
        "E": [
          8,
          10,
          10,
          8,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          13,
          11
        ]
      },
      "matchingScales": [
        "Dorian",
        "Phrygian",
        "Aeolian",
        "Minor",
        "Harmonic minor",
        "Romanian",
        "Melodic minor",
        "Javanese",
        "Hindu",
        "Blues minor",
        "Blues major"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "aug": {
      "name": "Augmented",
      "formula": [
        4,
        4,
        4
      ],
      "intervals": [
        "1",
        "3",
        "#5"
      ],
      "quality": "Augmented",
      "degree": "Augmented",

      "cagedShapes": {
        "C": [
          null,
          3,
          2,
          1,
          1,
          0
        ],
        "A": [
          null,
          3,
          6,
          5,
          5,
          4
        ],
        "G": [
          8,
          7,
          6,
          5,
          9,
          8
        ],
        "E": [
          8,
          11,
          10,
          9,
          9,
          8
        ],
        "D": [
          null,
          null,
          10,
          13,
          13,
          12
        ]
      },
      "matchingScales": [
        "Phrygian dominant",
        "Super locrian"
      ],
      "matchingArpeggios": [
        "Dominant 7th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus4",
        "add4",
        "Minor 7th",
        "Minor 7b5",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "dim": {
      "name": "Diminished",
      "formula": [
        3,
        3,
        3,
        3
      ],
      "intervals": [
        "1",
        "b3",
        "b5",
        "6"
      ],
      "quality": "Diminished",
      "degree": "Locrian",

      "cagedShapes": {
        "C": [
          2,
          3,
          1,
          2,
          null,
          null
        ],
        "A": [
          null,
          3,
          4,
          2,
          4,
          2
        ],
        "G": [
          8,
          6,
          7,
          8,
          7,
          8
        ],
        "E": [
          8,
          9,
          10,
          8,
          10,
          8
        ],
        "D": [
          null,
          null,
          10,
          11,
          10,
          11
        ]
      },
      "matchingScales": [
        "Locrian",
        "Locrian #6",
        "Romanian",
        "Ultra locrian",
        "Locrian #2",
        "Super locrian",
        "Blues minor"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "sus2": {
      "name": "sus2",
      "intervals": [
        "1",
        "2",
        "5"
      ],
      "formula": [
        2,
        5
      ],
      "quality": "Suspended",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          0,
          3,
          0,
          0,
          1,
          3
        ],
        "A": [
          null,
          3,
          5,
          5,
          3,
          3
        ],
        "G": [
          8,
          7,
          5,
          5,
          8,
          10
        ],
        "E": [
          8,
          10,
          10,
          10,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          10,
          10
        ]
      },
      "matchingScales": [
        "Ionian",
        "Dorian",
        "Lydian",
        "Mixolydian",
        "Aeolian",
        "Minor",
        "Harmonic minor",
        "Ionian augmented",
        "Romanian",
        "Melodic minor",
        "Lydian dominant",
        "Hindu",
        "Blues major"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "sus4": {
      "name": "sus4",
      "intervals": [
        "1",
        "4",
        "5"
      ],
      "formula": [
        5,
        2
      ],
      "quality": "Suspended",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          0,
          3,
          3,
          0,
          1,
          1
        ],
        "A": [
          null,
          3,
          5,
          5,
          6,
          3
        ],
        "G": [
          8,
          8,
          5,
          5,
          6,
          8
        ],
        "E": [
          8,
          10,
          10,
          10,
          11,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          13,
          13
        ]
      },
      "matchingScales": [
        "Ionian",
        "Dorian",
        "Phrygian",
        "Mixolydian",
        "Aeolian",
        "Minor",
        "Harmonic minor",
        "Phrygian dominant",
        "Melodic minor",
        "Javanese",
        "Hindu",
        "Blues minor"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "add2": {
      "name": "add2",
      "intervals": [
        "1",
        "2",
        "3",
        "5"
      ],
      "formula": [
        2,
        2,
        3,
        3
      ],
      "quality": "Added Tone",
      "degree": "Major",

      "cagedShapes": {
        "C": [null, 3, 2, 0, 3, 0],
        "A": [3, 3, 2, 0, 3, 0],
        "G": [3, 5, 5, 4, 3, 3],
        "E": [8, 10, 10, 9, 8, 8],
        "D": [null, null, 10, 9, 8, 10]
      },

      "matchingScales": [
        "Ionian",
        "Lydian",
        "Mixolydian",
        "Ionian augmented",
        "Lydian dominant",
        "Blues major"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Minor",
        "Diminished",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Minor 6th",
        "Minor 7th",
        "Major 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th",
        "Minor 7b5"
      ]
    },
    "add4": {
      "name": "add4",
      "intervals": [
        "1",
        "3",
        "4",
        "5"
      ],
      "formula": [
        4,
        1,
        2,
        2
      ],
      "quality": "Added Tone",
      "degree": "Major",

      "cagedShapes": {
        "C": [null, 3, 2, 0, 1, 3],
        "A": [3, 3, 2, 0, 1, 3],
        "G": [3, 5, 5, 5, 3, 3],
        "E": [8, 10, 10, 10, 8, 8],
        "D": [null, null, 10, 9, 11, 8]
      },
      "matchingScales": [
        "Ionian",
        "Mixolydian",
        "Phrygian dominant"
      ],
      "matchingArpeggios": [
        "6th",
        "Dominant 7th",
        "9th",
        "11th",
        "13th",
        "Major",
        "Augmented",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Major 7th",
        "Dominant 7#5"
      ]
    },
    "min6": {
      "name": "Minor 6th",
      "intervals": [
        "1",
        "b3",
        "5",
        "6"
      ],
      "formula": [
        3,
        4,
        2,
        3
      ],
      "quality": "Minor",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          null,
          3,
          5,
          2,
          4,
          3
        ],
        "A": [
          null,
          3,
          5,
          2,
          4,
          3
        ],
        "G": [
          8,
          6,
          5,
          7,
          8,
          8
        ],
        "E": [
          8,
          10,
          10,
          8,
          10,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          10,
          12
        ]
      },
      "matchingScales": [
        "Dorian",
        "Romanian",
        "Melodic minor",
        "Javanese",
        "Hindu"
      ],
      "matchingArpeggios": [
        "Minor",
        "Diminished",
        "sus2",
        "sus4",
        "Minor 6th",
        "Minor 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th"
      ]
    },
    "min7": {
      "name": "Minor 7th",
      "formula": [
        3,
        4,
        3
      ],
      "intervals": [
        "1",
        "b3",
        "5",
        "b7"
      ],
      "quality": "Minor 7",
      "degree": "Dorian",

      "cagedShapes": {
        "C": [
          null,
          3,
          5,
          3,
          4,
          3
        ],
        "A": [
          null,
          3,
          5,
          3,
          4,
          3
        ],
        "G": [
          8,
          6,
          5,
          5,
          8,
          8
        ],
        "E": [
          8,
          10,
          8,
          8,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          12,
          11,
          11
        ]
      },
      "matchingScales": [
        "Dorian",
        "Phrygian",
        "Aeolian",
        "Minor",
        "Javanese"
      ],
      "matchingArpeggios": [
        "Minor",
        "sus2",
        "sus4",
        "Minor 6th",
        "Minor 7th"
      ]
    },
    "M7": {
      "name": "Major 7th",
      "formula": [
        4,
        3,
        4
      ],
      "intervals": [
        "1",
        "3",
        "5",
        "7"
      ],
      "quality": "Major 7",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          0,
          3,
          2,
          0,
          0,
          0
        ],
        "A": [
          null,
          3,
          5,
          4,
          5,
          3
        ],
        "G": [
          8,
          7,
          5,
          4,
          8,
          7
        ],
        "E": [
          8,
          10,
          9,
          9,
          8,
          7
        ],
        "D": [
          null,
          null,
          10,
          12,
          12,
          12
        ]
      },
      "matchingScales": [
        "Ionian",
        "Lydian",
        "Ionian augmented",
        "Lydian #2",
        "Lydian dominant"
      ],
      "matchingArpeggios": [
        "6th",
        "Major",
        "sus2",
        "sus4",
        "add2",
        "add4",
        "Major 7th"
      ]
    },
    "min7b5": {
      "name": "Minor 7b5",
      "intervals": [
        "1",
        "b3",
        "b5",
        "b7"
      ],
      "formula": [
        3,
        3,
        4,
        3
      ],
      "quality": "Diminished",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          null,
          3,
          1,
          3,
          1,
          2
        ],
        "A": [
          null,
          3,
          4,
          3,
          4,
          6
        ],
        "G": [
          8,
          6,
          8,
          8,
          7,
          6
        ],
        "E": [
          8,
          9,
          10,
          8,
          11,
          11
        ],
        "D": [
          null,
          null,
          10,
          11,
          11,
          11
        ]
      },
      "matchingScales": [
        "Locrian",
        "Locrian #6",
        "Locrian #2",
        "Super locrian"
      ],
      "matchingArpeggios": [
        "Augmented",
        "Diminished",
        "Minor 7b5",
        "Diminished 7th",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "dim7": {
      "name": "Diminished 7th",
      "intervals": [
        "1",
        "b3",
        "b5",
        "bb7"
      ],
      "formula": [
        3,
        3,
        3,
        3
      ],
      "quality": "Diminished",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          2,
          0,
          1,
          0,
          1,
          0
        ],
        "A": [
          null,
          3,
          4,
          2,
          4,
          2
        ],
        "G": [
          8,
          null,
          7,
          8,
          7,
          8
        ],
        "E": [
          8,
          9,
          10,
          8,
          10,
          null
        ],
        "D": [
          null,
          null,
          10,
          11,
          10,
          11
        ]
      },
      "matchingScales": [
        "Locrian #6",
        "Romanian",
        "Ultra locrian"
      ],
      "matchingArpeggios": [
        "Minor",
        "Diminished",
        "sus2",
        "sus4",
        "Minor 6th",
        "Minor 7th",
        "Minor 7b5",
        "Diminished 7th",
        "Minor Major 7th"
      ]
    },
    "minMaj7": {
      "name": "Minor Major 7th",
      "intervals": [
        "1",
        "b3",
        "5",
        "7"
      ],
      "formula": [
        3,
        4,
        4,
        4
      ],
      "quality": "Minor",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          3,
          3,
          1,
          0,
          0,
          null
        ],
        "A": [
          null,
          3,
          5,
          4,
          4,
          null
        ],
        "G": [
          7,
          6,
          5,
          5,
          null,
          null
        ],
        "E": [
          8,
          10,
          9,
          8,
          null,
          null
        ],
        "D": [
          null,
          null,
          10,
          12,
          12,
          11
        ]
      },
      "matchingScales": [
        "Harmonic minor",
        "Romanian",
        "Melodic minor",
        "Hindu"
      ],
      "matchingArpeggios": [
        "Minor",
        "Diminished",
        "sus2",
        "sus4",
        "Minor 6th",
        "Diminished 7th",
        "Minor Major 7th"
      ]
    },
    "7#5": {
      "name": "Minor 7#5",
      "intervals": [
        "1",
        "b3",
        "#5",
        "b7"
      ],
      "formula": [
        3,
        5,
        2,
        2
      ],
      "quality": "Minor",
      "degree": "Minor",

      "cagedShapes": {
        "C": [
          null,
          3,
          1,
          3,
          4,
          4
        ],
        "A": [
          null,
          3,
          6,
          3,
          4,
          4
        ],
        "G": [
          8,
          6,
          6,
          8,
          null,
          6
        ],
        "E": [
          8,
          11,
          8,
          8,
          9,
          8
        ],
        "D": [
          null,
          null,
          10,
          13,
          11,
          11
        ]
      },
      "matchingScales": [
        "Phrygian dominant",
        "Super locrian"
      ],
      "matchingArpeggios": [
        "Dominant 7th",
        "Major",
        "Minor",
        "Augmented",
        "Diminished",
        "sus4",
        "add4",
        "Minor 7th",
        "Minor 7b5",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    },
    "7b5": {
      "name": "Minor 7b5",
      "intervals": [
        "1",
        "3",
        "b5",
        "b7"
      ],
      "formula": [
        4,
        2,
        5,
        2
      ],
      "quality": "Dominant",
      "degree": "Major",

      "cagedShapes": {
        "C": [
          null,
          3,
          2,
          3,
          1,
          2
        ],
        "A": [
          null,
          3,
          4,
          3,
          5,
          3
        ],
        "G": [
          8,
          7,
          4,
          5,
          8,
          8
        ],
        "E": [
          8,
          9,
          8,
          9,
          8,
          8
        ],
        "D": [
          null,
          null,
          10,
          11,
          11,
          12
        ]
      },
      "matchingScales": [
        "Super locrian"
      ],
      "matchingArpeggios": [
        "Augmented",
        "Diminished",
        "Minor 7b5",
        "Dominant 7#5",
        "Minor 7b5"
      ]
    }
  }
}

extraChordConfig.applyExtraChords(guitar);

export default guitar;
