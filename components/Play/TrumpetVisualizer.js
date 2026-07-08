import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
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
  width: '100%',
});

const InstrumentPanel = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '20px',
  width: '100%',
  marginTop: '16px',
});

const NoteButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active' && prop !== 'inScale' && prop !== 'root' && prop !== 'modeRoot',
})(({ active, inScale, root, modeRoot }) => ({
  borderRadius: 4,
  margin: '4px',
  padding: '6px 12px',
  minWidth: '50px',
  background: modeRoot
    ? 'var(--brutal-mint)'
    : active || root
      ? 'var(--brutal-orange)'
      : (inScale ? 'var(--brutal-blue)' : 'var(--brutal-paper)'),
  color: active || inScale || root || modeRoot ? 'var(--brutal-paper)' : 'var(--brutal-ink)',
  border: '3px solid var(--brutal-ink)',
  boxShadow: active ? 'var(--brutal-shadow-small)' : '2px 2px 0 var(--brutal-ink)',
  fontWeight: 900,
  textTransform: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: modeRoot ? 'var(--brutal-mint)' : root ? 'var(--brutal-orange)' : active ? 'var(--brutal-pink)' : 'var(--brutal-yellow)',
    color: 'var(--brutal-ink)',
    transform: 'translate(2px, 2px)',
    boxShadow: 'none',
  },
}));

// Trumpet standard fingerings (written notes C4 to C6)
const TRUMPET_FINGERINGS = {
  'C4': [false, false, false],
  'C#4': [true, true, true],
  'D4': [true, false, true],
  'D#4': [false, true, true],
  'E4': [true, true, false],
  'F4': [true, false, false],
  'F#4': [false, true, false],
  'G4': [false, false, false],
  'G#4': [false, true, true],
  'A4': [true, true, false],
  'A#4': [true, false, false],
  'B4': [false, true, false],
  'C5': [false, false, false],
  'C#5': [true, true, false],
  'D5': [true, false, false],
  'D#5': [false, true, false],
  'E5': [false, false, false],
  'F5': [true, false, false],
  'F#5': [false, true, false],
  'G5': [false, false, false],
  'G#5': [false, true, true],
  'A5': [true, true, false],
  'A#5': [true, false, false],
  'B5': [false, true, false],
  'C6': [false, false, false]
};

