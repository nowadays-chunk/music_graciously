import guitar from "@/config/guitar";

/* ------------------------------------------------------------
   CONSTANTS
------------------------------------------------------------ */
export const FRET_COUNT = 25;

export const COLORS = [
    "#ff90e8", "#ffc900", "#23a094", "#90a8ed", "#ff7051",
    "#fffdf5", "#111111", "#f7f2e8", "#38b9ad", "#ffa8ef",
    "#ffd84d", "#b2c2ff", "#ff9b82", "#67d4c9", "#ffe78a"
];

/* ------------------------------------------------------------
   UTILITY HELPERS
------------------------------------------------------------ */
export const countOccurrences = (arr) =>
    arr.reduce((acc, v) => {
        if (!v) return acc;
        acc[v] = (acc[v] || 0) + 1;
        return acc;
    }, {});

export const toPie = (map) =>
    Object.entries(map).map(([name, value]) => ({ name, value }));

export const safe = (x) => (x === undefined ? null : x);

/* ------------------------------------------------------------
   FRETBOARD DATA EXTRACTORS
------------------------------------------------------------ */
export const extractNotes = (board) => {
    if (!Array.isArray(board)) return [];
    const out = [];
    board.forEach((string) =>
        string?.forEach((cell) => {
            if (cell?.show && cell.current) out.push(cell.current);
        })
    );
    return out;
};

export const extractIntervals = (board) => {
    if (!Array.isArray(board)) return [];
    const out = [];
    board.forEach((string) =>
        string?.forEach((cell) => {
            if (cell?.show && cell.interval) out.push(cell.interval);
        })
    );
    return out;
};

export const extractPositions = (board) => {
    if (!Array.isArray(board)) return [];
    const positions = [];
    board.forEach((string, sIndex) =>
        string?.forEach((cell, fret) => {
            if (cell?.show) {
                positions.push({ string: sIndex + 1, fret });
            }
        })
    );
    return positions;
};

/* ------------------------------------------------------------
   BUILDERS (Aggregators)
------------------------------------------------------------ */
export const buildFretHeatmap = (boards) => {
    const frets = Array.from({ length: FRET_COUNT }, (_, f) => ({
        fret: f,
        value: 0,
    }));
    boards.forEach((fb) => {
        if (!Array.isArray(fb)) return;
        fb.forEach((string) =>
            string?.forEach((cell, fretIndex) => {
                if (cell?.show) {
                    frets[fretIndex].value++;
                }
            })
        );
    });
    return frets;
};

