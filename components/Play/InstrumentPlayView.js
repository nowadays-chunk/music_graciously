import React, { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Box, Typography, Button, MenuItem, Select, InputLabel,
  FormControl, Grid, Chip, Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/router';
import { getSoundfontInstrument } from '../../core/audio/AudioService';
import guitar from '../../config/guitar';
import {
  getAbsoluteNotes, getNoteName, getIntervalName, checkMatch,
} from '../../core/music/musicTheory';
import InstrumentSelector from './InstrumentSelector';
import PianoVisualizer from './PianoVisualizer';
import UkuleleVisualizer from './UkuleleVisualizer';
import BassVisualizer from './BassVisualizer';
import ViolinVisualizer from './ViolinVisualizer';
import DoubleBassVisualizer from './DoubleBassVisualizer';
import TrumpetVisualizer from './TrumpetVisualizer';
import SaxophoneVisualizer from './SaxophoneVisualizer';
import GuitarVisualizer from './GuitarVisualizer';
import { useDispatch, useSelector } from 'react-redux';
import { updateStateProperty } from '../../redux/actions';
import { TargetIcon } from '../Graphics/BrutalistIcons';

// ─── Styled Components ────────────────────────────────────────────────────────

const PlayContainer = styled(Box)({
  maxWidth: 1200,
  margin: '0 auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
});

const BannerContainer = styled(Box)({
  background: 'var(--brutal-pink)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '16px 24px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    alignItems: 'stretch',
    textAlign: 'center',
  },
});

const BannerText = styled(Typography)({
  fontWeight: 800,
  color: 'var(--brutal-ink)',
  fontSize: '1.05rem',
  lineHeight: 1.4,
  flex: 1,
});

const BannerLinkButton = styled(Button)({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: 'var(--brutal-yellow)',
  color: 'var(--brutal-ink)',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  fontWeight: 900,
  textTransform: 'none',
  fontSize: '0.95rem',
  padding: '8px 20px',
  whiteSpace: 'nowrap',
  '&:hover': {
    background: 'var(--brutal-mint)',
    transform: 'translate(2px, 2px)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
  },
  '@media (max-width: 768px)': {
    width: '100%',
    justifyContent: 'center',
  },
});

const Card = styled(Box)({
  background: 'rgba(255,253,245,0.92)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '24px',
});

const BrutalSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 900,
    fontSize: '0.95rem',
    '& fieldset': { border: 'none' },
    '&:hover': { backgroundColor: 'var(--brutal-yellow)' },
    '&.Mui-focused': { backgroundColor: 'var(--brutal-yellow)', boxShadow: 'none' },
  },
  '& .MuiInputLabel-root': {
    fontWeight: 900,
    color: 'var(--brutal-ink)',
    transform: 'translate(14px, 12px) scale(1)',
    '&.MuiInputLabel-shrink': { transform: 'translate(14px, -9px) scale(0.75)' },
  },
  '& .MuiMenuItem-root': { fontWeight: 700 },
});

const ActionButton = styled(Button)({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: 'var(--brutal-yellow)',
  color: 'var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  fontWeight: 900,
  textTransform: 'none',
  padding: '10px 20px',
  '&:hover': { background: 'var(--brutal-pink)', transform: 'translate(2px,2px)', boxShadow: 'none' },
  '&:disabled': { opacity: 0.5 },
});

const SpreadButton = styled(Button)({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: 'var(--brutal-mint)',
  color: 'var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  fontWeight: 900,
  textTransform: 'none',
  padding: '10px 20px',
  '&:hover': { background: 'var(--brutal-blue)', transform: 'translate(2px,2px)', boxShadow: 'none' },
});

const TabBtn = styled(Button, { shouldForwardProp: p => p !== 'active' })(
  ({ active }) => ({
    borderRadius: 0,
    border: '3px solid var(--brutal-ink)',
    borderBottom: active ? '3px solid rgba(255,253,245,0.92)' : '3px solid var(--brutal-ink)',
    marginBottom: active ? '-3px' : 0,
    background: active ? 'rgba(255,253,245,0.92)' : 'var(--brutal-mint)',
    color: 'var(--brutal-ink)',
    fontWeight: 900,
    textTransform: 'none',
    padding: '8px 20px',
    zIndex: active ? 2 : 1,
    '&:hover': { background: 'var(--brutal-yellow)' },
  })
);

const ModeButton = styled(Button, { shouldForwardProp: p => p !== 'active' })(
  ({ active }) => ({
    borderRadius: 4,
    border: '3px solid var(--brutal-ink)',
    background: active ? 'var(--brutal-pink)' : 'var(--brutal-paper)',
    color: 'var(--brutal-ink)',
    boxShadow: active ? 'none' : '2px 2px 0 var(--brutal-ink)',
    fontWeight: 900,
    textTransform: 'none',
    padding: '6px 16px',
    transform: active ? 'translate(2px, 2px)' : 'none',
    '&:hover': { background: 'var(--brutal-yellow)' },
  })
);

const VisualizerWrapper = styled(Box)({
  '& .MuiTypography-h6': {
    display: 'none', // Hide standard static headers inside visualizers
  }
});

// ─── Constants ─────────────────────────────────────────────────────────────────

const KEYS      = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const SCALE_KEYS = Object.keys(guitar.scales);
const ARP_KEYS   = Object.keys(guitar.arppegios);

// Instruments that support fretboard CAGED spreading
const SPREADING_INSTRUMENTS = new Set(['guitar', 'bass', 'ukulele']);

const INSTRUMENT_STANDARD_TUNINGS = {
  guitar: {
    midi: [64, 59, 55, 50, 45, 40],
    names: ['E', 'B', 'G', 'D', 'A', 'E']
  },
  bass: {
    midi: [28, 33, 38, 43],
    names: ['E', 'A', 'D', 'G']
  },
  ukulele: {
    midi: [67, 60, 64, 69],
    names: ['G', 'C', 'E', 'A']
  },
  violin: {
    midi: [55, 62, 69, 76],
    names: ['G', 'D', 'A', 'E']
  },
  'double-bass': {
    midi: [28, 33, 38, 43],
    names: ['E', 'A', 'D', 'G']
  }
};

