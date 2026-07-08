import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

const KIND_LABEL = {
  chord: 'Chord',
  scale: 'Scale',
  arpeggio: 'Arpeggio',
};

const KIND_PREFIX = {
  chord: 'CH',
  scale: 'SC',
  arpeggio: 'ARP',
};

const INSTRUMENTS = [
  { id: 'piano', label: 'Piano', description: 'Two-octave keyboard visualizer.' },
  { id: 'guitar', label: 'Guitar', description: 'Six-string standard tuning.' },
  { id: 'bass', label: 'Bass', description: 'Four-string bass tuning.' },
  { id: 'ukulele', label: 'Ukulele', description: 'G C E A ukulele tuning.' },
  { id: 'violin', label: 'Violin', description: 'G D A E violin tuning.' },
  { id: 'double-bass', label: 'Double Bass', description: 'E A D G upright tuning.' },
];

const STRINGED = {
  guitar: { label: 'Guitar', tuning: ['E', 'B', 'G', 'D', 'A', 'E'], fretCount: 12 },
  bass: { label: 'Bass', tuning: ['G', 'D', 'A', 'E'], fretCount: 12 },
  ukulele: { label: 'Ukulele', tuning: ['A', 'E', 'C', 'G'], fretCount: 12 },
  violin: { label: 'Violin', tuning: ['E', 'A', 'D', 'G'], fretCount: 12 },
  'double-bass': { label: 'Double Bass', tuning: ['G', 'D', 'A', 'E'], fretCount: 12 },
};

