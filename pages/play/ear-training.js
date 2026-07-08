import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Paper,
  Select,
  Typography,
  LinearProgress,
} from '@mui/material';

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const HIDDEN_NOTE_COLOR = '#e5e7eb';
const NOTE_COLORS = {
  C: '#ef4444',
  'C#': '#f97316',
  D: '#f59e0b',
  'D#': '#eab308',
  E: '#84cc16',
  F: '#22c55e',
  'F#': '#14b8a6',
  G: '#06b6d4',
  'G#': '#3b82f6',
  A: '#6366f1',
  'A#': '#a855f7',
  B: '#ec4899',
};
const lighten = (hex, amount = 0.68) => {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = n >> 16;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const mix = (channel) => Math.round(channel + (255 - channel) * amount);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};
const NOTE_INDEX = Object.fromEntries(NOTES.map((note, index) => [note, index]));
const INSTRUMENTS = {
  piano: {
    label: 'Piano',
    soundfont: 'Acoustic Grand Piano',
    octave: 4,
    attack: 0.008,
    decay: 0.12,
    sustain: 0.28,
    release: 0.7,
    filter: 5200,
    harmonics: [
      { type: 'triangle', ratio: 1, gain: 0.9 },
      { type: 'sine', ratio: 2, gain: 0.28 },
      { type: 'sine', ratio: 3, gain: 0.12 },
    ],
  },
  guitar: {
    label: 'Guitar',
    soundfont: 'Nylon/Steel Guitar',
    octave: 3,
    attack: 0.006,
    decay: 0.08,
    sustain: 0.18,
    release: 0.55,
    filter: 3100,
    pluck: true,
    harmonics: [
      { type: 'triangle', ratio: 1, gain: 0.72 },
      { type: 'sawtooth', ratio: 2, gain: 0.18 },
      { type: 'sine', ratio: 3, gain: 0.12 },
    ],
  },
  ukulele: {
    label: 'Ukulele',
    soundfont: 'Ukulele Pluck',
    octave: 4,
    attack: 0.004,
    decay: 0.06,
    sustain: 0.14,
    release: 0.34,
    filter: 4200,
    pluck: true,
    harmonics: [
      { type: 'triangle', ratio: 1, gain: 0.78 },
      { type: 'square', ratio: 2, gain: 0.12 },
      { type: 'sine', ratio: 4, gain: 0.06 },
    ],
  },
  bass: {
    label: 'Bass',
    soundfont: 'Fingered Electric Bass',
    octave: 2,
    attack: 0.018,
    decay: 0.1,
    sustain: 0.36,
    release: 0.65,
    filter: 900,
    harmonics: [
      { type: 'sine', ratio: 1, gain: 1 },
      { type: 'triangle', ratio: 2, gain: 0.24 },
      { type: 'sine', ratio: 3, gain: 0.1 },
    ],
  },
  violin: {
    label: 'Violin',
    soundfont: 'Solo Violin',
    octave: 5,
    attack: 0.08,
    decay: 0.08,
    sustain: 0.52,
    release: 0.55,
    filter: 3600,
    vibrato: true,
    harmonics: [
      { type: 'sawtooth', ratio: 1, gain: 0.55 },
      { type: 'sine', ratio: 2, gain: 0.18 },
      { type: 'triangle', ratio: 3, gain: 0.12 },
    ],
  },
  trumpet: {
    label: 'Trumpet',
    soundfont: 'Bright Trumpet',
    octave: 4,
    attack: 0.035,
    decay: 0.07,
    sustain: 0.5,
    release: 0.34,
    filter: 2400,
    harmonics: [
      { type: 'square', ratio: 1, gain: 0.58 },
      { type: 'sawtooth', ratio: 2, gain: 0.28 },
      { type: 'sine', ratio: 3, gain: 0.13 },
    ],
  },
};
const QUESTION_TYPES = ['note', 'multi', 'chord', 'scale', 'arpeggio', 'instrument'];
const CHORDS = [
  { label: 'Major', suffix: 'maj', intervals: [0, 4, 7] },
  { label: 'Minor', suffix: 'min', intervals: [0, 3, 7] },
  { label: 'Dominant 7', suffix: '7', intervals: [0, 4, 7, 10] },
  { label: 'Major 7', suffix: 'maj7', intervals: [0, 4, 7, 11] },
  { label: 'Minor 7', suffix: 'min7', intervals: [0, 3, 7, 10] },
  { label: 'Diminished', suffix: 'dim', intervals: [0, 3, 6] },
  { label: 'Augmented', suffix: 'aug', intervals: [0, 4, 8] },
  { label: 'Suspended 4', suffix: 'sus4', intervals: [0, 5, 7] },
];
const SCALES = [
  { label: 'Major scale', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { label: 'Natural minor scale', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { label: 'Major pentatonic', intervals: [0, 2, 4, 7, 9] },
  { label: 'Minor pentatonic', intervals: [0, 3, 5, 7, 10] },
  { label: 'Blues scale', intervals: [0, 3, 5, 6, 7, 10] },
  { label: 'Dorian mode', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { label: 'Mixolydian mode', intervals: [0, 2, 4, 5, 7, 9, 10] },
];

const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const noteAt = (root, interval) => NOTES[(NOTE_INDEX[root] + interval + 120) % 12];
const noteFrequency = (note, octave) => 440 * Math.pow(2, (((octave + 1) * 12 + NOTE_INDEX[note]) - 69) / 12);

function addPluckNoise(ctx, destination, start, duration, amount = 0.04) {
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.025), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const source = ctx.createBufferSource();
  const gain = ctx.createGain();
  source.buffer = buffer;
  gain.gain.setValueAtTime(amount, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.min(0.04, duration));
  source.connect(gain);
  gain.connect(destination);
  source.start(start);
  source.stop(start + Math.min(0.05, duration));
}

function playTone(ctx, note, instrumentKey, delay = 0, duration = 0.55) {
  const instrument = INSTRUMENTS[instrumentKey] || INSTRUMENTS.piano;
  const start = ctx.currentTime + delay;
  const output = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const baseFrequency = noteFrequency(note, instrument.octave);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(instrument.filter, start);
  output.gain.setValueAtTime(0.0001, start);
  output.gain.exponentialRampToValueAtTime(0.24, start + instrument.attack);
  output.gain.exponentialRampToValueAtTime(instrument.sustain, start + instrument.attack + instrument.decay);
  output.gain.exponentialRampToValueAtTime(0.0001, start + duration + instrument.release);
  output.connect(filter);
  filter.connect(ctx.destination);

  if (instrument.pluck) addPluckNoise(ctx, output, start, duration, instrumentKey === 'ukulele' ? 0.028 : 0.04);

  const vibrato = instrument.vibrato ? ctx.createOscillator() : null;
  const vibratoDepth = instrument.vibrato ? ctx.createGain() : null;
  if (vibrato && vibratoDepth) {
    vibrato.frequency.setValueAtTime(5.5, start);
    vibratoDepth.gain.setValueAtTime(4.5, start);
    vibrato.start(start);
    vibrato.stop(start + duration + instrument.release);
  }

  instrument.harmonics.forEach((partial) => {
    const oscillator = ctx.createOscillator();
    const harmonicGain = ctx.createGain();
    oscillator.type = partial.type;
    oscillator.frequency.setValueAtTime(baseFrequency * partial.ratio, start);
    if (vibrato && vibratoDepth) vibrato.connect(vibratoDepth).connect(oscillator.frequency);
    harmonicGain.gain.setValueAtTime(partial.gain, start);
    oscillator.connect(harmonicGain);
    harmonicGain.connect(output);
    oscillator.start(start);
    oscillator.stop(start + duration + instrument.release + 0.08);
  });
}

function makeQuestion({ level, instruments, enabledTypes }) {
  const type = randomItem(enabledTypes.length ? enabledTypes : QUESTION_TYPES);
  const root = randomItem(NOTES);
  const instrument = randomItem(instruments);

  if (type === 'instrument') {
    const noteCount = level === 'advanced' ? 5 : level === 'intermediate' ? 4 : 3;
    const notes = Array.from({ length: noteCount }, () => randomItem(NOTES));
    return {
      type,
      prompt: 'Which instrument is playing these notes?',
      hidden: true,
      root,
      notes,
      instruments: [instrument],
      answer: INSTRUMENTS[instrument].label,
      choices: shuffle([INSTRUMENTS[instrument].label, ...shuffle(Object.entries(INSTRUMENTS).filter(([key]) => key !== instrument).map(([, data]) => data.label)).slice(0, 3)]),
    };
  }

  if (type === 'multi') {
    const count = level === 'advanced' ? 7 : level === 'intermediate' ? 5 : 3;
    const notes = shuffle(NOTES).slice(0, count);
    return {
      type,
      prompt: `Put these ${count} random notes in the order you hear them`,
      root: notes[0],
      notes,
      instruments: [instrument],
      answer: notes.join(' - '),
      choices: shuffle([notes.join(' - '), shuffle(notes).join(' - '), shuffle(notes).join(' - '), shuffle(notes).join(' - ')]),
    };
  }

  if (type === 'chord') {
    const chord = randomItem(CHORDS);
    const notes = chord.intervals.map((interval) => noteAt(root, interval));
    return {
      type,
      prompt: 'Name the chord quality and root',
      root,
      notes,
      instruments: [instrument],
      answer: `${root} ${chord.label}`,
      choices: shuffle([`${root} ${chord.label}`, ...shuffle(CHORDS.filter((item) => item.label !== chord.label)).slice(0, 3).map((item) => `${root} ${item.label}`)]),
      colorRoot: root,
    };
  }

  if (type === 'scale') {
    const scale = randomItem(SCALES);
    const notes = scale.intervals.map((interval) => noteAt(root, interval));
    return {
      type,
      prompt: 'Identify the scale or mode',
      root,
      notes,
      instruments: [instrument],
      answer: `${root} ${scale.label}`,
      choices: shuffle([`${root} ${scale.label}`, ...shuffle(SCALES.filter((item) => item.label !== scale.label)).slice(0, 3).map((item) => `${root} ${item.label}`)]),
    };
  }

  if (type === 'arpeggio') {
    const chord = randomItem(CHORDS);
    const notes = chord.intervals.map((interval) => noteAt(root, interval));
    return {
      type,
      prompt: 'Identify the arpeggio',
      root,
      notes,
      instruments: [instrument],
      answer: `${root} ${chord.label} arpeggio`,
      choices: shuffle([`${root} ${chord.label} arpeggio`, ...shuffle(CHORDS.filter((item) => item.label !== chord.label)).slice(0, 3).map((item) => `${root} ${item.label} arpeggio`)]),
    };
  }

  return {
    type: 'note',
    prompt: 'Name the note',
    root,
    notes: [root],
    instruments: [instrument],
    answer: root,
    choices: shuffle([root, ...shuffle(NOTES.filter((note) => note !== root)).slice(0, 3)]),
  };
}

const getInstrumentForNote = (question, noteIndex) => {
  if (!question) return 'piano';
  if (question.type === 'instrument') return question.instruments[0];
  return question.instruments[noteIndex % question.instruments.length] || question.instruments[0] || 'piano';
};

const getIntervalName = (root, note) => {
  const semitones = (NOTE_INDEX[note] - NOTE_INDEX[root] + 12) % 12;
  const names = {
    0: 'Root',
    1: 'b2',
    2: '2',
    3: 'b3',
    4: '3',
    5: '4',
    6: 'b5/#4',
    7: '5',
    8: 'b6/#5',
    9: '6',
    10: 'b7',
    11: '7',
  };
  return names[semitones] || '';
};

function PlayedNotesVisualizer({ question }) {
  if (!question) return null;

  const sequential = ['scale', 'arpeggio', 'multi', 'instrument'].includes(question.type);
  const uniqueInstruments = [...new Set(question.notes.map((_, noteIndex) => getInstrumentForNote(question, noteIndex)))];

  return (
    <Paper sx={{ mt: 3, p: 2.5, border: '3px solid var(--brutal-ink)', bgcolor: '#fff', boxShadow: '4px 4px 0 var(--brutal-ink)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap', mb: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 1000 }}>Played notes visualizer</Typography>
          <Typography sx={{ fontWeight: 750, opacity: 0.8 }}>
            {sequential ? 'These notes were played in this order.' : 'These notes were played together as one sound.'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {uniqueInstruments.map((instrumentKey) => (
            <Chip
              key={instrumentKey}
              label={`${INSTRUMENTS[instrumentKey]?.label || instrumentKey}: ${INSTRUMENTS[instrumentKey]?.soundfont || 'soundfont'}`}
              sx={{ fontWeight: 900, border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-mint)' }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ position: 'relative', minHeight: 128, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', overflow: 'hidden', mb: 2 }}>
        {[0, 1, 2, 3].map((line) => (
          <Box key={line} sx={{ position: 'absolute', left: 0, right: 0, top: `${20 + line * 24}%`, borderTop: '2px solid rgba(17,24,39,0.28)' }} />
        ))}
        <Box sx={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: `repeat(${Math.max(1, question.notes.length)}, minmax(82px, 1fr))`, gap: 1.25, p: 2 }}>
          {question.notes.map((note, noteIndex) => {
            const instrumentKey = getInstrumentForNote(question, noteIndex);
            const pitchRank = NOTE_INDEX[note];
            return (
              <Box key={`${note}-${noteIndex}`} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.75, transform: `translateY(${28 - pitchRank * 3}px)`, transition: 'transform 0.2s ease' }}>
                <Box sx={{ width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '3px solid var(--brutal-ink)', bgcolor: NOTE_COLORS[note], color: '#111', fontWeight: 1000, boxShadow: '3px 3px 0 var(--brutal-ink)' }}>
                  {note}
                </Box>
                <Typography sx={{ fontWeight: 1000, fontSize: 12 }}>#{noteIndex + 1}</Typography>
                <Typography sx={{ fontWeight: 850, fontSize: 11, textAlign: 'center' }}>{INSTRUMENTS[instrumentKey]?.label || instrumentKey}</Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: `repeat(${Math.min(4, Math.max(1, question.notes.length))}, 1fr)` }, gap: 1.25 }}>
        {question.notes.map((note, noteIndex) => {
          const instrumentKey = getInstrumentForNote(question, noteIndex);
          return (
            <Box key={`detail-${note}-${noteIndex}`} sx={{ p: 1.5, border: '2px solid var(--brutal-ink)', bgcolor: lighten(NOTE_COLORS[note], 0.72) }}>
              <Typography sx={{ fontWeight: 1000 }}>{sequential ? `Step ${noteIndex + 1}` : `Tone ${noteIndex + 1}`}: {note}</Typography>
              <Typography sx={{ fontWeight: 750, fontSize: 13 }}>{getIntervalName(question.root, note)} from {question.root}</Typography>
              <Typography sx={{ fontWeight: 750, fontSize: 13 }}>{INSTRUMENTS[instrumentKey]?.soundfont || 'Selected instrument'}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}

export default function EarTrainingPage() {
  const [level, setLevel] = useState('beginner');
  const [selectedInstruments, setSelectedInstruments] = useState(['piano', 'guitar', 'ukulele']);
  const [enabledTypes, setEnabledTypes] = useState(['note', 'chord', 'scale', 'arpeggio', 'multi', 'instrument']);
  const [deck, setDeck] = useState([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [slide, setSlide] = useState('right');
  const [isPlaying, setIsPlaying] = useState(false);

  const current = deck[index];
  const score = answers.filter(Boolean).length;
  const finished = deck.length === 10 && answers.length === 10;
  const activeInstruments = selectedInstruments.length ? selectedInstruments : ['piano'];

  const startSet = () => {
    const newDeck = Array.from({ length: 10 }, () => makeQuestion({ level, instruments: activeInstruments, enabledTypes }));
    setDeck(newDeck);
    setIndex(0);
    setAnswers([]);
    setRevealed(false);
    setSlide('right');
    setIsPlaying(false);
  };

  const playCard = async () => {
    if (!current || typeof window === 'undefined' || isPlaying) return;
    setIsPlaying(true);

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') await ctx.resume();

      const playSequential = ['scale', 'arpeggio', 'multi', 'instrument'].includes(current.type);
      const stepDelay = playSequential ? 0.48 : 0;
      const toneDuration = playSequential ? 0.32 : 0.75;
      current.notes.forEach((note, noteIndex) => {
        const instrument = getInstrumentForNote(current, noteIndex);
        playTone(ctx, note, instrument, stepDelay ? noteIndex * stepDelay : 0, toneDuration);
      });

      const totalDuration = (playSequential ? (current.notes.length - 1) * stepDelay : 0) + toneDuration + 0.9;
      window.setTimeout(() => {
        setIsPlaying(false);
        if (typeof ctx.close === 'function') ctx.close().catch(() => {});
      }, Math.max(900, totalDuration * 1000));
    } catch (error) {
      setIsPlaying(false);
    }
  };

  const answer = (choice) => {
    if (!current || answers[index] !== undefined) return;
    const correct = choice === current.answer;
    const nextAnswers = [...answers];
    nextAnswers[index] = correct;
    setAnswers(nextAnswers);
    setRevealed(true);
  };

  const move = (direction) => {
    const next = index + direction;
    if (next < 0 || next >= deck.length) return;
    setSlide(direction > 0 ? 'right' : 'left');
    setIndex(next);
    setRevealed(Boolean(answers[next] !== undefined));
    setIsPlaying(false);
  };

  const typeLabels = { note: 'Single notes', multi: '2-7 note memory', chord: 'Chords', scale: 'Scales', arpeggio: 'Arpeggios', instrument: 'Instrument guess' };

  const studyIdeas = useMemo(() => [
    'Sing the answer before revealing it, then replay the card and compare.',
    'Use one instrument only for 10 cards, then repeat with random instruments.',
    'For chords, listen first for major/minor quality, then root, then extensions.',
    'For scales, identify whether the third and seventh sound bright or dark.',
    'For multi-note cards, hum the contour before naming the exact notes.',
  ], []);

  return (
    <>
      <Head>
        <title>Ear Training Flashcards | Sheets Media</title>
        <meta name="description" content="Practice musical ear training with notes, chords, scales, arpeggios, instruments, and flashcard quizzes." />
      </Head>

      <Container maxWidth="xl" sx={{ py: { xs: 12, md: 14 } }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '360px 1fr' }, gap: 3 }}>
          <Paper sx={{ p: 3, border: '4px solid var(--brutal-ink)', boxShadow: '8px 8px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
            <Typography variant="h4" sx={{ fontWeight: 1000, mb: 1 }}>Ear Training Lab</Typography>
            <Typography sx={{ fontWeight: 700, mb: 3 }}>Beginner to advanced listening flashcards. Each set has 10 cards.</Typography>

            <Typography sx={{ fontWeight: 900, mb: 1 }}>Level</Typography>
            <Select fullWidth size="small" value={level} onChange={(event) => setLevel(event.target.value)} sx={{ mb: 3, bgcolor: '#fff', border: '2px solid var(--brutal-ink)' }}>
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="advanced">Advanced</MenuItem>
            </Select>

            <Typography sx={{ fontWeight: 900, mb: 1 }}>Quiz types</Typography>
            <FormGroup sx={{ mb: 3 }}>
              {QUESTION_TYPES.map((type) => (
                <FormControlLabel key={type} control={<Checkbox checked={enabledTypes.includes(type)} onChange={() => setEnabledTypes((value) => value.includes(type) ? value.filter((item) => item !== type) : [...value, type])} />} label={typeLabels[type]} />
              ))}
            </FormGroup>

            <Typography sx={{ fontWeight: 900, mb: 1 }}>Instruments</Typography>
            <FormGroup sx={{ mb: 3 }}>
              {Object.entries(INSTRUMENTS).map(([key, instrument]) => (
                <FormControlLabel key={key} control={<Checkbox checked={selectedInstruments.includes(key)} onChange={() => setSelectedInstruments((value) => value.includes(key) ? value.filter((item) => item !== key) : [...value, key])} />} label={`${instrument.label} soundfont`} />
              ))}
            </FormGroup>

            <Button fullWidth variant="contained" onClick={startSet} sx={{ color: 'var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)', fontWeight: 1000, '&:hover': { bgcolor: 'var(--brutal-pink)' } }}>
              Start a new set of 10
            </Button>
          </Paper>

          <Box>
            <Paper sx={{ p: { xs: 2, md: 4 }, minHeight: 520, border: '4px solid var(--brutal-ink)', boxShadow: '8px 8px 0 var(--brutal-ink)', bgcolor: current && revealed ? lighten(NOTE_COLORS[current.colorRoot || current.root] || NOTE_COLORS.C, current.type === 'chord' ? 0.72 : 0.86) : 'var(--brutal-paper)', transform: `translateX(${slide === 'right' ? 0 : 0}px)`, transition: 'transform 0.2s ease, background-color 0.2s ease' }}>
              {!current ? (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <Typography variant="h2" sx={{ fontWeight: 1000, mb: 2 }}>Train your ear like a musician.</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, maxWidth: 760, mx: 'auto', mb: 4 }}>Listen, guess, reveal, score. Practice notes, intervals, chords, scales, arpeggios, instruments, and short melodic memory cards.</Typography>
                  <Button onClick={startSet} sx={{ color: 'var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)', fontWeight: 1000 }}>Start training</Button>
                </Box>
              ) : finished ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h2" sx={{ fontWeight: 1000 }}>Score: {score}/10</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, mt: 2, mb: 4 }}>{score >= 8 ? 'Great ear. Raise the level or restrict the instrument.' : score >= 5 ? 'Good set. Replay the missed card types.' : 'Slow it down: start with single notes and chords only.'}</Typography>
                  <Button onClick={startSet} sx={{ color: 'var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)', fontWeight: 1000 }}>New set</Button>
                </Box>
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Chip label={`Card ${index + 1}/10`} sx={{ fontWeight: 1000, border: '2px solid var(--brutal-ink)', bgcolor: '#fff' }} />
                    <Chip label={typeLabels[current.type]} sx={{ fontWeight: 1000, border: '2px solid var(--brutal-ink)', bgcolor: revealed ? NOTE_COLORS[current.root] : HIDDEN_NOTE_COLOR }} />
                  </Box>
                  <LinearProgress variant="determinate" value={(index + 1) * 10} sx={{ mb: 3, height: 12, border: '2px solid var(--brutal-ink)', bgcolor: '#fff' }} />
                  <Box sx={{ minHeight: 180, display: 'grid', placeItems: 'center', border: '4px solid var(--brutal-ink)', bgcolor: current.hidden ? '#111827' : '#fff', color: current.hidden ? '#fff' : 'var(--brutal-ink)', boxShadow: '5px 5px 0 var(--brutal-ink)', p: 3, mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 1000, textAlign: 'center' }}>{current.hidden ? 'Invisible listening card' : current.prompt}</Typography>
                    {!current.hidden && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>{current.notes.map((note, noteIndex) => <Chip key={`${note}-${noteIndex}`} label={revealed ? note : '?'} sx={{ fontWeight: 1000, bgcolor: revealed ? NOTE_COLORS[note] : HIDDEN_NOTE_COLOR, color: '#111', border: '2px solid var(--brutal-ink)' }} />)}</Box>}
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3, alignItems: 'center' }}>
                    <Button disabled={isPlaying} onClick={playCard} sx={{ color: 'var(--brutal-ink)', bgcolor: isPlaying ? HIDDEN_NOTE_COLOR : 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', boxShadow: '3px 3px 0 var(--brutal-ink)', fontWeight: 1000 }}>{isPlaying ? 'Playing...' : 'Play sound'}</Button>
                    <Button onClick={() => move(-1)} disabled={index === 0 || isPlaying} sx={{ fontWeight: 900 }}>Slide left</Button>
                    <Button onClick={() => move(1)} disabled={index === 9 || isPlaying} sx={{ fontWeight: 900 }}>Slide right</Button>
                    {isPlaying && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1, border: '3px solid var(--brutal-ink)', bgcolor: '#fff', boxShadow: '3px 3px 0 var(--brutal-ink)' }}>
                        <CircularProgress size={22} thickness={5} />
                        <Typography sx={{ fontWeight: 1000 }}>
                          Preparing and playing the {INSTRUMENTS[current.instruments[0]]?.soundfont || 'selected instrument'} soundfont...
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    {current.choices.map((choice) => {
                      const selected = revealed && choice === current.answer;
                      return <Button key={choice} onClick={() => answer(choice)} disabled={answers[index] !== undefined || isPlaying} sx={{ justifyContent: 'flex-start', color: 'var(--brutal-ink)', bgcolor: selected ? 'var(--brutal-mint)' : '#fff', border: '3px solid var(--brutal-ink)', boxShadow: '3px 3px 0 var(--brutal-ink)', fontWeight: 900, p: 2 }}>{choice}</Button>;
                    })}
                  </Box>
                  {revealed && (
                    <>
                      <Typography sx={{ mt: 3, fontWeight: 1000 }}>Answer: {current.answer}</Typography>
                      <PlayedNotesVisualizer question={current} />
                    </>
                  )}
                </>
              )}
            </Paper>

            <Box sx={{ mt: 4, display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 1 }}>
              {NOTES.map((note) => <Box key={note} sx={{ p: 1.25, textAlign: 'center', fontWeight: 1000, bgcolor: NOTE_COLORS[note], border: '3px solid var(--brutal-ink)' }}>{note}</Box>)}
            </Box>

            <Paper sx={{ mt: 4, p: 3, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
              <Typography variant="h5" sx={{ fontWeight: 1000, mb: 2 }}>Other ways to improve your ear</Typography>
              {studyIdeas.map((idea) => <Typography key={idea} sx={{ fontWeight: 700, mb: 1 }}>• {idea}</Typography>)}
            </Paper>
          </Box>
        </Box>
      </Container>
    </>
  );
}
