import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const PianoContainer = styled(Box)({
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
  background: 'var(--brutal-ink)',
  borderRadius: '4px',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  userSelect: 'none',
});

// Piano notes mapping (C3 to B5, midi 48 to 83)
const START_MIDI = 48; // C3
const END_MIDI = 83;   // B5

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const PianoVisualizer = ({ activeNotes = [], rootNote = null, modeRootNote = null, onNoteClick, displayMode = 'notes' }) => {
  const getNoteDisplayText = (key) => {
    if (displayMode === 'intervals') {
      if (rootNote === null) return '';
      const semitones = (key.noteIndex - rootNote + 12) % 12;
      const intervalMap = {
        0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
        6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
      };
      return intervalMap[semitones] || '';
    }
    if (displayMode === 'fingering') {
      if (!key.isActive && !key.isRoot && !key.isModeRoot) return '';
      if (rootNote === null || activeNotes.length === 0) return '';
      
      const sortedActive = [...activeNotes].sort((a, b) => {
        const distA = (a - rootNote + 12) % 12;
        const distB = (b - rootNote + 12) % 12;
        return distA - distB;
      });
      const idx = sortedActive.indexOf(key.noteIndex);
      if (idx === -1) return '';
      
      if (sortedActive.length === 3) {
        const fingeringMap = { 0: '1', 1: '3', 2: '5' };
        return fingeringMap[idx] || '';
      } else if (sortedActive.length === 4) {
        const fingeringMap = { 0: '1', 1: '2', 2: '3', 3: '5' };
        return fingeringMap[idx] || '';
      } else {
        const fingeringMap = { 0: '1', 1: '2', 2: '3', 3: '1', 4: '2', 5: '3', 6: '4', 7: '5' };
        return fingeringMap[idx % 8] || '1';
      }
    }
    return key.noteName;
  };
  const getNoteInfo = (midi) => {
    const noteName = NOTE_NAMES[midi % 12];
    const octave = Math.floor(midi / 12) - 1;
    const isBlack = [1, 3, 6, 8, 10].includes(midi % 12);
    const noteIndex = midi % 12;
    const isRoot = rootNote !== null && noteIndex === rootNote;
    const isModeRoot = modeRootNote !== null && noteIndex === modeRootNote;
    const isActive = activeNotes.includes(noteIndex);
    return { noteName, octave, isBlack, noteIndex, isRoot, isModeRoot, isActive, label: `${noteName}${octave}` };
  };

  // Generate lists of white and black keys
  const whiteKeys = [];
  const blackKeys = [];
  let whiteIndex = 0;

  const whiteKeyWidth = 40;
  const whiteKeyHeight = 180;
  const blackKeyWidth = 24;
  const blackKeyHeight = 110;

  for (let midi = START_MIDI; midi <= END_MIDI; midi++) {
    const info = getNoteInfo(midi);
    if (!info.isBlack) {
      whiteKeys.push({
        ...info,
        midi,
        x: whiteIndex * whiteKeyWidth,
        width: whiteKeyWidth,
        height: whiteKeyHeight,
      });
      whiteIndex++;
    }
  }

  // Draw black keys relative to white keys
  // For each octave: C D E F G A B
  // C# is between C and D
  // D# is between D and E
  // F# is between F and G
  // G# is between G and A
  // A# is between A and B
  whiteKeys.forEach((wk, index) => {
    const midi = wk.midi;
    const noteIndex = midi % 12;
    
    // Check if there should be a black key to the right of this white key
    // white key index in octave: C(0), D(2), F(5), G(7), A(9)
    if ([0, 2, 5, 7, 9].includes(noteIndex) && midi < END_MIDI) {
      const blackMidi = midi + 1;
      const info = getNoteInfo(blackMidi);
      blackKeys.push({
        ...info,
        midi: blackMidi,
        x: wk.x + whiteKeyWidth - (blackKeyWidth / 2),
        width: blackKeyWidth,
        height: blackKeyHeight,
      });
    }
  });

  const getKeyColor = (key) => {
    if (key.isModeRoot) return 'var(--brutal-mint)';
    if (key.isRoot) return 'var(--brutal-orange)';
    if (key.isActive) return 'var(--brutal-blue)';
    return key.isBlack ? 'var(--brutal-ink)' : 'var(--brutal-paper)';
  };

  const handleKeyClick = (key) => {
    if (onNoteClick) {
      onNoteClick(key.label);
    }
  };

  const totalWidth = whiteKeys.length * whiteKeyWidth;

  return (
    <PianoContainer>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 2, color: 'var(--brutal-ink)' }}>
        Piano Key Visualizer
      </Typography>
      
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', overflowX: 'auto', py: 2 }}>
        <SvgContainer
          width={totalWidth}
          height={whiteKeyHeight + 20}
          viewBox={`0 0 ${totalWidth} ${whiteKeyHeight + 20}`}
        >
          {/* Render White Keys */}
          {whiteKeys.map((key) => (
            <g key={key.midi}>
              <rect
                x={key.x}
                y={0}
                width={key.width}
                height={key.height}
                fill={getKeyColor(key)}
                stroke="var(--brutal-ink)"
                strokeWidth="2"
                onClick={() => handleKeyClick(key)}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.1s ease',
                }}
              />
              <text
                x={key.x + key.width / 2}
                y={key.height - 10}
                textAnchor="middle"
                fontSize="9"
                fontWeight="900"
                fill="var(--brutal-ink)"
                style={{ pointerEvents: 'none' }}
              >
                {getNoteDisplayText(key)}
              </text>
            </g>
          ))}

          {/* Render Black Keys */}
          {blackKeys.map((key) => (
            <g key={key.midi}>
              <rect
                x={key.x}
                y={0}
                width={key.width}
                height={key.height}
                fill={getKeyColor(key)}
                stroke="var(--brutal-ink)"
                strokeWidth="2"
                onClick={() => handleKeyClick(key)}
                style={{
                  cursor: 'pointer',
                  transition: 'fill 0.1s ease',
                }}
              />
              <text
                x={key.x + key.width / 2}
                y={key.height - 12}
                textAnchor="middle"
                fontSize="8"
                fontWeight="900"
                fill={key.isRoot || key.isModeRoot || key.isActive ? 'var(--brutal-ink)' : 'var(--brutal-paper)'}
                style={{ pointerEvents: 'none' }}
              >
                {getNoteDisplayText(key)}
              </text>
            </g>
          ))}
        </SvgContainer>
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-orange)', border: '2px solid var(--brutal-ink)' }} />
          <Typography variant="caption" sx={{ fontWeight: 800 }}>Root Note</Typography>
        </Box>
        {modeRootNote !== null && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-mint)', border: '2px solid var(--brutal-ink)' }} />
            <Typography variant="caption" sx={{ fontWeight: 800 }}>Mode Root</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 16, height: 16, bgcolor: 'var(--brutal-blue)', border: '2px solid var(--brutal-ink)' }} />
          <Typography variant="caption" sx={{ fontWeight: 800 }}>Scale/Chord Note</Typography>
        </Box>
      </Box>
    </PianoContainer>
  );
};

export default PianoVisualizer;
