import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel,
  FormControl, Grid, Chip, Divider, Checkbox, FormControlLabel,
  TextField, InputAdornment, IconButton, Tooltip, Slider,
  ToggleButton, ToggleButtonGroup, Paper, Card, CardContent
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import PauseIcon from '@mui/icons-material/Pause';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import SettingsIcon from '@mui/icons-material/Settings';
import LyricsIcon from '@mui/icons-material/Lyrics';
import CreateIcon from '@mui/icons-material/Create';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { getSoundfontInstrument } from '../../core/audio/AudioService';
import { getNoteName } from '../../core/music/musicTheory';
import { trackAffinity } from '../../core/marketing/affinity';


// ─── Constants ─────────────────────────────────────────────────────────────────

const NOTES_SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLATS = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const KEY_DISPLAY = {
  'C': 'C', 'C#': 'C# / Db', 'D': 'D', 'D#': 'D# / Eb', 'E': 'E', 'F': 'F',
  'F#': 'F# / Gb', 'G': 'G', 'G#': 'G# / Ab', 'A': 'A', 'A#': 'A# / Bb', 'B': 'B'
};

const MODES = [
  { name: 'Major (Ionian)', val: 'major' },
  { name: 'Natural Minor (Aeolian)', val: 'minor' },
  { name: 'Dorian', val: 'dorian' },
  { name: 'Phrygian', val: 'phrygian' },
  { name: 'Lydian', val: 'lydian' },
  { name: 'Mixolydian', val: 'mixolydian' },
  { name: 'Locrian', val: 'locrian' }
];

const MODE_DEFS = {
  major: {
    offsets: [0, 2, 4, 5, 7, 9, 11],
    romans: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    qualities: ['Major', 'minor', 'minor', 'Major', 'Major', 'minor', 'diminished'],
    suffixes: ['', 'm', 'm', '', '', 'm', 'dim'],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone']
  },
  minor: {
    offsets: [0, 2, 3, 5, 7, 8, 10],
    romans: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    qualities: ['minor', 'diminished', 'Major', 'minor', 'minor', 'Major', 'Major'],
    suffixes: ['m', 'dim', '', 'm', 'm', '', ''],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic']
  },
  dorian: {
    offsets: [0, 2, 3, 5, 7, 9, 10],
    romans: ['i', 'ii', 'III', 'IV', 'v', 'vi°', 'VII'],
    qualities: ['minor', 'minor', 'Major', 'Major', 'minor', 'diminished', 'Major'],
    suffixes: ['m', 'm', '', '', 'm', 'dim', ''],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic']
  },
  phrygian: {
    offsets: [0, 1, 3, 5, 7, 8, 10],
    romans: ['i', 'II', 'III', 'iv', 'v°', 'VI', 'vii'],
    qualities: ['minor', 'Major', 'Major', 'minor', 'diminished', 'Major', 'minor'],
    suffixes: ['m', '', '', 'm', 'dim', '', 'm'],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic']
  },
  lydian: {
    offsets: [0, 2, 4, 6, 7, 9, 11],
    romans: ['I', 'II', 'iii', 'iv°', 'V', 'vi', 'vii'],
    qualities: ['Major', 'Major', 'minor', 'diminished', 'Major', 'minor', 'minor'],
    suffixes: ['', '', 'm', 'dim', '', 'm', 'm'],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Leading Tone']
  },
  mixolydian: {
    offsets: [0, 2, 4, 5, 7, 9, 10],
    romans: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'VII'],
    qualities: ['Major', 'minor', 'diminished', 'Major', 'minor', 'minor', 'Major'],
    suffixes: ['', 'm', 'dim', '', 'm', 'm', ''],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic']
  },
  locrian: {
    offsets: [0, 1, 3, 5, 6, 8, 10],
    romans: ['i°', 'II', 'iii', 'iv', 'V', 'VI', 'vii'],
    qualities: ['diminished', 'Major', 'minor', 'minor', 'Major', 'Major', 'minor'],
    suffixes: ['dim', '', 'm', 'm', '', '', 'm'],
    functions: ['Tonic', 'Supertonic', 'Mediant', 'Subdominant', 'Dominant', 'Submediant', 'Subtonic']
  }
};

const CHORD_QUALITIES = [
  { label: 'Major Triad', val: 'Major' },
  { label: 'Minor Triad', val: 'minor' },
  { label: 'Diminished', val: 'diminished' },
  { label: 'Augmented', val: 'augmented' },
  { label: 'Dominant 7th', val: '7' },
  { label: 'Major 7th', val: 'maj7' },
  { label: 'Minor 7th', val: 'm7' },
  { label: 'Half-Diminished 7th', val: 'm7b5' },
  { label: 'Diminished 7th', val: 'dim7' },
  { label: 'Suspended 4th', val: 'sus4' },
  { label: 'Suspended 2nd', val: 'sus2' }
];

const PRESETS = [
  {
    name: 'Pop Loop (I - V - vi - IV)',
    mode: 'major',
    degrees: [0, 4, 5, 3]
  },
  {
    name: 'Jazz Turnaround (ii - V - I - I)',
    mode: 'major',
    degrees: [1, 4, 0, 0]
  },
  {
    name: 'Andalusian Cadence (i - VII - VI - V)',
    mode: 'minor',
    degrees: [0, 6, 5, 4]
  },
  {
    name: 'Royal Road (IV - V - iii - vi)',
    mode: 'major',
    degrees: [3, 4, 2, 5]
  },
  {
    name: 'Classic 50s (I - vi - IV - V)',
    mode: 'major',
    degrees: [0, 5, 3, 4]
  },
  {
    name: 'Epic Progression (vi - IV - I - V)',
    mode: 'major',
    degrees: [5, 3, 0, 4]
  },
  {
    name: 'Dorian Groove (i - IV - i - IV)',
    mode: 'dorian',
    degrees: [0, 3, 0, 3]
  }
];

const SUGGESTIONS_MAP = {
  'Tonic': ['Subdominant', 'Dominant', 'Submediant', 'Supertonic'],
  'Supertonic': ['Dominant', 'Leading Tone', 'Tonic'],
  'Mediant': ['Submediant', 'Subdominant', 'Tonic'],
  'Subdominant': ['Dominant', 'Tonic', 'Supertonic'],
  'Dominant': ['Tonic', 'Submediant', 'Subdominant'],
  'Submediant': ['Subdominant', 'Supertonic', 'Dominant'],
  'Leading Tone': ['Tonic', 'Mediant'],
  'Subtonic': ['Tonic', 'Mediant', 'Subdominant']
};

const getOrdinalSuffix = (i) => {
  const j = i % 10;
  const k = i % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
};

const getChordMidiNotes = (rootIndex, qualityName) => {
  const baseMidi = 48 + rootIndex; // C3 to B3 base
  let offsets = [0, 4, 7, 12];
  
  switch (qualityName.toLowerCase()) {
    case 'major':
    case '':
      offsets = [0, 4, 7, 12];
      break;
    case 'minor':
    case 'min':
    case 'm':
      offsets = [0, 3, 7, 12];
      break;
    case 'diminished':
    case 'dim':
    case '°':
      offsets = [0, 3, 6, 12];
      break;
    case 'augmented':
    case 'aug':
    case '+':
      offsets = [0, 4, 8, 12];
      break;
    case 'maj7':
    case 'major 7th':
    case 'major7':
      offsets = [0, 4, 7, 11];
      break;
    case 'm7':
    case 'minor 7th':
    case 'minor7':
      offsets = [0, 3, 7, 10];
      break;
    case '7':
    case 'dominant 7th':
    case 'dominant':
      offsets = [0, 4, 7, 10];
      break;
    case 'm7b5':
    case 'half-diminished':
    case 'half-diminished 7th':
      offsets = [0, 3, 6, 10];
      break;
    case 'dim7':
    case 'diminished 7th':
      offsets = [0, 3, 6, 9];
      break;
    case 'sus2':
      offsets = [0, 2, 7, 12];
      break;
    case 'sus4':
      offsets = [0, 5, 7, 12];
      break;
    default:
      offsets = [0, 4, 7, 12];
  }
  return offsets.map(o => baseMidi + o);
};

// ─── Styled Components (Neo-Brutalism) ────────────────────────────────────────

const PageContainer = styled(Box)({
  maxWidth: 1400,
  margin: '0 auto',
  padding: '0 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const BrutalCard = styled(Box)({
  background: 'rgba(255, 253, 245, 0.95)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

const ControlPanel = styled(Box)({
  background: 'var(--brutal-mint)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  borderRadius: 4,
  padding: '16px 20px',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '16px',
  alignItems: 'center',
});

const SelectWrapper = styled(FormControl)({
  minWidth: 150,
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 900,
    fontSize: '0.9rem',
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'var(--brutal-yellow)' },
    '&.Mui-focused': { backgroundColor: 'var(--brutal-yellow)', boxShadow: 'none' },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 900,
    color: 'var(--brutal-ink)',
  },
});

