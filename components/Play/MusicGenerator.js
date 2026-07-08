import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  TextField,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import GuitarVisualizer from './GuitarVisualizer';
import PianoVisualizer from './PianoVisualizer';
import UkuleleVisualizer from './UkuleleVisualizer';
import BassVisualizer from './BassVisualizer';
import DoubleBassVisualizer from './DoubleBassVisualizer';
import ViolinVisualizer from './ViolinVisualizer';
import TrumpetVisualizer from './TrumpetVisualizer';
import SaxophoneVisualizer from './SaxophoneVisualizer';
import { createPerformedMusic, describePerformanceUpgrade } from '../../core/music/PerformanceEngine';
import { getSamplerReadiness, loadBestInstrumentPlayer, playPerformedEvent } from '../../core/audio/SamplerPlaybackEngine';

const DURATION_SECONDS = 30;
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const INSTRUMENTS = [
  { value: 'guitar', label: 'Guitar' },
  { value: 'piano', label: 'Piano' },
  { value: 'ukulele', label: 'Ukulele' },
  { value: 'violin', label: 'Violin' },
  { value: 'bass', label: 'Bass' },
  { value: 'double-bass', label: 'Double Bass' },
  { value: 'trumpet', label: 'Trumpet' },
  { value: 'saxophone', label: 'Saxophone' },
];

const STYLES = ['Jazz', 'Blues', 'Bebop', 'Funk', 'Rock', 'Pop', 'Classical', 'Soul', 'Latin', 'Bossa Nova', 'Reggae', 'Fusion'];
const FEELS = ['straight', 'swing', 'shuffle', 'latin', 'funk'];
const COMPLEXITIES = ['simple', 'medium', 'advanced'];
const DENSITIES = ['sparse', 'balanced', 'dense'];
const REGISTERS = ['low', 'middle', 'high', 'full range'];
const PROGRESSION_TYPES = ['diatonic', 'blues', 'ii-V-I', 'rhythm changes', 'modal', 'minor', 'custom'];
const SOLO_BEHAVIORS = ['melodic', 'bebop', 'bluesy', 'arpeggio-based', 'scalar', 'motif-based', 'outside/tension'];
const RHYTHM_BEHAVIORS = ['comping', 'strumming', 'walking bass', 'ostinato', 'syncopated groove', 'chord stabs', 'sustained pads'];

const TECHNIQUES = {
  guitar: ['bends', 'slides', 'hammer-ons', 'pull-offs', 'vibrato', 'palm mute', 'strum', 'alternate picking'],
  piano: ['voicings', 'inversions', 'arpeggios', 'block chords', 'walking tenths', 'left-hand/right-hand split'],
  bass: ['walking bass', 'slap', 'ghost notes', 'slides', 'octaves', 'roots/fifths'],
  'double-bass': ['pizzicato', 'walking bass', 'slides', 'chromatic approach notes'],
  violin: ['legato', 'staccato', 'vibrato', 'slides', 'double stops'],
  ukulele: ['strumming', 'fingerpicking', 'muted strums', 'rolls'],
  trumpet: ['tonguing', 'slurs', 'falls', 'shakes', 'staccato', 'long tones'],
  saxophone: ['legato', 'staccato', 'scoops', 'falls', 'ghost notes', 'vibrato'],
};

const INSTRUMENT_RANGES = {
  guitar: { min: 40, max: 88, low: [40, 52], middle: [52, 72], high: [65, 88] },
  piano: { min: 21, max: 108, low: [36, 52], middle: [52, 72], high: [72, 96] },
  ukulele: { min: 60, max: 81, low: [60, 65], middle: [64, 74], high: [72, 81] },
  violin: { min: 55, max: 103, low: [55, 67], middle: [67, 84], high: [80, 103] },
  bass: { min: 28, max: 67, low: [28, 40], middle: [36, 52], high: [48, 67] },
  'double-bass': { min: 28, max: 64, low: [28, 40], middle: [36, 52], high: [48, 64] },
  trumpet: { min: 54, max: 82, low: [54, 62], middle: [60, 72], high: [70, 82] },
  saxophone: { min: 49, max: 80, low: [49, 58], middle: [56, 70], high: [68, 80] },
};

const SCALE_INTERVALS = {
  major: [0, 2, 4, 5, 7, 9, 11],
  minor: [0, 2, 3, 5, 7, 8, 10],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  blues: [0, 3, 5, 6, 7, 10],
  bebop: [0, 2, 4, 5, 7, 9, 10, 11],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
};