export const buildStringUsage = (boards) => {
    const map = {};
    boards.forEach((fb) => {
        if (!Array.isArray(fb)) return;
        fb.forEach((string, sindex) =>
            string?.forEach((cell) => {
                if (cell?.show) {
                    const key = `String ${sindex + 1}`;
                    map[key] = (map[key] || 0) + 1;
                }
            })
        );
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
};

export const buildNeckZones = (boards) => {
    const zones = { open: 0, low: 0, mid: 0, high: 0 };
    boards.forEach((fb) => {
        if (!Array.isArray(fb)) return;
        fb.forEach((string) =>
            string?.forEach((cell, fret) => {
                if (cell?.show) {
                    if (fret <= 3) zones.open++;
                    else if (fret <= 7) zones.low++;
                    else if (fret <= 12) zones.mid++;
                    else zones.high++;
                }
            })
        );
    });
    return toPie(zones);
};

export const buildKeyUsage = (boards) => {
    const keyCounts = {};
    boards.forEach((b) => {
        if (typeof b.keyIndex === "number") {
            const keyName = guitar.notes.sharps[b.keyIndex];
            keyCounts[keyName] = (keyCounts[keyName] || 0) + 1;
        }
    });
    return toPie(keyCounts);
};

export const buildShapeUsage = (boards) => {
    const map = {};
    boards.forEach((b) => {
        if (b.shape) {
            map[b.shape] = (map[b.shape] || 0) + 1;
        } else if (b.generalSettings) {
            const choice = b.generalSettings.choice;
            const shape = b?.[choice + "Settings"]?.shape;
            if (shape) map[shape] = (map[shape] || 0) + 1;
        }
    });
    return toPie(map);
};

export const buildModeUsage = (boards) => {
    const map = {};
    boards.forEach((b) => {
        if (typeof b.mode === "number") {
            const scaleName = b.scale;
            const modeName = guitar.scales[scaleName]?.modes?.[b.mode];
            if (modeName) map[modeName] = (map[modeName] || 0) + 1;
        }
    });
    return toPie(map);
};

export const buildIntervalUsage = (boards) => {
    const intervals = [];
    boards.forEach((b) => {
        const fb = b.fretboard || (b.generalSettings ? b[b.generalSettings.choice + "Settings"]?.fretboard : null);
        if (!fb) return;
        intervals.push(...extractIntervals(fb));
    });
    return toPie(countOccurrences(intervals));
};

export const buildNoteUsage = (boards) => {
    const notes = [];
    boards.forEach((b) => {
        const fb = b.fretboard ||
            (b.generalSettings
                ? b[b.generalSettings.choice + "Settings"]?.fretboard
                : null);
        if (!fb) return;
        notes.push(...extractNotes(fb));
    });
    return toPie(countOccurrences(notes));
};

export const buildFretHistogram = (boards) => {
    const map = {};
    boards.forEach((b) => {
        const fb = b.fretboard ||
            (b.generalSettings
                ? b[b.generalSettings.choice + "Settings"]?.fretboard
                : null);
        if (!fb) return;

        fb.forEach((string) =>
            string?.forEach((cell, fret) => {
                if (cell?.show) {
                    map[fret] = (map[fret] || 0) + 1;
                }
            })
        );
    });

    return Object.entries(map).map(([fret, value]) => ({
        name: `F${fret}`,
        value,
    }));
};

export const buildFretRanges = (boards) => {
    const ranges = boards.map((b) => {
        const fb = b.fretboard ||
            (b.generalSettings
                ? b[b.generalSettings.choice + "Settings"]?.fretboard
                : null);

        if (!fb) return null;

        const frets = [];
        fb.forEach((string) =>
            string?.forEach((cell, fret) => {
                if (cell?.show) frets.push(fret);
            })
        );

        if (frets.length === 0) return null;

        const min = Math.min(...frets);
        const max = Math.max(...frets);
        const avg = frets.reduce((a, b) => a + b, 0) / frets.length;

        return { min, max, avg };
    }).filter(Boolean);

    if (ranges.length === 0) {
        return [
            { name: "Min Fret Avg", value: 0 },
            { name: "Max Fret Avg", value: 0 },
            { name: "Avg Fret Avg", value: 0 },
        ];
    }

    const minAvg = ranges.reduce((a, r) => a + r.min, 0) / ranges.length;
    const maxAvg = ranges.reduce((a, r) => a + r.max, 0) / ranges.length;
    const avgAvg = ranges.reduce((a, r) => a + r.avg, 0) / ranges.length;

    return [
        { name: "Min Fret Avg", value: Number(minAvg.toFixed(2)) },
        { name: "Max Fret Avg", value: Number(maxAvg.toFixed(2)) },
        { name: "Avg Fret Avg", value: Number(avgAvg.toFixed(2)) },
    ];
};

export const buildScatterPositions = (boards) => {
    const pts = [];
    boards.forEach((b) => {
        const fb = b.fretboard ||
            (b.generalSettings
                ? b[b.generalSettings.choice + "Settings"]?.fretboard
                : null);
        if (!fb) return;
        pts.push(...extractPositions(fb));
    });
    return pts.map((p, i) => ({
        x: p.fret,
        y: p.string,
        z: 1,
        id: i,
    }));
};

export const buildTreemapNotes = (boards) => {
    const notes = buildNoteUsage(boards);
    return notes.map((n, i) => ({
        name: n.name,
        size: n.value,
    }));
};

export const buildRadarStringUsage = (boards) => {
    const items = buildStringUsage(boards);
    if (items.length === 0) return [];
    const maxVal = Math.max(...items.map((i) => i.value), 1);
    return items.map((i) => ({
        subject: i.name,
        value: (i.value / maxVal) * 100,
        fullMark: 100,
    }));
};

export const buildChordFlow = (boards) => {
    const transitions = {};

    for (let i = 0; i < boards.length - 1; i++) {
        const c1 = boards[i].chord || boards[i].arpeggio || boards[i].scale || "X";
        const c2 = boards[i + 1].chord || boards[i + 1].arpeggio || boards[i + 1].scale || "X";

        const key = `${c1}->${c2}`;
        transitions[key] = (transitions[key] || 0) + 1;
    }

    return Object.entries(transitions).map(([name, value]) => ({
        name,
        value,
    }));
};


/* ---------------------------------------------
   HELPER: COMBINE PRECOMPUTED & COMPUTED
--------------------------------------------- */
export const combineStats = (computed, precomputed) => {
    if (!precomputed) return computed;

    // Helpers for transforms
    const toRadar = (arr) => {
        if (!Array.isArray(arr)) return [];
        const max = Math.max(...arr.map((x) => x.value), 1);
        return arr.map((x) => ({
            subject: x.name,
            value: (x.value / max) * 100,
            fullMark: 100,
        }));
    };

    const toHistogram = (arr) => {
        if (!Array.isArray(arr)) return [];
        return arr.map((x) => ({ name: `F${x.fret}`, value: x.value }));
    };

    return {
        ...computed,
        intervalUsage: precomputed.intervals || computed.intervalUsage,
        keys: precomputed.keys || computed.keys,
        shapes: precomputed.shapes || computed.shapes,
        modes: precomputed.modes || computed.modes,
        neckZones: precomputed.neckZones || computed.neckZones,
        fretHeatmap: precomputed.fretUsage || computed.fretHeatmap,
        fretHistogram:
            precomputed.fretUsage && precomputed.fretUsage.length > 0
                ? toHistogram(precomputed.fretUsage)
                : computed.fretHistogram,
        radarStrings:
            precomputed.stringUsage && precomputed.stringUsage.length > 0
                ? toRadar(precomputed.stringUsage)
                : computed.radarStrings,

        // NEW MAPPINGS
        noteUsage: precomputed.noteUsage || computed.noteUsage,
        treemap: precomputed.treemap || computed.treemap,
        scatter: precomputed.scatter || computed.scatter,
        fretRanges: precomputed.fretRanges || computed.fretRanges,

        // Flow remains computed per session as it is sequence-dependent, 
        // but we can support precomputed theoretical flow if provided
        flow: precomputed.flow || computed.flow,
    };
};