const BrutalButton = styled(Button)(({ bgcolor = 'var(--brutal-yellow)', hovercolor = 'var(--brutal-pink)' }) => ({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: bgcolor,
  color: 'var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  fontWeight: 900,
  textTransform: 'none',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  '&:hover': { background: hovercolor, transform: 'translate(2px,2px)', boxShadow: 'none' },
  '&:disabled': { opacity: 0.5 },
}));

const TimelineContainer = styled(Box)({
  display: 'flex',
  gap: '16px',
  padding: '12px 4px',
  overflowX: 'auto',
  minHeight: '160px',
  alignItems: 'center',
});

const ChordCard = styled(Box)(({ isactive, isplaying }) => ({
  flex: '0 0 160px',
  height: '140px',
  background: isplaying 
    ? 'var(--brutal-pink)' 
    : isactive 
      ? 'var(--brutal-yellow)' 
      : 'var(--brutal-paper)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: isactive ? 'none' : 'var(--brutal-shadow-small)',
  transform: isactive ? 'translate(3px, 3px)' : 'none',
  borderRadius: 4,
  padding: '12px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  transition: 'all 0.15s ease',
  position: 'relative',
  '&:hover': {
    backgroundColor: isactive ? 'var(--brutal-yellow)' : 'var(--brutal-blue)',
  }
}));

const ChordCardControls = styled(Box)({
  position: 'absolute',
  top: '-15px',
  right: '4px',
  display: 'flex',
  gap: '4px',
});

const MiniIconButton = styled(IconButton)({
  backgroundColor: 'var(--brutal-paper)',
  border: '2px solid var(--brutal-ink)',
  boxShadow: '1px 1px 0 var(--brutal-ink)',
  width: '24px',
  height: '24px',
  padding: '2px',
  '&:hover': {
    backgroundColor: 'var(--brutal-yellow)',
    transform: 'translate(1px, 1px)',
    boxShadow: 'none',
  }
});

const SuggestionChip = styled(Chip)({
  border: '3px solid var(--brutal-ink)',
  fontWeight: 800,
  borderRadius: 4,
  fontSize: '0.9rem',
  boxShadow: '2px 2px 0 var(--brutal-ink)',
  backgroundColor: 'var(--brutal-paper)',
  cursor: 'pointer',
  padding: '6px 4px',
  height: 'auto',
  transition: 'transform 0.1s ease',
  '&:hover': {
    backgroundColor: 'var(--brutal-blue)',
    transform: 'translate(-2px, -2px)',
    boxShadow: '4px 4px 0 var(--brutal-ink)',
  },
  '&:active': {
    transform: 'translate(0, 0)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
  }
});

// ─── Component ─────────────────────────────────────────────────────────────────

export const calculateRomanNumeral = (chordRootIndex, quality, keyIndex, modeVal) => {
  const diff = (chordRootIndex - keyIndex + 12) % 12;
  const romanRootsMajor = {
    0: 'I', 1: 'bII', 2: 'II', 3: 'bIII', 4: 'III', 5: 'IV', 6: '#IV', 7: 'V', 8: 'bVI', 9: 'VI', 10: 'bVII', 11: 'VII'
  };
  const romanRootsMinor = {
    0: 'i', 1: 'bII', 2: 'ii', 3: 'III', 4: 'iii', 5: 'iv', 6: 'bV', 7: 'v', 8: 'VI', 9: 'vi', 10: 'VII', 11: 'vii'
  };
  
  let romanRoot = (modeVal === 'minor' || modeVal === 'dorian' || modeVal === 'phrygian' || modeVal === 'locrian')
    ? romanRootsMinor[diff]
    : romanRootsMajor[diff];
    
  const isMinorLike = quality.toLowerCase().includes('minor') || quality.toLowerCase() === 'm' || quality.toLowerCase().includes('dim') || quality.toLowerCase().includes('m7') || quality.toLowerCase().includes('o7') || quality.toLowerCase().includes('ø7');
  if (isMinorLike) {
    romanRoot = romanRoot.toLowerCase();
  } else {
    romanRoot = romanRoot.toUpperCase();
  }
  
  let suffix = '';
  if (quality.toLowerCase().includes('maj7')) suffix = 'maj7';
  else if (quality.toLowerCase().includes('m7b5')) suffix = 'ø7';
  else if (quality.toLowerCase().includes('dim7')) suffix = 'o7';
  else if (quality.toLowerCase().includes('dim') || quality.toLowerCase() === '°') suffix = '°';
  else if (quality.toLowerCase().includes('m7')) suffix = '7';
  else if (quality.toLowerCase() === '7') suffix = '7';
  else if (quality.toLowerCase().includes('sus4')) suffix = 'sus4';
  else if (quality.toLowerCase().includes('sus2')) suffix = 'sus2';
  else if (quality.toLowerCase().includes('aug') || quality.toLowerCase() === '+') suffix = '+';
  
  return `${romanRoot}${suffix}`;
};

