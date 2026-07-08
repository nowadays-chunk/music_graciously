import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import guitar from '../../config/guitar';

const VisualizerContainer = styled(Box, { shouldForwardProp: p => p !== 'isShapeView' })(
  ({ isShapeView }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: isShapeView ? '0px' : '24px',
    background: isShapeView ? 'transparent' : 'rgba(255, 253, 245, 0.85)',
    border: isShapeView ? 'none' : '4px solid var(--brutal-ink)',
    boxShadow: isShapeView ? 'none' : 'var(--brutal-shadow)',
    borderRadius: isShapeView ? 0 : 4,
    overflowX: 'auto',
    width: '100%',
  })
);

const SvgContainer = styled('svg')({
  border: '3px solid var(--brutal-ink)',
  background: '#faf3e0',
  borderRadius: '4px',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  userSelect: 'none',
});

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const UKULELE_TUNING = [67, 60, 64, 69];
const UKULELE_STRING_NAMES = ['G', 'C', 'E', 'A'];
const MIN_SHAPE_FRET_SPACES = 4;
const INTERVAL_IMPORTANCE = [0, 3, 4, 7, 6, 8, 10, 11, 9, 2, 5, 1];

const expandFretRange = (minFret, maxFret, fretLimit) => {
  let start = Math.max(0, minFret);
  let end = Math.min(fretLimit, maxFret);
  if (end - start >= MIN_SHAPE_FRET_SPACES) return { minFret: start, maxFret: end };
  const missing = MIN_SHAPE_FRET_SPACES - (end - start);
  start = Math.max(0, start - Math.floor(missing / 2));
  end = Math.min(fretLimit, end + Math.ceil(missing / 2));
  if (end - start < MIN_SHAPE_FRET_SPACES) {
    if (start === 0) end = Math.min(fretLimit, start + MIN_SHAPE_FRET_SPACES);
    else start = Math.max(0, end - MIN_SHAPE_FRET_SPACES);
  }
  return { minFret: start, maxFret: end };
};

const intervalRank = (interval) => {
  const rank = INTERVAL_IMPORTANCE.indexOf(interval);
  return rank === -1 ? 99 : rank;
};

const getShapeWindow = ({ shape, shapeType, subType, keyIndex, fretLimit }) => {
  const shapeIndex = ['C', 'A', 'G', 'E', 'D'].indexOf(shape);
  let rawRange = { minFret: 0, maxFret: fretLimit };
  if (shapeIndex !== -1) {
    const shapeIntervals = shapeType === 'scale'
      ? guitar.scales[subType]?.indexes?.[shapeIndex]
      : guitar.shapes.indexes[subType]?.[shapeIndex] || guitar.shapes.indexes.M?.[shapeIndex];
    if (shapeIntervals) rawRange = { minFret: shapeIntervals.start + keyIndex, maxFret: shapeIntervals.end + keyIndex };
  }
  return expandFretRange(rawRange.minFret, rawRange.maxFret, fretLimit);
};

const buildPlayableUkuleleChord = ({ activeNotes, rootNote, tuning, stringIndexes, minFret, maxFret }) => {
  if (rootNote === null || !activeNotes.length) return [];

  const candidatesByString = stringIndexes.map((stringIndex) => {
    const candidates = [];
    for (let fret = minFret; fret <= maxFret; fret += 1) {
      const noteIndex = (tuning[stringIndex] + fret) % 12;
      if (!activeNotes.includes(noteIndex)) continue;
      const interval = (noteIndex - rootNote + 12) % 12;
      candidates.push({ fret, interval, noteIndex });
    }
    return candidates.sort((a, b) => {
      const rankDiff = intervalRank(a.interval) - intervalRank(b.interval);
      if (rankDiff !== 0) return rankDiff;
      return a.fret - b.fret;
    });
  });

  const pools = candidatesByString.map((candidates) => [null, ...candidates.slice(0, 6)]);
  let best = null;

  const scoreVoicing = (voicing) => {
    const used = voicing.filter(Boolean);
    if (used.length === 0) return Infinity;

    const intervals = new Set(used.map(note => note.interval));
    const fretted = used.map(note => note.fret).filter(fret => fret > 0);
    const hasRoot = intervals.has(0);
    const fingerCount = fretted.length;
    const minUsedFret = fretted.length ? Math.min(...fretted) : 0;
    const maxUsedFret = fretted.length ? Math.max(...fretted) : 0;
    const span = fretted.length ? maxUsedFret - minUsedFret : 0;
    const averageFret = used.reduce((sum, note) => sum + note.fret, 0) / used.length;

    let score = 0;
    if (!hasRoot) score += 1000;
    if (used.length < 3) score += 500;
    if (fingerCount > 4) score += 500;
    if (span > 4) score += 250 + span * 20;
    score += (4 - Math.min(4, used.length)) * 60;
    score += (4 - Math.min(4, intervals.size)) * 45;
    score += Math.abs(3 - Math.min(3, fingerCount)) * 25;
    score += span * 10;
    score += averageFret * 2;

    for (const interval of intervals) score -= Math.max(0, 20 - intervalRank(interval) * 3);
    return score;
  };

  for (const a of pools[0]) {
    for (const b of pools[1]) {
      for (const c of pools[2]) {
        for (const d of pools[3]) {
          const voicing = [a, b, c, d];
          const score = scoreVoicing(voicing);
          if (!best || score < best.score) best = { score, voicing };
        }
      }
    }
  }

  return best ? best.voicing.map(note => note?.fret ?? null) : [];
};

