import React, { useState } from 'react';
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
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '40px',
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

// Saxophone fingerings map for notes D4 to C6
// Keys: [OK, LH1, Bis, LH2, LH3, G#, RH1, RH2, RH3, Eb]
const SAX_FINGERINGS = {
  'D4':  [false, true, false, true, true, false, true, true, true, false],
  'D#4': [false, true, false, true, true, false, true, true, true, true],
  'E4':  [false, true, false, true, true, false, true, true, false, false],
  'F4':  [false, true, false, true, true, false, true, false, false, false],
  'F#4': [false, true, false, true, true, false, false, true, false, false],
  'G4':  [false, true, false, true, true, false, false, false, false, false],
  'G#4': [false, true, false, true, true, true, false, false, false, false],
  'A4':  [false, true, false, true, false, false, false, false, false, false],
  'Bb4': [false, true, true, false, false, false, false, false, false, false],
  'B4':  [false, true, false, false, false, false, false, false, false, false],
  'C5':  [false, false, false, true, false, false, false, false, false, false],
  'C#5': [false, false, false, false, false, false, false, false, false, false],
  'D5':  [true, true, false, true, true, false, true, true, true, false],
  'Eb5': [true, true, false, true, true, false, true, true, true, true],
  'E5':  [true, true, false, true, true, false, true, true, false, false],
  'F5':  [true, true, false, true, true, false, true, false, false, false],
  'F#5': [true, true, false, true, true, false, false, true, false, false],
  'G5':  [true, true, false, true, true, false, false, false, false, false],
  'G#5': [true, true, false, true, true, true, false, false, false, false],
  'A5':  [true, true, false, true, false, false, false, false, false, false],
  'Bb5': [true, true, true, false, false, false, false, false, false, false],
  'B5':  [true, true, false, false, false, false, false, false, false, false],
  'C6':  [true, false, false, true, false, false, false, false, false, false],
  'C#6': [true, false, false, false, false, false, false, false, false, false]
};

const NOTE_LIST = Object.keys(SAX_FINGERINGS);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTE_INDEXES = { Db: 1, Eb: 3, Gb: 6, Ab: 8, Bb: 10 };