const NOTE_LIST = Object.keys(TRUMPET_FINGERINGS);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const TrumpetVisualizer = ({ activeNotes = [], rootNote = null, modeRootNote = null, onNoteClick, displayMode = 'notes' }) => {
  const getNoteDisplayText = (note) => {
    if (displayMode === 'intervals') {
      if (rootNote === null) return note;
      const idx = getNoteIndex(note);
      const semitones = (idx - rootNote + 12) % 12;
      const intervalMap = {
        0: 'R', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4',
        6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
      };
      return intervalMap[semitones] || note;
    }
    if (displayMode === 'fingering') {
      const valves = TRUMPET_FINGERINGS[note] || [false, false, false];
      const pressed = valves.map((v, i) => v ? (i + 1) : null).filter(Boolean);
      return pressed.join('-') || '0';
    }
    return note;
  };
  const [selectedNote, setSelectedNote] = useState('C4');

  const getNoteIndex = (noteNameWithOctave) => {
    const cleanName = noteNameWithOctave.replace(/[0-9]/g, '');
    return NOTE_NAMES.indexOf(cleanName);
  };

  // Filter notes that are in the active scale/chord to highlight them
  const isNoteInScale = (noteNameWithOctave) => {
    const idx = getNoteIndex(noteNameWithOctave);
    return activeNotes.includes(idx);
  };

  const isNoteRoot = (noteNameWithOctave) =>
    rootNote !== null && getNoteIndex(noteNameWithOctave) === rootNote;

  const isNoteModeRoot = (noteNameWithOctave) =>
    modeRootNote !== null && getNoteIndex(noteNameWithOctave) === modeRootNote;

  const handleNoteSelect = (note) => {
    setSelectedNote(note);
    if (onNoteClick) {
      onNoteClick(note);
    }
  };

  const valves = TRUMPET_FINGERINGS[selectedNote] || [false, false, false];

  return (
    <VisualizerContainer>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: 'var(--brutal-ink)' }}>
        Trumpet Valve Fingering Visualizer
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', mb: 3 }}>
        Select a note in the active scale/chord to see the piston valve combination.
      </Typography>

      {/* Note Selector Grid */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%', mb: 4 }}>
        {NOTE_LIST.map((note) => (
          <NoteButton
            key={note}
            active={selectedNote === note}
            inScale={isNoteInScale(note)}
            root={isNoteRoot(note)}
            modeRoot={isNoteModeRoot(note)}
            onClick={() => handleNoteSelect(note)}
          >
            {getNoteDisplayText(note)}
          </NoteButton>
        ))}
      </Box>

      <InstrumentPanel>
        {/* Trumpet SVG Drawing */}
        <svg width="450" height="200" viewBox="0 0 450 200" style={{ overflow: 'visible' }}>
          {/* Bell flare */}
          <path
            d="M 320,100 C 370,100 400,60 430,50 L 430,150 C 400,140 370,100 320,100 Z"
            fill="var(--brutal-yellow)"
            stroke="var(--brutal-ink)"
            strokeWidth="4"
          />
          <ellipse cx="430" cy="100" rx="6" ry="50" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />

          {/* Leadpipe and outer tubes */}
          <path
            d="M 50,85 L 320,85 M 50,115 L 320,115 M 50,85 C 20,85 20,115 50,115"
            fill="none"
            stroke="var(--brutal-ink)"
            strokeWidth="10"
          />

          {/* Mouthpiece */}
          <path d="M 10,75 L 35,80 L 35,90 L 10,95 Z" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="3" />

          {/* Valve Casings (Outer cylinders) */}
          <g>
            <rect x="150" y="60" width="30" height="90" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="4" />
            <rect x="190" y="60" width="30" height="90" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="4" />
            <rect x="230" y="60" width="30" height="90" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="4" />
          </g>

          {/* Valve Slides */}
          <path d="M 180,100 Q 200,100 200,120 Q 200,140 180,140" fill="none" stroke="var(--brutal-ink)" strokeWidth="8" />
          <path d="M 220,90 Q 260,90 260,110 Q 260,130 220,130" fill="none" stroke="var(--brutal-ink)" strokeWidth="8" />

          {/* Valve Pistons (Animated downward if pressed) */}
          {valves.map((isPressed, idx) => {
            const x = 155 + idx * 40;
            const yOffset = isPressed ? 15 : 0; // Animates pistons down
            return (
              <g key={idx} transform={`translate(0, ${yOffset})`}>
                {/* Finger button top cap */}
                <ellipse cx={x + 10} cy="35" rx="12" ry="5" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="3" />
                {/* Valve shaft stem */}
                <rect x={x + 7} y="40" width="6" height="20" fill="var(--brutal-ink)" />
                {/* Internal piston representation */}
                <rect x={x} y="60" width="20" height="25" fill={isPressed ? 'var(--brutal-pink)' : 'var(--brutal-paper)'} stroke="var(--brutal-ink)" strokeWidth="3" />
              </g>
            );
          })}
        </svg>

        {/* Fingering combination display */}
        <Box sx={{ display: 'flex', gap: 2, bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', p: 1.5, borderRadius: 1, boxShadow: 'var(--brutal-shadow-small)' }}>
          <Typography variant="body2" sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>
            Valves Pressed: {valves.map((v, i) => v ? (i + 1) : null).filter(Boolean).join(' - ') || 'Open (None)'}
          </Typography>
        </Box>
      </InstrumentPanel>
    </VisualizerContainer>
  );
};

export default TrumpetVisualizer;
