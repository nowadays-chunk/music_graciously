import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MemoryIcon from '@mui/icons-material/Memory';
import HubIcon from '@mui/icons-material/Hub';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const NOTE_NAMES = ['C', 'D', 'E', 'G', 'A'];
const FLASHCARDS = [
  { q: 'What notes are in C major?', a: 'C D E F G A B' },
  { q: 'What is a ii-V-I in C?', a: 'Dm7 - G7 - Cmaj7' },
  { q: 'What is the 5th of G?', a: 'D' },
  { q: 'What scale fits Am7?', a: 'A minor or A Dorian' },
  { q: 'What does V7 resolve to?', a: 'I or i' },
];

const NAV_SECTIONS = [
  {
    title: 'Play',
    href: '/play',
    label: 'Instrument visualizers',
    color: 'var(--brutal-yellow)',
    icon: <MusicNoteIcon />,
    description: 'Open guitar, piano, violin, bass, trumpet, saxophone, ukulele, or double-bass layouts and inspect notes directly on the instrument.',
    inside: ['8 instrument pages', 'scales/chords/arpeggios', 'interactive note highlighting'],
  },
  {
    title: 'Generate',
    href: '/generate',
    label: '30-second music generator',
    color: 'var(--brutal-blue)',
    icon: <AutoAwesomeIcon />,
    description: 'Generate rhythm and solo ideas with performance metadata, articulations, and audible playback.',
    inside: ['instrument effects', 'generated JSON events', 'SoundFont + synth fallback'],
  },
  {
    title: 'Ear Training',
    href: '/ear-training',
    label: 'Listen and guess',
    color: 'var(--brutal-mint)',
    icon: <PlayArrowIcon />,
    description: 'Practice recognition by hearing musical ideas and checking your answer against note sets.',
    inside: ['random challenges', 'hidden notes', 'progress feedback'],
  },
  {
    title: 'Map',
    href: '/matches',
    label: 'Matches network',
    color: 'var(--brutal-pink)',
    icon: <HubIcon />,
    description: 'Explore how chords, scales, modes, and arpeggios connect through shared notes.',
    inside: ['network graph', 'entity matching', 'relationship exploration'],
  },
  {
    title: 'Progressions',
    href: '/progressions',
    label: 'Chord movement lab',
    color: 'var(--brutal-orange)',
    icon: <MusicNoteIcon />,
    description: 'Visualize chord progressions, Roman numerals, and harmonic motion before going deeper.',
    inside: ['I-vi-ii-V preview', 'chord timeline', 'songwriter workflow'],
  },
  {
    title: 'Detector',
    href: '/play/detector',
    label: 'Find what your notes make',
    color: 'var(--brutal-paper)',
    icon: <MemoryIcon />,
    description: 'Select notes and detect possible chords, scales, and arpeggios.',
    inside: ['note selection', 'chord detection', 'scale matching'],
  },
  {
    title: 'Compose',
    href: '/compose',
    label: 'Write ideas',
    color: 'var(--brutal-pink)',
    icon: <AutoAwesomeIcon />,
    description: 'Move from theory discovery into writing, arranging, and shaping musical ideas.',
    inside: ['composition workspace', 'idea capture', 'creative flow'],
  },
  {
    title: 'References',
    href: '/references',
    label: 'Theory library',
    color: 'var(--brutal-mint)',
    icon: <MemoryIcon />,
    description: 'Look inside the reference system for theory concepts, diagrams, and learning material.',
    inside: ['definitions', 'music theory pages', 'study references'],
  },
];

const progression = ['Cmaj7', 'Am7', 'Dm7', 'G7'];

const miniPlay = async () => {
  if (typeof window === 'undefined') return;
  const Tone = await import('tone');
  await Tone.start();
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.01, decay: 0.14, sustain: 0.28, release: 0.5 },
  }).toDestination();
  const now = Tone.now();
  ['C4', 'E4', 'G4', 'B4', 'A4', 'G4'].forEach((note, index) => {
    synth.triggerAttackRelease(note, '8n', now + index * 0.18, 0.55);
  });
};