const CHORD_INTERVALS = {
  '': [0, 4, 7],
  m: [0, 3, 7],
  dim: [0, 3, 6],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  7: [0, 4, 7, 10],
  m7b5: [0, 3, 6, 10],
  sus4: [0, 5, 7],
};

const PROGRESSION_LIBRARY = {
  diatonic: [
    { roman: 'Imaj7', degree: 0, suffix: 'maj7' },
    { roman: 'vi7', degree: 9, suffix: 'm7' },
    { roman: 'ii7', degree: 2, suffix: 'm7' },
    { roman: 'V7', degree: 7, suffix: '7' },
  ],
  blues: [
    { roman: 'I7', degree: 0, suffix: '7', scale: 'Blues scale' },
    { roman: 'IV7', degree: 5, suffix: '7', scale: 'Mixolydian blues' },
    { roman: 'I7', degree: 0, suffix: '7', scale: 'Blues scale' },
    { roman: 'V7', degree: 7, suffix: '7', scale: 'Altered / blues' },
  ],
  'ii-V-I': [
    { roman: 'ii7', degree: 2, suffix: 'm7', scale: 'Dorian' },
    { roman: 'V7', degree: 7, suffix: '7', scale: 'Mixolydian / altered' },
    { roman: 'Imaj7', degree: 0, suffix: 'maj7', scale: 'Ionian' },
    { roman: 'Imaj7', degree: 0, suffix: 'maj7', scale: 'Ionian' },
  ],
  'rhythm changes': [
    { roman: 'Imaj7', degree: 0, suffix: 'maj7' },
    { roman: 'vi7', degree: 9, suffix: 'm7' },
    { roman: 'ii7', degree: 2, suffix: 'm7' },
    { roman: 'V7', degree: 7, suffix: '7' },
    { roman: 'iii7', degree: 4, suffix: 'm7' },
    { roman: 'VI7', degree: 9, suffix: '7' },
    { roman: 'ii7', degree: 2, suffix: 'm7' },
    { roman: 'V7', degree: 7, suffix: '7' },
  ],
  modal: [
    { roman: 'i7', degree: 0, suffix: 'm7', scale: 'Dorian' },
    { roman: 'IV7', degree: 5, suffix: '7', scale: 'Dorian color' },
    { roman: 'i7', degree: 0, suffix: 'm7', scale: 'Dorian' },
    { roman: 'bVIImaj7', degree: 10, suffix: 'maj7', scale: 'Mixolydian color' },
  ],
  minor: [
    { roman: 'i7', degree: 0, suffix: 'm7', scale: 'Natural minor' },
    { roman: 'iv7', degree: 5, suffix: 'm7', scale: 'Dorian' },
    { roman: 'bVImaj7', degree: 8, suffix: 'maj7', scale: 'Lydian' },
    { roman: 'V7', degree: 7, suffix: '7', scale: 'Harmonic minor dominant' },
  ],
};

const Card = styled(Box)({
  background: 'rgba(255,253,245,0.94)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
  padding: '24px',
});

const MiniCard = styled(Box)({
  background: 'var(--brutal-paper)',
  border: '3px solid var(--brutal-ink)',
  boxShadow: '3px 3px 0 var(--brutal-ink)',
  borderRadius: 4,
  padding: '14px',
});

const BrutalSelect = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    border: '3px solid var(--brutal-ink)',
    borderRadius: 4,
    backgroundColor: 'var(--brutal-paper)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    fontWeight: 900,
    '& fieldset': { border: 'none' },
  },
  '& .MuiInputLabel-root': { fontWeight: 900, color: 'var(--brutal-ink)' },
});

const ActionButton = styled(Button)({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  background: 'var(--brutal-yellow)',
  color: 'var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow-small)',
  fontWeight: 900,
  textTransform: 'none',
  '&:hover': { background: 'var(--brutal-pink)', boxShadow: 'none', transform: 'translate(2px,2px)' },
});

const mod12 = (n) => ((n % 12) + 12) % 12;
const noteIndex = (name) => NOTES.indexOf(name);
const midiToPitch = (midi) => NOTES[mod12(midi)];
const pick = (items) => items[Math.floor(Math.random() * items.length)];
const pct = (n) => `${Math.max(0, Math.min(1, n)) * 100}%`;

const getChordIntervals = (suffix) => CHORD_INTERVALS[suffix] || CHORD_INTERVALS[''];
const buildChordName = (rootIndex, suffix) => `${NOTES[rootIndex]}${suffix}`;

const getStyleScale = (style, progressionType) => {
  const lower = style.toLowerCase();
  if (lower.includes('blues')) return 'blues';
  if (lower.includes('bebop')) return 'bebop';
  if (lower.includes('jazz') || lower.includes('fusion') || progressionType === 'ii-V-I') return 'mixolydian';
  if (lower.includes('classical')) return progressionType === 'minor' ? 'harmonicMinor' : 'major';
  if (progressionType === 'minor' || progressionType === 'modal') return 'dorian';
  return 'major';
};

