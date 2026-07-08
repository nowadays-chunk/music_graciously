import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const VisualizerContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '24px',
  background: 'rgba(255, 253, 245, 0.85)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  overflowX: 'auto',
  width: '100%',
});

const SvgContainer = styled('svg')({
  border: '3px solid var(--brutal-ink)',
  background: '#5d4037', // Mahogany / Dark maple varnish for contrabass body
  borderRadius: '4px',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  userSelect: 'none',
});

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const DOUBLE_BASS_TUNING = [28, 33, 38, 43]; // E1, A1, D2, G2 (Upright bass tuning)
const DOUBLE_BASS_STRING_NAMES = ['E', 'A', 'D', 'G'];

const DoubleBassVisualizer = ({
  activeNotes = [],
  rootNote = null,
  modeRootNote = null,
  onNoteClick,
  tuning = DOUBLE_BASS_TUNING,
  stringNames = DOUBLE_BASS_STRING_NAMES,
  isShapeView = false,
  shapeName = '',
  shapeType = '',
  subType = '',
  keyIndex = 0,
  minFret = 0,
  maxFret = 24,
  displayMode = 'notes'
}) => {
  const numFrets = 13; // 0 to 12 semitones
  const numStrings = 4;
  
  const width = isShapeView ? 240 : 750;
  const height = isShapeView ? 140 : 180;
  const paddingLeft = isShapeView ? 30 : 80;
  const paddingRight = isShapeView ? 15 : 40;
  const usableWidth = width - paddingLeft - paddingRight;

  const nutHeight = 80;
  const bridgeHeight = 130;

  const getFretX = (fretIndex) => {
    return paddingLeft + (fretIndex * (usableWidth / (numFrets - 1)));
  };

  const getNeckHeightAtX = (x) => {
    const ratio = (x - paddingLeft) / usableWidth;
    return nutHeight + ratio * (bridgeHeight - nutHeight);
  };

  const getStringYAtX = (stringIndex, x) => {
    const neckH = getNeckHeightAtX(x);
    const spacing = neckH / (numStrings + 1);
    return height / 2 - neckH / 2 + (stringIndex + 1) * spacing;
  };

  const getNoteInfo = (stringIndex, fret) => {
    const openMidi = tuning[stringIndex];
    const midi = openMidi + fret;
    const noteIndex = midi % 12;
    const noteName = NOTE_NAMES[noteIndex];
    const octave = Math.floor(midi / 12) - 1;
    const isRoot = rootNote !== null && noteIndex === rootNote;
    const isModeRoot = modeRootNote !== null && noteIndex === modeRootNote;
    const isActive = activeNotes.includes(noteIndex);
    return { noteName, octave, noteIndex, isRoot, isModeRoot, isActive, label: `${noteName}${octave}` };
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

  const handleNoteClick = (stringIndex, fret) => {
    const info = getNoteInfo(stringIndex, fret);
    if (onNoteClick) {
      onNoteClick(info.label);
    }
  };

  const fretNumbers = Array.from({ length: numFrets }, (_, i) => i);
  const stringIndexes = Array.from({ length: numStrings }, (_, i) => i);

  const fingerboardPoints = [
    `${paddingLeft},${height/2 - nutHeight/2}`,
    `${width - paddingRight},${height/2 - bridgeHeight/2}`,
    `${width - paddingRight},${height/2 + bridgeHeight/2}`,
    `${paddingLeft},${height/2 + nutHeight/2}`,
  ].join(' ');

  return (
    <VisualizerContainer>
      {!isShapeView && (
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>
          Double Bass Visualizer ({stringNames.join(' ')} - Fretless Upright)
        </Typography>
      )}

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', py: 2 }}>
        <SvgContainer width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Pegbox shape */}
          {!isShapeView && (
            <path
              d={`M 10,${height/2 - 25} L 70,${height/2 - 25} L 70,${height/2 + 25} L 10,${height/2 + 25} Z`}
              fill="#3e2723"
              stroke="var(--brutal-ink)"
              strokeWidth="3"
            />
          )}

          {/* Ebony Fingerboard */}
          <polygon
            points={fingerboardPoints}
            fill="#151515"
            stroke="var(--brutal-ink)"
            strokeWidth="4"
          />

          {/* Nut */}
          <line
            x1={paddingLeft}
            y1={height/2 - nutHeight/2}
            x2={paddingLeft}
            y2={height/2 + nutHeight/2}
            stroke="var(--brutal-ink)"
            strokeWidth="6"
          />

          {/* Position dashed marker lines */}
          {fretNumbers.slice(1).map((fret) => {
            const x = getFretX(fret);
            const neckH = getNeckHeightAtX(x);
            return (
              <line
                key={`guide-${fret}`}
                x1={x}
                y1={height/2 - neckH/2}
                x2={x}
                y2={height/2 + neckH/2}
                stroke="#333333"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          })}

          {/* Position labels */}
          {!isShapeView && [
            { fret: 1, label: '1/2 Pos' },
            { fret: 2, label: 'I Pos' },
            { fret: 4, label: 'II Pos' },
            { fret: 5, label: 'III Pos' },
            { fret: 7, label: 'IV Pos' },
            { fret: 12, label: 'Octave' }
          ].map((pos) => {
            const x = getFretX(pos.fret);
            return (
              <text
                key={`label-${pos.fret}`}
                x={x}
                y={height/2 - getNeckHeightAtX(x)/2 - 8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="var(--brutal-ink)"
              >
                {pos.label}
              </text>
            );
          })}

          {/* Diverging extra-thick strings */}
          {stringIndexes.map((strIdx) => {
            const y1 = getStringYAtX(strIdx, paddingLeft - 20);
            const y2 = getStringYAtX(strIdx, width - paddingRight);
            return (
              <line
                key={`string-${strIdx}`}
                x1={paddingLeft - 20}
                y1={y1}
                x2={width - paddingRight}
                y2={y2}
                stroke="#c2c2c2" // Chrome steel strings
                strokeWidth={2 + strIdx * 0.8} // Bass strings get very thick
              />
            );
          })}

          {/* Open string names */}
          {!isShapeView && stringIndexes.map((strIdx) => {
            const y = getStringYAtX(strIdx, paddingLeft - 40);
            const info = getNoteInfo(strIdx, 0);
            return (
              <g key={`string-label-${strIdx}`}>
                {info.isActive && (
                  <circle
                    cx={paddingLeft - 40}
                    cy={y}
                    r="11"
                    fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'}
                    stroke="var(--brutal-ink)"
                    strokeWidth="2"
                  />
                )}
                <text
                  x={paddingLeft - 40}
                  y={y + 4}
                  textAnchor="middle"
                  fontSize="12"
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

          {/* Click hotspots and indicators */}
          {stringIndexes.map((strIdx) => (
            fretNumbers.slice(1).map((fret) => {
              const info = getNoteInfo(strIdx, fret);
              const x = fret === 0 ? paddingLeft - 10 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
              const y = getStringYAtX(strIdx, x);

              return (
                <g key={`db-note-${strIdx}-${fret}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r={isShapeView ? "11" : "15"}
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleNoteClick(strIdx, fret)}
                  />
                  {info.isActive && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isShapeView ? "8" : "11"}
                      fill={info.isModeRoot ? 'var(--brutal-mint)' : info.isRoot ? 'var(--brutal-orange)' : 'var(--brutal-blue)'}
                      stroke="var(--brutal-ink)"
                      strokeWidth="2"
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                  {info.isActive && (
                    <text
                      x={x}
                      y={y + (isShapeView ? 2.5 : 3.5)}
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
        <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
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
    </VisualizerContainer>
  );
};

export default DoubleBassVisualizer;