const UkuleleVisualizer = ({
  activeNotes = [],
  rootNote = null,
  modeRootNote = null,
  onNoteClick,
  tuning = UKULELE_TUNING,
  stringNames = UKULELE_STRING_NAMES,
  isShapeView = false,
  shapeName = '',
  shapeType = '',
  subType = '',
  keyIndex = 0,
  minFret = 0,
  maxFret = 24,
  displayMode = 'notes',
  showCagedShapes = false
}) => {
  const numFrets = 13;
  const numStrings = 4;
  const fretLimit = numFrets - 1;
  const displayedRange = isShapeView ? expandFretRange(minFret, maxFret, fretLimit) : { minFret, maxFret };
  const displayMinFret = displayedRange.minFret;
  const displayMaxFret = displayedRange.maxFret;
  const stringIndexes = Array.from({ length: numStrings }, (_, i) => i);
  const chordShapeFrets = isShapeView && shapeType === 'chord'
    ? buildPlayableUkuleleChord({ activeNotes, rootNote, tuning, stringIndexes, minFret: displayMinFret, maxFret: displayMaxFret })
    : [];

  const getNoteInfo = (stringIndex, fret) => {
    const openMidi = tuning[stringIndex];
    const midi = openMidi + fret;
    const noteIndex = midi % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midi / 12) - 1;
    const isRoot = rootNote !== null && noteIndex === rootNote;
    const isModeRoot = modeRootNote !== null && noteIndex === modeRootNote;
    let isActive = activeNotes.includes(noteIndex);
    if (isShapeView) {
      if (shapeType === 'chord') isActive = isActive && chordShapeFrets[stringIndex] === fret;
      else isActive = isActive && fret >= displayMinFret && fret <= displayMaxFret;
    }
    return { noteName, octave, noteIndex, isRoot, isModeRoot, isActive, label: `${noteName}${octave}` };
  };

  const startFretLine = Math.max(0, displayMinFret > 0 ? displayMinFret - 1 : 0);
  const endFretLine = Math.min(fretLimit, displayMaxFret);
  const numFretSpaces = Math.max(1, endFretLine - startFretLine);
  const hasOpenString = isShapeView && startFretLine === 0 && stringIndexes.some(strIdx => getNoteInfo(strIdx, 0).isActive);
  const width = isShapeView ? (hasOpenString ? 300 : 270) : 750;
  const height = isShapeView ? 140 : 180;
  const paddingLeft = isShapeView ? (hasOpenString ? 60 : 30) : 60;
  const paddingRight = isShapeView ? 15 : 30;
  const neckHeight = isShapeView ? 90 : 120;
  const stringSpacing = neckHeight / (numStrings + 1);

  const getFretX = (fretIndex) => {
    const usableWidth = width - paddingLeft - paddingRight;
    if (fretIndex < startFretLine) return paddingLeft;
    if (fretIndex > endFretLine) return width - paddingRight;
    return paddingLeft + ((fretIndex - startFretLine) * (usableWidth / numFretSpaces));
  };

  const getStringY = (stringIndex) => (height - neckHeight) / 2 + (stringIndex + 1) * stringSpacing;

  const handleNoteClick = (stringIndex, fret) => {
    const info = getNoteInfo(stringIndex, fret);
    if (onNoteClick) onNoteClick(info.label);
  };

  const getNoteDisplayText = (info, fret) => {
    if (displayMode === 'intervals') {
      const semitones = (info.noteIndex - rootNote + 12) % 12;
      const intervalMap = { 0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7' };
      return intervalMap[semitones] || '';
    }
    if (displayMode === 'fingering') {
      if (fret <= 0) return '';
      const start = displayMinFret > 0 ? displayMinFret : Math.floor((fret - 1) / 4) * 4 + 1;
      return String(Math.min(4, Math.max(1, fret - start + 1)));
    }
    return info.noteName;
  };

  const getShapeFretRange = (shape) => getShapeWindow({ shape, shapeType, subType, keyIndex, fretLimit });
  const fretNumbers = Array.from({ length: numFrets }, (_, i) => i);

  return (
    <VisualizerContainer isShapeView={isShapeView}>
      {!isShapeView && <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>Ukulele Fretboard Visualizer ({stringNames.join(' ')} - 12 Frets)</Typography>}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', py: isShapeView ? 0 : 2 }}>
        <SvgContainer width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {startFretLine === 0 && <line x1={paddingLeft} y1={(height - neckHeight) / 2} x2={paddingLeft} y2={(height + neckHeight) / 2} stroke="var(--brutal-ink)" strokeWidth="6" />}
          <rect x={paddingLeft} y={(height - neckHeight) / 2} width={width - paddingLeft - paddingRight} height={neckHeight} fill="none" stroke="var(--brutal-ink)" strokeWidth="3" />
          {!isShapeView && [5, 7, 10].map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            const fretX = getFretX(fret);
            const prevFretX = getFretX(fret - 1);
            const dotX = prevFretX + (fretX - prevFretX) / 2;
            return <circle key={`dot-${fret}`} cx={dotX} cy={height / 2} r="6" fill="rgba(0, 0, 0, 0.2)" stroke="var(--brutal-ink)" strokeWidth="1.5" />;
          })}
          {fretNumbers.slice(1).map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            return <line key={`fret-${fret}`} x1={getFretX(fret)} y1={(height - neckHeight) / 2} x2={getFretX(fret)} y2={(height + neckHeight) / 2} stroke="var(--brutal-ink)" strokeWidth="2" />;
          })}
          {fretNumbers.map((fret) => {
            const isVisible = fret === 0 ? startFretLine === 0 : (fret > startFretLine && fret <= endFretLine);
            if (!isVisible) return null;
            const fretX = fret === 0 ? paddingLeft / 2 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
            return <text key={`num-${fret}`} x={fretX} y={(height - neckHeight) / 2 - 8} textAnchor="middle" fontSize={isShapeView ? "11" : "9"} fontWeight="900" fill="var(--brutal-ink)">{fret === 0 ? 'Open' : fret}</text>;
          })}
          {stringIndexes.map((strIdx) => <line key={`string-${strIdx}`} x1={startFretLine === 0 ? paddingLeft - 20 : paddingLeft} y1={getStringY(strIdx)} x2={width - paddingRight} y2={getStringY(strIdx)} stroke="var(--brutal-ink)" strokeWidth={1 + strIdx * 0.4} />)}
          {startFretLine === 0 && stringIndexes.map((strIdx) => {
            const info = getNoteInfo(strIdx, 0);
            return <g key={`tuner-${strIdx}`}>{info.isActive && <circle cx={paddingLeft - 35} cy={getStringY(strIdx)} r={isShapeView ? "9" : "11"} fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'} stroke="var(--brutal-ink)" strokeWidth="2" />}<text x={paddingLeft - 35} y={getStringY(strIdx) + 4} textAnchor="middle" fontSize={isShapeView ? "10" : "12"} fontWeight="900" fill="var(--brutal-ink)" style={{ cursor: 'pointer' }} onClick={() => handleNoteClick(strIdx, 0)}>{stringNames[strIdx]}</text></g>;
          })}
          {stringIndexes.map((strIdx) => fretNumbers.slice(1).map((fret) => {
            const isVisible = fret > startFretLine && fret <= endFretLine;
            if (!isVisible) return null;
            const info = getNoteInfo(strIdx, fret);
            const fretX = getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
            const stringY = getStringY(strIdx);
            return <g key={`note-${strIdx}-${fret}`}><circle cx={fretX} cy={stringY} r={isShapeView ? "11" : "14"} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => handleNoteClick(strIdx, fret)} />{info.isActive && <circle cx={fretX} cy={stringY} r={isShapeView ? "8" : "10"} fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'} stroke="var(--brutal-ink)" strokeWidth="2" style={{ cursor: 'pointer', pointerEvents: 'none' }} />}{info.isActive && <text x={fretX} y={stringY + (isShapeView ? 2.5 : 3)} textAnchor="middle" fontSize={isShapeView ? "7" : "9"} fontWeight="900" fill="var(--brutal-ink)" style={{ pointerEvents: 'none' }}>{getNoteDisplayText(info, fret)}</text>}</g>;
          }))}
        </SvgContainer>
      </Box>
      {!isShapeView && <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: showCagedShapes ? 4 : 0 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-orange)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Root Note</Typography></Box>{modeRootNote !== null && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Mode Root</Typography></Box>}<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-blue)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Scale/Chord Note</Typography></Box></Box>}
      {!isShapeView && showCagedShapes && <Box sx={{ width: '100%', borderTop: '3px solid var(--brutal-ink)', pt: 4, mt: 2 }}><Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)', mb: 3, textAlign: 'center' }}>The 5 Essential CAGED Shapes</Typography><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', flexWrap: 'wrap' }}>{['C', 'A', 'G', 'E', 'D'].map((shape) => { const range = getShapeFretRange(shape); return <Box key={shape} sx={{ flex: '1 1 0px', minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, color: 'var(--brutal-ink)' }}>Shape {shape}</Typography><Typography variant="caption" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>Frets {range.minFret} - {range.maxFret}</Typography><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}><UkuleleVisualizer activeNotes={activeNotes} rootNote={rootNote} modeRootNote={modeRootNote} onNoteClick={onNoteClick} tuning={tuning} stringNames={stringNames} isShapeView={true} shapeName={shape} shapeType={shapeType} subType={subType} keyIndex={keyIndex} minFret={range.minFret} maxFret={range.maxFret} displayMode={displayMode} /></Box></Box>; })}</Box></Box>}
    </VisualizerContainer>
  );
};

export default UkuleleVisualizer;
