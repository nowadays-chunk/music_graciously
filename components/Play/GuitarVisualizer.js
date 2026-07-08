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
  background: '#e5c290', // Warm wood fretboard color
  borderRadius: '4px',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  userSelect: 'none',
});

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const GUITAR_TUNING = [64, 59, 55, 50, 45, 40]; // E4, B3, G3, D3, A2, E2 (standard high to low)
const GUITAR_STRING_NAMES = ['E', 'B', 'G', 'D', 'A', 'E'];

const GuitarVisualizer = ({
  activeNotes = [],
  rootNote = null,
  modeRootNote = null,
  onNoteClick,
  tuning = GUITAR_TUNING,
  stringNames = GUITAR_STRING_NAMES,
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
  const numFrets = 25; // 0 (open) to 24 frets
  const numStrings = 6;
  
  const stringIndexes = Array.from({ length: numStrings }, (_, i) => i);

  const getNoteInfo = (stringIndex, fret) => {
    const openMidi = tuning[stringIndex];
    const midi = openMidi + fret;
    const noteIndex = midi % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midi / 12) - 1;
    const isRoot = rootNote !== null && noteIndex === rootNote;
    const isModeRoot = modeRootNote !== null && noteIndex === modeRootNote;
    
    // Filter active state for shape view
    let isActive = activeNotes.includes(noteIndex);
    if (isShapeView) {
      if (shapeType === 'chord') {
        const cagedShape = guitar.arppegios[subType]?.cagedShapes?.[shapeName];
        const realFrets = cagedShape ? cagedShape.slice().reverse().map(f => f === null ? null : f + keyIndex) : [];
        isActive = isActive && fret === realFrets[stringIndex];
      } else {
        isActive = isActive && fret >= minFret && fret <= maxFret;
      }
    }

    return { noteName, octave, noteIndex, isRoot, isModeRoot, isActive, label: `${noteName}${octave}` };
  };

  // Fret slice mapping
  const startFretLine = Math.max(0, minFret > 0 ? minFret - 1 : 0);
  const endFretLine = Math.min(numFrets - 1, maxFret);
  const numFretSpaces = Math.max(1, endFretLine - startFretLine);

  const hasOpenString = isShapeView && startFretLine === 0 && stringIndexes.some(strIdx => getNoteInfo(strIdx, 0).isActive);
  const width = isShapeView ? (hasOpenString ? 275 : 240) : 1250;
  const height = isShapeView ? 160 : 220;
  const paddingLeft = isShapeView ? (hasOpenString ? 60 : 30) : 60;
  const paddingRight = isShapeView ? 15 : 30;
  const neckHeight = isShapeView ? 100 : 150;
  const stringSpacing = neckHeight / (numStrings + 1);


  const getFretX = (fretIndex) => {
    const usableWidth = width - paddingLeft - paddingRight;
    if (fretIndex < startFretLine) return paddingLeft;
    if (fretIndex > endFretLine) return width - paddingRight;
    return paddingLeft + ((fretIndex - startFretLine) * (usableWidth / numFretSpaces));
  };

  const getStringY = (stringIndex) => {
    return (height - neckHeight) / 2 + (stringIndex + 1) * stringSpacing;
  };

  const handleNoteClick = (stringIndex, fret) => {
    const info = getNoteInfo(stringIndex, fret);
    if (onNoteClick) {
      onNoteClick(info.label);
    }
  };

  const getNoteDisplayText = (info, fret) => {
    if (displayMode === 'intervals') {
      const semitones = (info.noteIndex - rootNote + 12) % 12;
      const intervalMap = {
        0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
        6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
      };
      return intervalMap[semitones] || '';
    }
    if (displayMode === 'fingering') {
      if (fret <= 0) return '';
      const start = minFret > 0 ? minFret : Math.floor((fret - 1) / 4) * 4 + 1;
      return String(Math.min(4, Math.max(1, fret - start + 1)));
    }
    return info.noteName;
  };

  const getShapeFretRange = (shape) => {
    if (shapeType === 'chord') {
      const cagedShape = guitar.arppegios[subType]?.cagedShapes?.[shape];
      if (!cagedShape) return { minFret: 0, maxFret: 24 };
      const realFrets = cagedShape.map(fret => fret === null ? null : fret + keyIndex);
      const validFrets = realFrets.filter(f => f !== null);
      if (validFrets.length === 0) return { minFret: 0, maxFret: 24 };
      return { minFret: Math.min(...validFrets), maxFret: Math.max(...validFrets) };
    } else {
      // scale or arpeggio
      const shapeIndex = ['C', 'A', 'G', 'E', 'D'].indexOf(shape);
      if (shapeIndex === -1) return { minFret: 0, maxFret: 24 };
      let shapeIntervals = null;
      if (shapeType === 'scale') {
        shapeIntervals = guitar.scales[subType]?.indexes?.[shapeIndex];
      } else {
        shapeIntervals = guitar.shapes.indexes[subType]?.[shapeIndex] || guitar.shapes.indexes["M"]?.[shapeIndex];
      }
      if (!shapeIntervals) return { minFret: 0, maxFret: 24 };
      const minFret = shapeIntervals.start + keyIndex;
      const maxFret = shapeIntervals.end + keyIndex;
      return { minFret, maxFret };
    }
  };

  const fretNumbers = Array.from({ length: numFrets }, (_, i) => i);

  return (
    <VisualizerContainer isShapeView={isShapeView}>
      {!isShapeView && (
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>
          Guitar Fretboard Visualizer ({stringNames.join(' ')} - 24 Frets)
        </Typography>
      )}

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', py: isShapeView ? 0 : 2 }}>
        <SvgContainer width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Nut line */}
          {startFretLine === 0 && (
            <line
              x1={paddingLeft}
              y1={(height - neckHeight) / 2}
              x2={paddingLeft}
              y2={(height + neckHeight) / 2}
              stroke="var(--brutal-ink)"
              strokeWidth="6"
            />
          )}

          {/* Fretboard outline */}
          <rect
            x={paddingLeft}
            y={(height - neckHeight) / 2}
            width={width - paddingLeft - paddingRight}
            height={neckHeight}
            fill="none"
            stroke="var(--brutal-ink)"
            strokeWidth="3"
          />

          {/* Fret Markers (dots) */}
          {!isShapeView && [3, 5, 7, 9, 15, 17, 19, 21].map((fret) => {
            const fretX = getFretX(fret);
            const prevFretX = getFretX(fret - 1);
            const dotX = prevFretX + (fretX - prevFretX) / 2;
            const dotY = height / 2;
            return (
              <circle
                key={`dot-${fret}`}
                cx={dotX}
                cy={dotY}
                r="6"
                fill="rgba(0, 0, 0, 0.25)"
                stroke="var(--brutal-ink)"
                strokeWidth="1.5"
              />
            );
          })}

          {/* Double dots at 12th & 24th frets */}
          {!isShapeView && [12, 24].map((fret) => {
            const fretX = getFretX(fret);
            const prevFretX = getFretX(fret - 1);
            const dotX = prevFretX + (fretX - prevFretX) / 2;
            const dotY1 = height / 2 - 25;
            const dotY2 = height / 2 + 25;
            return (
              <g key={`double-dot-${fret}`}>
                <circle cx={dotX} cy={dotY1} r="6" fill="rgba(0, 0, 0, 0.25)" stroke="var(--brutal-ink)" strokeWidth="1.5" />
                <circle cx={dotX} cy={dotY2} r="6" fill="rgba(0, 0, 0, 0.25)" stroke="var(--brutal-ink)" strokeWidth="1.5" />
              </g>
            );
          })}

          {/* Vertical Fret Lines */}
          {fretNumbers.slice(1).map((fret) => {
            if (fret < startFretLine || fret > endFretLine) return null;
            return (
              <line
                key={`fret-${fret}`}
                x1={getFretX(fret)}
                y1={(height - neckHeight) / 2}
                x2={getFretX(fret)}
                y2={(height + neckHeight) / 2}
                stroke="var(--brutal-ink)"
                strokeWidth="2"
              />
            );
          })}

          {/* Fret Numbers (text) */}
          {fretNumbers.map((fret) => {
            const isVisible = fret === 0
              ? startFretLine === 0
              : (fret > startFretLine && fret <= endFretLine);
            if (!isVisible) return null;

            const fretX = fret === 0
              ? paddingLeft / 2
              : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;

            return (
              <text
                key={`num-${fret}`}
                x={fretX}
                y={(height - neckHeight) / 2 - 8}
                textAnchor="middle"
                fontSize={isShapeView ? "11" : "9"}
                fontWeight="900"
                fill="var(--brutal-ink)"
              >
                {fret === 0 ? 'Open' : fret}
              </text>
            );
          })}

          {/* Horizontal Strings */}
          {stringIndexes.map((strIdx) => (
            <line
              key={`string-${strIdx}`}
              x1={startFretLine === 0 ? paddingLeft - 20 : paddingLeft}
              y1={getStringY(strIdx)}
              x2={width - paddingRight}
              y2={getStringY(strIdx)}
              stroke="var(--brutal-ink)"
              strokeWidth={1 + strIdx * 0.4} // Strings get thicker towards the low E string
            />
          ))}

          {/* Tuner label names */}
          {startFretLine === 0 && stringIndexes.map((strIdx) => {
            const info = getNoteInfo(strIdx, 0);
            return (
              <g key={`tuner-${strIdx}`}>
                {info.isActive && (
                  <circle
                    cx={paddingLeft - 35}
                    cy={getStringY(strIdx)}
                    r={isShapeView ? "9" : "11"}
                    fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'}
                    stroke="var(--brutal-ink)"
                    strokeWidth="2"
                  />
                )}
                <text
                  x={paddingLeft - 35}
                  y={getStringY(strIdx) + 4}
                  textAnchor="middle"
                  fontSize={isShapeView ? "10" : "12"}
                  fontWeight="900"
                  fill="var(--brutal-ink)"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleNoteClick(strIdx, 0)}
                >
                  {stringNames[strIdx]}
                </text>
              </g>
            );
          })}

          {/* Interactive Note circles */}
          {stringIndexes.map((strIdx) => (
            fretNumbers.slice(1).map((fret) => {
              const isVisible = (fret > startFretLine && fret <= endFretLine);
              if (!isVisible) return null;

              const info = getNoteInfo(strIdx, fret);
              const fretX = fret === 0 ? paddingLeft - 10 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
              const stringY = getStringY(strIdx);

              return (
                <g key={`note-${strIdx}-${fret}`}>
                  {/* Click target */}
                  <circle
                    cx={fretX}
                    cy={stringY}
                    r={isShapeView ? "11" : "14"}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNoteClick(strIdx, fret)}
                  />
                  {/* Highlight circle */}
                  {info.isActive && (
                    <circle
                      cx={fretX}
                      cy={stringY}
                      r={isShapeView ? "8" : "10"}
                      fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'}
                      stroke="var(--brutal-ink)"
                      strokeWidth="2"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {/* Note label */}
                  {info.isActive && (
                    <text
                      x={fretX}
                      y={stringY + (isShapeView ? 2.5 : 3)}
                      textAnchor="middle"
                      fontSize={isShapeView ? "7" : "9"}
                      fontWeight="900"
                      fill="var(--brutal-ink)"
                      style={{ pointerEvents: 'none' }}
                    >
                      {getNoteDisplayText(info, fret)}
                    </text>
                  )}
                </g>
              );
            })
          ))}
        </SvgContainer>
      </Box>

      {/* Legend */}
      {!isShapeView && (
        <Box sx={{ display: 'flex', gap: 3, mt: 2, mb: showCagedShapes ? 4 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-orange)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ fontWeight: 800 }}>Root Note</Typography>
          </Box>
          {modeRootNote !== null && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} />
              <Typography variant="caption" sx={{ fontWeight: 800 }}>Mode Root</Typography>
            </Box>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-blue)', border: '2px solid var(--brutal-ink)', borderRadius: '50%' }} />
            <Typography variant="caption" sx={{ fontWeight: 800 }}>Scale/Chord Note</Typography>
          </Box>
        </Box>
      )}

      {/* 5 CAGED Shapes Row (rendered inside the main visualizer container) */}
      {!isShapeView && showCagedShapes && (
        <Box sx={{ width: '100%', borderTop: '3px solid var(--brutal-ink)', pt: 4, mt: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)', mb: 3, textAlign: 'center' }}>
            🎸 The 5 Essential CAGED Shapes
          </Typography>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            width: '100%',
            flexWrap: 'wrap'
          }}>
            {['C', 'A', 'G', 'E', 'D'].map((shape) => {
              const range = getShapeFretRange(shape);
              return (
                <Box
                  key={shape}
                  sx={{
                    flex: '1 1 0px',
                    minWidth: '180px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, mb: 0.5, color: 'var(--brutal-ink)' }}>
                    Shape {shape}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 800, mb: 1, color: 'text.secondary' }}>
                    Frets {range.minFret} - {range.maxFret}
                  </Typography>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <GuitarVisualizer
                      activeNotes={activeNotes}
                      rootNote={rootNote}
                      modeRootNote={modeRootNote}
                      onNoteClick={onNoteClick}
                      tuning={tuning}
                      stringNames={stringNames}
                      isShapeView={true}
                      shapeName={shape}
                      shapeType={shapeType}
                      subType={subType}
                      keyIndex={keyIndex}
                      minFret={range.minFret}
                      maxFret={range.maxFret}
                      displayMode={displayMode}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </VisualizerContainer>
  );
};

export default GuitarVisualizer;