const SaxophoneVisualizer = ({ activeNotes = [], rootNote = null, modeRootNote = null, onNoteClick, displayMode = 'notes' }) => {
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
      const keys = SAX_FINGERINGS[note] || [];
      if (!keys.length) return 'Open';
      
      const parts = [];
      const lh = [];
      if (keys[0]) lh.push('Ok');
      if (keys[1]) lh.push('1');
      if (keys[2]) lh.push('Bis');
      if (keys[3]) lh.push('2');
      if (keys[4]) lh.push('3');
      if (keys[5]) lh.push('G#');
      
      const rh = [];
      if (keys[6]) rh.push('1');
      if (keys[7]) rh.push('2');
      if (keys[8]) rh.push('3');
      if (keys[9]) rh.push('Eb');
      
      if (lh.length) parts.push(lh.join(''));
      if (rh.length) parts.push(rh.join(''));
      
      return parts.join('|') || 'Open';
    }
    return note;
  };
  const [selectedNote, setSelectedNote] = useState('G4');

  const getNoteIndex = (noteNameWithOctave) => {
    const cleanName = noteNameWithOctave.replace(/[0-9]/g, '');
    return NOTE_NAMES.indexOf(cleanName) >= 0 ? NOTE_NAMES.indexOf(cleanName) : FLAT_NOTE_INDEXES[cleanName];
  };

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

  // Current fingering array: [OK, LH1, Bis, LH2, LH3, G#, RH1, RH2, RH3, Eb]
  const keys = SAX_FINGERINGS[selectedNote] || [false, false, false, false, false, false, false, false, false, false];

  const getKeyColor = (isPressed) => (isPressed ? 'var(--brutal-pink)' : 'var(--brutal-paper)');

  return (
    <VisualizerContainer>
      <Typography variant="h6" sx={{ fontWeight: 900, mb: 1, color: 'var(--brutal-ink)' }}>
        Saxophone Key Fingering Visualizer
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', mb: 3 }}>
        Select a note to light up the key pads on the saxophone body.
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
        {/* Saxophone SVG Drawing */}
        <svg width="220" height="360" viewBox="0 0 220 360" style={{ overflow: 'visible' }}>
          {/* Crook/Neck */}
          <path d="M 70,30 Q 100,5 110,40 Q 110,65 95,80" fill="none" stroke="var(--brutal-ink)" strokeWidth="8" />
          {/* Mouthpiece */}
          <rect x="60" y="25" width="12" height="8" transform="rotate(-30, 60, 25)" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="2" />

          {/* Sax Body (Main tube) */}
          <path
            d="M 90,80 L 90,260 C 90,320 160,320 160,260 L 160,180"
            fill="none"
            stroke="var(--brutal-yellow)"
            strokeWidth="32"
            strokeLinecap="round"
          />
          {/* Sax Bell flare */}
          <path
            d="M 144,190 C 130,170 120,130 170,120 C 220,110 200,170 176,190 Z"
            fill="var(--brutal-yellow)"
            stroke="var(--brutal-ink)"
            strokeWidth="3"
          />

          {/* Body black outline details */}
          <path
            d="M 74,80 L 74,260 C 74,336 176,336 176,260 L 176,180"
            fill="none"
            stroke="var(--brutal-ink)"
            strokeWidth="3"
          />

          {/* KEY PADS LAYOUT */}
          {/* Octave Key (OK) - drawn on the left side of the neck/body */}
          <g>
            <rect x="62" y="80" width="8" height="24" rx="2" fill={getKeyColor(keys[0])} stroke="var(--brutal-ink)" strokeWidth="2" />
            <text x="52" y="96" fontSize="9" fontWeight="900" textAnchor="end">OK</text>
          </g>

          {/* Left Hand Keys (Stack) */}
          {/* LH1 */}
          <g>
            <circle cx="90" cy="110" r="8" fill={getKeyColor(keys[1])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="113" fontSize="10" fontWeight="900">LH 1</text>
          </g>

          {/* Bis Key (small dot between LH1 and LH2) */}
          <g>
            <circle cx="90" cy="126" r="4.5" fill={getKeyColor(keys[2])} stroke="var(--brutal-ink)" strokeWidth="2" />
            <text x="106" y="129" fontSize="8" fontWeight="900">Bis</text>
          </g>

          {/* LH2 */}
          <g>
            <circle cx="90" cy="142" r="8" fill={getKeyColor(keys[3])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="145" fontSize="10" fontWeight="900">LH 2</text>
          </g>

          {/* LH3 */}
          <g>
            <circle cx="90" cy="166" r="8" fill={getKeyColor(keys[4])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="169" fontSize="10" fontWeight="900">LH 3</text>
          </g>

          {/* G# key (little lever on the left of LH3) */}
          <g>
            <rect x="65" y="160" width="12" height="12" rx="2" fill={getKeyColor(keys[5])} stroke="var(--brutal-ink)" strokeWidth="2" />
            <text x="58" y="169" fontSize="9" fontWeight="900" textAnchor="end">G#</text>
          </g>

          {/* Right Hand Keys (Stack) */}
          {/* RH1 */}
          <g>
            <circle cx="90" cy="200" r="8" fill={getKeyColor(keys[6])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="203" fontSize="10" fontWeight="900">RH 1</text>
          </g>

          {/* RH2 */}
          <g>
            <circle cx="90" cy="222" r="8" fill={getKeyColor(keys[7])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="225" fontSize="10" fontWeight="900">RH 2</text>
          </g>

          {/* RH3 */}
          <g>
            <circle cx="90" cy="244" r="8" fill={getKeyColor(keys[8])} stroke="var(--brutal-ink)" strokeWidth="2.5" />
            <text x="108" y="247" fontSize="10" fontWeight="900">RH 3</text>
          </g>

          {/* Eb Key (bottom stack right side lever) */}
          <g>
            <path d="M 112,254 Q 130,250 126,268 Z" fill={getKeyColor(keys[9])} stroke="var(--brutal-ink)" strokeWidth="2" />
            <text x="135" y="265" fontSize="9" fontWeight="900">Eb</text>
          </g>
        </svg>

        {/* Legend / Info box */}
        <Box sx={{ maxWidth: '280px', display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', borderRadius: 1, boxShadow: 'var(--brutal-shadow-small)' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900 }}>Keys Pressed:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {keys[0] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>Octave</Typography>}
            {keys[1] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>LH 1</Typography>}
            {keys[2] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>Bis</Typography>}
            {keys[3] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>LH 2</Typography>}
            {keys[4] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>LH 3</Typography>}
            {keys[5] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>G#</Typography>}
            {keys[6] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>RH 1</Typography>}
            {keys[7] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>RH 2</Typography>}
            {keys[8] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>RH 3</Typography>}
            {keys[9] && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-pink)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>Eb Key</Typography>}
            {!keys.some(Boolean) && <Typography variant="caption" sx={{ fontWeight: 800, bgcolor: 'var(--brutal-mint)', p: 0.5, border: '1.5px solid var(--brutal-ink)' }}>All Open (C#)</Typography>}
          </Box>
        </Box>
      </InstrumentPanel>
    </VisualizerContainer>
  );
};

export default SaxophoneVisualizer;
