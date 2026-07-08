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
  background: '#3e2723',
  borderRadius: '4px',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  userSelect: 'none',
});

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const BASS_TUNING = [28, 33, 38, 43];
const BASS_STRING_NAMES = ['E', 'A', 'D', 'G'];
const MIN_SHAPE_FRET_SPACES = 4;

const INTERVAL_TO_SEMITONES = {
  '1': 0,
  'b2': 1,
  '2': 2,
  '9': 2,
  '#9': 3,
  'b3': 3,
  '3': 4,
  '4': 5,
  '11': 5,
  '#4': 6,
  '#11': 6,
  'b5': 6,
  '5': 7,
  '#5': 8,
  'b6': 8,
  '6': 9,
  '13': 9,
  'bb7': 9,
  'b7': 10,
  '7': 11,
};
const INTERVAL_IMPORTANCE = ['1', 'b3', '3', '5', 'b5', '#5', 'b7', '7', '6', '13', '2', '9', '4', '11', 'b2', '#9', '#4', '#11', 'b6'];

const expandFretRange = (minFret, maxFret, fretLimit) => {
  let start = Math.max(0, minFret);
  let end = Math.min(fretLimit, maxFret);

  if (end - start >= MIN_SHAPE_FRET_SPACES) return { minFret: start, maxFret: end };

  const missing = MIN_SHAPE_FRET_SPACES - (end - start);
  const addBefore = Math.floor(missing / 2);
  const addAfter = missing - addBefore;

  start = Math.max(0, start - addBefore);
  end = Math.min(fretLimit, end + addAfter);

  if (end - start < MIN_SHAPE_FRET_SPACES) {
    if (start === 0) end = Math.min(fretLimit, start + MIN_SHAPE_FRET_SPACES);
    else if (end === fretLimit) start = Math.max(0, end - MIN_SHAPE_FRET_SPACES);
  }

  return { minFret: start, maxFret: end };
};

const getIntervalRankMap = (intervals = []) => {
  const ordered = [...INTERVAL_IMPORTANCE, ...intervals];
  const rankMap = new Map();

  for (const interval of ordered) {
    if (!intervals.includes(interval) && interval !== '1') continue;
    const semitones = INTERVAL_TO_SEMITONES[interval];
    if (semitones === undefined || rankMap.has(semitones)) continue;
    rankMap.set(semitones, rankMap.size);
  }

  return rankMap;
};

const buildPlayableChordShapeFrets = ({ activeNotes, rootNote, intervals, tuning, stringIndexes, minFret, maxFret }) => {
  if (rootNote === null || !activeNotes.length) return [];

  const rankMap = getIntervalRankMap(intervals);
  const selected = Array.from({ length: stringIndexes.length }, () => null);
  const covered = new Set();

  const candidatesByString = stringIndexes.map((stringIndex) => {
    const candidates = [];
    for (let fret = minFret; fret <= maxFret; fret += 1) {
      const noteIndex = (tuning[stringIndex] + fret) % 12;
      if (!activeNotes.includes(noteIndex)) continue;
      const interval = (noteIndex - rootNote + 12) % 12;
      candidates.push({ fret, interval, rank: rankMap.get(interval) ?? 99 });
    }
    return candidates;
  });

  const rootStringIndex = candidatesByString.findIndex((candidates) => candidates.some(candidate => candidate.interval === 0));
  if (rootStringIndex !== -1) {
    const rootCandidate = candidatesByString[rootStringIndex]
      .filter(candidate => candidate.interval === 0)
      .sort((a, b) => a.fret - b.fret)[0];
    selected[rootStringIndex] = rootCandidate.fret;
    covered.add(0);
  }

  candidatesByString.forEach((candidates, stringIndex) => {
    if (selected[stringIndex] !== null || candidates.length === 0) return;
    const preferred = candidates
      .slice()
      .sort((a, b) => {
        const coveredPenaltyA = covered.has(a.interval) ? 20 : 0;
        const coveredPenaltyB = covered.has(b.interval) ? 20 : 0;
        const rankDiff = (a.rank + coveredPenaltyA) - (b.rank + coveredPenaltyB);
        if (rankDiff !== 0) return rankDiff;
        return a.fret - b.fret;
      })[0];
    selected[stringIndex] = preferred.fret;
    covered.add(preferred.interval);
  });

  return selected;
};