const FORMULAS = [
  { kind: 'chord', name: 'major chord', abbreviation: 'maj', intervals: [0, 4, 7] },
  { kind: 'chord', name: 'minor chord', abbreviation: 'min', intervals: [0, 3, 7] },
  { kind: 'chord', name: 'diminished chord', abbreviation: 'dim', intervals: [0, 3, 6] },
  { kind: 'chord', name: 'augmented chord', abbreviation: 'aug', intervals: [0, 4, 8] },
  { kind: 'chord', name: 'suspended second chord', abbreviation: 'sus2', intervals: [0, 2, 7] },
  { kind: 'chord', name: 'suspended fourth chord', abbreviation: 'sus4', intervals: [0, 5, 7] },
  { kind: 'chord', name: 'dominant seventh chord', abbreviation: '7', intervals: [0, 4, 7, 10] },
  { kind: 'chord', name: 'major seventh chord', abbreviation: 'maj7', intervals: [0, 4, 7, 11] },
  { kind: 'chord', name: 'minor seventh chord', abbreviation: 'min7', intervals: [0, 3, 7, 10] },
  { kind: 'chord', name: 'minor major seventh chord', abbreviation: 'mMaj7', intervals: [0, 3, 7, 11] },
  { kind: 'chord', name: 'half-diminished seventh chord', abbreviation: 'm7b5', intervals: [0, 3, 6, 10] },
  { kind: 'chord', name: 'diminished seventh chord', abbreviation: 'dim7', intervals: [0, 3, 6, 9] },
  { kind: 'chord', name: 'sixth chord', abbreviation: '6', intervals: [0, 4, 7, 9] },
  { kind: 'chord', name: 'minor sixth chord', abbreviation: 'm6', intervals: [0, 3, 7, 9] },
  { kind: 'scale', name: 'major scale', abbreviation: 'Ion', intervals: [0, 2, 4, 5, 7, 9, 11] },
  { kind: 'scale', name: 'natural minor scale', abbreviation: 'Aeol', intervals: [0, 2, 3, 5, 7, 8, 10] },
  { kind: 'scale', name: 'harmonic minor scale', abbreviation: 'Hmin', intervals: [0, 2, 3, 5, 7, 8, 11] },
  { kind: 'scale', name: 'melodic minor scale', abbreviation: 'Mmin', intervals: [0, 2, 3, 5, 7, 9, 11] },
  { kind: 'scale', name: 'Dorian mode', abbreviation: 'Dor', intervals: [0, 2, 3, 5, 7, 9, 10] },
  { kind: 'scale', name: 'Phrygian mode', abbreviation: 'Phr', intervals: [0, 1, 3, 5, 7, 8, 10] },
  { kind: 'scale', name: 'Lydian mode', abbreviation: 'Lyd', intervals: [0, 2, 4, 6, 7, 9, 11] },
  { kind: 'scale', name: 'Mixolydian mode', abbreviation: 'Mix', intervals: [0, 2, 4, 5, 7, 9, 10] },
  { kind: 'scale', name: 'Locrian mode', abbreviation: 'Loc', intervals: [0, 1, 3, 5, 6, 8, 10] },
  { kind: 'scale', name: 'major pentatonic scale', abbreviation: 'MajP', intervals: [0, 2, 4, 7, 9] },
  { kind: 'scale', name: 'minor pentatonic scale', abbreviation: 'MinP', intervals: [0, 3, 5, 7, 10] },
  { kind: 'scale', name: 'blues scale', abbreviation: 'Blues', intervals: [0, 3, 5, 6, 7, 10] },
  { kind: 'scale', name: 'chromatic scale', abbreviation: 'Chr', intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
  { kind: 'arpeggio', name: 'major arpeggio', abbreviation: 'maj', intervals: [0, 4, 7, 12] },
  { kind: 'arpeggio', name: 'minor arpeggio', abbreviation: 'min', intervals: [0, 3, 7, 12] },
  { kind: 'arpeggio', name: 'dominant seventh arpeggio', abbreviation: '7', intervals: [0, 4, 7, 10, 12] },
  { kind: 'arpeggio', name: 'major seventh arpeggio', abbreviation: 'maj7', intervals: [0, 4, 7, 11, 12] },
  { kind: 'arpeggio', name: 'minor seventh arpeggio', abbreviation: 'min7', intervals: [0, 3, 7, 10, 12] },
  { kind: 'arpeggio', name: 'diminished arpeggio', abbreviation: 'dim', intervals: [0, 3, 6, 12] },
  { kind: 'arpeggio', name: 'augmented arpeggio', abbreviation: 'aug', intervals: [0, 4, 8, 12] },
];

const PageShell = styled(Box)({
  marginTop: '88px',
  minHeight: '100vh',
  background: 'var(--brutal-bg)',
  padding: '48px 0',
});

const BrutalPanel = styled(Paper)({
  border: '4px solid var(--brutal-ink)',
  borderRadius: 4,
  boxShadow: 'var(--brutal-shadow)',
  background: 'rgba(255,253,245,0.94)',
  padding: 24,
});

const BrutalButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'active' })(({ active }) => ({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  boxShadow: active ? 'none' : '4px 4px 0 var(--brutal-ink)',
  background: active ? 'var(--brutal-pink)' : 'var(--brutal-paper)',
  color: 'var(--brutal-ink)',
  transform: active ? 'translate(3px, 3px)' : 'none',
  fontWeight: 900,
  textTransform: 'none',
  '&:hover': {
    background: 'var(--brutal-yellow)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    transform: 'translate(2px, 2px)',
  },
}));

const SmallBox = styled(Button, { shouldForwardProp: (prop) => prop !== 'active' })(({ active }) => ({
  borderRadius: 4,
  border: '3px solid var(--brutal-ink)',
  minHeight: 38,
  background: active ? 'var(--brutal-ink)' : 'var(--brutal-mint)',
  color: active ? 'var(--brutal-paper)' : 'var(--brutal-ink)',
  fontWeight: 950,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  padding: '6px 10px',
  '&:hover': {
    background: active ? 'var(--brutal-ink)' : 'var(--brutal-yellow)',
  },
}));

function noteIndex(note) {
  return NOTE_NAMES.indexOf(note);
}

function transpose(root, interval) {
  return NOTE_NAMES[(noteIndex(root) + interval + 120) % 12];
}

function uniqueNotes(notes) {
  return Array.from(new Set(notes));
}

function buildEntities() {
  return NOTE_NAMES.flatMap((root) =>
    FORMULAS.map((formula) => ({
      ...formula,
      root,
      id: `${root}-${formula.kind}-${formula.abbreviation}-${formula.name}`,
    })),
  );
}