const TUNING_NOTE_OPTIONS = (() => {
  const options = [];
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  for (let octave = 1; octave <= 6; octave++) {
    notes.forEach((note, idx) => {
      const midi = (octave + 1) * 12 + idx;
      options.push({
        midi,
        label: `${note}${octave}`,
        name: note
      });
    });
  }
  return options;
})();

// Convert a key like "C#" → "Csharp" for use in spreading URLs
const keyToSlug = (key) => key.replace('#', 'sharp');
const modeNameToSlug = (modeName) =>
  String(modeName || '')
    .trim()
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/\s+/g, '-');

// ─── Component ─────────────────────────────────────────────────────────────────

const InstrumentPlayView = ({ instrument }) => {
  const dispatch = useDispatch();
  const router   = useRouter();

  // ── Initialization guard ─────────────────────────────────────────────────────
  // `isInitialized` drives the form disabled state; it becomes true only after
  // all URL params have been fully committed to React state.
  const [isInitialized, setIsInitialized] = useState(false);

  // When true, the sync-to-URL effect is suppressed.  We set it to true before
  // batch-applying URL params and clear it once everything has settled.
  const blockUrlSync = useRef(true);

  // Tracks how many setState calls are still pending (in-flight) so the
  // sync-to-URL effect can wait until every field has settled.
  const pendingSetCount = useRef(0);

  // Wizard state
  const [selectedKeyIndex, setSelectedKeyIndex] = useState(0);
  const [category, setCategory]   = useState('scale');
  const [scaleType, setScaleType] = useState('major');
  const [modeIndex, setModeIndex] = useState(0);
  const [chordType, setChordType] = useState('M');

  // Tuning & Display mode state
  const [customTuning, setCustomTuning] = useState([]);
  const [customStringNames, setCustomStringNames] = useState([]);
  const [displayMode, setDisplayMode] = useState('notes');

  // ── Helpers: wrapped setters that increment / decrement pending counter ───────
  // Used only during the URL→state batch-apply phase so we can know when all
  // state updates have committed before enabling the form and URL sync.
  const safeSet = (setter, value) => {
    pendingSetCount.current += 1;
    setter(value);
  };

  // ── Sync to/from router params ────────────────────────────────────────────────

  // 1. Parse & atomically apply all URL path params.
  //    We parse everything first (no state reads), then call all setters at once
  //    inside a single synchronous pass so React can batch them in one render.
  useEffect(() => {
    if (!router.isReady) return;

    // Block sync-to-URL while we apply URL params.
    blockUrlSync.current = true;
    pendingSetCount.current = 0;

    const { key, category: qCat, type, mode: qMode, display } = router.query;

    // ── Parse key ──
    let resolvedKeyIndex = 0; // default C
    if (key) {
      const decodedKey = key.replace(/sharp/gi, '#').toUpperCase();
      const idx = KEYS.indexOf(decodedKey);
      if (idx !== -1) {
        resolvedKeyIndex = idx;
      } else {
        const parsedIdx = parseInt(key);
        if (!isNaN(parsedIdx) && parsedIdx >= 0 && parsedIdx < 12) {
          resolvedKeyIndex = parsedIdx;
        }
      }
    }

    // ── Parse category ──
    let resolvedCategory = 'scale';
    if (qCat) {
      const cleanCat = qCat.toLowerCase();
      if (['scale', 'chord', 'arpeggio'].includes(cleanCat)) {
        resolvedCategory = cleanCat;
      }
    }

    // ── Parse type ──
    let resolvedScaleType = 'major';
    let resolvedChordType = 'M';
    if (type) {
      const decodedType = type.replace(/sharp/gi, '#');
      if (resolvedCategory === 'scale') {
        if (guitar.scales[decodedType]) resolvedScaleType = decodedType;
      } else {
        if (guitar.arppegios[decodedType]) resolvedChordType = decodedType;
      }
    }

    // ── Parse display mode ──
    let resolvedDisplayMode = 'notes';
    if (display) {
      const d = display.toLowerCase();
      resolvedDisplayMode = d.startsWith('finger') ? 'fingering' : d;
    } else if (qMode) {
      const cleanMode = Array.isArray(qMode) ? qMode[0].toLowerCase() : qMode.toLowerCase();
      if (['notes', 'intervals', 'fingering', 'fingerings'].includes(cleanMode)) {
        resolvedDisplayMode = cleanMode.startsWith('finger') ? 'fingering' : cleanMode;
      }
    }

    // ── Parse scale mode index ──
    let resolvedModeIndex = 0;
    if (qMode && resolvedCategory === 'scale') {
      const cleanMode = Array.isArray(qMode) ? qMode[0].toLowerCase() : qMode.toLowerCase();
      if (!['notes', 'intervals', 'fingering', 'fingerings'].includes(cleanMode)) {
        const parsedModeIdx = parseInt(cleanMode);
        if (!isNaN(parsedModeIdx)) {
          resolvedModeIndex = parsedModeIdx;
        } else {
          // Resolve mode name by slug
          const scaleData = guitar.scales[resolvedScaleType];
          if (scaleData && scaleData.modes) {
            const foundIdx = scaleData.modes.findIndex(m =>
              modeNameToSlug(m.name) === cleanMode ||
              m.name.toLowerCase() === cleanMode
            );
            if (foundIdx !== -1) resolvedModeIndex = foundIdx;
          }
        }
      }
    }

    // ── Batch-apply all parsed values ──
    // All setters are called synchronously; React batches them into one render
    // (guaranteed in React 18, and practically true in React 17 inside effects).
    safeSet(setSelectedKeyIndex, resolvedKeyIndex);
    safeSet(setCategory,         resolvedCategory);
    safeSet(setScaleType,        resolvedScaleType);
    safeSet(setChordType,        resolvedChordType);
    safeSet(setModeIndex,        resolvedModeIndex);
    safeSet(setDisplayMode,      resolvedDisplayMode);

    // Mark form as ready after this effect's micro-task queue flushes.
    // We use a short timeout so the state setters above have been committed
    // before we lift the blockUrlSync flag and enable the form.
    setTimeout(() => {
      pendingSetCount.current = 0;
      blockUrlSync.current = false;
      setIsInitialized(true);
    }, 0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query]);

  // 2. Sync state changes back to the URL path (shallow update).
  //    Suppressed while blockUrlSync is true (during URL→state hydration and
  //    during multi-field form changes) to prevent partial state from being
  //    committed to the URL.
  useEffect(() => {
    if (!router.isReady) return;
    if (blockUrlSync.current) return;

    const keySlug = KEYS[selectedKeyIndex].replace('#', 'sharp');
    const type = category === 'scale' ? scaleType : chordType;
    const typeSlug = type.replace(/#/g, 'sharp');

    let path = `/play/${instrument}/${keySlug}/${category}/${typeSlug}/${displayMode}`;
    if (category === 'scale') {
      const scaleData = guitar.scales[scaleType];
      if (scaleData && scaleData.isModal && scaleData.modes?.length) {
        const modeName = scaleData.modes[modeIndex]?.name || '';
        const modeSlug = modeNameToSlug(modeName);
        if (modeSlug) {
          path += `/${modeSlug}`;
        }
      }
    }

    // Only update if the path has actually changed to prevent infinite loops.
    const currentPath = router.asPath.split('?')[0];
    const decodedCurrentPath = decodeURIComponent(currentPath);
    const hasChanged = decodedCurrentPath !== path;

    if (hasChanged) {
      router.replace(path, undefined, { shallow: true });
    }
  }, [selectedKeyIndex, category, scaleType, chordType, modeIndex, displayMode, router.isReady, instrument, router]);

  useEffect(() => {
    const std = INSTRUMENT_STANDARD_TUNINGS[instrument];
    if (std) {
      setCustomTuning(std.midi);
      setCustomStringNames(std.names);
    } else {
      setCustomTuning([]);
      setCustomStringNames([]);
    }
  }, [instrument]);

  // UI tabs: 'visualizer' | 'metadata' | 'matches'
  const [activeTab, setActiveTab] = useState('visualizer');

  // Audio
  const [player, setPlayer]             = useState(null);
  const [isLoadingSound, setIsLoading]  = useState(false);
  const [isPlayingSeq, setIsPlayingSeq] = useState(false);

  // Redux for guitar board
  const boards          = useSelector(s => s.fretboard.components);
  const activeFretboard = boards.find(b => b.generalSettings.page === 'play');

  // ── Load soundfont ─────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    setIsLoading(true);
    const soundMap = {
      piano: 'acoustic_grand_piano', bass: 'acoustic_bass',
      'double-bass': 'acoustic_bass', violin: 'violin',
      trumpet: 'trumpet', saxophone: 'alto_sax',
    };
    const soundName = soundMap[instrument] || 'acoustic_guitar_nylon';
    getSoundfontInstrument(soundName)
      .then(p => { if (active) { setPlayer(p); setIsLoading(false); } })
      .catch(() => { if (active) setIsLoading(false); });
    return () => { active = false; };
  }, [instrument]);

  // ── Active notes ────────────────────────────────────────────────────────────
  const subType = category === 'scale' ? scaleType : chordType;

  const activeNotes = useMemo(() => {
    const cat = category === 'arpeggio' ? 'arppegio' : category;
    const mi  = category === 'scale' ? modeIndex : 0;
    return getAbsoluteNotes(cat, subType, selectedKeyIndex, mi);
  }, [category, subType, selectedKeyIndex, modeIndex]);

  // ── Sync to Redux (guitar only) ─────────────────────────────────────────────
  useEffect(() => {
    if (instrument === 'guitar' && activeFretboard) {
      const choice = category === 'arpeggio' ? 'arppegio' : category;
      dispatch(updateStateProperty(activeFretboard.id, 'generalSettings.choice', choice));
      dispatch(updateStateProperty(activeFretboard.id, `keySettings.${choice}`, selectedKeyIndex));
      if (category === 'scale') {
        dispatch(updateStateProperty(activeFretboard.id, 'scaleSettings.scale', scaleType));
        dispatch(updateStateProperty(activeFretboard.id, 'keySettings.mode', modeIndex));
        dispatch(updateStateProperty(activeFretboard.id, 'modeSettings.mode', modeIndex));
      } else if (category === 'chord') {
        dispatch(updateStateProperty(activeFretboard.id, 'chordSettings.chord', chordType));
      } else if (category === 'arpeggio') {
        dispatch(updateStateProperty(activeFretboard.id, 'arppegioSettings.arppegio', chordType));
      }
    }
  }, [instrument, category, selectedKeyIndex, scaleType, modeIndex, chordType, activeFretboard, dispatch]);

  // ── Metadata ────────────────────────────────────────────────────────────────
  const metadata = useMemo(() => {
    if (!activeNotes.length) return { noteNames: [], intervals: [], name: '', description: '', matchingScales: [], matchingArps: [] };

    const rootNote  = activeNotes[0];
    const noteNames = activeNotes.map(n => getNoteName(n));
    const intervals = activeNotes.map(n => getIntervalName((n - rootNote + 12) % 12));

    let name = '', description = '', matchingScales = [], matchingArps = [];

    if (category === 'scale') {
      const scaleData = guitar.scales[scaleType] || {};
      const modeData  = scaleData.modes?.[modeIndex];
      name        = modeData?.name || scaleData.name || scaleType;
      description = modeData?.description || scaleData.description || '';
      matchingArps = scaleData.matchingArpeggios || [];
    } else {
      const arpData = guitar.arppegios[chordType] || {};
      name        = arpData.name || chordType;
      description = arpData.description || '';
      matchingScales = arpData.matchingScales || [];
      matchingArps   = arpData.matchingArpeggios || [];
    }

    return { noteNames, intervals, name, description, matchingScales, matchingArps };
  }, [activeNotes, category, scaleType, modeIndex, chordType]);

  // ── Matching entities ───────────────────────────────────────────────────────
  const matchingEntities = useMemo(() => {
    if (!activeNotes.length) return [];
    const results = [];

    SCALE_KEYS.forEach(sk => {
      const sd = guitar.scales[sk];
      if (sd?.modes) {
        sd.modes.forEach((m, mi) => {
          const notes = getAbsoluteNotes('scale', sk, selectedKeyIndex, mi);
          if (checkMatch(activeNotes, notes)) {
            results.push({ type: 'scale', label: `${KEYS[selectedKeyIndex]} ${m.name}`, scale: sk, modeIndex: mi });
          }
        });
      } else {
        const notes = getAbsoluteNotes('scale', sk, selectedKeyIndex);
        if (checkMatch(activeNotes, notes)) {
          results.push({ type: 'scale', label: `${KEYS[selectedKeyIndex]} ${sd?.name || sk}`, scale: sk });
        }
      }
    });

    ARP_KEYS.forEach(ak => {
      const notes = getAbsoluteNotes('arppegio', ak, selectedKeyIndex);
      if (checkMatch(activeNotes, notes)) {
        results.push({ type: 'arp', label: `${KEYS[selectedKeyIndex]} ${guitar.arppegios[ak]?.name || ak}`, arp: ak });
      }
    });

    return results;
  }, [activeNotes, selectedKeyIndex]);

  // ── CAGED Spreading redirect ────────────────────────────────────────────────
  const handleGoToSpreading = () => {
    const keySlug = keyToSlug(KEYS[selectedKeyIndex]);

    if (category === 'scale') {
      const scaleData = guitar.scales[scaleType] || {};
      if (scaleData.isModal && scaleData.modes?.length) {
        const modeName = scaleData.modes[modeIndex]?.name || scaleData.modes[0].name;
        router.push(`/spreading/scales/${keySlug}/${scaleType}/modal/${modeNameToSlug(modeName)}/notes`);
      } else {
        router.push(`/spreading/scales/${keySlug}/${scaleType}/single/notes`);
      }
    } else if (category === 'chord') {
      router.push(`/spreading/chords/${keySlug}/${chordType}/notes`);
    } else if (category === 'arpeggio') {
      router.push(`/spreading/arppegios/${keySlug}/${chordType}/notes`);
    }
  };

  // ── Audio playback ──────────────────────────────────────────────────────────
  const playNote = label => { if (player) player.play(label); };

  const playSequence = async () => {
    if (!player || isPlayingSeq) return;
    setIsPlayingSeq(true);
    const baseOctave = ['bass','double-bass'].includes(instrument) ? 2 : 4;
    for (let i = 0; i < activeNotes.length; i++) {
      const noteIdx  = activeNotes[i];
      const noteName = getNoteName(noteIdx);
      const octave   = baseOctave + (i > 0 && noteIdx < activeNotes[i - 1] ? 1 : 0);
      playNote(`${noteName}${octave}`);
      await new Promise(r => setTimeout(r, 450));
    }
    setIsPlayingSeq(false);
  };


  // ── Visualizer ──────────────────────────────────────────────────────────────
  const renderVisualizer = () => {
    const props = {
      activeNotes,
      rootNote: selectedKeyIndex,
      modeRootNote,
      onNoteClick: playNote,
      displayMode,
      tuning: customTuning.length > 0 ? customTuning : undefined,
      stringNames: customStringNames.length > 0 ? customStringNames : undefined,
      showCagedShapes: canSpread,
      shapeType: category,
      subType: category === 'scale' ? scaleType : chordType,
      keyIndex: selectedKeyIndex,
      commonName
    };
    switch (instrument) {
      case 'piano':       return <PianoVisualizer {...props} />;
      case 'ukulele':     return <UkuleleVisualizer {...props} />;
      case 'bass':        return <BassVisualizer {...props} />;
      case 'violin':      return <ViolinVisualizer {...props} />;
      case 'double-bass': return <DoubleBassVisualizer {...props} />;
      case 'trumpet':     return <TrumpetVisualizer {...props} />;
      case 'saxophone':   return <SaxophoneVisualizer {...props} />;
      case 'guitar':
      default:            return <GuitarVisualizer {...props} />;
    }
  };

  const getShapeFretRange = (shape) => {
    if (category === 'chord') {
      const cagedShape = guitar.arppegios[chordType]?.cagedShapes?.[shape];
      if (!cagedShape) return { minFret: 0, maxFret: 24 };
      const realFrets = cagedShape.map(fret => fret === null ? null : fret + selectedKeyIndex);
      const validFrets = realFrets.filter(f => f !== null);
      if (validFrets.length === 0) return { minFret: 0, maxFret: 24 };
      return { minFret: Math.min(...validFrets), maxFret: Math.max(...validFrets) };
    } else {
      // scale or arpeggio
      const shapeIndex = ['C', 'A', 'G', 'E', 'D'].indexOf(shape);
      if (shapeIndex === -1) return { minFret: 0, maxFret: 24 };
      let shapeIntervals = null;
      if (category === 'scale') {
        shapeIntervals = guitar.scales[scaleType]?.indexes?.[shapeIndex];
      } else {
        shapeIntervals = guitar.shapes.indexes[chordType]?.[shapeIndex] || guitar.shapes.indexes["M"]?.[shapeIndex];
      }
      if (!shapeIntervals) return { minFret: 0, maxFret: 24 };
      const minFret = shapeIntervals.start + selectedKeyIndex;
      const maxFret = shapeIntervals.end + selectedKeyIndex;
      return { minFret, maxFret };
    }
  };

  const renderShapeVisualizer = (shape, minFret, maxFret) => {
    const props = {
      activeNotes,
      rootNote: selectedKeyIndex,
      modeRootNote,
      onNoteClick: playNote,
      displayMode,
      tuning: customTuning.length > 0 ? customTuning : undefined,
      stringNames: customStringNames.length > 0 ? customStringNames : undefined,
      isShapeView: true,
      shapeName: shape,
      shapeType: category,
      subType: category === 'scale' ? scaleType : chordType,
      keyIndex: selectedKeyIndex,
      minFret,
      maxFret,
    };
    switch (instrument) {
      case 'ukulele':     return <UkuleleVisualizer {...props} />;
      case 'bass':        return <BassVisualizer {...props} />;
      case 'guitar':
      default:            return <GuitarVisualizer {...props} />;
    }
  };

  // ── Derived UI values ───────────────────────────────────────────────────────
  const scaleData    = guitar.scales[scaleType] || {};
  const isModalScale = category === 'scale' && scaleData.isModal;
  const modeRootNote  = isModalScale && Number(modeIndex) > 0 ? activeNotes[0] : null;
  const canSpread    = SPREADING_INSTRUMENTS.has(instrument);

  const formattedInstrumentName = useMemo(() => {
    return instrument
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }, [instrument]);

  const commonName = useMemo(() => {
    const keyName = KEYS[selectedKeyIndex];
    const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
    return `${keyName} ${metadata.name} ${categoryName}`;
  }, [selectedKeyIndex, metadata.name, category]);

  const seoTitle = `${commonName} on ${formattedInstrumentName} | Interactive Visualizer`;
  const seoDescription = `Interactive visualizer for the ${commonName} on ${formattedInstrumentName}. Practice notes, intervals, and fingerings with real-time audio playback.`;
  const seoKeywords = `${KEYS[selectedKeyIndex]}, ${metadata.name}, ${category}, ${scaleType || chordType}, ${instrument}, visualizer, music theory, chords, scales`;

  // ── Sheets Bundle Banner Info ────────────────────────────────────────────────
  const bannerInfo = useMemo(() => {
    if (!isInitialized) return null;
    const keyName = KEYS[selectedKeyIndex] || 'C';
    const keySlug = keyName.replace('#', 'sharp');
    const validInstrument = instrument === 'piano' ? 'piano' : 'guitar';
    const displayInstrumentName = validInstrument.charAt(0).toUpperCase() + validInstrument.slice(1);

    const sentence1 = `Master the key of ${keyName} on ${displayInstrumentName} with our complete collection of sheet music bundles.`;
    const sentence2 = `Download the high-resolution PDFs below to practice chords, scales, and arpeggios offline.`;
    const bannerText = `${sentence1} ${sentence2}`;

    const links = [
      { label: `${keyName} Chords`, url: `/product/bundle-${validInstrument}-${keySlug}-chords`, color: 'var(--brutal-pink)' },
      { label: `${keyName} Scales`, url: `/product/bundle-${validInstrument}-${keySlug}-scales`, color: 'var(--brutal-yellow)' },
      { label: `${keyName} Arpeggios`, url: `/product/bundle-${validInstrument}-${keySlug}-arppegios`, color: 'var(--brutal-blue)' }
    ];

    return { keyName, bannerText, links };
  }, [isInitialized, selectedKeyIndex, instrument]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <PlayContainer>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <meta name="keywords" content={seoKeywords} />
      </Head>

      {/* ── Instrument switcher ── */}
      <InstrumentSelector activeInstrument={instrument} />

      {/* ── Selector card ── */}
      <Card sx={{ position: 'relative' }}>
        {/* Loading overlay — shown while URL params are being applied to form state */}
        {!isInitialized && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 10,
              bgcolor: 'rgba(255, 253, 245, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              backdropFilter: 'blur(2px)',
              borderRadius: 'inherit',
              pointerEvents: 'all',
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: 'var(--brutal-paper)',
                border: '3px solid var(--brutal-ink)',
                boxShadow: '2px 2px 0 var(--brutal-ink)',
                borderRadius: '50%',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 50 50"
                style={{ animation: 'spin 1s linear infinite' }}
              >
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="var(--brutal-bg)"
                  strokeWidth="6"
                />
                <path
                  d="M25,5a20,20 0 0,1 20,20"
                  fill="none"
                  stroke="var(--brutal-pink)"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Typography sx={{ fontWeight: 900, color: 'var(--brutal-ink)', fontSize: '0.9rem' }}>
              Applying settings…
            </Typography>
          </Box>
        )}

        <Typography variant="h5" sx={{ fontWeight: 900, color: 'var(--brutal-ink)', mb: 3 }}>
          🎵 Configure Visualizer
        </Typography>

        <Grid container spacing={2} alignItems="flex-end" sx={{ opacity: isInitialized ? 1 : 0.35, pointerEvents: isInitialized ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
          {/* 1 – Root Key */}
          <Grid item xs={12} sm={isModalScale ? 3 : 4}>
            <BrutalSelect fullWidth>
              <InputLabel id="key-label">Root Key</InputLabel>
              <Select
                labelId="key-label"
                value={selectedKeyIndex}
                onChange={e => {
                  blockUrlSync.current = true;
                  setSelectedKeyIndex(e.target.value);
                  // Unblock after one microtask so the setter has committed
                  Promise.resolve().then(() => { blockUrlSync.current = false; });
                }}
                label="Root Key"
              >
                {KEYS.map((k, idx) => (
                  <MenuItem key={k} value={idx} sx={{ fontWeight: 700 }}>{k}</MenuItem>
                ))}
              </Select>
            </BrutalSelect>
          </Grid>

          {/* 2 – Category */}
          <Grid item xs={12} sm={isModalScale ? 3 : 4}>
            <BrutalSelect fullWidth>
              <InputLabel id="cat-label">Category</InputLabel>
              <Select
                labelId="cat-label"
                value={category}
                onChange={e => {
                  blockUrlSync.current = true;
                  setCategory(e.target.value);
                  setModeIndex(0);
                  Promise.resolve().then(() => { blockUrlSync.current = false; });
                }}
                label="Category"
              >
                <MenuItem value="scale"    sx={{ fontWeight: 700 }}>Scale</MenuItem>
                <MenuItem value="chord"    sx={{ fontWeight: 700 }}>Chord</MenuItem>
                <MenuItem value="arpeggio" sx={{ fontWeight: 700 }}>Arpeggio</MenuItem>
              </Select>
            </BrutalSelect>
          </Grid>

          {/* 3 – Type */}
          <Grid item xs={12} sm={isModalScale ? 3 : 4}>
            <BrutalSelect fullWidth>
              <InputLabel id="type-label">
                {category === 'scale' ? 'Scale Type' : category === 'chord' ? 'Chord Type' : 'Arpeggio Type'}
              </InputLabel>
              {category === 'scale' ? (
                <Select
                  labelId="type-label"
                  value={scaleType}
                  onChange={e => {
                    blockUrlSync.current = true;
                    setScaleType(e.target.value);
                    setModeIndex(0);
                    Promise.resolve().then(() => { blockUrlSync.current = false; });
                  }}
                  label="Scale Type"
                >
                  {SCALE_KEYS.map(sk => (
                    <MenuItem key={sk} value={sk} sx={{ fontWeight: 700 }}>
                      {guitar.scales[sk]?.name || sk}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <Select
                  labelId="type-label"
                  value={chordType}
                  onChange={e => {
                    blockUrlSync.current = true;
                    setChordType(e.target.value);
                    Promise.resolve().then(() => { blockUrlSync.current = false; });
                  }}
                  label={category === 'chord' ? 'Chord Type' : 'Arpeggio Type'}
                >
                  {ARP_KEYS.map(ak => (
                    <MenuItem key={ak} value={ak} sx={{ fontWeight: 700 }}>
                      {guitar.arppegios[ak]?.name || ak}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </BrutalSelect>
          </Grid>

          {/* 4 – Mode (conditional, only for modal scales) */}
          {isModalScale && scaleData.modes?.length > 0 && (
            <Grid item xs={12} sm={3}>
              <BrutalSelect fullWidth>
                <InputLabel id="mode-label">Mode</InputLabel>
                <Select
                  labelId="mode-label"
                  value={modeIndex}
                  onChange={e => {
                    blockUrlSync.current = true;
                    setModeIndex(e.target.value);
                    Promise.resolve().then(() => { blockUrlSync.current = false; });
                  }}
                  label="Mode"
                >
                  {scaleData.modes.map((m, mi) => (
                    <MenuItem key={m.name} value={mi} sx={{ fontWeight: 700 }}>{m.name}</MenuItem>
                  ))}
                </Select>
              </BrutalSelect>
            </Grid>
          )}
        </Grid>

        {/* Display Mode Selection */}
        <Box sx={{ mt: 3, opacity: isInitialized ? 1 : 0.35, pointerEvents: isInitialized ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: 'var(--brutal-ink)' }}>
            Display Mode
          </Typography>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            {[
              { id: 'notes', label: '🎵 Notes' },
              { id: 'intervals', label: '📐 Intervals' },
              { id: 'fingering', label: '✋ Fingering' },
            ].map((m) => (
              <ModeButton
                key={m.id}
                active={displayMode === m.id}
                onClick={() => {
                  blockUrlSync.current = true;
                  setDisplayMode(m.id);
                  Promise.resolve().then(() => { blockUrlSync.current = false; });
                }}
              >
                {m.label}
              </ModeButton>
            ))}
          </Box>
        </Box>

        {/* Dynamic Tuning Selection */}
        {customTuning.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: 'var(--brutal-ink)' }}>
              ⚙️ Customize Tuning (String 1 to {customTuning.length})
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
              {customTuning.map((midiVal, idx) => {
                return (
                  <BrutalSelect key={idx} sx={{ minWidth: 95 }}>
                    <InputLabel id={`string-tune-${idx}`}>Str {idx + 1}</InputLabel>
                    <Select
                      labelId={`string-tune-${idx}`}
                      value={midiVal}
                      label={`Str ${idx + 1}`}
                      onChange={(e) => {
                        const newMidi = Number(e.target.value);
                        const opt = TUNING_NOTE_OPTIONS.find(o => o.midi === newMidi);
                        const newTuning = [...customTuning];
                        const newNames = [...customStringNames];
                        newTuning[idx] = newMidi;
                        if (opt) {
                          newNames[idx] = opt.name;
                        }
                        setCustomTuning(newTuning);
                        setCustomStringNames(newNames);
                      }}
                    >
                      {TUNING_NOTE_OPTIONS.map((opt) => (
                        <MenuItem key={opt.midi} value={opt.midi} sx={{ fontWeight: 700 }}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </BrutalSelect>
                );
              })}
              
              <Button
                onClick={() => {
                  const std = INSTRUMENT_STANDARD_TUNINGS[instrument];
                  if (std) {
                    setCustomTuning(std.midi);
                    setCustomStringNames(std.names);
                  }
                }}
                sx={{
                  fontWeight: 900,
                  border: '3px solid var(--brutal-ink)',
                  bgcolor: 'var(--brutal-mint)',
                  color: 'var(--brutal-ink)',
                  boxShadow: '2px 2px 0 var(--brutal-ink)',
                  textTransform: 'none',
                  py: 1,
                  px: 2,
                  '&:hover': { bgcolor: 'var(--brutal-yellow)' }
                }}
              >
                Reset Standard
              </Button>
            </Box>
          </Box>
        )}

        {/* Actions row */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mt: 4 }}>
          <ActionButton onClick={playSequence} disabled={isPlayingSeq || isLoadingSound}>
            {isPlayingSeq ? '▶ Playing…' : '▶ Play Sequence 🔊'}
          </ActionButton>

          {isLoadingSound && (
            <Typography variant="caption" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', opacity: 0.6 }}>
              Loading sounds…
            </Typography>
          )}

          <Box sx={{ ml: 'auto', display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={`${KEYS[selectedKeyIndex]} ${metadata.name}`}
              sx={{
                fontWeight: 900, fontSize: '0.9rem',
                border: '2px solid var(--brutal-ink)',
                bgcolor: 'var(--brutal-yellow)', borderRadius: 1, px: 0.5,
              }}
            />
            <Chip
              label={`${activeNotes.length} notes`}
              sx={{
                fontWeight: 900,
                border: '2px solid var(--brutal-ink)',
                bgcolor: 'var(--brutal-mint)', borderRadius: 1,
              }}
            />
          </Box>
        </Box>
      </Card>

      {/* ── Tabs ── */}
      <Box>
        <Box sx={{ display: 'flex', gap: 0 }}>
          {[
            { id: 'visualizer', label: '🎸 Visualizer' },
            { id: 'metadata',   label: '📖 Theory' },
            { id: 'matches',    label: `🔗 Matches (${matchingEntities.length})` },
          ].map(tab => (
            <TabBtn
              key={tab.id}
              active={activeTab === tab.id ? 1 : 0}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabBtn>
          ))}
        </Box>

        <Box sx={{ border: '4px solid var(--brutal-ink)', borderTop: '4px solid var(--brutal-ink)', background: 'rgba(255,253,245,0.92)', p: 3 }}>

          {/* ── VISUALIZER TAB ── */}
          {activeTab === 'visualizer' && (
            <VisualizerWrapper>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: 'var(--brutal-ink)', borderBottom: '3px solid var(--brutal-ink)', pb: 1.5 }}>
                ✨ {commonName} on {formattedInstrumentName}
              </Typography>
              {renderVisualizer()}
            </VisualizerWrapper>
          )}

          {/* ── THEORY / METADATA TAB ── */}
          {activeTab === 'metadata' && (
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, color: 'var(--brutal-ink)' }}>
                {KEYS[selectedKeyIndex]} {metadata.name}
              </Typography>
              {metadata.description && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 680 }}>
                  {metadata.description}
                </Typography>
              )}

              <Grid container spacing={3}>
                {/* Notes */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: 'var(--brutal-blue)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
                      🎵 Notes
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {metadata.noteNames.map((n, i) => (
                        <Chip
                          key={i}
                          label={n}
                          onClick={() => playNote(`${n}4`)}
                          sx={{
                            fontWeight: 900, fontSize: '1rem',
                            border: '2px solid var(--brutal-ink)',
                            bgcolor: i === 0 ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                            borderRadius: 1, cursor: 'pointer',
                            '&:hover': { bgcolor: 'var(--brutal-pink)', transform: 'scale(1.05)' },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Intervals */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
                      📐 Intervals
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {metadata.intervals.map((iv, i) => (
                        <Chip
                          key={i}
                          label={iv || 'R'}
                          sx={{
                            fontWeight: 900,
                            border: '2px solid var(--brutal-ink)',
                            bgcolor: i === 0 ? 'var(--brutal-pink)' : 'var(--brutal-paper)',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Degrees */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 3, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
                      ✋ Degrees
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {metadata.noteNames.map((n, i) => (
                        <Chip
                          key={i}
                          label={`${i + 1}. ${n}`}
                          sx={{
                            fontWeight: 900,
                            border: '2px solid var(--brutal-ink)',
                            bgcolor: 'var(--brutal-paper)',
                            borderRadius: 1,
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                {/* Related data from config */}
                {metadata.matchingScales.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', bgcolor: 'var(--brutal-paper)' }}>
                      <Typography variant="overline" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
                        📚 Parent Scales
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {metadata.matchingScales.map(s => (
                          <Chip key={s} label={s} sx={{ fontWeight: 800, border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}

                {metadata.matchingArps.length > 0 && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', bgcolor: 'var(--brutal-paper)' }}>
                      <Typography variant="overline" sx={{ fontWeight: 900, mb: 1, display: 'block' }}>
                        🎶 Related Chords / Arpeggios
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {metadata.matchingArps.map(a => (
                          <Chip key={a} label={a} sx={{ fontWeight: 800, border: '2px solid var(--brutal-ink)', borderRadius: 1 }} />
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                )}

                {/* Construction table */}
                <Grid item xs={12}>
                  <Box sx={{ p: 3, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow-small)', overflowX: 'auto' }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, mb: 2, display: 'block' }}>
                      🔬 Construction
                    </Typography>
                    <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                      <Box component="thead">
                        <Box component="tr">
                          {['Degree','Note','Interval','Play'].map(h => (
                            <Box
                              component="th" key={h}
                              sx={{ p: 1.5, fontWeight: 900, border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-ink)', color: 'var(--brutal-paper)', textAlign: 'center', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 1 }}
                            >
                              {h}
                            </Box>
                          ))}
                        </Box>
                      </Box>
                      <Box component="tbody">
                        {metadata.noteNames.map((n, i) => (
                          <Box component="tr" key={i} sx={{ '&:nth-of-type(even)': { bgcolor: 'rgba(0,0,0,0.04)' } }}>
                            <Box component="td" sx={{ p: 1.5, textAlign: 'center', border: '2px solid var(--brutal-ink)', fontWeight: 900, bgcolor: i === 0 ? 'var(--brutal-yellow)' : 'transparent' }}>
                              {i + 1}
                            </Box>
                            <Box component="td" sx={{ p: 1.5, textAlign: 'center', border: '2px solid var(--brutal-ink)', fontWeight: 900, fontSize: '1.1rem' }}>
                              {n}
                            </Box>
                            <Box component="td" sx={{ p: 1.5, textAlign: 'center', border: '2px solid var(--brutal-ink)', fontWeight: 700, opacity: 0.75 }}>
                              {metadata.intervals[i] || 'R'}
                            </Box>
                            <Box component="td" sx={{ p: 1, textAlign: 'center', border: '2px solid var(--brutal-ink)' }}>
                              <Button
                                size="small"
                                onClick={() => playNote(`${n}4`)}
                                sx={{ minWidth: 0, fontWeight: 900, border: '2px solid var(--brutal-ink)', borderRadius: 2, bgcolor: 'var(--brutal-mint)', color: 'var(--brutal-ink)', '&:hover': { bgcolor: 'var(--brutal-yellow)' } }}
                              >
                                ▶
                              </Button>
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* ── MATCHES TAB ── */}
          {activeTab === 'matches' && (
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5, color: 'var(--brutal-ink)' }}>
                Entities containing all notes of{' '}
                <Box component="span" sx={{ color: 'secondary.main' }}>
                  {KEYS[selectedKeyIndex]} {metadata.name}
                </Box>
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  These scales and arpeggios share all {activeNotes.length} notes of your selection.
                </Typography>
                <Button
                  onClick={() => router.push('/play/matches')}
                  sx={{
                    fontWeight: 900,
                    border: '3px solid var(--brutal-ink)',
                    bgcolor: 'var(--brutal-yellow)',
                    color: 'var(--brutal-ink)',
                    boxShadow: '4px 4px 0 var(--brutal-ink)',
                    textTransform: 'none',
                    borderRadius: 1,
                    px: 2.5,
                    py: 1,
                    '&:hover': {
                      bgcolor: 'var(--brutal-pink)',
                      transform: 'translate(2px, 2px)',
                      boxShadow: '2px 2px 0 var(--brutal-ink)',
                    }
                  }}
                >
                  🌐 Open Interactive Network Diagram
                </Button>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="overline" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>
                    Scales ({matchingEntities.filter(e => e.type === 'scale').length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {matchingEntities.filter(e => e.type === 'scale').map((e, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          p: 1.5, border: '3px solid var(--brutal-ink)',
                          bgcolor: i % 2 === 0 ? 'var(--brutal-blue)' : 'var(--brutal-mint)',
                          boxShadow: '2px 2px 0 var(--brutal-ink)',
                        }}
                      >
                        <Typography sx={{ fontWeight: 800 }}>{e.label}</Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            setCategory('scale');
                            setScaleType(e.scale);
                            if (e.modeIndex !== undefined) setModeIndex(e.modeIndex);
                            setActiveTab('visualizer');
                          }}
                          sx={{ fontWeight: 900, border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)', color: 'var(--brutal-ink)', borderRadius: 2, '&:hover': { bgcolor: 'var(--brutal-pink)' } }}
                        >
                          Apply
                        </Button>
                      </Box>
                    ))}
                    {matchingEntities.filter(e => e.type === 'scale').length === 0 && (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>No matching scales found.</Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="overline" sx={{ fontWeight: 900, display: 'block', mb: 1 }}>
                    Arpeggios / Chords ({matchingEntities.filter(e => e.type === 'arp').length})
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {matchingEntities.filter(e => e.type === 'arp').map((e, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          p: 1.5, border: '3px solid var(--brutal-ink)',
                          bgcolor: i % 2 === 0 ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
                          boxShadow: '2px 2px 0 var(--brutal-ink)',
                        }}
                      >
                        <Typography sx={{ fontWeight: 800 }}>{e.label}</Typography>
                        <Button
                          size="small"
                          onClick={() => {
                            setCategory('arpeggio');
                            setChordType(e.arp);
                            setActiveTab('visualizer');
                          }}
                          sx={{ fontWeight: 900, border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-mint)', color: 'var(--brutal-ink)', borderRadius: 2, '&:hover': { bgcolor: 'var(--brutal-blue)' } }}
                        >
                          Apply
                        </Button>
                      </Box>
                    ))}
                    {matchingEntities.filter(e => e.type === 'arp').length === 0 && (
                      <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>No matching arpeggios found.</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Dynamic Sheets Bundle Banner ── */}
      {bannerInfo && (
        <Box sx={{ 
          mb: 4, 
          p: 2.5, 
          bgcolor: 'var(--brutal-pink)', 
          border: '3px solid var(--brutal-ink)', 
          boxShadow: 'var(--brutal-shadow-small, 4px 4px 0 #111111)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 2,
          borderRadius: '4px',
          mt: 4
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', flex: 1 }}>
            <TargetIcon size={22} fill="var(--brutal-yellow)" />
            <Typography sx={{ fontWeight: 900, color: 'var(--brutal-ink)', fontSize: '1rem', lineHeight: 1.5 }}>
              {bannerInfo.bannerText}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', ml: { xs: 0, md: 'auto' } }}>
            {bannerInfo.links.map(btn => (
              <Button 
                key={btn.label}
                component={Link}
                href={btn.url}
                sx={{
                  fontWeight: 900,
                  fontSize: '0.8rem',
                  bgcolor: btn.color,
                  color: 'var(--brutal-ink)',
                  border: '2px solid var(--brutal-ink)',
                  boxShadow: '2px 2px 0 var(--brutal-ink)',
                  textTransform: 'none',
                  padding: '6px 14px',
                  '&:hover': { bgcolor: 'var(--brutal-paper)', boxShadow: 'none' }
                }}
              >
                {btn.label} ➔
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </PlayContainer>
  );
};

export default InstrumentPlayView;