const BassVisualizer = ({
  activeNotes = [],
  rootNote = null,
  modeRootNote = null,
  onNoteClick,
  tuning = BASS_TUNING,
  stringNames = BASS_STRING_NAMES,
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
  const numFrets = 16;
  const numStrings = 4;
  const fretLimit = numFrets - 1;
  const displayedRange = isShapeView ? expandFretRange(minFret, maxFret, fretLimit) : { minFret, maxFret };
  const displayMinFret = displayedRange.minFret;
  const displayMaxFret = displayedRange.maxFret;
  const stringIndexes = Array.from({ length: numStrings }, (_, i) => i);
  const chordShapeFrets = isShapeView && shapeType === 'chord'
    ? buildPlayableChordShapeFrets({
        activeNotes,
        rootNote,
        intervals: guitar.arppegios[subType]?.intervals || [],
        tuning,
        stringIndexes,
        minFret: displayMinFret,
        maxFret: displayMaxFret,
      })
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
      if (shapeType === 'chord') {
        isActive = isActive && chordShapeFrets[stringIndex] === fret;
      } else {
        isActive = isActive && fret >= displayMinFret && fret <= displayMaxFret;
      }
    }

    return { noteName, octave, noteIndex, isRoot, isModeRoot, isActive, label: `${noteName}${octave}` };
  };

  const startFretLine = Math.max(0, displayMinFret > 0 ? displayMinFret - 1 : 0);
  const endFretLine = Math.min(fretLimit, displayMaxFret);
  const numFretSpaces = Math.max(1, endFretLine - startFretLine);
  const hasOpenString = isShapeView && startFretLine === 0 && stringIndexes.some(strIdx => getNoteInfo(strIdx, 0).isActive);
  const width = isShapeView ? (hasOpenString ? 300 : 270) : 850;
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

  const getShapeFretRange = (shape) => {
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

  const fretNumbers = Array.from({ length: numFrets }, (_, i) => i);

  return (
    <VisualizerContainer isShapeView={isShapeView}>
      {!isShapeView && (
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>
          Bass Fretboard Visualizer ({stringNames.join(' ')} - 15 Frets)
        </Typography>
      )}

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', py: isShapeView ? 0 : 2 }}>
        <SvgContainer width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {startFretLine === 0 && <line x1={paddingLeft} y1={(height - neckHeight) / 2} x2={paddingLeft} y2={(height + neckHeight) / 2} stroke="var(--brutal-ink)" strokeWidth="6" />}
          <rect x={paddingLeft} y={(height - neckHeight) / 2} width={width - paddingLeft - paddingRight} height={neckHeight} fill="none" stroke="var(--brutal-ink)" strokeWidth="3" />

          {!isShapeView && [3, 5, 7, 9, 15].map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            const fretX = getFretX(fret);
            const prevFretX = getFretX(fret - 1);
            const dotX = prevFretX + (fretX - prevFretX) / 2;
            return <circle key={`dot-${fret}`} cx={dotX} cy={height / 2} r="6" fill="rgba(255, 255, 255, 0.15)" stroke="var(--brutal-ink)" strokeWidth="1.5" />;
          })}

          {!isShapeView && [12].map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            const fretX = getFretX(fret);
            const prevFretX = getFretX(fret - 1);
            const dotX = prevFretX + (fretX - prevFretX) / 2;
            return <g key={`double-dot-${fret}`}><circle cx={dotX} cy={height / 2 - 20} r="6" fill="rgba(255, 255, 255, 0.15)" stroke="var(--brutal-ink)" strokeWidth="1.5" /><circle cx={dotX} cy={height / 2 + 20} r="6" fill="rgba(255, 255, 255, 0.15)" stroke="var(--brutal-ink)" strokeWidth="1.5" /></g>;
          })}

          {fretNumbers.slice(1).map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            return <line key={`fret-${fret}`} x1={getFretX(fret)} y1={(height - neckHeight) / 2} x2={getFretX(fret)} y2={(height + neckHeight) / 2} stroke="var(--brutal-ink)" strokeWidth="2.5" />;
          })}

          {fretNumbers.map((fret) => {
            const isVisible = fret === 0 ? startFretLine === 0 : (fret > startFretLine && fret <= endFretLine);
            if (!isVisible) return null;
            const fretX = fret === 0 ? paddingLeft / 2 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
            return <text key={`num-${fret}`} x={fretX} y={(height - neckHeight) / 2 - 8} textAnchor="middle" fontSize={isShapeView ? "11" : "9"} fontWeight="900" fill="#ffffff">{fret === 0 ? 'Open' : fret}</text>;
          })}

          {stringIndexes.map((strIdx) => <line key={`string-${strIdx}`} x1={startFretLine === 0 ? paddingLeft - 20 : paddingLeft} y1={getStringY(strIdx)} x2={width - paddingRight} y2={getStringY(strIdx)} stroke="var(--brutal-ink)" strokeWidth={1.5 + strIdx * 0.8} />)}

          {startFretLine === 0 && stringIndexes.map((strIdx) => {
            const info = getNoteInfo(strIdx, 0);
            return <g key={`tuner-${strIdx}`}>{info.isActive && <circle cx={paddingLeft - 35} cy={getStringY(strIdx)} r={isShapeView ? "9" : "11"} fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'} stroke="var(--brutal-ink)" strokeWidth="2" />}<text x={paddingLeft - 35} y={getStringY(strIdx) + 4} textAnchor="middle" fontSize={isShapeView ? "10" : "12"} fontWeight="900" fill={info.isActive ? "#3e2723" : "#ffffff"} style={{ cursor: 'pointer' }} onClick={() => handleNoteClick(strIdx, 0)}>{stringNames[strIdx]}</text></g>;
          })}

          {stringIndexes.map((strIdx) => fretNumbers.slice(1).map((fret) => {
            const isVisible = fret > startFretLine && fret <= endFretLine;
            if (!isVisible) return null;
            const info = getNoteInfo(strIdx, fret);
            const fretX = getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
            const stringY = getStringY(strIdx);
            return <g key={`note-${strIdx}-${fret}`}><circle cx={fretX} cy={stringY} r={isShapeView ? "11" : "15"} fill="transparent" style={{ cursor: 'pointer' }} onClick={() => handleNoteClick(strIdx, fret)} />{info.isActive && <circle cx={fretX} cy={stringY} r={isShapeView ? "8" : "11"} fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'} stroke="var(--brutal-ink)" strokeWidth="2" style={{ cursor: 'pointer', pointerEvents: 'none' }} />}{info.isActive && <text x={fretX} y={stringY + (isShapeView ? 2.5 : 3.5)} textAnchor="middle" fontSize={isShapeView ? "7" : "9"} fontWeight="900" fill="#3e2723" style={{ pointerEvents: 'none' }}>{getNoteDisplayText(info, fret)}</text>}</g>;
          }))}
        </SvgContainer>
      </Box>

      {!isShapeView && <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: showCagedShapes ? 4 : 0 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-orange)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Root Note</Typography></Box>{modeRootNote !== null && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Mode Root</Typography></Box>}<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-blue)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} /><Typography variant="caption" sx={{ fontWeight: 800 }}>Scale/Chord Note</Typography></Box></Box>}

      {!isShapeView && showCagedShapes && <Box sx={{ width: '100%', borderTop: '3px solid var(--brutal-ink)', pt: 4, mt: 2 }}><Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)', mb: 3, textAlign: 'center' }}>🎸 The 5 Essential CAGED Shapes</Typography><Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, width: '100%', flexWrap: 'wrap' }}>{['C', 'A', 'G', 'E', 'D'].map((shape) => { const range = getShapeFretRange(shape); return <Box key={shape} sx={{ flex: '1 1 0px', minWidth: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}><Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, color: 'var(--brutal-ink)' }}>Shape {shape}</Typography><Typography variant="caption" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>Frets {range.minFret} - {range.maxFret}</Typography><Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}><BassVisualizer activeNotes={activeNotes} rootNote={rootNote} modeRootNote={modeRootNote} onNoteClick={onNoteClick} tuning={tuning} stringNames={stringNames} isShapeView={true} shapeName={shape} shapeType={shapeType} subType={subType} keyIndex={keyIndex} minFret={range.minFret} maxFret={range.maxFret} displayMode={displayMode} /></Box></Box>; })}</Box></Box>}
    </VisualizerContainer>
  );
};

export default BassVisualizer;