const ProgressionGenerator = () => {
  // State variables
  const [keyIndex, setKeyIndex] = useState(0); // 0 = C
  const [modeVal, setModeVal] = useState('major');
  const [viewMode, setViewMode] = useState('notation'); // notation | roman | degree
  const [bpm, setBpm] = useState(120);

  const getVisualizerUrl = (instrument, step) => {
    const keySlug = NOTES_SHARPS[step.rootIndex].replace('#', 'sharp');
    let typeCode = 'M';
    const q = step.quality.toLowerCase();
    if (q === 'minor' || q === 'min' || q === 'm') typeCode = 'm';
    else if (q === 'diminished' || q === 'dim' || q === '°') typeCode = 'dim';
    else if (q === 'augmented' || q === 'aug' || q === '+') typeCode = 'aug';
    else if (q === '7') typeCode = '7';
    else if (q === 'maj7') typeCode = 'maj7';
    else if (q === 'm7') typeCode = 'm7';
    else if (q === 'm7b5') typeCode = 'm7b5';
    else if (q === 'dim7') typeCode = 'dim7';
    else if (q === 'sus4') typeCode = 'sus4';
    else if (q === 'sus2') typeCode = 'sus2';

    const display = viewMode === 'roman' ? 'intervals' : 'notes';
    return `/play/${instrument}/${keySlug}/chord/${typeCode}/${display}`;
  };

  const getScaleVisualizerUrl = (instrument) => {
    const keySlug = NOTES_SHARPS[keyIndex].replace('#', 'sharp');
    const display = viewMode === 'roman' ? 'intervals' : 'notes';
    
    let scaleTypeVal = 'major';
    let modeSlug = '';
    
    if (modeVal === 'minor') {
      scaleTypeVal = 'minor';
    } else if (modeVal === 'dorian') {
      scaleTypeVal = 'major';
      modeSlug = 'dorian';
    } else if (modeVal === 'phrygian') {
      scaleTypeVal = 'major';
      modeSlug = 'phrygian';
    } else if (modeVal === 'lydian') {
      scaleTypeVal = 'major';
      modeSlug = 'lydian';
    } else if (modeVal === 'mixolydian') {
      scaleTypeVal = 'major';
      modeSlug = 'mixolydian';
    } else if (modeVal === 'locrian') {
      scaleTypeVal = 'major';
      modeSlug = 'locrian';
    }
    
    let url = `/play/${instrument}/${keySlug}/scale/${scaleTypeVal}/${display}`;
    if (modeSlug) {
      url += `/${modeSlug}`;
    }
    return url;
  };
  
  // Audio Playback
  const [player, setPlayer] = useState(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const timerRef = useRef(null);

  // Active progression steps
  const [progression, setProgression] = useState([]);
  const [activeStepIndex, setActiveStepIndex] = useState(null);

  // Custom Chord Editor States
  const [editRoot, setEditRoot] = useState(0);
  const [editQuality, setEditQuality] = useState('Major');

  // Songwriter & Lyrics
  const [sections, setSections] = useState([
    { id: '1', type: 'Verse', text: '[C] Yesterday, all my [G] troubles seemed so [Am] far away.\n[F] Now it looks as though they\'re [C] here to stay.' },
    { id: '2', type: 'Chorus', text: '[Am] Oh, I [D7] believe in [F] yester[C]day.' }
  ]);
  const [activeSectionId, setActiveSectionId] = useState('1');
  const [songwriterTab, setSongwriterTab] = useState('edit'); // edit | preview
  const lyricTextareaRef = useRef(null);

  // Graph vis-network
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const nodesDataSetRef = useRef(null);
  const edgesDataSetRef = useRef(null);

  const progressionRef = useRef(null);
  const loadPresetRef = useRef(null);
  const diatonicChordsRef = useRef(null);
  const triggerChordSoundRef = useRef(null);
  const addChordToProgressionRef = useRef(null);

  // Helper flags
  const preferFlats = useMemo(() => [1, 3, 5, 8, 10].includes(keyIndex), [keyIndex]);
  const activeKeyName = preferFlats ? NOTES_FLATS[keyIndex] : NOTES_SHARPS[keyIndex];

  // 1. Harmonized scale chords (diatonics)
  const diatonicChords = useMemo(() => {
    return getDiatonicChords(keyIndex, modeVal, preferFlats);
  }, [keyIndex, modeVal, preferFlats]);

  const [shareButtonText, setShareButtonText] = useState('Share Jam');

  const shareProgression = () => {
    try {
      const dataToEncode = {
        keyIndex,
        modeVal,
        bpm,
        progression: progression.map(c => ({
          rootIndex: c.rootIndex,
          quality: c.quality,
          chordName: c.chordName,
          degreeIndex: c.degreeIndex,
          isCustom: c.isCustom
        })),
        sections: sections.map(s => ({
          id: s.id,
          type: s.type,
          text: s.text
        }))
      };

      const jsonStr = JSON.stringify(dataToEncode);
      const base64Str = btoa(unescape(encodeURIComponent(jsonStr)));
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${base64Str}`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareButtonText('Copied Link!');
        setTimeout(() => {
          setShareButtonText('Share Jam');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert(`Copy this URL to share:\n\n${shareUrl}`);
      });
    } catch (err) {
      console.error('Failed to generate share URL: ', err);
    }
  };

  // Load default progression once or when key/mode changes (if empty), or load shared URL progression
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const shareData = urlParams.get('share');
      if (shareData) {
        try {
          const decodedJSON = decodeURIComponent(escape(atob(shareData)));
          const parsed = JSON.parse(decodedJSON);
          if (parsed) {
            if (parsed.keyIndex !== undefined) setKeyIndex(Number(parsed.keyIndex));
            if (parsed.modeVal) setModeVal(parsed.modeVal);
            if (parsed.bpm) setBpm(Number(parsed.bpm));
            if (Array.isArray(parsed.progression)) {
              const loadedProg = parsed.progression.map(c => {
                const rRoot = c.rootIndex;
                const rQual = c.quality;
                const rRoman = calculateRomanNumeral(rRoot, rQual, parsed.keyIndex || 0, parsed.modeVal || 'major');
                return {
                  id: Math.random().toString(36).substr(2, 9),
                  rootIndex: rRoot,
                  quality: rQual,
                  chordName: c.chordName,
                  roman: rRoman,
                  functionName: c.functionName || 'Custom',
                  degreeName: c.degreeName || 'Custom',
                  degreeIndex: c.degreeIndex,
                  isCustom: !!c.isCustom
                };
              });
              setProgression(loadedProg);
            }
            if (Array.isArray(parsed.sections)) {
              setSections(parsed.sections);
              if (parsed.sections.length > 0) {
                setActiveSectionId(parsed.sections[0].id);
              }
            }
            return;
          }
        } catch (e) {
          console.error("Failed to decode shared progression parameter:", e);
        }
      }
    }

    if (progressionRef.current.length === 0) {
      loadPresetRef.current(PRESETS[0]);
    }
  }, []);

  // Track user key and page affinity
  useEffect(() => {
    trackAffinity({
      preferredKey: activeKeyName,
      preferredPage: '/play/progression',
      preferredComponent: 'timeline'
    });
  }, [activeKeyName]);

  // Sync edit form with selected progression step
  useEffect(() => {
    if (activeStepIndex !== null && progression[activeStepIndex]) {
      const step = progression[activeStepIndex];
      setEditRoot(step.rootIndex);
      setEditQuality(step.quality);
    }
  }, [activeStepIndex, progression]);

  // Load soundfont player
  const loadPlayer = async () => {
    if (player) return player;
    setAudioLoading(true);
    try {
      const p = await getSoundfontInstrument('acoustic_grand_piano');
      setPlayer(p);
      setAudioLoading(false);
      return p;
    } catch (err) {
      console.error('Failed to load Soundfont player:', err);
      setAudioLoading(false);
      return null;
    }
  };

  // Play a chord
  const triggerChordSound = async (chord) => {
    const p = player || (await loadPlayer());
    if (!p) return;
    
    // Play notes
    const midiNotes = getChordMidiNotes(chord.rootIndex, chord.quality);
    midiNotes.forEach(midi => {
      const octave = Math.floor(midi / 12) - 1;
      const noteIdx = midi % 12;
      const noteName = getNoteName(noteIdx, preferFlats);
      const noteLabel = `${noteName}${octave}`;
      p.play(noteLabel);
    });
  };

  // Custom Roman Numeral calculation
  const getRomanNumeral = useCallback((chordRootIndex, quality) => {
    return calculateRomanNumeral(chordRootIndex, quality, keyIndex, modeVal);
  }, [keyIndex, modeVal]);

  // Load Preset progression
  const loadPreset = (preset) => {
    setModeVal(preset.mode);
    const presetDiatonics = getDiatonicChords(keyIndex, preset.mode, preferFlats);
    const newProg = preset.degrees.map((degIdx) => {
      const dia = presetDiatonics[degIdx];
      return {
        id: Math.random().toString(36).substr(2, 9),
        rootIndex: dia.rootIndex,
        quality: dia.quality,
        chordName: dia.chordName,
        roman: dia.roman,
        functionName: dia.functionName,
        degreeName: dia.degreeName,
        degreeIndex: dia.degreeIndex,
        isCustom: false
      };
    });
    setProgression(newProg);
    setActiveStepIndex(null);
    stopPlayback();
  };

  // Add Chord to progression
  const addChordToProgression = (chord, indexToInsert = null) => {
    const isCustom = chord.degreeIndex === undefined;
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      rootIndex: chord.rootIndex,
      quality: chord.quality || 'Major',
      chordName: chord.chordName || `${preferFlats ? NOTES_FLATS[chord.rootIndex] : NOTES_SHARPS[chord.rootIndex]}${chord.quality === 'minor' ? 'm' : chord.quality === 'diminished' ? 'dim' : ''}`,
      roman: chord.roman || getRomanNumeral(chord.rootIndex, chord.quality || 'Major'),
      functionName: chord.functionName || 'Custom',
      degreeName: chord.degreeName || 'Custom',
      degreeIndex: chord.degreeIndex,
      isCustom: isCustom
    };

    if (indexToInsert !== null) {
      const nextProg = [...progression];
      nextProg.splice(indexToInsert + 1, 0, newStep);
      setProgression(nextProg);
      setActiveStepIndex(indexToInsert + 1);
    } else {
      setProgression([...progression, newStep]);
      setActiveStepIndex(progression.length);
    }
    triggerChordSound(newStep);
  };

  // Delete Chord Step
  const deleteStep = (index, e) => {
    if (e) e.stopPropagation();
    const nextProg = progression.filter((_, idx) => idx !== index);
    setProgression(nextProg);
    if (activeStepIndex === index) {
      setActiveStepIndex(null);
    } else if (activeStepIndex > index) {
      setActiveStepIndex(activeStepIndex - 1);
    }
  };

  // Reorder Chords
  const moveStep = (index, direction, e) => {
    if (e) e.stopPropagation();
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= progression.length) return;

    const nextProg = [...progression];
    const temp = nextProg[index];
    nextProg[index] = nextProg[newIndex];
    nextProg[newIndex] = temp;
    setProgression(nextProg);

    if (activeStepIndex === index) {
      setActiveStepIndex(newIndex);
    } else if (activeStepIndex === newIndex) {
      setActiveStepIndex(index);
    }
  };

  // Edit custom chord values
  const handleUpdateCustomChord = (newRoot, newQuality) => {
    if (activeStepIndex === null) return;
    const rootName = preferFlats ? NOTES_FLATS[newRoot] : NOTES_SHARPS[newRoot];
    
    // Find suffix mapping
    let suffix = '';
    if (newQuality === 'minor') suffix = 'm';
    else if (newQuality === 'diminished') suffix = 'dim';
    else if (newQuality === 'augmented') suffix = 'aug';
    else if (newQuality === '7') suffix = '7';
    else if (newQuality === 'maj7') suffix = 'maj7';
    else if (newQuality === 'm7') suffix = 'm7';
    else if (newQuality === 'm7b5') suffix = 'm7b5';
    else if (newQuality === 'dim7') suffix = 'dim7';
    else if (newQuality === 'sus4') suffix = 'sus4';
    else if (newQuality === 'sus2') suffix = 'sus2';

    const customName = `${rootName}${suffix}`;
    const customRoman = getRomanNumeral(newRoot, newQuality);

    // Check if this edited chord matches any diatonic in current scale
    const matchingDia = diatonicChords.find(d => d.rootIndex === newRoot && d.quality === newQuality);

    const updatedProg = [...progression];
    updatedProg[activeStepIndex] = {
      ...updatedProg[activeStepIndex],
      rootIndex: newRoot,
      quality: newQuality,
      chordName: customName,
      roman: customRoman,
      functionName: matchingDia ? matchingDia.functionName : 'Borrowed',
      degreeName: matchingDia ? matchingDia.degreeName : 'Non-diatonic',
      degreeIndex: matchingDia ? matchingDia.degreeIndex : undefined,
      isCustom: !matchingDia
    };

    setProgression(updatedProg);
    triggerChordSound(updatedProg[activeStepIndex]);
  };

  // Playback Loop
  const startPlayback = async () => {
    if (progression.length === 0) return;
    setIsPlaying(true);
    
    const p = player || (await loadPlayer());
    if (!p) {
      setIsPlaying(false);
      return;
    }

    let currentIndex = 0;
    setCurrentPlayingIndex(0);
    triggerChordSound(progression[0]);

    const stepInterval = (60 / bpm) * 1000 * 4; // Assuming 4 beats per chord (1 bar)
    
    timerRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % progression.length;
      setCurrentPlayingIndex(currentIndex);
      triggerChordSound(progression[currentIndex]);
    }, stepInterval);
  };

  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    setCurrentPlayingIndex(-1);
  };

  progressionRef.current = progression;
  loadPresetRef.current = loadPreset;
  diatonicChordsRef.current = diatonicChords;
  triggerChordSoundRef.current = triggerChordSound;
  addChordToProgressionRef.current = addChordToProgression;

  // Continuous Suggestions Calculation
  const suggestions = useMemo(() => {
    if (progression.length === 0) return [];
    
    // Suggest based on active selected step or the last chord step
    const targetStep = activeStepIndex !== null ? progression[activeStepIndex] : progression[progression.length - 1];
    if (!targetStep) return [];

    const suggestionsList = [];
    
    // 1. Diatonic suggestions based on scale degree function
    const currentFunction = targetStep.functionName;
    const recommendedFunctions = SUGGESTIONS_MAP[currentFunction] || ['Tonic'];
    
    diatonicChords.forEach(dia => {
      if (recommendedFunctions.includes(dia.functionName) && dia.chordName !== targetStep.chordName) {
        suggestionsList.push({
          ...dia,
          source: 'diatonic'
        });
      }
    });

    // 2. Add Modal Interchange / Borrowed chords
    const chordRootName = preferFlats ? NOTES_FLATS[targetStep.rootIndex] : NOTES_SHARPS[targetStep.rootIndex];
    if (modeVal === 'major') {
      // Add standard flat-VI (bVI) and flat-VII (bVII) borrowed from parallel minor
      const flatSevenIdx = (keyIndex + 10) % 12;
      const flatSixIdx = (keyIndex + 8) % 12;
      const minorFourIdx = (keyIndex + 5) % 12;

      suggestionsList.push({
        rootIndex: flatSevenIdx,
        quality: 'Major',
        chordName: `${preferFlats ? NOTES_FLATS[flatSevenIdx] : NOTES_SHARPS[flatSevenIdx]}`,
        roman: 'bVII',
        functionName: 'Borrowed',
        degreeName: 'Modal Interchange',
        source: 'borrowed'
      });
      suggestionsList.push({
        rootIndex: flatSixIdx,
        quality: 'Major',
        chordName: `${preferFlats ? NOTES_FLATS[flatSixIdx] : NOTES_SHARPS[flatSixIdx]}`,
        roman: 'bVI',
        functionName: 'Borrowed',
        degreeName: 'Modal Interchange',
        source: 'borrowed'
      });
      suggestionsList.push({
        rootIndex: minorFourIdx,
        quality: 'minor',
        chordName: `${preferFlats ? NOTES_FLATS[minorFourIdx] : NOTES_SHARPS[minorFourIdx]}m`,
        roman: 'iv',
        functionName: 'Borrowed',
        degreeName: 'Modal Interchange',
        source: 'borrowed'
      });
    } else if (modeVal === 'minor') {
      // Borrow V major from Harmonic minor
      const majorFiveIdx = (keyIndex + 7) % 12;
      suggestionsList.push({
        rootIndex: majorFiveIdx,
        quality: 'Major',
        chordName: `${preferFlats ? NOTES_FLATS[majorFiveIdx] : NOTES_SHARPS[majorFiveIdx]}`,
        roman: 'V',
        functionName: 'Dominant',
        degreeName: 'Harmonic Minor',
        source: 'borrowed'
      });
    }

    // 3. Add Secondary Dominants
    // V of V (dominant of degree 5)
    const domOfFiveIdx = (keyIndex + 2) % 12; // D7 in C Major
    suggestionsList.push({
      rootIndex: domOfFiveIdx,
      quality: '7',
      chordName: `${preferFlats ? NOTES_FLATS[domOfFiveIdx] : NOTES_SHARPS[domOfFiveIdx]}7`,
      roman: 'V7/V',
      functionName: 'Secondary Dominant',
      degreeName: 'Secondary Dominant',
      source: 'sec-dom'
    });

    // V of vi
    const domOfSixIdx = (keyIndex + 4) % 12; // E7 in C Major
    suggestionsList.push({
      rootIndex: domOfSixIdx,
      quality: '7',
      chordName: `${preferFlats ? NOTES_FLATS[domOfSixIdx] : NOTES_SHARPS[domOfSixIdx]}7`,
      roman: 'V7/vi',
      functionName: 'Secondary Dominant',
      degreeName: 'Secondary Dominant',
      source: 'sec-dom'
    });

    // Remove duplicates
    const uniqueList = [];
    const seenNames = new Set();
    suggestionsList.forEach(s => {
      if (!seenNames.has(s.chordName)) {
        seenNames.add(s.chordName);
        uniqueList.push(s);
      }
    });

    return uniqueList.slice(0, 6); // Cap at 6 suggestions
  }, [progression, activeStepIndex, diatonicChords, keyIndex, modeVal, preferFlats]);

  // Clean up playback on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Network Diagram (vis-network) Configuration ──────────────────────────────

  const visNodesAndEdges = useMemo(() => {
    // 7 Diatonic Nodes
    const nodePositions = [
      { x: 0, y: -160 },   // I / i
      { x: 130, y: -90 },  // ii / ii°
      { x: 160, y: 70 },   // iii / III
      { x: 70, y: 160 },   // IV / iv
      { x: -70, y: 160 },  // V / v
      { x: -160, y: 70 },  // vi / VI
      { x: -130, y: -90 }  // vii° / VII
    ];

    const nodes = diatonicChords.map((chord, idx) => {
      const isCurrentlySelected = activeStepIndex !== null && progression[activeStepIndex] && progression[activeStepIndex].degreeIndex === idx && !progression[activeStepIndex].isCustom;
      const isCurrentlyPlaying = currentPlayingIndex !== -1 && progression[currentPlayingIndex] && progression[currentPlayingIndex].degreeIndex === idx && !progression[currentPlayingIndex].isCustom;
      
      let background = 'var(--brutal-paper)';
      let border = 'var(--brutal-ink)';
      let borderWidth = 3;
      let fontColor = 'var(--brutal-ink)';

      if (isCurrentlyPlaying) {
        background = 'var(--brutal-pink)';
        borderWidth = 5;
      } else if (isCurrentlySelected) {
        background = 'var(--brutal-yellow)';
        borderWidth = 5;
      } else {
        // Base category color
        if (chord.functionName === 'Tonic') background = '#fffdcc'; // Soft yellow
        else if (chord.functionName === 'Subdominant' || chord.functionName === 'Supertonic') background = 'var(--brutal-blue)'; // Soft blue
        else if (chord.functionName === 'Dominant' || chord.functionName === 'Leading Tone') background = '#ffcccc'; // Soft pink
        else background = 'var(--brutal-mint)';
      }

      return {
        id: `diatonic-${idx}`,
        label: `${chord.chordName}\n[${chord.roman}]`,
        x: nodePositions[idx].x,
        y: nodePositions[idx].y,
        shape: 'box',
        margin: 12,
        borderWidth: borderWidth,
        color: {
          background,
          border,
          highlight: {
            background: 'var(--brutal-yellow)',
            border: 'var(--brutal-ink)'
          }
        },
        font: {
          size: 14,
          face: 'Arial, sans-serif',
          color: fontColor,
          bold: true
        },
        shadow: {
          enabled: true,
          color: 'var(--brutal-ink)',
          size: 0,
          x: 4,
          y: 4
        }
      };
    });

    // Base Diatonic Edges (Harmonic paths)
    const baseEdges = [
      { from: 'diatonic-0', to: 'diatonic-3', label: 'to IV' }, // I -> IV
      { from: 'diatonic-0', to: 'diatonic-4', label: 'to V' },  // I -> V
      { from: 'diatonic-0', to: 'diatonic-5', label: 'to vi' }, // I -> vi
      { from: 'diatonic-1', to: 'diatonic-4', label: 'to V' },  // ii -> V
      { from: 'diatonic-2', to: 'diatonic-5', label: 'to vi' }, // iii -> vi
      { from: 'diatonic-3', to: 'diatonic-4', label: 'to V' },  // IV -> V
      { from: 'diatonic-3', to: 'diatonic-0', label: 'to I' },  // IV -> I
      { from: 'diatonic-4', to: 'diatonic-0', label: 'to I' },  // V -> I
      { from: 'diatonic-4', to: 'diatonic-5', label: 'to vi' }, // V -> vi
      { from: 'diatonic-5', to: 'diatonic-3', label: 'to IV' }, // vi -> IV
      { from: 'diatonic-5', to: 'diatonic-1', label: 'to ii' }, // vi -> ii
      { from: 'diatonic-6', to: 'diatonic-0', label: 'to I' }   // vii -> I
    ].map((edge, idx) => ({
      id: `base-edge-${idx}`,
      from: edge.from,
      to: edge.to,
      label: edge.label,
      arrows: 'to',
      color: { color: 'rgba(17, 17, 17, 0.25)', highlight: 'var(--brutal-ink)' },
      width: 1.5,
      font: { size: 10, align: 'middle', color: '#666', background: 'var(--brutal-paper)' }
    }));

    // Active progression path edges overlay
    const progressionPathEdges = [];
    for (let i = 0; i < progression.length - 1; i++) {
      const fromStep = progression[i];
      const toStep = progression[i + 1];

      if (fromStep.degreeIndex !== undefined && toStep.degreeIndex !== undefined && !fromStep.isCustom && !toStep.isCustom) {
        progressionPathEdges.push({
          id: `path-edge-${i}`,
          from: `diatonic-${fromStep.degreeIndex}`,
          to: `diatonic-${toStep.degreeIndex}`,
          label: `Step ${i + 1}➔${i + 2}`,
          arrows: 'to',
          color: { color: 'var(--brutal-pink)', highlight: 'var(--brutal-pink)' },
          width: 4,
          dashes: true,
          smooth: {
            type: 'curvedCW',
            roundness: 0.15 + (i * 0.08)
          },
          font: { size: 11, align: 'top', color: 'var(--brutal-ink)', bold: true, background: 'var(--brutal-yellow)' }
        });
      }
    }

    return { nodes, edges: [...baseEdges, ...progressionPathEdges] };
  }, [diatonicChords, progression, activeStepIndex, currentPlayingIndex]);

  // Handle vis-network rendering
  useEffect(() => {
    if (!containerRef.current) return;

    if (networkRef.current) {
      networkRef.current.destroy();
      networkRef.current = null;
    }

    const { nodes, edges } = visNodesAndEdges;
    const nodesDataSet = new DataSet(nodes);
    const edgesDataSet = new DataSet(edges);

    nodesDataSetRef.current = nodesDataSet;
    edgesDataSetRef.current = edgesDataSet;

    const options = {
      physics: {
        enabled: false // Fix nodes in place for stable circle layout
      },
      edges: {
        smooth: {
          type: 'continuous',
          roundness: 0.2
        }
      },
      interaction: {
        hover: true,
        zoomView: true,
        dragView: true,
        selectConnectedEdges: false
      }
    };

    const network = new Network(containerRef.current, { nodes: nodesDataSet, edges: edgesDataSet }, options);
    networkRef.current = network;

    // Handle single node clicks
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const idx = parseInt(nodeId.split('-')[1]);
        const selectedChord = diatonicChordsRef.current[idx];
        if (selectedChord) {
          triggerChordSoundRef.current(selectedChord);
          addChordToProgressionRef.current(selectedChord);
        }
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [visNodesAndEdges]);

  // ─── Lyrics Parser & Formatted Output ──────────────────────────────────────────

  const handleInsertChordToLyrics = (chordName) => {
    const textarea = lyricTextareaRef.current;
    if (!textarea) return;

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const text = textarea.value;

    const chordToken = `[${chordName}]`;
    const updatedText = text.substring(0, startPos) + chordToken + text.substring(endPos);
    
    // Update active section lyrics
    const updatedSections = sections.map(sec => {
      if (sec.id === activeSectionId) {
        return { ...sec, text: updatedText };
      }
      return sec;
    });
    setSections(updatedSections);

    // Refocus & reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = startPos + chordToken.length;
    }, 50);
  };

  const parseChordProLine = (line) => {
    const tokens = line.split(/(\[[^\]]+\])/);
    const segments = [];
    let activeChord = '';
    
    tokens.forEach(token => {
      if (token.startsWith('[') && token.endsWith(']')) {
        activeChord = token.slice(1, -1);
      } else {
        segments.push({ chord: activeChord, text: token });
        activeChord = '';
      }
    });
    
    if (activeChord) {
      segments.push({ chord: activeChord, text: ' ' });
    }
    return segments;
  };

  const currentSectionLyrics = useMemo(() => {
    const sec = sections.find(s => s.id === activeSectionId);
    return sec ? sec.text : '';
  }, [sections, activeSectionId]);

  const activeSectionType = useMemo(() => {
    const sec = sections.find(s => s.id === activeSectionId);
    return sec ? sec.type : 'Verse';
  }, [sections, activeSectionId]);

  // Unique chords in progression table for lyric insertion palette
  const uniqueProgressionChords = useMemo(() => {
    const names = new Set();
    const chords = [];
    progression.forEach(step => {
      if (!names.has(step.chordName)) {
        names.add(step.chordName);
        chords.push(step);
      }
    });
    return chords;
  }, [progression]);

  // Update text of active section lyrics
  const handleLyricsChange = (e) => {
    const updatedSections = sections.map(sec => {
      if (sec.id === activeSectionId) {
        return { ...sec, text: e.target.value };
      }
      return sec;
    });
    setSections(updatedSections);
  };

  // Add new lyrics section
  const handleAddSection = (type) => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection = {
      id: newId,
      type: type,
      text: ''
    };
    setSections([...sections, newSection]);
    setActiveSectionId(newId);
  };

  // Delete section
  const handleDeleteSection = (id) => {
    if (sections.length <= 1) return;
    const nextSections = sections.filter(s => s.id !== id);
    setSections(nextSections);
    if (activeSectionId === id) {
      setActiveSectionId(nextSections[0].id);
    }
  };

  return (
    <PageContainer>
      {/* Page Title */}
      <Box sx={{ borderBottom: '4px solid var(--brutal-ink)', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -1 }}>
            🎹 Rapid Chord Progression Generator
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 700, opacity: 0.8, mt: 1 }}>
            Compose backing progressions rapidly, experiment with scale degrees, Roman numeral shifts, and write lyrics in style.
          </Typography>
        </Box>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, val) => val && setViewMode(val)}
          sx={{ border: '3px solid var(--brutal-ink)', borderRadius: 1, boxShadow: '2px 2px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}
        >
          <ToggleButton value="notation" sx={{ fontWeight: 900, textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'var(--brutal-yellow)' } }}>
            American (C)
          </ToggleButton>
          <ToggleButton value="roman" sx={{ fontWeight: 900, textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'var(--brutal-yellow)' } }}>
            Roman (I)
          </ToggleButton>
          <ToggleButton value="degree" sx={{ fontWeight: 900, textTransform: 'none', px: 2, '&.Mui-selected': { bgcolor: 'var(--brutal-yellow)' } }}>
            Degree (1st)
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Control Configuration Panel */}
      <ControlPanel>
        <SelectWrapper>
          <InputLabel id="key-label">Key</InputLabel>
          <Select
            labelId="key-label"
            id="key-select"
            value={keyIndex}
            label="Key"
            onChange={(e) => {
              setKeyIndex(e.target.value);
              setActiveStepIndex(null);
              stopPlayback();
            }}
            sx={{ fontWeight: 900 }}
          >
            {NOTES_SHARPS.map((k, i) => (
              <MenuItem key={k} value={i} sx={{ fontWeight: 700 }}>{KEY_DISPLAY[k]}</MenuItem>
            ))}
          </Select>
        </SelectWrapper>

        <SelectWrapper sx={{ minWidth: 200 }}>
          <InputLabel id="mode-label">Mode / Scale</InputLabel>
          <Select
            labelId="mode-label"
            id="mode-select"
            value={modeVal}
            label="Mode / Scale"
            onChange={(e) => {
              setModeVal(e.target.value);
              setActiveStepIndex(null);
              stopPlayback();
            }}
            sx={{ fontWeight: 900 }}
          >
            {MODES.map((m) => (
              <MenuItem key={m.val} value={m.val} sx={{ fontWeight: 700 }}>{m.name}</MenuItem>
            ))}
          </Select>
        </SelectWrapper>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 240, bgcolor: 'var(--brutal-paper)', p: '8px 16px', borderRadius: 1, border: '3px solid var(--brutal-ink)', boxShadow: '2px 2px 0 var(--brutal-ink)' }}>
          <Typography sx={{ fontWeight: 900, fontSize: '0.9rem', color: 'var(--brutal-ink)' }}>Tempo: {bpm} BPM</Typography>
          <Slider
            size="small"
            value={bpm}
            min={60}
            max={240}
            step={1}
            onChange={(e, val) => setBpm(val)}
            sx={{
              color: 'var(--brutal-ink)',
              '& .MuiSlider-thumb': {
                width: 16,
                height: 16,
                backgroundColor: 'var(--brutal-yellow)',
                border: '2px solid var(--brutal-ink)',
                '&:hover, &.Mui-focusVisible': { boxShadow: 'none' },
              },
              '& .MuiSlider-track': { backgroundColor: 'var(--brutal-ink)', height: 6 },
              '& .MuiSlider-rail': { backgroundColor: 'rgba(0,0,0,0.1)', height: 6 },
            }}
          />
        </Box>

        <SelectWrapper sx={{ minWidth: 220 }}>
          <InputLabel id="preset-label" shrink>Load Progression Preset</InputLabel>
          <Select
            labelId="preset-label"
            id="preset-select"
            value=""
            displayEmpty
            label="Load Progression Preset"
            onChange={(e) => {
              const selected = PRESETS.find(p => p.name === e.target.value);
              if (selected) loadPreset(selected);
            }}
            sx={{ fontWeight: 900 }}
          >
            <MenuItem value="" disabled sx={{ fontWeight: 700 }}>-- Choose Preset --</MenuItem>
            {PRESETS.map((p) => (
              <MenuItem key={p.name} value={p.name} sx={{ fontWeight: 700 }}>{p.name}</MenuItem>
            ))}
          </Select>
        </SelectWrapper>
      </ControlPanel>

      {/* Timeline Progression Table */}
      <BrutalCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--brutal-ink)', pb: 1.5, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -0.5 }}>
            🎼 Progression Timeline
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {isPlaying ? (
              <BrutalButton bgcolor="var(--brutal-pink)" onClick={stopPlayback}>
                <StopIcon /> Stop Loop
              </BrutalButton>
            ) : (
              <BrutalButton bgcolor="var(--brutal-yellow)" onClick={startPlayback}>
                <PlayArrowIcon /> Loop Progression
              </BrutalButton>
            )}
            <BrutalButton bgcolor="var(--brutal-blue)" onClick={shareProgression}>
              <ContentCopyIcon /> {shareButtonText}
            </BrutalButton>
            <BrutalButton bgcolor="var(--brutal-paper)" hovercolor="#ff7051" onClick={() => { setProgression([]); setActiveStepIndex(null); stopPlayback(); }}>
              <RestartAltIcon /> Clear All
            </BrutalButton>
          </Box>
        </Box>

        <TimelineContainer>
          {progression.map((step, idx) => {
            const isactive = activeStepIndex === idx ? 1 : 0;
            const isplaying = currentPlayingIndex === idx ? 1 : 0;
            
            // Format labels based on View Mode
            let primaryLabel = step.chordName;
            let subLabel = `${step.roman} (${step.degreeName})`;
            
            if (viewMode === 'roman') {
              primaryLabel = step.roman;
              subLabel = `${step.chordName} (${step.degreeName})`;
            } else if (viewMode === 'degree') {
              primaryLabel = step.degreeName;
              subLabel = `${step.chordName} [${step.roman}]`;
            }

            return (
              <ChordCard 
                key={step.id} 
                isactive={isactive} 
                isplaying={isplaying}
                onClick={() => setActiveStepIndex(idx)}
              >
                <ChordCardControls className="card-controls">
                  <MiniIconButton size="small" onClick={(e) => moveStep(idx, -1, e)} disabled={idx === 0}>
                    <ArrowBackIcon sx={{ fontSize: 12, color: 'var(--brutal-ink)' }} />
                  </MiniIconButton>
                  <MiniIconButton size="small" onClick={(e) => moveStep(idx, 1, e)} disabled={idx === progression.length - 1}>
                    <ArrowForwardIcon sx={{ fontSize: 12, color: 'var(--brutal-ink)' }} />
                  </MiniIconButton>
                  <MiniIconButton size="small" onClick={(e) => deleteStep(idx, e)}>
                    <DeleteIcon sx={{ fontSize: 12, color: 'var(--brutal-ink)' }} />
                  </MiniIconButton>
                </ChordCardControls>

                <Box sx={{ mt: 1 }}>
                  <Typography sx={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--brutal-ink)', lineHeight: 1.1 }}>
                    {primaryLabel}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: 'rgba(0,0,0,0.6)', mt: 0.5 }}>
                    {subLabel}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip 
                    label={step.functionName} 
                    size="small" 
                    sx={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      backgroundColor: 'rgba(0,0,0,0.06)', 
                      border: '1px solid var(--brutal-ink)',
                      borderRadius: 1,
                      height: '18px'
                    }} 
                  />
                  <Typography sx={{ fontSize: '0.8rem', fontWeight: 900 }}>
                    #{idx + 1}
                  </Typography>
                </Box>
              </ChordCard>
            );
          })}

          <Box 
            onClick={() => addChordToProgression(diatonicChords[0])}
            sx={{
              flex: '0 0 160px',
              height: '140px',
              border: '3px dashed rgba(17,17,17,0.4)',
              borderRadius: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
              '&:hover': {
                backgroundColor: 'rgba(17,17,17,0.04)',
                borderColor: 'var(--brutal-ink)'
              }
            }}
          >
            <AddIcon sx={{ fontSize: 32, color: 'rgba(17,17,17,0.5)' }} />
            <Typography sx={{ fontWeight: 800, color: 'rgba(17,17,17,0.6)', fontSize: '0.9rem', mt: 1 }}>Add Step</Typography>
          </Box>
        </TimelineContainer>
      </BrutalCard>

      {/* Progression Builder Dashboard: Suggestions & Custom & Network Graph */}
      <Grid container spacing={3}>
        
        {/* Left Side: Chord Selection and Suggestions */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            
            {/* Chord Selection & Custom Editor */}
            <BrutalCard>
              <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', borderBottom: '3px solid var(--brutal-ink)', pb: 1 }}>
                🛠️ {activeStepIndex !== null ? `Edit Step #${activeStepIndex + 1}` : 'Quick Chord Add'}
              </Typography>

              {activeStepIndex !== null ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
                    Choose a diatonic chord from the active key, or customize it below:
                  </Typography>
                  
                  {/* Diatonic Chord Quick Selector */}
                  <Grid container spacing={1}>
                    {diatonicChords.map(dia => (
                      <Grid item xs={4} sm={3} key={dia.chordName}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => {
                            const updated = [...progression];
                            updated[activeStepIndex] = {
                              ...updated[activeStepIndex],
                              rootIndex: dia.rootIndex,
                              quality: dia.quality,
                              chordName: dia.chordName,
                              roman: dia.roman,
                              functionName: dia.functionName,
                              degreeName: dia.degreeName,
                              degreeIndex: dia.degreeIndex,
                              isCustom: false
                            };
                            setProgression(updated);
                            triggerChordSound(dia);
                          }}
                          sx={{
                            fontWeight: 800,
                            color: 'var(--brutal-ink)',
                            border: '2px solid var(--brutal-ink)',
                            bgcolor: progression[activeStepIndex]?.chordName === dia.chordName ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                            '&:hover': { bgcolor: 'var(--brutal-blue)' }
                          }}
                        >
                          {dia.chordName}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ borderBottomWidth: '2px', borderColor: 'var(--brutal-ink)' }} />

                  {/* Custom Chord Editor Form */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem' }}>
                    Custom Chord Extensions
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <SelectWrapper sx={{ flex: 1 }}>
                      <InputLabel id="edit-root-label">Root Note</InputLabel>
                      <Select
                        labelId="edit-root-label"
                        value={editRoot}
                        label="Root Note"
                        onChange={(e) => {
                          setEditRoot(e.target.value);
                          handleUpdateCustomChord(e.target.value, editQuality);
                        }}
                      >
                        {NOTES_SHARPS.map((n, i) => (
                          <MenuItem key={n} value={i} sx={{ fontWeight: 700 }}>{preferFlats ? NOTES_FLATS[i] : n}</MenuItem>
                        ))}
                      </Select>
                    </SelectWrapper>

                    <SelectWrapper sx={{ flex: 2 }}>
                      <InputLabel id="edit-quality-label">Quality</InputLabel>
                      <Select
                        labelId="edit-quality-label"
                        value={editQuality}
                        label="Quality"
                        onChange={(e) => {
                          setEditQuality(e.target.value);
                          handleUpdateCustomChord(editRoot, e.target.value);
                        }}
                      >
                        {CHORD_QUALITIES.map(q => (
                          <MenuItem key={q.val} value={q.val} sx={{ fontWeight: 700 }}>{q.label}</MenuItem>
                        ))}
                      </Select>
                    </SelectWrapper>
                  </Box>

                  <Divider sx={{ borderBottomWidth: '2px', borderColor: 'var(--brutal-ink)', my: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--brutal-ink)' }}>
                    🔍 Visualize Active Chord
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {[
                      { id: 'guitar', name: 'Guitar', color: 'var(--brutal-blue)' },
                      { id: 'piano', name: 'Piano', color: 'var(--brutal-yellow)' },
                      { id: 'ukulele', name: 'Ukulele', color: 'var(--brutal-mint)' },
                      { id: 'bass', name: 'Bass', color: 'var(--brutal-pink)' }
                    ].map(inst => (
                      <Button
                        key={inst.id}
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(getVisualizerUrl(inst.id, progression[activeStepIndex]), '_blank')}
                        sx={{
                          fontWeight: 850,
                          color: 'var(--brutal-ink)',
                          border: '2px solid var(--brutal-ink)',
                          bgcolor: inst.color,
                          boxShadow: '2px 2px 0 var(--brutal-ink)',
                          '&:hover': { transform: 'translate(1px, 1px)', boxShadow: 'none', bgcolor: inst.color }
                        }}
                      >
                        {inst.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 800, mb: 2 }}>
                    Select a chord step in the timeline above to edit it. Or click any diatonic chord below to append it:
                  </Typography>
                  <Grid container spacing={1}>
                    {diatonicChords.map(dia => (
                      <Grid item xs={4} sm={3} key={`add-${dia.chordName}`}>
                        <Button
                          fullWidth
                          variant="outlined"
                          onClick={() => addChordToProgression(dia)}
                          sx={{
                            fontWeight: 800,
                            color: 'var(--brutal-ink)',
                            border: '2px solid var(--brutal-ink)',
                            bgcolor: 'var(--brutal-paper)',
                            boxShadow: '1px 1px 0 var(--brutal-ink)',
                            '&:hover': { bgcolor: 'var(--brutal-blue)', transform: 'translate(1px, 1px)', boxShadow: 'none' }
                          }}
                        >
                          {dia.chordName}
                        </Button>
                      </Grid>
                    ))}
                  </Grid>

                  <Divider sx={{ borderBottomWidth: '2px', borderColor: 'var(--brutal-ink)', my: 2 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--brutal-ink)' }}>
                    🔍 Visualize Scale ({preferFlats ? NOTES_FLATS[keyIndex] : NOTES_SHARPS[keyIndex]} {MODES.find(m => m.val === modeVal)?.name || modeVal})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    {[
                      { id: 'guitar', name: 'Guitar', color: 'var(--brutal-blue)' },
                      { id: 'piano', name: 'Piano', color: 'var(--brutal-yellow)' },
                      { id: 'ukulele', name: 'Ukulele', color: 'var(--brutal-mint)' },
                      { id: 'bass', name: 'Bass', color: 'var(--brutal-pink)' }
                    ].map(inst => (
                      <Button
                        key={inst.id}
                        variant="outlined"
                        size="small"
                        onClick={() => window.open(getScaleVisualizerUrl(inst.id), '_blank')}
                        sx={{
                          fontWeight: 850,
                          color: 'var(--brutal-ink)',
                          border: '2px solid var(--brutal-ink)',
                          bgcolor: inst.color,
                          boxShadow: '2px 2px 0 var(--brutal-ink)',
                          '&:hover': { transform: 'translate(1px, 1px)', boxShadow: 'none', bgcolor: inst.color }
                        }}
                      >
                        {inst.name}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </BrutalCard>

            {/* Continuous Chord Suggestions */}
            <BrutalCard sx={{ bgcolor: 'var(--brutal-blue)' }}>
              <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', color: 'var(--brutal-ink)', borderBottom: '3px solid var(--brutal-ink)', pb: 1 }}>
                💡 Continuous Suggestions
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800 }}>
                Based on the {activeStepIndex !== null ? `selected step #${activeStepIndex + 1}` : 'last chord'}, these chords transition naturally:
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>
                {suggestions.map((sug, idx) => (
                  <SuggestionChip
                    key={`${sug.chordName}-${idx}`}
                    label={
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 0.5 }}>
                        <Typography sx={{ fontWeight: 900, fontSize: '1.1rem', lineHeight: 1 }}>
                          {sug.chordName}
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', fontWeight: 700, color: 'rgba(0,0,0,0.6)' }}>
                          {sug.roman} • {sug.functionName}
                        </Typography>
                      </Box>
                    }
                    onClick={() => addChordToProgression(sug, activeStepIndex)}
                  />
                ))}
                {suggestions.length === 0 && (
                  <Typography sx={{ fontWeight: 800, fontStyle: 'italic' }}>
                    Add chords to the timeline to get suggestions!
                  </Typography>
                )}
              </Box>
            </BrutalCard>

          </Box>
        </Grid>

        {/* Right Side: Chord Connections Network Diagram */}
        <Grid item xs={12} md={6}>
          <BrutalCard sx={{ height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--brutal-ink)', pb: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                🔗 Chord Connection Network
              </Typography>
              <Tooltip title="Nodes are scale chords (color shows degree function). Dotted line shows your current progression sequence. Click nodes to play/insert them.">
                <IconButton size="small" sx={{ border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
                  <MusicNoteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>

            <Box
              ref={containerRef}
              sx={{
                width: '100%',
                height: '350px',
                border: '3px solid var(--brutal-ink)',
                borderRadius: 1,
                bgcolor: 'var(--brutal-paper)',
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)',
                position: 'relative'
              }}
            />
          </BrutalCard>
        </Grid>
      </Grid>

      {/* Lyrics & Songwriter Section */}
      <BrutalCard>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid var(--brutal-ink)', pb: 1.5, flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LyricsIcon sx={{ fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: -0.5 }}>
              📝 Lyrics & Songwriter Sheet
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, bgcolor: 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', borderRadius: 1, boxShadow: '2px 2px 0 var(--brutal-ink)' }}>
            <Button
              onClick={() => setSongwriterTab('edit')}
              sx={{
                fontWeight: 900,
                textTransform: 'none',
                color: 'var(--brutal-ink)',
                px: 2,
                borderRadius: 0,
                bgcolor: songwriterTab === 'edit' ? 'var(--brutal-yellow)' : 'transparent',
                '&:hover': { bgcolor: songwriterTab === 'edit' ? 'var(--brutal-yellow)' : 'rgba(0,0,0,0.04)' }
              }}
            >
              <CreateIcon sx={{ fontSize: 16, mr: 1 }} /> Write Mode
            </Button>
            <Divider orientation="vertical" flexItem sx={{ width: '2px', bgcolor: 'var(--brutal-ink)' }} />
            <Button
              onClick={() => setSongwriterTab('preview')}
              sx={{
                fontWeight: 900,
                textTransform: 'none',
                color: 'var(--brutal-ink)',
                px: 2,
                borderRadius: 0,
                bgcolor: songwriterTab === 'preview' ? 'var(--brutal-yellow)' : 'transparent',
                '&:hover': { bgcolor: songwriterTab === 'preview' ? 'var(--brutal-yellow)' : 'rgba(0,0,0,0.04)' }
              }}
            >
              <PreviewIcon sx={{ fontSize: 16, mr: 1 }} /> Performance View
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Section Selector & Manager */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>
                Song Sections
              </Typography>
              
              {sections.map((sec, idx) => (
                <Box
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '3px solid var(--brutal-ink)',
                    borderRadius: 1,
                    p: '8px 12px',
                    cursor: 'pointer',
                    bgcolor: activeSectionId === sec.id ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                    boxShadow: activeSectionId === sec.id ? 'none' : '2px 2px 0 var(--brutal-ink)',
                    transform: activeSectionId === sec.id ? 'translate(2px, 2px)' : 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      bgcolor: activeSectionId === sec.id ? 'var(--brutal-yellow)' : 'var(--brutal-blue)'
                    }
                  }}
                >
                  <Typography sx={{ fontWeight: 900, fontSize: '0.9rem' }}>
                    {sec.type}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSection(sec.id); }} 
                    disabled={sections.length <= 1}
                  >
                    <DeleteIcon sx={{ fontSize: 16, color: 'var(--brutal-ink)' }} />
                  </IconButton>
                </Box>
              ))}

              <Divider sx={{ my: 1, borderBottomWidth: '2px', borderColor: 'var(--brutal-ink)' }} />

              <SelectWrapper fullWidth>
                <InputLabel id="add-sec-label" shrink>Add Section</InputLabel>
                <Select
                  labelId="add-sec-label"
                  value=""
                  onChange={(e) => handleAddSection(e.target.value)}
                  sx={{ fontWeight: 900 }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>-- Choose Section --</MenuItem>
                  <MenuItem value="Intro" sx={{ fontWeight: 700 }}>Intro</MenuItem>
                  <MenuItem value="Verse" sx={{ fontWeight: 700 }}>Verse</MenuItem>
                  <MenuItem value="Pre-Chorus" sx={{ fontWeight: 700 }}>Pre-Chorus</MenuItem>
                  <MenuItem value="Chorus" sx={{ fontWeight: 700 }}>Chorus</MenuItem>
                  <MenuItem value="Bridge" sx={{ fontWeight: 700 }}>Bridge</MenuItem>
                  <MenuItem value="Solo" sx={{ fontWeight: 700 }}>Guitar/Synth Solo</MenuItem>
                  <MenuItem value="Outro" sx={{ fontWeight: 700 }}>Outro</MenuItem>
                </Select>
              </SelectWrapper>
            </Box>
          </Grid>

          {/* Active Section Lyrics Editor/Preview */}
          <Grid item xs={12} md={9}>
            {songwriterTab === 'edit' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                
                {/* Progression Chord Palette for Rapid Insertion */}
                <Box sx={{ bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', p: 1.5, borderRadius: 1 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', mb: 1, textTransform: 'uppercase' }}>
                    ⚡ Rapid Chord Palette (Click to insert at text cursor)
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {uniqueProgressionChords.map(ch => (
                      <Chip
                        key={`palette-${ch.chordName}`}
                        label={`+ [${ch.chordName}]`}
                        onClick={() => handleInsertChordToLyrics(ch.chordName)}
                        sx={{
                          fontWeight: 900,
                          bgcolor: 'var(--brutal-paper)',
                          border: '2px solid var(--brutal-ink)',
                          boxShadow: '1px 1px 0 var(--brutal-ink)',
                          cursor: 'pointer',
                          '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                        }}
                      />
                    ))}
                    {uniqueProgressionChords.length === 0 && (
                      <Typography sx={{ fontStyle: 'italic', fontWeight: 800, fontSize: '0.8rem' }}>
                        Build a progression timeline above to load chords into this palette!
                      </Typography>
                    )}
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Typography sx={{ fontWeight: 900, fontSize: '0.85rem', textTransform: 'uppercase' }}>
                    Lyrics Editor (Format: Write chords in brackets like [C] or [Am] next to the words)
                  </Typography>
                  <textarea
                    ref={lyricTextareaRef}
                    value={currentSectionLyrics}
                    onChange={handleLyricsChange}
                    placeholder="Yesterday, [F] all my [G] troubles seemed so [Am] far away..."
                    rows={8}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontFamily: '"Courier New", Courier, monospace',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      backgroundColor: 'var(--brutal-paper)',
                      border: '3px solid var(--brutal-ink)',
                      borderRadius: '4px',
                      boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1)',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </Box>
              </Box>
            ) : (
              /* Performance View (Chords positioned above lyrics) */
              <Box
                sx={{
                  border: '3px solid var(--brutal-ink)',
                  borderRadius: 1,
                  p: 3,
                  bgcolor: 'var(--brutal-paper)',
                  minHeight: '260px',
                  boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.05)'
                }}
              >
                <Chip
                  label={activeSectionType}
                  color="primary"
                  sx={{
                    fontWeight: 900,
                    textTransform: 'none',
                    border: '2px solid var(--brutal-ink)',
                    borderRadius: 1,
                    mb: 3
                  }}
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {currentSectionLyrics.split('\n').map((line, lineIdx) => {
                    if (!line.trim()) return <Box key={lineIdx} sx={{ height: '1.2rem' }} />;
                    
                    const segments = parseChordProLine(line);
                    return (
                      <Box 
                        key={lineIdx} 
                        sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          rowGap: '20px', // spacing between lyrics lines
                          lineHeight: '1.2rem',
                          mt: 1.5 // Space for chord badges above words
                        }}
                      >
                        {segments.map((seg, segIdx) => (
                          <Box
                            key={segIdx}
                            sx={{
                              position: 'relative',
                              display: 'inline-block',
                              whiteSpace: 'pre',
                              mr: 0.2
                            }}
                          >
                            {seg.chord && (
                              <Box
                                onClick={() => {
                                  // Play chord sound if they click the badge in preview mode!
                                  const rootName = seg.chord.replace(/[m7b5°ø+sus]/g, '');
                                  let rootIdx = NOTES_SHARPS.indexOf(rootName);
                                  if (rootIdx === -1) rootIdx = NOTES_FLATS.indexOf(rootName);
                                  if (rootIdx !== -1) {
                                    const quality = seg.chord.includes('m') && !seg.chord.includes('maj7') ? 'minor' : 'Major';
                                    triggerChordSound({ rootIndex: rootIdx, quality });
                                  }
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: '-1.45rem',
                                  left: 0,
                                  fontSize: '0.78rem',
                                  fontWeight: 900,
                                  color: 'var(--brutal-ink)',
                                  backgroundColor: 'var(--brutal-yellow)',
                                  border: '1.5px solid var(--brutal-ink)',
                                  borderRadius: '3px',
                                  px: '4px',
                                  py: '1px',
                                  boxShadow: '1px 1px 0 var(--brutal-ink)',
                                  cursor: 'pointer',
                                  pointerEvents: 'auto',
                                  userSelect: 'none',
                                  '&:hover': {
                                    backgroundColor: 'var(--brutal-pink)',
                                    transform: 'scale(1.05)'
                                  }
                                }}
                              >
                                {seg.chord}
                              </Box>
                            )}
                            <Typography
                              component="span"
                              sx={{
                                fontFamily: 'inherit',
                                fontWeight: 650,
                                fontSize: '1rem',
                                color: 'var(--brutal-ink)'
                              }}
                            >
                              {seg.text || ' '}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    );
                  })}
                  {!currentSectionLyrics.trim() && (
                    <Typography sx={{ fontStyle: 'italic', fontWeight: 800, color: 'rgba(0,0,0,0.4)', textAlign: 'center', mt: 4 }}>
                      lyrics are empty. Go back to Write Mode to add lyrics!
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </BrutalCard>
    </PageContainer>
  );
};

// Harmonized scale degree chords generator helper
const getDiatonicChords = (keyIndex, modeVal, preferFlats = false) => {
  const modeDef = MODE_DEFS[modeVal] || MODE_DEFS.major;
  return modeDef.offsets.map((offset, idx) => {
    const chordRootIndex = (keyIndex + offset) % 12;
    const rootName = preferFlats ? NOTES_FLATS[chordRootIndex] : NOTES_SHARPS[chordRootIndex];
    const quality = modeDef.qualities[idx];
    const suffix = modeDef.suffixes[idx];
    const roman = modeDef.romans[idx];
    const functionName = modeDef.functions[idx];
    
    return {
      degreeIndex: idx,
      rootIndex: chordRootIndex,
      rootName: rootName,
      quality: quality,
      suffix: suffix,
      roman: roman,
      chordName: `${rootName}${suffix}`,
      degreeName: `${idx + 1}${getOrdinalSuffix(idx + 1)}`,
      functionName: functionName
    };
  });
};

export default ProgressionGenerator;