const HomepageNavigationShowcase = () => {
  const [flashIndex, setFlashIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [activeChord, setActiveChord] = useState(0);
  const [selectedNotes, setSelectedNotes] = useState(['C', 'E', 'G']);
  const flashcard = FLASHCARDS[flashIndex];

  const detected = useMemo(() => {
    const set = selectedNotes.join('-');
    if (set === 'C-E-G') return 'C major triad';
    if (set === 'D-F-A') return 'D minor triad';
    if (set === 'G-B-D') return 'G major triad';
    return `${selectedNotes.length} selected notes`;
  }, [selectedNotes]);

  const shuffleFlashcard = () => {
    setFlashIndex((current) => (current + 1) % FLASHCARDS.length);
    setRevealed(false);
  };

  const toggleNote = (note) => {
    setSelectedNotes((current) => current.includes(note) ? current.filter((item) => item !== note) : [...current, note]);
  };

  return (
    <Box id="homepage-tools" sx={{ bgcolor: 'var(--brutal-bg)', py: 10, borderBottom: '4px solid var(--brutal-ink)' }}>
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip label="Everything in the navigation, playable from the homepage" sx={{ bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', fontWeight: 900, mb: 2 }} />
          <Typography variant="h2" sx={{ fontWeight: 950, color: 'var(--brutal-ink)', lineHeight: 1 }}>
            Try every Sheets-Media tool before opening it.
          </Typography>
          <Typography sx={{ mt: 2, fontWeight: 800, color: 'var(--brutal-ink)', maxWidth: 820, mx: 'auto' }}>
            Hear a tiny demo, inspect chord movement, flip a flashcard, select notes, and jump straight into each page.
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', bgcolor: 'var(--brutal-paper)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Hear sound</Typography>
                <Typography sx={{ fontWeight: 800, mb: 2 }}>Mini Tone.js synth preview. The generator page uses the larger playback chain.</Typography>
                <Button onClick={miniPlay} startIcon={<PlayArrowIcon />} sx={{ bgcolor: 'var(--brutal-yellow)', color: 'var(--brutal-ink)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)', fontWeight: 900 }}>
                  Play demo sound
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', bgcolor: 'var(--brutal-paper)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Visualize progression</Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                  {progression.map((chord, index) => (
                    <Chip key={chord} label={chord} onClick={() => setActiveChord(index)} sx={{ bgcolor: activeChord === index ? 'var(--brutal-orange)' : 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', fontWeight: 900 }} />
                  ))}
                </Stack>
                <LinearProgress variant="determinate" value={(activeChord + 1) * 25} sx={{ height: 14, border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', bgcolor: 'var(--brutal-paper)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Flashcard</Typography>
                <Typography sx={{ fontWeight: 900, minHeight: 52 }}>{revealed ? flashcard.a : flashcard.q}</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button onClick={() => setRevealed((value) => !value)} sx={{ border: '3px solid var(--brutal-ink)', fontWeight: 900 }}>Flip</Button>
                  <Button onClick={shuffleFlashcard} startIcon={<ShuffleIcon />} sx={{ border: '3px solid var(--brutal-ink)', fontWeight: 900 }}>Next</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card sx={{ mb: 4, border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', bgcolor: 'var(--brutal-paper)' }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 950, mb: 2 }}>Detector mini-preview</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {NOTE_NAMES.map((note) => (
                <Chip key={note} label={note} onClick={() => toggleNote(note)} sx={{ bgcolor: selectedNotes.includes(note) ? 'var(--brutal-blue)' : 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', fontWeight: 900 }} />
              ))}
            </Stack>
            <Typography sx={{ fontWeight: 900 }}>Detected: {detected}</Typography>
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          {NAV_SECTIONS.map((section) => (
            <Grid key={section.href} item xs={12} sm={6} lg={3}>
              <Card sx={{ height: '100%', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', bgcolor: 'var(--brutal-paper)', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ bgcolor: section.color, borderBottom: '4px solid var(--brutal-ink)', p: 2, display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  {section.icon}
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 950, lineHeight: 1 }}>{section.title}</Typography>
                    <Typography variant="caption" sx={{ fontWeight: 900 }}>{section.label}</Typography>
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography sx={{ fontWeight: 800, mb: 2 }}>{section.description}</Typography>
                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    {section.inside.map((item) => <Chip key={item} label={item} sx={{ justifyContent: 'flex-start', fontWeight: 800, border: '2px solid var(--brutal-ink)' }} />)}
                  </Stack>
                  <Button component={Link} href={section.href} endIcon={<ArrowForwardIcon />} sx={{ mt: 'auto', bgcolor: section.color, color: 'var(--brutal-ink)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)', fontWeight: 900 }}>
                    Open {section.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomepageNavigationShowcase;
