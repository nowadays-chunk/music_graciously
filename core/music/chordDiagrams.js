import guitar from '@/config/guitar';
import { getNoteIndex } from '@/core/music/musicTheory';

const CAGED_SHAPES = ['C', 'A', 'G', 'E', 'D'];
const STANDARD_TUNING = ['E', 'A', 'D', 'G', 'B', 'E'];
const SHARP_SIGN = /\u266F/g;
const FLAT_SIGN = /\u266D/g;
const HALF_DIM_SIGN = /\u00F8/g;
const DEGREE_SIGNS = /[\u00BA\u00B0]/g;
const DELTA_7 = '\u03947';
const DELTA_9 = '\u03949';
const DELTA_11 = '\u039411';
const DELTA_13 = '\u039413';

function normalizeRoot(root) {
  if (!root) return '';

  const clean = root
    .trim()
    .replace(SHARP_SIGN, '#')
    .replace(FLAT_SIGN, 'b');

  return clean.charAt(0).toUpperCase() + clean.slice(1);
}

function trimOuterParens(label) {
  let current = label.trim();

  while (current.startsWith('(') && current.endsWith(')')) {
    current = current.slice(1, -1).trim();
  }

  return current;
}

function normalizeQuality(rawQuality) {
  const quality = rawQuality
    .trim()
    .replace(/[()]/g, '')
    .replace(SHARP_SIGN, '#')
    .replace(FLAT_SIGN, 'b')
    .replace(HALF_DIM_SIGN, 'm7b5')
    .replace(DEGREE_SIGNS, 'dim')
    .replace(/-+$/g, '-');

  if (!quality || /^(maj|major)$/i.test(quality)) {
    return { quality: 'M', approximate: false };
  }

  if (/^5$/i.test(quality)) {
    return { quality: '5', approximate: false };
  }

  if (/^(-5|b5|flat5)$/i.test(quality)) {
    return { quality: '-5', approximate: false };
  }

  if (/^(m7b5|m7-5|min7b5|min7-5|m7\/5-|m7b-5|halfdim|hdim)$/i.test(quality)) {
    return { quality: 'min7b5', approximate: false };
  }

  if (/^(dim7|dimdim7|o7)$/i.test(quality)) {
    return { quality: 'dim7', approximate: false };
  }

  if (/^(mmaj9|minmaj9)$/i.test(quality)) {
    return { quality: 'mmaj9', approximate: false };
  }

  if (/^(mmaj7|minmaj7)$/i.test(quality)) {
    return { quality: 'minMaj7', approximate: false };
  }

  if (/^(maj6\/9|maj6add9|6add9|6\/9|69)$/i.test(quality)) {
    return { quality: '6add9', approximate: false };
  }

  if (/^(maj6|maj6\/9|69|6\/9)$/i.test(quality)) {
    return { quality: '6', approximate: !/^6$/i.test(quality) };
  }

  if (quality === DELTA_7 || /^(maj7|ma7)$/i.test(quality)) {
    return { quality: 'M7', approximate: false };
  }

  if (/^(maj7b5|ma7b5|maj7-5|ma7-5)$/i.test(quality)) {
    return { quality: 'maj7b5', approximate: false };
  }

  if (/^(maj7#5|ma7#5|maj7\+5|ma7\+5)$/i.test(quality)) {
    return { quality: 'maj7#5', approximate: false };
  }

  if (quality === DELTA_9 || /^maj9$/i.test(quality)) {
    return { quality: 'maj9', approximate: false };
  }

  if (quality === DELTA_11 || /^maj11$/i.test(quality)) {
    return { quality: 'maj11', approximate: false };
  }

  if (quality === DELTA_13 || /^maj13$/i.test(quality)) {
    return { quality: 'maj13', approximate: false };
  }

  if (/^maj9#11$/i.test(quality)) {
    return { quality: 'maj9#11', approximate: false };
  }

  if (/^maj13#11$/i.test(quality)) {
    return { quality: 'maj13#11', approximate: false };
  }

  if (/^(m6|min6)$/i.test(quality)) {
    return { quality: 'min6', approximate: false };
  }

  if (/^(m6add9|min6add9|m6\/9|min6\/9)$/i.test(quality)) {
    return { quality: 'm6add9', approximate: false };
  }

  if (/^(madd9|minadd9)$/i.test(quality)) {
    return { quality: 'madd9', approximate: false };
  }

  if (/^(m13|min13)$/i.test(quality)) {
    return { quality: 'm13', approximate: false };
  }

  if (/^(m11|min11)$/i.test(quality)) {
    return { quality: 'm11', approximate: false };
  }

  if (/^(m9|min9|m7\/9|min7\/9)$/i.test(quality)) {
    return { quality: 'm9', approximate: !/^(m9|min9)$/i.test(quality) };
  }

  if (/^(m7#5|min7#5)$/i.test(quality)) {
    return { quality: 'm7#5', approximate: false };
  }

  if (/^(m7|min7|-7)$/i.test(quality)) {
    return { quality: 'min7', approximate: false };
  }

  if (/^(m|min|-)$/i.test(quality)) {
    return { quality: 'min', approximate: false };
  }

  if (/^(7#5|\+7|aug7)$/i.test(quality)) {
    return { quality: '7#5', approximate: false };
  }

  if (/^(7b5|7-5|7\/5-)$/i.test(quality)) {
    return { quality: '7b5', approximate: false };
  }

  if (/^7sus4$/i.test(quality)) {
    return { quality: '7sus4', approximate: false };
  }

  if (/^7b9$/i.test(quality)) {
    return { quality: '7b9', approximate: false };
  }

  if (/^7#9$/i.test(quality)) {
    return { quality: '7#9', approximate: false };
  }

  if (/^7(?:b5,?b9|b9,?b5)$/i.test(quality)) {
    return { quality: '7(b5,b9)', approximate: false };
  }

  if (/^7(?:b5,?#9|#9,?b5)$/i.test(quality)) {
    return { quality: '7(b5,#9)', approximate: false };
  }

  if (/^7(?:#5,?b9|b9,?#5)$/i.test(quality)) {
    return { quality: '7(#5,b9)', approximate: false };
  }

  if (/^7(?:#5,?#9|#9,?#5)$/i.test(quality)) {
    return { quality: '7(#5,#9)', approximate: false };
  }

  if (/^(aug|\+)$/i.test(quality)) {
    return { quality: 'aug', approximate: false };
  }

  if (/^(dim|o)$/i.test(quality)) {
    return { quality: 'dim', approximate: false };
  }

  if (/^(add11|add4)$/i.test(quality)) {
    return { quality: 'add4', approximate: false };
  }

  if (/^sus2sus4$/i.test(quality)) {
    return { quality: 'sus2sus4', approximate: false };
  }

  if (/^(7sus4|sus4|sus|4)$/i.test(quality)) {
    return { quality: 'sus4', approximate: !/^sus4$/i.test(quality) };
  }

  if (/^(7sus2|sus2|2)$/i.test(quality)) {
    return { quality: 'sus2', approximate: !/^sus2$/i.test(quality) };
  }

  if (/^add9$/i.test(quality)) {
    return { quality: 'add9', approximate: false };
  }

  if (/^add2$/i.test(quality)) {
    return { quality: 'add2', approximate: false };
  }

  if (/^13#11$/i.test(quality)) {
    return { quality: '13#11', approximate: false };
  }

  if (/^13b9$/i.test(quality)) {
    return { quality: '13b9', approximate: false };
  }

  if (/^11b9$/i.test(quality)) {
    return { quality: '11b9', approximate: false };
  }

  if (/^9b5$/i.test(quality)) {
    return { quality: '9b5', approximate: false };
  }

  if (/^9#5$/i.test(quality)) {
    return { quality: '9#5', approximate: false };
  }

  if (/^(13|7\/13)$/i.test(quality)) {
    return { quality: '13', approximate: !/^13$/i.test(quality) };
  }

  if (/^(11|7\/11)$/i.test(quality)) {
    return { quality: '11', approximate: !/^11$/i.test(quality) };
  }

  if (/^(9|7\/9)$/i.test(quality)) {
    return { quality: '9', approximate: !/^9$/i.test(quality) };
  }

  if (/^7$/i.test(quality)) {
    return { quality: '7', approximate: false };
  }

  if (/^6$/i.test(quality)) {
    return { quality: '6', approximate: false };
  }

  return null;
}

export function parseChordLabel(rawLabel) {
  if (!rawLabel || typeof rawLabel !== 'string') return null;

  const cleaned = trimOuterParens(rawLabel)
    .replace(/\s+/g, '')
    .replace(/[|,:;]+$/g, '')
    .replace(SHARP_SIGN, '#')
    .replace(FLAT_SIGN, 'b');

  const match = cleaned.match(/^([A-G](?:#|b)?)(.*)$/);
  if (!match) return null;

  const root = normalizeRoot(match[1]);
  const baseChord = match[2].split('/')[0];
  const normalized = normalizeQuality(baseChord);
  if (!normalized) return null;

  return {
    label: cleaned,
    root,
    quality: normalized.quality,
    approximate: normalized.approximate,
  };
}

function transposeFrets(shapeFrets, keyIndex) {
  const frets = shapeFrets.map((fret) => (fret === null ? null : fret + keyIndex));

  while (frets.every((fret) => fret === null || fret >= 12)) {
    for (let i = 0; i < frets.length; i += 1) {
      if (typeof frets[i] === 'number') {
        frets[i] -= 12;
      }
    }
  }

  return frets;
}

function scoreFrets(frets) {
  const activeFrets = frets.filter((fret) => typeof fret === 'number' && fret > 0);
  const maxFret = activeFrets.length ? Math.max(...activeFrets) : 0;
  const minFret = activeFrets.length ? Math.min(...activeFrets) : 0;
  const span = maxFret - minFret;
  const openCount = frets.filter((fret) => fret === 0).length;

  return { maxFret, minFret, span, openCount };
}

function pickBestShape(root, quality, preferredShape) {
  const keyIndex = getNoteIndex(root);
  const chordData = guitar.arppegios[quality];
  if (keyIndex < 0 || !chordData?.cagedShapes) return null;

  const candidateShapes = preferredShape ? [preferredShape, ...CAGED_SHAPES] : CAGED_SHAPES;
  const uniqueShapes = [...new Set(candidateShapes)].filter((shape) => chordData.cagedShapes[shape]);

  const candidates = uniqueShapes.map((shape) => ({
    shape,
    frets: transposeFrets(chordData.cagedShapes[shape], keyIndex),
  }));

  if (preferredShape && candidates[0]) {
    return candidates[0];
  }

  candidates.sort((left, right) => {
    const a = scoreFrets(left.frets);
    const b = scoreFrets(right.frets);

    if (a.maxFret !== b.maxFret) return a.maxFret - b.maxFret;
    if (a.minFret !== b.minFret) return a.minFret - b.minFret;
    if (a.span !== b.span) return a.span - b.span;
    return b.openCount - a.openCount;
  });

  return candidates[0] || null;
}

function buildViewport(frets) {
  const activeFrets = frets.filter((fret) => typeof fret === 'number' && fret > 0);
  const minFret = activeFrets.length ? Math.min(...activeFrets) : 0;
  const maxFret = activeFrets.length ? Math.max(...activeFrets) : 0;
  const position = minFret > 4 ? minFret : 0;
  const highestVisibleFret = position > 0 ? maxFret - position + 1 : maxFret;

  return {
    position,
    numFrets: Math.max(5, highestVisibleFret || 5),
  };
}

function buildVexChordFromFrets(frets) {
  const { position, numFrets } = buildViewport(frets);
  const chord = [];

  for (let i = frets.length - 1, stringNumber = 1; i >= 0; i -= 1, stringNumber += 1) {
    const absoluteFret = frets[i];
    let fretValue = 'x';

    if (absoluteFret === 0) {
      fretValue = 0;
    } else if (typeof absoluteFret === 'number' && absoluteFret > 0) {
      fretValue = position > 0 ? absoluteFret - position + 1 : absoluteFret;
    }

    chord.push([stringNumber, fretValue]);
  }

  return {
    chord,
    position,
    numFrets,
    tuning: STANDARD_TUNING,
  };
}

function buildPowerChord(root) {
  const keyIndex = getNoteIndex(root);
  if (keyIndex < 0) return null;

  const lowE = (keyIndex - 4 + 12) % 12;
  const onA = (keyIndex - 9 + 12) % 12;
  const candidates = [
    [lowE, lowE + 2, lowE + 2, null, null, null],
    [null, onA, onA + 2, onA + 2, null, null],
  ];

  const best = candidates
    .map((frets) => ({ frets, score: scoreFrets(frets) }))
    .sort((left, right) => {
      if (left.score.maxFret !== right.score.maxFret) {
        return left.score.maxFret - right.score.maxFret;
      }
      return left.score.minFret - right.score.minFret;
    })[0];

  return best ? buildVexChordFromFrets(best.frets) : null;
}

export function resolveChordDiagram({ root, quality, shape, label }) {
  const normalizedRoot = normalizeRoot(root);

  if (quality === '5') {
    const powerChord = buildPowerChord(normalizedRoot);
    return powerChord
      ? { ...powerChord, shape: 'power', quality, root: normalizedRoot, label }
      : null;
  }

  const shapeData = pickBestShape(normalizedRoot, quality, shape);
  if (!shapeData) return null;

  return {
    ...buildVexChordFromFrets(shapeData.frets),
    root: normalizedRoot,
    quality,
    shape: shapeData.shape,
    label,
  };
}

export function resolveChordLabelDiagram(label) {
  const parsed = parseChordLabel(label);
  if (!parsed) return null;

  const diagram = resolveChordDiagram({
    root: parsed.root,
    quality: parsed.quality,
    label: parsed.label,
  });

  return diagram
    ? {
        ...diagram,
        approximate: parsed.approximate,
      }
    : null;
}