function entityNotes(entity) {
  return uniqueNotes(entity.intervals.map((interval) => transpose(entity.root, interval)));
}

function fullTitle(entity) {
  return `${entity.root} ${entity.name} (${KIND_LABEL[entity.kind]})`;
}

function shortTitle(entity) {
  return `${KIND_PREFIX[entity.kind]}: ${entity.root}${entity.abbreviation}`;
}

function scoreEntity(entity, selectedNotes) {
  const notes = entityNotes(entity);
  const selectedSet = new Set(selectedNotes);
  const entitySet = new Set(notes);
  const matched = selectedNotes.filter((note) => entitySet.has(note)).length;
  const missing = notes.filter((note) => !selectedSet.has(note)).length;
  const extra = selectedNotes.filter((note) => !entitySet.has(note)).length;
  const containsSelection = selectedNotes.length > 0 && extra === 0;
  const isExact = selectedNotes.length > 0 && extra === 0 && missing === 0;
  const score = matched * 14 - missing * 2 - extra * 9 + (containsSelection ? 10 : 0) + (isExact ? 30 : 0);
  return { ...entity, notes, matched, missing, extra, containsSelection, isExact, score };
}

function detectSuggestions(entities, selectedNotes) {
  if (selectedNotes.length === 0) return [];
  const scored = entities
    .map((entity) => scoreEntity(entity, selectedNotes))
    .filter((item) => item.matched > 0)
    .sort((a, b) => {
      if (a.isExact !== b.isExact) return a.isExact ? -1 : 1;
      if (a.extra !== b.extra) return a.extra - b.extra;
      if (a.missing !== b.missing) return a.missing - b.missing;
      return b.score - a.score;
    });

  const seen = new Set();
  return scored.filter((item) => {
    const key = `${item.kind}-${item.root}-${item.abbreviation}-${item.notes.join('-')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 10);
}

function DetectorPage() {
  const [instrument, setInstrument] = useState('piano');
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [hoveredSuggestionId, setHoveredSuggestionId] = useState(null);
  const [activeSuggestionId, setActiveSuggestionId] = useState(null);

  const entities = useMemo(buildEntities, []);
  const suggestions = useMemo(() => detectSuggestions(entities, selectedNotes), [entities, selectedNotes]);
  const previewSuggestion = useMemo(
    () => suggestions.find((item) => item.id === hoveredSuggestionId) || suggestions.find((item) => item.id === activeSuggestionId) || suggestions[0],
    [activeSuggestionId, hoveredSuggestionId, suggestions],
  );
  const previewNotes = previewSuggestion ? previewSuggestion.notes.filter((note) => !selectedNotes.includes(note)) : [];
  const displayedTitle = previewSuggestion ? fullTitle(previewSuggestion) : 'Select notes to detect a chord, scale, or arpeggio';

  const toggleNote = (note) => {
    setActiveSuggestionId(null);
    setSelectedNotes((current) => (current.includes(note) ? current.filter((item) => item !== note) : [...current, note]));
  };

  const applySuggestion = (suggestion) => {
    setSelectedNotes(suggestion.notes);
    setActiveSuggestionId(suggestion.id);
    setHoveredSuggestionId(null);
  };

  return (
    <>
      <Head>
        <title>Interactive Music Detector | Chords, Scales & Arpeggios</title>
        <meta
          name="description"
          content="Select notes on an empty instrument visualizer and detect matching chords, scales, and arpeggios with transparent note completions."
        />
      </Head>

      <PageShell>
        <Container maxWidth="xl">
          <Stack spacing={4}>
            <BrutalPanel sx={{ background: 'var(--brutal-yellow)' }}>
              <Grid container spacing={3} alignItems="flex-end">
                <Grid item xs={12} md={6}>
                  <Chip
                    label="Play Detector"
                    sx={{ border: '3px solid var(--brutal-ink)', fontWeight: 900, background: 'var(--brutal-mint)', mb: 2 }}
                  />
                  <Typography variant="h2" sx={{ color: 'var(--brutal-ink)', fontWeight: 950, lineHeight: 0.95 }}>
                    Detect and complete musical shapes.
                  </Typography>
                  <Typography sx={{ mt: 2, color: 'var(--brutal-ink)', fontWeight: 700, maxWidth: 680 }}>
                    Choose an empty visualizer, insert notes, then see the exact or closest chord, scale, and arpeggio matches. Hover any suggestion to show only its transparent completion; click it to fill the visualizer.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={1.5}>
                    {INSTRUMENTS.map((item) => (
                      <Grid item xs={6} sm={4} key={item.id}>
                        <BrutalButton active={instrument === item.id ? 1 : 0} fullWidth onClick={() => setInstrument(item.id)}>
                          <Box sx={{ textAlign: 'left', width: '100%' }}>
                            <Typography sx={{ fontWeight: 950 }}>{item.label}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, lineHeight: 1.25 }}>
                              {item.description}
                            </Typography>
                          </Box>
                        </BrutalButton>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </BrutalPanel>

            <BrutalPanel>
              <Stack direction={{ xs: 'column', lg: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', lg: 'center' }} spacing={2} sx={{ mb: 3 }}>
                <Box>
                  <Typography sx={{ color: 'var(--brutal-ink)', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Currently displayed
                  </Typography>
                  <Typography variant="h4" sx={{ color: 'var(--brutal-ink)', fontWeight: 950 }}>
                    {displayedTitle}
                  </Typography>
                </Box>

                <Stack direction="row" flexWrap="wrap" gap={1} justifyContent={{ xs: 'flex-start', lg: 'flex-end' }}>
                  {suggestions.length > 0 ? suggestions.map((suggestion) => (
                    <Tooltip key={suggestion.id} title={fullTitle(suggestion)} arrow>
                      <SmallBox
                        active={(hoveredSuggestionId === suggestion.id || activeSuggestionId === suggestion.id) ? 1 : 0}
                        onClick={() => applySuggestion(suggestion)}
                        onMouseEnter={() => setHoveredSuggestionId(suggestion.id)}
                        onMouseLeave={() => setHoveredSuggestionId(null)}
                      >
                        {shortTitle(suggestion)}
                      </SmallBox>
                    </Tooltip>
                  )) : (
                    <Chip label="CH / SC / ARP suggestions appear here" sx={{ border: '3px solid var(--brutal-ink)', fontWeight: 900 }} />
                  )}
                </Stack>
              </Stack>

              <Box sx={{ border: '4px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', boxShadow: '4px 4px 0 var(--brutal-ink)', p: 2, overflowX: 'auto' }}>
                {instrument === 'piano' ? (
                  <PianoDetector selectedNotes={selectedNotes} previewNotes={previewNotes} onToggleNote={toggleNote} />
                ) : (
                  <StringedDetector instrument={STRINGED[instrument]} selectedNotes={selectedNotes} previewNotes={previewNotes} onToggleNote={toggleNote} />
                )}
              </Box>
            </BrutalPanel>

            <Grid container spacing={3}>
              <Grid item xs={12} lg={8}>
                <BrutalPanel>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2} sx={{ mb: 2 }}>
                    <Box>
                      <Typography sx={{ fontWeight: 950, color: 'var(--brutal-ink)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                        Suggestions
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 950, color: 'var(--brutal-ink)' }}>
                        Closest matches {suggestions.length ? `(${suggestions.length})` : ''}
                      </Typography>
                    </Box>
                    <BrutalButton onClick={() => { setSelectedNotes([]); setActiveSuggestionId(null); setHoveredSuggestionId(null); }}>
                      Clear notes
                    </BrutalButton>
                  </Stack>

                  <Grid container spacing={2}>
                    {suggestions.length > 0 ? suggestions.map((suggestion) => (
                      <Grid item xs={12} sm={6} md={4} key={suggestion.id}>
                        <Tooltip title={fullTitle(suggestion)} arrow>
                          <Paper
                            component="button"
                            onClick={() => applySuggestion(suggestion)}
                            onMouseEnter={() => setHoveredSuggestionId(suggestion.id)}
                            onMouseLeave={() => setHoveredSuggestionId(null)}
                            sx={{
                              width: '100%',
                              textAlign: 'left',
                              p: 2,
                              cursor: 'pointer',
                              border: '3px solid var(--brutal-ink)',
                              borderRadius: 1,
                              bgcolor: hoveredSuggestionId === suggestion.id || activeSuggestionId === suggestion.id ? 'var(--brutal-ink)' : 'var(--brutal-mint)',
                              color: hoveredSuggestionId === suggestion.id || activeSuggestionId === suggestion.id ? 'var(--brutal-paper)' : 'var(--brutal-ink)',
                              boxShadow: '4px 4px 0 var(--brutal-ink)',
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 950, opacity: 0.75 }}>{KIND_PREFIX[suggestion.kind]}</Typography>
                                <Typography sx={{ fontWeight: 950, fontSize: 20 }}>{suggestion.root} {suggestion.abbreviation}</Typography>
                              </Box>
                              <Chip size="small" label={suggestion.isExact ? 'Exact' : 'Close'} sx={{ fontWeight: 900, border: '2px solid currentColor' }} />
                            </Stack>
                            <Typography sx={{ mt: 1, fontWeight: 800, opacity: 0.8 }}>{fullTitle(suggestion)}</Typography>
                            <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1.5 }}>
                              {suggestion.notes.map((note) => (
                                <Chip key={note} size="small" label={note} sx={{ fontWeight: 900, opacity: selectedNotes.includes(note) ? 1 : 0.48 }} />
                              ))}
                            </Stack>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    )) : (
                      <Grid item xs={12}>
                        <Typography sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>
                          Click notes on the visualizer to get up to ten exact or closest matches.
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </BrutalPanel>
              </Grid>

              <Grid item xs={12} lg={4}>
                <BrutalPanel>
                  <Typography sx={{ fontWeight: 950, color: 'var(--brutal-ink)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                    Inserted notes
                  </Typography>
                  <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 2 }}>
                    {selectedNotes.length ? selectedNotes.map((note) => (
                      <Chip key={note} label={note} onDelete={() => toggleNote(note)} sx={{ border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-blue)', fontWeight: 950 }} />
                    )) : (
                      <Typography sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>No notes inserted yet.</Typography>
                    )}
                  </Stack>

                  {previewNotes.length > 0 && (
                    <Box sx={{ mt: 3, border: '3px solid var(--brutal-ink)', p: 2, bgcolor: 'var(--brutal-yellow)' }}>
                      <Typography sx={{ fontWeight: 950, color: 'var(--brutal-ink)' }}>Transparent completion</Typography>
                      <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                        {previewNotes.map((note) => <Chip key={note} label={note} sx={{ fontWeight: 950, opacity: 0.5 }} />)}
                      </Stack>
                    </Box>
                  )}
                </BrutalPanel>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </PageShell>
    </>
  );
}

function PianoDetector({ selectedNotes, previewNotes, onToggleNote }) {
  const whiteWidth = 48;
  const whiteHeight = 190;
  const blackWidth = 30;
  const blackHeight = 116;
  const startMidi = 48;
  const endMidi = 71;
  const whiteKeys = [];
  const blackKeys = [];
  let whiteIndex = 0;

  for (let midi = startMidi; midi <= endMidi; midi += 1) {
    const note = NOTE_NAMES[midi % 12];
    const isBlack = note.includes('#');
    if (!isBlack) {
      whiteKeys.push({ midi, note, x: whiteIndex * whiteWidth });
      whiteIndex += 1;
    }
  }

  whiteKeys.forEach((key) => {
    if ([0, 2, 5, 7, 9].includes(key.midi % 12) && key.midi < endMidi) {
      const midi = key.midi + 1;
      blackKeys.push({ midi, note: NOTE_NAMES[midi % 12], x: key.x + whiteWidth - blackWidth / 2 });
    }
  });

  const keyFill = (note, isBlack) => {
    if (selectedNotes.includes(note)) return 'var(--brutal-blue)';
    if (previewNotes.includes(note)) return isBlack ? 'rgba(30,30,30,0.45)' : 'rgba(41, 151, 255, 0.35)';
    return isBlack ? 'var(--brutal-ink)' : 'var(--brutal-paper)';
  };

  return (
    <Box sx={{ minWidth: whiteKeys.length * whiteWidth, display: 'flex', justifyContent: 'center' }}>
      <svg width={whiteKeys.length * whiteWidth} height={whiteHeight + 22} viewBox={`0 0 ${whiteKeys.length * whiteWidth} ${whiteHeight + 22}`}>
        {whiteKeys.map((key) => (
          <g key={key.midi} onClick={() => onToggleNote(key.note)} style={{ cursor: 'pointer' }}>
            <rect x={key.x} y={0} width={whiteWidth} height={whiteHeight} fill={keyFill(key.note, false)} stroke="var(--brutal-ink)" strokeWidth="3" />
            <text x={key.x + whiteWidth / 2} y={whiteHeight - 13} textAnchor="middle" fontSize="13" fontWeight="900" fill="var(--brutal-ink)" pointerEvents="none">{key.note}</text>
          </g>
        ))}
        {blackKeys.map((key) => (
          <g key={key.midi} onClick={() => onToggleNote(key.note)} style={{ cursor: 'pointer' }}>
            <rect x={key.x} y={0} width={blackWidth} height={blackHeight} fill={keyFill(key.note, true)} stroke="var(--brutal-ink)" strokeWidth="3" />
            <text x={key.x + blackWidth / 2} y={blackHeight - 12} textAnchor="middle" fontSize="10" fontWeight="900" fill={selectedNotes.includes(key.note) || previewNotes.includes(key.note) ? 'var(--brutal-ink)' : 'var(--brutal-paper)'} pointerEvents="none">{key.note}</text>
          </g>
        ))}
      </svg>
    </Box>
  );
}

function StringedDetector({ instrument, selectedNotes, previewNotes, onToggleNote }) {
  return (
    <Box sx={{ minWidth: 920 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: `86px repeat(${instrument.fretCount + 1}, minmax(54px, 1fr))`, gap: 0.75, mb: 1 }}>
        <Box />
        {Array.from({ length: instrument.fretCount + 1 }, (_, fret) => (
          <Typography key={fret} align="center" sx={{ fontWeight: 950, fontSize: 12, color: 'var(--brutal-ink)' }}>
            {fret === 0 ? 'Open' : fret}
          </Typography>
        ))}
      </Box>
      {instrument.tuning.map((openNote, stringIndex) => (
        <Box key={`${openNote}-${stringIndex}`} sx={{ display: 'grid', gridTemplateColumns: `86px repeat(${instrument.fretCount + 1}, minmax(54px, 1fr))`, gap: 0.75, alignItems: 'center', mb: 0.75 }}>
          <Box sx={{ border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)', p: 1, fontWeight: 950, textAlign: 'center' }}>
            {openNote}
          </Box>
          {Array.from({ length: instrument.fretCount + 1 }, (_, fret) => {
            const note = transpose(openNote, fret);
            const selected = selectedNotes.includes(note);
            const preview = previewNotes.includes(note);
            return (
              <Button
                key={`${openNote}-${stringIndex}-${fret}`}
                onClick={() => onToggleNote(note)}
                sx={{
                  minWidth: 0,
                  height: 46,
                  border: '3px solid var(--brutal-ink)',
                  borderRadius: 0,
                  bgcolor: selected ? 'var(--brutal-blue)' : preview ? 'rgba(41, 151, 255, 0.35)' : 'var(--brutal-paper)',
                  color: 'var(--brutal-ink)',
                  opacity: preview && !selected ? 0.58 : 1,
                  fontWeight: 950,
                  '&:hover': { bgcolor: selected ? 'var(--brutal-blue)' : 'var(--brutal-mint)' },
                }}
              >
                {note}
              </Button>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

export default DetectorPage;