const parseCustomProgression = (customProgression) => {
  if (!customProgression.trim()) return null;
  const tokens = customProgression.replace(/[|]/g, ' ').split(/[\s,]+/).map((token) => token.trim()).filter(Boolean);
  if (!tokens.length) return null;
  const romanToDegree = { I: 0, II: 2, III: 4, IV: 5, V: 7, VI: 9, VII: 11, i: 0, ii: 2, iii: 4, iv: 5, v: 7, vi: 9, vii: 11 };
  return tokens.map((token) => {
    const roman = token.match(/^(b|#)?(VII|VI|IV|V|III|II|I|vii|vi|iv|v|iii|ii|i)/);
    const accidental = roman?.[1] === 'b' ? -1 : roman?.[1] === '#' ? 1 : 0;
    const plainRoman = roman?.[2] || 'I';
    const suffixText = token.replace(`${roman?.[1] || ''}${plainRoman}`, '');
    let suffix = suffixText.includes('maj7') ? 'maj7' : suffixText.includes('m7') ? 'm7' : suffixText.includes('7') ? '7' : suffixText.includes('m') ? 'm' : '';
    if (/dim|°/i.test(token)) suffix = 'dim';
    return { roman: token, degree: mod12((romanToDegree[plainRoman] ?? 0) + accidental), suffix, scale: 'Chord scale' };
  });
};

const chooseRegisterRange = (instrument, register) => {
  const cfg = INSTRUMENT_RANGES[instrument] || INSTRUMENT_RANGES.guitar;
  if (register === 'full range') return [cfg.min, cfg.max];
  return cfg[register] || cfg.middle;
};

const nearestPlayableMidi = ({ pitchClass, instrument, register, previousMidi, preferBass = false }) => {
  const [min, max] = chooseRegisterRange(instrument, register);
  const all = [];
  for (let midi = min; midi <= max; midi += 1) {
    if (mod12(midi) === pitchClass) all.push(midi);
  }
  if (!all.length) return min;
  if (preferBass) return all[0];
  const center = previousMidi || Math.round((min + max) / 2);
  return all.reduce((best, midi) => (Math.abs(midi - center) < Math.abs(best - center) ? midi : best), all[0]);
};

const visualizerPositionFor = (instrument, midi) => {
  const pitchClass = mod12(midi);
  if (['guitar', 'ukulele', 'bass', 'double-bass', 'violin'].includes(instrument)) {
    const tunings = {
      guitar: [64, 59, 55, 50, 45, 40],
      ukulele: [67, 60, 64, 69],
      bass: [28, 33, 38, 43],
      'double-bass': [28, 33, 38, 43],
      violin: [55, 62, 69, 76],
    };
    const candidate = tunings[instrument].map((openMidi, stringIndex) => ({ string: stringIndex + 1, fret: midi - openMidi })).find((pos) => pos.fret >= 0 && pos.fret <= 24);
    return candidate ? { ...candidate, pitchClass } : { pitchClass };
  }
  if (instrument === 'piano') return { key: midi, pitchClass };
  if (instrument === 'trumpet') return { valves: ['open', '2', '1', '1-2', '2-3', '1-3', '1-2-3'][pitchClass % 7], pitchClass };
  if (instrument === 'saxophone') return { fingering: `concert-${midi}`, pitchClass };
  return { pitchClass };
};

const makeProgression = ({ key, progressionType, customProgression, style }) => {
  const keyRoot = noteIndex(key);
  const base = progressionType === 'custom'
    ? (parseCustomProgression(customProgression) || PROGRESSION_LIBRARY.diatonic)
    : (PROGRESSION_LIBRARY[progressionType] || PROGRESSION_LIBRARY.diatonic);
  const chordDuration = DURATION_SECONDS / base.length;
  return base.map((chord, index) => {
    const chordRoot = mod12(keyRoot + chord.degree);
    const scaleSuggestion = chord.scale || (style === 'Bebop' ? 'Bebop dominant' : chord.suffix === '7' ? 'Mixolydian' : chord.suffix.includes('m') ? 'Dorian' : 'Ionian');
    return {
      romanNumeral: chord.roman,
      chordName: buildChordName(chordRoot, chord.suffix),
      chordSymbol: buildChordName(chordRoot, chord.suffix),
      rootIndex: chordRoot,
      suffix: chord.suffix,
      startTime: Number((index * chordDuration).toFixed(3)),
      duration: Number(chordDuration.toFixed(3)),
      scaleSuggestion,
    };
  });
};

const makeEvent = ({ settings, role, midi, startTime, duration, velocity, technique, chord, scaleName }) => ({
  pitch: midiToPitch(midi),
  octave: Math.floor(midi / 12) - 1,
  midi,
  startTime: Number(startTime.toFixed(3)),
  duration: Number(Math.min(duration, Math.max(0.05, DURATION_SECONDS - startTime)).toFixed(3)),
  velocity,
  role,
  technique,
  chordName: chord.chordName,
  romanNumeral: chord.romanNumeral,
  scaleName,
  chordContext: chord.chordName,
  scaleContext: scaleName,
  visualizerPosition: visualizerPositionFor(settings.instrument, midi),
});

const makeTechnique = (instrument, selectedTechniques, role, behavior) => {
  const choices = selectedTechniques.filter((tech) => TECHNIQUES[instrument]?.includes(tech));
  if (!choices.length) return role === 'rhythm' ? behavior : 'legato';
  if (role === 'rhythm' && behavior === 'strumming' && choices.includes('strum')) return 'strum';
  if (role === 'rhythm' && behavior === 'walking bass' && choices.includes('walking bass')) return 'walking bass';
  return pick(choices);
};

const generateRhythmEvents = ({ settings, chordProgression, selectedTechniques }) => {
  if (settings.generationType === 'solo') return [];
  const events = [];
  const beatSeconds = 60 / settings.tempo;
  const densityStep = settings.density === 'sparse' ? 2 : settings.density === 'dense' ? 0.5 : 1;
  chordProgression.forEach((chord, chordIndex) => {
    const chordMidi = getChordIntervals(chord.suffix).map((interval) => nearestPlayableMidi({
      pitchClass: mod12(chord.rootIndex + interval),
      instrument: settings.instrument,
      register: settings.register,
      preferBass: ['bass', 'double-bass'].includes(settings.instrument),
    }));
    const end = chord.startTime + chord.duration;
    for (let t = chord.startTime; t < end - 0.05; t += beatSeconds * densityStep) {
      if (settings.rhythmBehavior === 'syncopated groove' && Math.random() > 0.72) continue;
      const shouldChord = ['piano', 'guitar', 'ukulele'].includes(settings.instrument) && !['walking bass', 'ostinato'].includes(settings.rhythmBehavior);
      const notes = shouldChord ? chordMidi.slice(0, settings.complexity === 'simple' ? 3 : 4) : [chordMidi[(Math.round(t / beatSeconds) + chordIndex) % chordMidi.length]];
      notes.forEach((midi, noteIndexInChord) => {
        events.push(makeEvent({
          settings,
          role: 'rhythm',
          midi,
          startTime: t + (settings.rhythmBehavior === 'strumming' ? noteIndexInChord * 0.028 : 0),
          duration: settings.rhythmBehavior === 'sustained pads' ? Math.min(chord.duration, beatSeconds * 3.5) : Math.min(beatSeconds * densityStep * 0.85, end - t),
          velocity: 82 - noteIndexInChord * 4,
          technique: makeTechnique(settings.instrument, selectedTechniques, 'rhythm', settings.rhythmBehavior),
          chord,
          scaleName: chord.scaleSuggestion,
        }));
      });
    }
  });
  return events;
};

const generateSoloEvents = ({ settings, chordProgression, selectedTechniques }) => {
  if (settings.generationType === 'rhythm') return [];
  const events = [];
  const keyRoot = noteIndex(settings.key);
  const scaleType = getStyleScale(settings.style, settings.progressionType);
  const scale = SCALE_INTERVALS[scaleType].map((interval) => mod12(keyRoot + interval));
  const beatSeconds = 60 / settings.tempo;
  const subdivision = settings.density === 'dense' ? 0.5 : settings.density === 'sparse' ? 1.5 : 1;
  let previousMidi;
  chordProgression.forEach((chord, chordIndex) => {
    const chordToneClasses = getChordIntervals(chord.suffix).map((interval) => mod12(chord.rootIndex + interval));
    for (let t = chord.startTime; t < chord.startTime + chord.duration - 0.05; t += beatSeconds * subdivision) {
      if (Math.random() < (settings.complexity === 'simple' ? 0.36 : settings.complexity === 'medium' ? 0.18 : 0.06)) continue;
      const strongBeat = Math.round(t / beatSeconds) % 2 === 0;
      let pitchClass;
      if (chordIndex === chordProgression.length - 1 && t > DURATION_SECONDS - beatSeconds * 2) pitchClass = keyRoot;
      else if (settings.soloBehavior === 'arpeggio-based' || strongBeat) pitchClass = pick(chordToneClasses);
      else if (settings.soloBehavior === 'outside/tension' && Math.random() > 0.64) pitchClass = mod12(pick(chordToneClasses) + pick([1, -1, 6]));
      else if (settings.soloBehavior === 'bluesy') pitchClass = pick(SCALE_INTERVALS.blues.map((interval) => mod12(keyRoot + interval)));
      else pitchClass = pick(scale);
      const midi = nearestPlayableMidi({ pitchClass, instrument: settings.instrument, register: settings.register, previousMidi });
      const playableMidi = previousMidi && Math.abs(midi - previousMidi) > (settings.complexity === 'advanced' ? 12 : 7)
        ? nearestPlayableMidi({ pitchClass: mod12(previousMidi + (midi > previousMidi ? 2 : -2)), instrument: settings.instrument, register: settings.register, previousMidi })
        : midi;
      previousMidi = playableMidi;
      events.push(makeEvent({
        settings,
        role: 'solo',
        midi: playableMidi,
        startTime: t,
        duration: Math.min(beatSeconds * 0.78 * subdivision, DURATION_SECONDS - t),
        velocity: strongBeat ? 96 : 78,
        technique: makeTechnique(settings.instrument, selectedTechniques, 'solo', settings.soloBehavior),
        chord,
        scaleName: chord.scaleSuggestion || scaleType,
      }));
    }
  });
  return events;
};

const generateMusic = (settings, selectedTechniques) => {
  const chordProgression = makeProgression(settings);
  const noteEvents = [
    ...generateRhythmEvents({ settings, chordProgression, selectedTechniques }),
    ...generateSoloEvents({ settings, chordProgression, selectedTechniques }),
  ].filter((event) => event.startTime < DURATION_SECONDS && event.duration > 0).sort((a, b) => a.startTime - b.startTime || a.midi - b.midi);
  return createPerformedMusic({
    instrument: settings.instrument,
    generationType: settings.generationType,
    key: settings.key,
    tempo: settings.tempo,
    timeSignature: settings.timeSignature,
    style: settings.style,
    durationSeconds: DURATION_SECONDS,
    chordProgression,
    noteEvents,
  }, settings);
};

const findCurrentChord = (progression, currentTime) => progression.find((chord) => currentTime >= chord.startTime && currentTime < chord.startTime + chord.duration) || progression[0];

const MusicGenerator = () => {
  const [settings, setSettings] = useState({
    instrument: 'guitar',
    generationType: 'both',
    key: 'C',
    tempo: 120,
    timeSignature: '4/4',
    style: 'Jazz',
    feel: 'swing',
    complexity: 'medium',
    density: 'balanced',
    register: 'middle',
    progressionType: 'ii-V-I',
    soloBehavior: 'melodic',
    rhythmBehavior: 'comping',
    customProgression: '| Imaj7 | vi7 | ii7 | V7 |',
  });
  const [selectedTechniques, setSelectedTechniques] = useState(['slides', 'vibrato', 'alternate picking']);
  const [generated, setGenerated] = useState(() => generateMusic(settings, selectedTechniques));
  const [player, setPlayer] = useState(null);
  const [playerEngine, setPlayerEngine] = useState('loading');
  const [isLoadingSound, setIsLoadingSound] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const startTimeRef = useRef(0);
  const pauseOffsetRef = useRef(0);
  const rafRef = useRef(null);
  const playedIndexesRef = useRef(new Set());

  const keyIndex = NOTES.indexOf(settings.key);
  const currentChord = findCurrentChord(generated.chordProgression, currentTime);
  const beatSeconds = 60 / settings.tempo;
  const beatsPerBar = Number(settings.timeSignature.split('/')[0]) || 4;
  const currentBeat = Math.floor(currentTime / beatSeconds) + 1;
  const currentBar = Math.floor((currentBeat - 1) / beatsPerBar) + 1;
  const beatInBar = ((currentBeat - 1) % beatsPerBar) + 1;
  const samplerReadiness = useMemo(() => getSamplerReadiness(settings.instrument), [settings.instrument]);
  const performanceInfo = useMemo(() => describePerformanceUpgrade(settings.instrument), [settings.instrument]);

  const activeEvents = useMemo(() => generated.noteEvents.filter((event) => currentTime >= event.startTime && currentTime < event.startTime + event.duration), [generated, currentTime]);
  const previewEvents = useMemo(() => generated.noteEvents.filter((event) => event.startTime > currentTime && event.startTime <= currentTime + 1.2).slice(0, 8), [generated, currentTime]);
  const activeNotes = useMemo(() => [...new Set(activeEvents.map((event) => mod12(event.midi)))], [activeEvents]);
  const ghostNotes = useMemo(() => [...new Set(previewEvents.map((event) => mod12(event.midi)))], [previewEvents]);
  const visualizerNotes = useMemo(() => [...new Set([...activeNotes, ...ghostNotes])], [activeNotes, ghostNotes]);

  useEffect(() => {
    let mounted = true;
    setIsLoadingSound(true);
    loadBestInstrumentPlayer(settings.instrument)
      .then((loadedPlayer) => {
        if (!mounted) return;
        setPlayer(loadedPlayer);
        setPlayerEngine(loadedPlayer?.engine || 'unavailable');
      })
      .catch(() => {
        if (mounted) setPlayerEngine('unavailable');
      })
      .finally(() => { if (mounted) setIsLoadingSound(false); });
    return () => { mounted = false; };
  }, [settings.instrument]);

  useEffect(() => {
    const defaults = TECHNIQUES[settings.instrument]?.slice(0, 3) || [];
    setSelectedTechniques(defaults);
  }, [settings.instrument]);

  const setSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const handleGenerate = useCallback(() => {
    const next = generateMusic(settings, selectedTechniques);
    setGenerated(next);
    setCurrentTime(0);
    pauseOffsetRef.current = 0;
    playedIndexesRef.current = new Set();
  }, [settings, selectedTechniques]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
    pauseOffsetRef.current = 0;
    playedIndexesRef.current = new Set();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const tick = useCallback(() => {
    const now = performance.now() / 1000;
    const elapsed = Math.min(DURATION_SECONDS, now - startTimeRef.current + pauseOffsetRef.current);
    setCurrentTime(elapsed);
    if (player) {
      generated.noteEvents.forEach((event, index) => {
        if (!playedIndexesRef.current.has(index) && event.startTime <= elapsed && event.startTime > elapsed - 0.08) {
          playedIndexesRef.current.add(index);
          playPerformedEvent(player, event);
        }
      });
    }
    if (elapsed >= DURATION_SECONDS) {
      stopPlayback();
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, [generated.noteEvents, player, stopPlayback]);

  const playPlayback = () => {
    if (isPlaying && !isPaused) return;
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = performance.now() / 1000;
    rafRef.current = requestAnimationFrame(tick);
  };

  const pausePlayback = () => {
    setIsPaused(true);
    setIsPlaying(false);
    pauseOffsetRef.current = currentTime;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  };

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const renderVisualizer = () => {
    const props = {
      activeNotes: visualizerNotes,
      rootNote: keyIndex,
      modeRootNote: activeNotes.length ? activeNotes[0] : null,
      displayMode: 'notes',
      keyIndex,
      commonName: `${settings.key} ${settings.style} generated line`,
    };
    switch (settings.instrument) {
      case 'piano': return <PianoVisualizer {...props} />;
      case 'ukulele': return <UkuleleVisualizer {...props} />;
      case 'violin': return <ViolinVisualizer {...props} />;
      case 'bass': return <BassVisualizer {...props} />;
      case 'double-bass': return <DoubleBassVisualizer {...props} />;
      case 'trumpet': return <TrumpetVisualizer {...props} />;
      case 'saxophone': return <SaxophoneVisualizer {...props} />;
      case 'guitar':
      default: return <GuitarVisualizer {...props} showCagedShapes={false} />;
    }
  };

  const toggleTechnique = (technique) => {
    setSelectedTechniques((prev) => prev.includes(technique)
      ? prev.filter((item) => item !== technique)
      : [...prev, technique]);
  };

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto', px: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 950, color: 'var(--brutal-ink)', lineHeight: 1 }}>Music Generator</Typography>
            <Typography sx={{ mt: 1, fontWeight: 800, color: 'var(--brutal-ink)' }}>
              30-second playable ideas with theory-aware harmony, instrument effects, humanized performance, and Tone.js Sampler playback fallback.
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip icon={<MusicNoteIcon />} label={`${generated.noteEvents.length} performed events / ${DURATION_SECONDS}s`} sx={{ fontWeight: 900, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)' }} />
            <Chip label={`Audio: ${playerEngine}`} sx={{ fontWeight: 900, border: '3px solid var(--brutal-ink)', bgcolor: playerEngine === 'tone-sampler' ? 'var(--brutal-mint)' : 'var(--brutal-pink)' }} />
          </Box>
        </Box>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={4}>
          <Card sx={{ position: 'sticky', top: 96 }}>
            <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, color: 'var(--brutal-ink)' }}>Customization Panel</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}><BrutalSelect fullWidth><InputLabel>Instrument</InputLabel><Select value={settings.instrument} label="Instrument" onChange={(e) => setSetting('instrument', e.target.value)}>{INSTRUMENTS.map((item) => <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12} sm={6}><BrutalSelect fullWidth><InputLabel>Style</InputLabel><Select value={settings.style} label="Style" onChange={(e) => setSetting('style', e.target.value)}>{STYLES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Generation mode</Typography>
                <ToggleButtonGroup fullWidth exclusive value={settings.generationType} onChange={(_, value) => value && setSetting('generationType', value)}>
                  <ToggleButton value="rhythm">Rhythm</ToggleButton>
                  <ToggleButton value="solo">Solo</ToggleButton>
                  <ToggleButton value="both">Both</ToggleButton>
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Key</InputLabel><Select value={settings.key} label="Key" onChange={(e) => setSetting('key', e.target.value)}>{NOTES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Time</InputLabel><Select value={settings.timeSignature} label="Time" onChange={(e) => setSetting('timeSignature', e.target.value)}>{['4/4', '3/4', '6/8', '5/4', '7/8'].map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12}><Typography sx={{ fontWeight: 900 }}>BPM: {settings.tempo}</Typography><Slider min={50} max={220} value={settings.tempo} onChange={(_, value) => setSetting('tempo', value)} /></Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Feel</InputLabel><Select value={settings.feel} label="Feel" onChange={(e) => setSetting('feel', e.target.value)}>{FEELS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Complexity</InputLabel><Select value={settings.complexity} label="Complexity" onChange={(e) => setSetting('complexity', e.target.value)}>{COMPLEXITIES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Density</InputLabel><Select value={settings.density} label="Density" onChange={(e) => setSetting('density', e.target.value)}>{DENSITIES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={6}><BrutalSelect fullWidth><InputLabel>Register</InputLabel><Select value={settings.register} label="Register" onChange={(e) => setSetting('register', e.target.value)}>{REGISTERS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12}><BrutalSelect fullWidth><InputLabel>Progression</InputLabel><Select value={settings.progressionType} label="Progression" onChange={(e) => setSetting('progressionType', e.target.value)}>{PROGRESSION_TYPES.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              {settings.progressionType === 'custom' && <Grid item xs={12}><TextField fullWidth label="Custom roman progression" value={settings.customProgression} onChange={(e) => setSetting('customProgression', e.target.value)} /></Grid>}
              <Grid item xs={12}><BrutalSelect fullWidth><InputLabel>Solo behavior</InputLabel><Select value={settings.soloBehavior} label="Solo behavior" onChange={(e) => setSetting('soloBehavior', e.target.value)}>{SOLO_BEHAVIORS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12}><BrutalSelect fullWidth><InputLabel>Rhythm behavior</InputLabel><Select value={settings.rhythmBehavior} label="Rhythm behavior" onChange={(e) => setSetting('rhythmBehavior', e.target.value)}>{RHYTHM_BEHAVIORS.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></BrutalSelect></Grid>
              <Grid item xs={12}>
                <Typography sx={{ fontWeight: 950, mb: 1 }}>Instrument effects / techniques</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.5 }}>
                  {(TECHNIQUES[settings.instrument] || []).map((technique) => (
                    <FormControlLabel key={technique} control={<Checkbox checked={selectedTechniques.includes(technique)} onChange={() => toggleTechnique(technique)} />} label={<Typography sx={{ fontWeight: 800, fontSize: '0.86rem' }}>{technique}</Typography>} />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}><Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}><ActionButton onClick={handleGenerate}>Generate</ActionButton><ActionButton startIcon={<RestartAltIcon />} onClick={handleGenerate}>Regenerate</ActionButton></Box></Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Card>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 950, color: 'var(--brutal-ink)' }}>Playback and visualization</Typography>
                  <Typography sx={{ fontWeight: 800 }}>Bar {currentBar}, beat {beatInBar} - {currentTime.toFixed(1)}s / {DURATION_SECONDS}s</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <ActionButton disabled={isLoadingSound} startIcon={<PlayArrowIcon />} onClick={playPlayback}>{isPaused ? 'Resume' : 'Play'}</ActionButton>
                  <ActionButton startIcon={<PauseIcon />} onClick={pausePlayback}>Pause</ActionButton>
                  <ActionButton startIcon={<StopIcon />} onClick={stopPlayback}>Stop</ActionButton>
                </Box>
              </Box>
              <Box sx={{ width: '100%', height: 18, mt: 2, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}><Box sx={{ height: '100%', width: pct(currentTime / DURATION_SECONDS), bgcolor: 'var(--brutal-pink)', transition: 'width 80ms linear' }} /></Box>
            </Card>

            <Card>
              <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, color: 'var(--brutal-ink)' }}>Chord progression visualizer</Typography>
              <Typography sx={{ fontWeight: 950, mb: 2 }}>Key: {generated.key} / {generated.style}</Typography>
              <Grid container spacing={1.5}>
                {generated.chordProgression.map((chord) => {
                  const active = currentChord?.startTime === chord.startTime;
                  return (
                    <Grid key={`${chord.startTime}-${chord.chordName}`} item xs={12} sm={6} md={3}>
                      <MiniCard sx={{ bgcolor: active ? 'var(--brutal-yellow)' : 'var(--brutal-paper)', transform: active ? 'translate(2px,2px)' : 'none', boxShadow: active ? '1px 1px 0 var(--brutal-ink)' : undefined }}>
                        <Typography variant="h6" sx={{ fontWeight: 950 }}>{chord.romanNumeral}</Typography>
                        <Typography sx={{ fontWeight: 950 }}>{chord.chordName}</Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, display: 'block' }}>{chord.duration}s</Typography>
                        <Chip size="small" label={chord.scaleSuggestion} sx={{ mt: 1, fontWeight: 800 }} />
                      </MiniCard>
                    </Grid>
                  );
                })}
              </Grid>
              <Box sx={{ mt: 2, fontFamily: 'monospace', fontWeight: 900, overflowX: 'auto' }}>| {generated.chordProgression.map((c) => c.romanNumeral).join(' | ')} |<br />| {generated.chordProgression.map((c) => c.chordName).join(' | ')} |</Box>
            </Card>

            <Card>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 950, color: 'var(--brutal-ink)' }}>{INSTRUMENTS.find((item) => item.value === settings.instrument)?.label} visualizer</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {activeEvents.slice(0, 6).map((event, idx) => <Chip key={`${event.startTime}-${event.midi}-${idx}`} label={`${event.pitch}${event.octave} ${event.articulation || event.role}`} sx={{ fontWeight: 900, bgcolor: 'var(--brutal-pink)' }} />)}
                  {previewEvents.slice(0, 4).map((event, idx) => <Chip key={`ghost-${event.startTime}-${event.midi}-${idx}`} label={`next ${event.pitch}${event.octave}`} sx={{ fontWeight: 800, opacity: 0.5 }} />)}
                </Box>
              </Box>
              {renderVisualizer()}
              <Typography variant="caption" sx={{ display: 'block', mt: 2, fontWeight: 800 }}>Solid chips are active events. Transparent chips are ghost/preview notes for the next 1.2 seconds.</Typography>
            </Card>

            <Card>
              <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, color: 'var(--brutal-ink)' }}>Sound and performance system</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Performance engine</Typography><Typography>Humanized timing, velocity, accents, phrase arcs, swing/shuffle offsets, vibrato, bends, slides, ghost notes, strum spread, and legato metadata.</Typography></MiniCard></Grid>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Tone.js sampler</Typography><Typography>{samplerReadiness.hasSampleMap ? `Ready for samples at ${samplerReadiness.expectedLocation}` : 'No sample map yet.'}</Typography></MiniCard></Grid>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Fallback</Typography><Typography>{performanceInfo.fallbackRenderer}. Add legal multi-samples under /public/samples to get more live-like sound.</Typography></MiniCard></Grid>
              </Grid>
            </Card>

            <Card>
              <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, color: 'var(--brutal-ink)' }}>Generated music summary</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Theory</Typography><Typography>{generated.key} center, {settings.progressionType} progression, chord tones on strong beats, scale and passing tones on weaker subdivisions.</Typography></MiniCard></Grid>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Playability</Typography><Typography>{settings.register} register, instrument range limits, reduced leap size, selected techniques only.</Typography></MiniCard></Grid>
                <Grid item xs={12} md={4}><MiniCard><Typography sx={{ fontWeight: 950 }}>Groove</Typography><Typography>{settings.tempo} BPM, {settings.timeSignature}, {settings.feel} feel, {settings.density} density, {settings.complexity} complexity.</Typography></MiniCard></Grid>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Typography sx={{ fontWeight: 950, mb: 1 }}>Structured output preview</Typography>
              <Box component="pre" sx={{ maxHeight: 340, overflow: 'auto', m: 0, p: 2, bgcolor: 'var(--brutal-ink)', color: 'var(--brutal-paper)', borderRadius: 1, fontSize: 12 }}>{JSON.stringify({ ...generated, noteEvents: generated.noteEvents.slice(0, 10) }, null, 2)}</Box>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MusicGenerator;
