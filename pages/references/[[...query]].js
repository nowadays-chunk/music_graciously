import React, { useState, useMemo, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import guitar from '../../config/guitar.js';
import CircleOfFifths from '../../components/Pages/CircleOfFifths/CircleOfFifths';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  Grid,
  Divider,
  Autocomplete,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getNoteIndex, getNoteName } from '../../core/music/musicTheory';

const scalesData = [
  { key: "C", notes: ["C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E, F, F#", "C, C#, D, D#, E", "C, C#, D, D#, E"] },
  { key: "C#", notes: ["C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F, F#, G", "C#, D, D#, E, F", "C#, D, D#, E, F"] },
  { key: "D", notes: ["D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#, G, G#", "D, D#, E, F, F#", "D, D#, E, F, F#"] },
  { key: "D#", notes: ["D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G, G#, A", "D#, E, F, F#, G", "D#, E, F, F#, G"] },
  { key: "E", notes: ["E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#, A, A#", "E, F, F#, G, G#", "E, F, F#, G, G#"] },
  { key: "F", notes: ["F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A, A#, B", "F, F#, G, G#, A", "F, F#, G, G#, A"] },
  { key: "F#", notes: ["F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#, B, C", "F#, G, G#, A, A#", "F#, G, G#, A, A#"] },
  { key: "G", notes: ["G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B, C, C#", "G, G#, A, A#, B", "G, G#, A, A#, B"] },
  { key: "G#", notes: ["G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C, C#, D", "G#, A, A#, B, C", "G#, A, A#, B, C"] },
  { key: "A", notes: ["A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#, D, D#", "A, A#, B, C, C#", "A, A#, B, C, C#"] },
  { key: "A#", notes: ["A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D, D#, E", "A#, B, C, C#, D", "A#, B, C, C#, D"] },
  { key: "B", notes: ["B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#, E, F", "B, C, C#, D, D#", "B, C, C#, D, D#"] },
];

const relativesData = [
  { key: "C", rel: "Am", chords: ["C maj", "D min", "E min", "F maj", "G maj", "A min", "B dim"] },
  { key: "G", rel: "Em", chords: ["G maj", "A min", "B min", "C maj", "D maj", "E min", "F# dim"] },
  { key: "D", rel: "Bm", chords: ["D maj", "E min", "F# min", "G maj", "A maj", "B min", "C# dim"] },
  { key: "A", rel: "F#m", chords: ["A maj", "B min", "C# min", "D maj", "E maj", "F# min", "G# dim"] },
  { key: "E", rel: "Dbm", chords: ["E maj", "F# min", "G# min", "A maj", "B maj", "C# min", "D# dim"] },
  { key: "B", rel: "Abm", chords: ["B maj", "Db min", "Eb min", "E maj", "Gb maj", "Ab min", "Bb dim"] },
  { key: "Gb", rel: "Ebm", chords: ["Gb maj", "Ab min", "Bb min", "Cb maj", "Db maj", "Ebm", "F dim"] },
  { key: "Db", rel: "Bbm", chords: ["Db maj", "Eb min", "F min", "Gb maj", "Ab maj", "Bbm", "C dim"] },
  { key: "Ab", rel: "Fm", chords: ["Ab maj", "Bb min", "C min", "Db maj", "Eb maj", "F min", "G dim"] },
  { key: "Eb", rel: "Cm", chords: ["Eb maj", "F min", "G min", "Ab maj", "Bb maj", "C min", "D dim"] },
  { key: "Bb", rel: "Gm", chords: ["Bb maj", "C min", "D min", "Eb maj", "F maj", "G min", "A dim"] },
  { key: "F", rel: "Dm", chords: ["F maj", "G min", "A min", "Bb maj", "C maj", "D min", "E dim"] },
];

// Normalize query parsing
const parseQueryString = (queryStr) => {
  if (!queryStr) return null;
  let s = queryStr.toLowerCase()
    .replace(/[-_]/g, ' ')
    .replace(/sharp/g, '#')
    .replace(/flat/g, 'b')
    .trim();

  if (s.includes('circle') || s.includes('fifth')) {
    return { key: 'all', type: 'circle_of_fifths', subtype: 'all' };
  }
  if (s.includes('formulas') || (s.includes('scale') && s.length < 7)) {
    return { key: 'all', type: 'scales', subtype: 'all' };
  }

  const allKeys = ['c#', 'db', 'd#', 'eb', 'f#', 'gb', 'g#', 'ab', 'a#', 'bb', 'c', 'd', 'e', 'f', 'g', 'a', 'b'];
  let matchedKey = 'all';
  for (const key of allKeys) {
    if (s.startsWith(key)) {
      matchedKey = key.toUpperCase();
      if (matchedKey.length > 1 && matchedKey[1] === 'B') {
        matchedKey = matchedKey[0] + 'b';
      }
      s = s.substring(key.length).trim();
      break;
    }
  }

  let type = 'all';
  let subtype = 'all';

  if (s.includes('scale')) {
    type = 'scales';
    s = s.replace('scale', '').trim();
  } else if (s.includes('chord') || s.includes('arp') || s.includes('arpeggio')) {
    type = 'chords_arpeggios';
    s = s.replace('chord', '').replace('arpeggio', '').replace('arp', '').trim();
  }

  const scaleSlugs = {
    'major': 'major',
    'minor': 'minor',
    'harmonic': 'harmonic',
    'melodic': 'melodic',
    'blues minor': 'blues-minor',
    'blues major': 'blues-major',
    'blues': 'blues-minor'
  };

  const chordSlugs = {
    '6': '6', '6th': '6',
    '7': '7', '7th': '7', 'dominant 7': '7', 'dominant 7th': '7',
    '9': '9', '9th': '9',
    '11': '11', '11th': '11',
    '13': '13', '13th': '13',
    'm': 'min', 'min': 'min', 'minor': 'min',
    'maj': 'M', 'major': 'M',
    'aug': 'aug', 'augmented': 'aug',
    'dim': 'dim', 'diminished': 'dim',
    'sus2': 'sus2',
    'sus4': 'sus4',
    'add2': 'add2',
    'add4': 'add4',
    'min6': 'min6', 'minor 6': 'min6', 'minor 6th': 'min6',
    'min7': 'min7', 'minor 7': 'min7', 'minor 7th': 'min7',
    'maj7': 'M7', 'major 7': 'M7', 'major 7th': 'M7', 'm7': 'min7',
    'min7b5': 'min7b5', 'half dim': 'min7b5', 'half diminished': 'min7b5',
    'dim7': 'dim7', 'diminished 7': 'dim7', 'diminished 7th': 'dim7',
    'minmaj7': 'minMaj7', 'minor major 7': 'minMaj7', 'minor major 7th': 'minMaj7',
    '7#5': '7#5', '7sharp5': '7#5',
    '7b5': '7b5', '7flat5': '7b5'
  };

  let foundSubtype = null;
  for (const [k, v] of Object.entries(scaleSlugs)) {
    if (s.includes(k)) {
      foundSubtype = v;
      type = 'scales';
      break;
    }
  }

  if (!foundSubtype) {
    for (const [k, v] of Object.entries(chordSlugs)) {
      if (s === k || s.includes(k)) {
        foundSubtype = v;
        type = 'chords_arpeggios';
        break;
      }
    }
  }

  if (foundSubtype) {
    subtype = foundSubtype;
  }

  return { key: matchedKey, type, subtype };
};

const getSlugForState = (key, type, subtype) => {
  if (type === 'circle_of_fifths') return 'circle-of-fifths';
  if (key === 'all' && type === 'all' && subtype === 'all') return '';

  let slugParts = [];
  if (key && key !== 'all') {
    slugParts.push(key.replace(/#/g, '-sharp').replace(/b/g, '-flat'));
  }

  if (subtype && subtype !== 'all') {
    slugParts.push(subtype.replace(/#/g, '-sharp').replace(/b/g, '-flat'));
  }

  if (type === 'scales') {
    slugParts.push('scale');
  } else if (type === 'chords_arpeggios') {
    slugParts.push('chord');
  }

  return slugParts.join('-').toLowerCase();
};

const TablesPage = () => {
  const router = useRouter();
  const { query } = router.query;

  // Filter States
  const [activeKey, setActiveKey] = useState('all');
  const [activeType, setActiveType] = useState('all');
  const [activeSubtype, setActiveSubtype] = useState('all');
  const [renderLimit, setRenderLimit] = useState(12);

  // Search autocomplete state
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedSearchOption, setSelectedSearchOption] = useState(null);

  const chordQualities = Object.keys(guitar.arppegios);
  const keys = guitar.circleOfFifths.map(k => k.key);

  // Global "/" keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName) && !document.activeElement?.isContentEditable) {
        e.preventDefault();
        const searchEl = document.getElementById('tables-search-input');
        if (searchEl) {
          searchEl.focus();
          searchEl.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Parse path-based query on load or URL change
  useEffect(() => {
    if (!router.isReady) return;
    const queryStr = Array.isArray(query) ? query.join('-') : '';
    if (queryStr) {
      const parsed = parseQueryString(queryStr);
      if (parsed) {
        setActiveKey(parsed.key);
        setActiveType(parsed.type);
        setActiveSubtype(parsed.subtype);

        // Synchronize search text input value
        let displayVal = '';
        if (parsed.type === 'circle_of_fifths') {
          displayVal = 'Circle of Fifths Reference';
        } else if (parsed.key !== 'all' || parsed.subtype !== 'all') {
          const keyLabel = parsed.key !== 'all' ? parsed.key : '';
          const subName = parsed.subtype !== 'all' ? (guitar.arppegios[parsed.subtype]?.name || parsed.subtype) : '';
          displayVal = `${keyLabel} ${subName}`.trim();
          if (parsed.type === 'scales') displayVal += ' Scale';
          else if (parsed.type === 'chords_arpeggios') displayVal += ' Chord & Arpeggio';
        }
        setSearchInputValue(displayVal);
      }
    } else {
      // Reset if navigating back to plain /references
      setActiveKey('all');
      setActiveType('all');
      setActiveSubtype('all');
      setSearchInputValue('');
    }
  }, [router.isReady, query]);

  // Synchronize state changes to URL query
  const updateUrlFromFilters = (key, type, subtype) => {
    const slug = getSlugForState(key, type, subtype);
    const newPath = slug ? `/references/${slug}` : '/references';
    if (router.asPath !== newPath) {
      router.replace(newPath, undefined, { shallow: true });
    }
  };

  const handleKeyChange = (newKey) => {
    setActiveKey(newKey);
    setRenderLimit(12);
    updateUrlFromFilters(newKey, activeType, activeSubtype);
  };

  const handleTypeChange = (newType) => {
    setActiveType(newType);
    setActiveSubtype('all');
    setRenderLimit(12);
    updateUrlFromFilters(activeKey, newType, 'all');
  };

  const handleSubtypeChange = (newSubtype) => {
    setActiveSubtype(newSubtype);
    setRenderLimit(12);
    updateUrlFromFilters(activeKey, activeType, newSubtype);
  };

  const handleResetFilters = () => {
    setActiveKey('all');
    setActiveType('all');
    setActiveSubtype('all');
    setSearchInputValue('');
    setSelectedSearchOption(null);
    setRenderLimit(12);
    router.replace('/references', undefined, { shallow: true });
  };

  // Autocomplete Suggestions List
  const searchSuggestions = useMemo(() => {
    const list = [
      { title: 'Circle of Fifths Reference', key: 'all', type: 'circle_of_fifths', subtype: 'all' },
      { title: 'Scales & Formulas Table', key: 'all', type: 'scales', subtype: 'all' },
    ];
    const allKeys = ['C', 'C#', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

    // Scales
    const scales = [
      { name: 'Major', id: 'major' },
      { name: 'Minor', id: 'minor' },
      { name: 'Harmonic', id: 'harmonic' },
      { name: 'Melodic', id: 'melodic' },
      { name: 'Blues Minor', id: 'blues-minor' },
      { name: 'Blues Major', id: 'blues-major' },
    ];
    allKeys.forEach(k => {
      scales.forEach(s => {
        list.push({
          title: `${k} ${s.name} Scale`,
          key: k,
          type: 'scales',
          subtype: s.id
        });
      });
    });

    // Chords
    const qualities = Object.keys(guitar.arppegios).map(q => ({
      id: q,
      name: guitar.arppegios[q].name
    }));
    allKeys.forEach(k => {
      qualities.forEach(q => {
        list.push({
          title: `${k} ${q.name} Chord & Arpeggio`,
          key: k,
          type: 'chords_arpeggios',
          subtype: q.id
        });
      });
    });

    return list;
  }, []);

  // Music theory calculations
  const getNotesForKey = (quality, keyNote) => {
    const info = guitar.arppegios[quality];
    if (!info) return [];
    const { formula, intervals } = info;
    const keyIndex = getNoteIndex(keyNote);
    const preferFlats = guitar.notes.flats.includes(keyNote);

    let notes = [getNoteName(keyIndex, preferFlats)];
    let idx = keyIndex;

    for (let i = 0; i < intervals.length - 1; i++) {
      idx = (idx + formula[i]) % 12;
      notes.push(getNoteName(idx, preferFlats));
    }
    return notes;
  };

  const getArpeggioFrets = (quality, shape, keyIndex) => {
    const shapeIndex = guitar.shapes.names.indexOf(shape);
    const range = guitar.shapes.indexes[quality]?.[shapeIndex] || guitar.shapes.indexes['M']?.[shapeIndex];
    if (!range) return ["-", "-", "-", "-", "-", "-"];

    const notes = getNotesForKey(quality, guitar.notes.sharps[keyIndex]);
    const start = range.start + keyIndex;
    const end = range.end + keyIndex;
    const tuning = guitar.tuning;

    return tuning.map((openNote) => {
      let stringFrets = [];
      for (let f = start; f <= end; f++) {
        const noteName = guitar.notes.sharps[(openNote + f) % 12];
        if (notes.includes(noteName)) {
          stringFrets.push(f);
        }
      }
      return stringFrets.length > 0 ? stringFrets.join(',') : "-";
    });
  };

  const getTransposedChordShape = (quality, shape, keyIndex) => {
    const original = guitar.arppegios[quality]?.cagedShapes?.[shape];
    if (!original) return ["-", "-", "-", "-", "-", "-"];
    return original.map(fret => fret === null ? "X" : fret + keyIndex);
  };

  // Scroll to helper
  const scrollToAnchor = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Filters logic
  const filteredChords = useMemo(() => {
    const list = [];
    keys.forEach((keyNote) => {
      if (activeKey !== 'all' && activeKey !== keyNote) {
        const standardIndex = getNoteIndex(keyNote);
        const activeIndex = getNoteIndex(activeKey);
        if (standardIndex !== activeIndex) return;
      }

      chordQualities.forEach((quality) => {
        if (activeSubtype !== 'all' && activeSubtype !== quality) return;
        list.push({ keyNote, quality, info: guitar.arppegios[quality] });
      });
    });
    return list;
  }, [activeKey, activeSubtype, keys, chordQualities]);

  const visibleChords = useMemo(() => {
    return filteredChords.slice(0, renderLimit);
  }, [filteredChords, renderLimit]);

  const isFiltersApplied = activeKey !== 'all' || activeType !== 'all' || activeSubtype !== 'all';

  const circleQuality = useMemo(() => {
    if (activeType === 'scales') {
      return activeSubtype.toLowerCase().includes('minor') ? 'Minor' : 'Major';
    }
    if (activeType === 'chords_arpeggios') {
      const lower = activeSubtype.toLowerCase();
      return (lower.includes('min') || lower.includes('dim') || lower.includes('m')) ? 'Minor' : 'Major';
    }
    return 'Major';
  }, [activeType, activeSubtype]);

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, bgcolor: 'var(--brutal-bg)', pt: { xs: '88px', sm: '104px' } }}>
      <Head>
        <title>References | Scales & Chords Reference</title>
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="description" content="Complete reference tables for guitar scales, chords, and the circle of fifths. Find yourself in the maze with comprehensive music theory formulas and diatonic chord progressions." />
      </Head>

      {/* Sticky Mini Appbar Sub-Navigation */}
      <Box
        sx={{
          position: 'sticky',
          top: { xs: 56, sm: 64 },
          zIndex: 100,
          bgcolor: 'var(--brutal-paper)',
          borderBottom: '4px solid var(--brutal-ink)',
          boxShadow: '0 4px 0 rgba(0, 0, 0, 0.1)',
          py: 1,
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              gap: { xs: 0.5, sm: 2 },
              pb: { xs: 0.5, sm: 0 },
            }}
          >
            <Button
              variant="text"
              onClick={() => {
                handleTypeChange('all');
                setTimeout(() => scrollToAnchor('circle-fifths-section'), 50);
              }}
              sx={{
                fontWeight: 900,
                color: 'var(--brutal-ink)',
                border: '2px solid transparent',
                '&:hover': { border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-pink)' },
                width: { xs: '33.33%', sm: 'auto' },
                fontSize: { xs: '2.8vw', sm: '0.875rem' },
                px: { xs: 0.5, sm: 2 },
                whiteSpace: 'nowrap',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Circle of Fifths</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Circle of 5ths</Box>
            </Button>
            <Button
              variant="text"
              onClick={() => {
                if (activeType === 'circle_of_fifths' || activeType === 'chords_arpeggios') handleTypeChange('all');
                setTimeout(() => scrollToAnchor('scales-section'), 50);
              }}
              sx={{
                fontWeight: 900,
                color: 'var(--brutal-ink)',
                border: '2px solid transparent',
                '&:hover': { border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-blue)' },
                width: { xs: '33.33%', sm: 'auto' },
                fontSize: { xs: '2.8vw', sm: '0.875rem' },
                px: { xs: 0.5, sm: 2 },
                whiteSpace: 'nowrap',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Scales & Formulas</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Scales</Box>
            </Button>
            <Button
              variant="text"
              onClick={() => {
                if (activeType === 'circle_of_fifths' || activeType === 'scales') handleTypeChange('all');
                setTimeout(() => scrollToAnchor('chords-arpeggios-section'), 50);
              }}
              sx={{
                fontWeight: 900,
                color: 'var(--brutal-ink)',
                border: '2px solid transparent',
                '&:hover': { border: '2px solid var(--brutal-ink)', bgcolor: 'var(--brutal-orange)' },
                width: { xs: '33.33%', sm: 'auto' },
                fontSize: { xs: '2.8vw', sm: '0.875rem' },
                px: { xs: 0.5, sm: 2 },
                whiteSpace: 'nowrap',
              }}
            >
              <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>Chords & Arpeggios</Box>
              <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>Chords</Box>
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 6 }}>
        {/* Title Box */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 3, md: 5 },
            bgcolor: 'var(--brutal-yellow)',
            border: '4px solid var(--brutal-ink)',
            boxShadow: 'var(--brutal-shadow)',
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '3.5rem' },
              color: 'var(--brutal-ink)',
            }}
          >
            References
          </Typography>
          <Typography align="center" sx={{ mt: 2, fontWeight: 800 }}>
            Smart references for chords, scales, CAGED shapes, and the circle of fifths.
          </Typography>
        </Box>

        {/* Search & Filters Panel */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 6,
            border: '4px solid var(--brutal-ink)',
            boxShadow: 'var(--brutal-shadow-small)',
            bgcolor: '#ffffff',
          }}
        >
          <Grid container spacing={3}>
            {/* Search Input */}
            <Grid item xs={12}>
              <Autocomplete
                id="tables-search-autocomplete"
                options={searchSuggestions}
                getOptionLabel={(option) => option.title || ''}
                inputValue={searchInputValue}
                onInputChange={(_, value) => setSearchInputValue(value)}
                value={selectedSearchOption}
                onChange={(_, item) => {
                  if (item) {
                    setSelectedSearchOption(item);
                    setActiveKey(item.key);
                    setActiveType(item.type);
                    setActiveSubtype(item.subtype);
                    setRenderLimit(12);
                    updateUrlFromFilters(item.key, item.type, item.subtype);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="tables-search-input"
                    placeholder="Search music components, e.g. C Major Scale, A minor chord..."
                    helperText='Tip: Press "/" anywhere on the page to search immediately.'
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        border: '3px solid var(--brutal-ink)',
                        borderRadius: 0,
                        '&.Mui-focused fieldset': {
                          border: 'none',
                        },
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    {...props}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      borderBottom: '2px solid #e2e8f0',
                      '&:last-of-type': { borderBottom: 0 },
                      py: 1.5,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: option.type === 'scales' ? 'var(--brutal-blue)' : option.type === 'circle_of_fifths' ? 'var(--brutal-pink)' : 'var(--brutal-orange)',
                        border: '2px solid var(--brutal-ink)',
                        color: 'var(--brutal-ink)',
                      }}
                    >
                      <LibraryMusicIcon fontSize="small" />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                        {option.title}
                      </Typography>
                    </Box>
                    <Chip label={option.type === 'scales' ? 'Scale' : option.type === 'circle_of_fifths' ? 'Circle' : 'Chord'} size="small" />
                    <ArrowForwardIcon fontSize="small" />
                  </Box>
                )}
              />
            </Grid>

            {/* Type Filter */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Section Type
              </Typography>
              <ToggleButtonGroup
                value={activeType}
                exclusive
                onChange={(_, value) => value && handleTypeChange(value)}
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  border: '3px solid var(--brutal-ink)',
                  borderRadius: 0,
                  '& .MuiToggleButtonGroup-grouped': {
                    flexGrow: 1,
                    border: 'none',
                    borderRadius: 0,
                    fontWeight: 800,
                    py: 1,
                    color: 'var(--brutal-ink)',
                    '&.Mui-selected': {
                      bgcolor: 'var(--brutal-yellow)',
                      color: 'var(--brutal-ink)',
                      borderRight: '3px solid var(--brutal-ink)',
                      '&:last-of-type': { borderRight: 'none' },
                    },
                    '&:not(:last-of-type)': {
                      borderRight: '3px solid var(--brutal-ink)',
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                }}
              >
                <ToggleButton value="all">All Sections</ToggleButton>
                <ToggleButton value="circle_of_fifths">Circle of Fifths</ToggleButton>
                <ToggleButton value="scales">Scales</ToggleButton>
                <ToggleButton value="chords_arpeggios">Chords & Arpeggios</ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {/* Subtype Dropdown (Conditional) */}
            <Grid item xs={12} md={6}>
              {activeType === 'scales' && (
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { border: '3px solid var(--brutal-ink)', borderRadius: 0 } }}>
                  <InputLabel id="scale-subtype-label" sx={{ fontWeight: 800 }}>Scale Formula</InputLabel>
                  <Select
                    labelId="scale-subtype-label"
                    value={activeSubtype}
                    label="Scale Formula"
                    onChange={(e) => handleSubtypeChange(e.target.value)}
                    sx={{ fontWeight: 800 }}
                  >
                    <MenuItem value="all">All Scales</MenuItem>
                    <MenuItem value="major">Major (Ionian)</MenuItem>
                    <MenuItem value="minor">Minor (Aeolian)</MenuItem>
                    <MenuItem value="harmonic">Harmonic Minor</MenuItem>
                    <MenuItem value="melodic">Melodic Minor</MenuItem>
                    <MenuItem value="blues-minor">Blues Minor</MenuItem>
                    <MenuItem value="blues-major">Blues Major</MenuItem>
                  </Select>
                </FormControl>
              )}

              {activeType === 'chords_arpeggios' && (
                <FormControl fullWidth sx={{ '& .MuiOutlinedInput-root': { border: '3px solid var(--brutal-ink)', borderRadius: 0 } }}>
                  <InputLabel id="chord-subtype-label" sx={{ fontWeight: 800 }}>Chord Quality</InputLabel>
                  <Select
                    labelId="chord-subtype-label"
                    value={activeSubtype}
                    label="Chord Quality"
                    onChange={(e) => handleSubtypeChange(e.target.value)}
                    sx={{ fontWeight: 800 }}
                  >
                    <MenuItem value="all">All Chords / Arpeggios</MenuItem>
                    {chordQualities.map((q) => (
                      <MenuItem key={q} value={q}>
                        {guitar.arppegios[q]?.name || q} ({q})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>

            {/* Key Grid Selector */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                Key Filter
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label="All Keys"
                  onClick={() => handleKeyChange('all')}
                  sx={{
                    fontWeight: 800,
                    border: '3px solid var(--brutal-ink)',
                    borderRadius: 0,
                    height: 36,
                    bgcolor: activeKey === 'all' ? 'var(--brutal-yellow)' : '#fff',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' },
                  }}
                />
                {keys.map((keyNote) => (
                  <Chip
                    key={keyNote}
                    label={keyNote}
                    onClick={() => handleKeyChange(keyNote)}
                    sx={{
                      fontWeight: 800,
                      border: '3px solid var(--brutal-ink)',
                      borderRadius: 0,
                      height: 36,
                      bgcolor: activeKey === keyNote ? 'var(--brutal-pink)' : '#fff',
                      '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.05)' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* Reset Button */}
            {isFiltersApplied && (
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={handleResetFilters}
                  sx={{
                    fontWeight: 800,
                    border: '3px solid var(--brutal-ink)',
                    borderRadius: 0,
                    color: 'var(--brutal-ink)',
                    borderColor: 'var(--brutal-ink)',
                    boxShadow: '2px 2px 0 var(--brutal-ink)',
                    '&:hover': {
                      bgcolor: 'rgba(0,0,0,0.05)',
                      borderColor: 'var(--brutal-ink)',
                      boxShadow: 'none',
                    },
                  }}
                >
                  Reset Search & Filters
                </Button>
              </Grid>
            )}
          </Grid>
        </Paper>

        <Grid container spacing={8}>
          {/* 1. Circle of Fifths Section */}
          {(activeType === 'all' || activeType === 'circle_of_fifths') && (
            <Grid item xs={12} id="circle-fifths-section" sx={{ scrollMarginTop: { xs: 120, md: 140 } }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 16, height: 44, bgcolor: 'var(--brutal-pink)', border: '3px solid var(--brutal-ink)' }} />
                <Typography variant="h4" component="h2" fontWeight="bold">
                  Circle of Fifths Reference
                </Typography>
              </Box>
              <Grid container spacing={4} alignItems="flex-start">
                <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{
                    width: '100%',
                    maxWidth: '380px',
                    aspectRatio: '1',
                    p: 2,
                    border: '3px solid var(--brutal-ink)',
                    boxShadow: 'var(--brutal-shadow)',
                    bgcolor: 'var(--brutal-mint)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .circle-container': {
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      backdropFilter: 'none',
                      width: '100%',
                      height: '100%',
                    }
                  }}>
                    <CircleOfFifths
                      tone={activeKey === 'all' ? 'C' : activeKey}
                      quality={circleQuality}
                      onElementChange={(chromaticIndex) => {
                        const keyNote = guitar.circleOfFifths[(chromaticIndex * 7) % 12]?.key || 'C';
                        handleKeyChange(keyNote);
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', overflow: 'auto' }}>
                    <Table aria-label="relatives table">
                      <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)' }}>Key</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)' }}>Relative Minor</TableCell>
                          <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)' }}>Chords (Diatonic)</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {relativesData
                          .filter((row) => activeKey === 'all' || row.key === activeKey || row.rel === activeKey)
                          .map((row) => (
                            <TableRow key={row.key} hover>
                              <TableCell sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '2px solid #e2e8f0' }}>{row.key}</TableCell>
                              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>{row.rel}</TableCell>
                              <TableCell sx={{ borderBottom: '2px solid #e2e8f0' }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {row.chords.map((chord, idx) => (
                                    <Chip
                                      key={idx}
                                      label={chord}
                                      size="small"
                                      color={idx === 0 || idx === 3 || idx === 4 ? 'primary' : 'default'}
                                      variant={idx === 6 ? 'outlined' : 'filled'}
                                      sx={{ borderRadius: 0, border: '1px solid var(--brutal-ink)', fontWeight: 700 }}
                                    />
                                  ))}
                                </Box>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </Grid>
          )}

          {/* 2. Scales Section */}
          {(activeType === 'all' || activeType === 'scales') && (
            <Grid item xs={12} id="scales-section" sx={{ scrollMarginTop: { xs: 120, md: 140 } }}>
              <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 16, height: 44, bgcolor: 'var(--brutal-blue)', border: '3px solid var(--brutal-ink)' }} />
                <Typography variant="h4" component="h2" fontWeight="bold">
                  Scales & Formulas
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', overflow: 'auto' }}>
                <Table aria-label="scales table">
                  <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)' }}>Root Key</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'major' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Major</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'minor' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Minor</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'harmonic' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Harmonic</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'melodic' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Melodic</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'blues-minor' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Blues Minor</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#475569', borderBottom: '3px solid var(--brutal-ink)', bgcolor: activeSubtype === 'blues-major' ? 'rgba(253, 224, 71, 0.2)' : 'inherit' }}>Blues Major</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {scalesData
                      .filter((row) => activeKey === 'all' || row.key === activeKey)
                      .map((row) => (
                        <TableRow key={row.key} hover>
                          <TableCell sx={{ fontWeight: 'bold', color: 'secondary.main', borderBottom: '2px solid #e2e8f0' }}>{row.key}</TableCell>
                          {row.notes.map((notes, idx) => {
                            const scaleTypes = ['major', 'minor', 'harmonic', 'melodic', 'blues-minor', 'blues-major'];
                            const isColumnActive = activeSubtype === scaleTypes[idx];
                            return (
                              <TableCell
                                key={idx}
                                align="center"
                                sx={{
                                  borderBottom: '2px solid #e2e8f0',
                                  bgcolor: isColumnActive ? 'rgba(253, 224, 71, 0.15)' : 'inherit',
                                  fontWeight: isColumnActive ? 800 : 'normal'
                                }}
                              >
                                {notes}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}

          {/* 3. Chords & Arpeggios Section */}
          {(activeType === 'all' || activeType === 'chords_arpeggios') && (
            <Grid item xs={12} id="chords-arpeggios-section" sx={{ scrollMarginTop: { xs: 120, md: 140 } }}>
              <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 16, height: 44, bgcolor: 'var(--brutal-orange)', border: '3px solid var(--brutal-ink)' }} />
                <Typography variant="h4" component="h2" fontWeight="bold">
                  Chords & Arpeggios (CAGED System)
                </Typography>
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>
                CAGED shape layouts mapped directly. Filter using the tools above to narrow down results and prevent interface lag.
              </Typography>

              {filteredChords.length === 0 ? (
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', border: '3px dashed var(--brutal-ink)', borderRadius: 0 }}>
                  <Typography variant="h6" fontWeight="bold">
                    No matching Chords/Arpeggios found. Try resetting filters.
                  </Typography>
                </Paper>
              ) : (
                <>
                  <Grid container spacing={4}>
                    {visibleChords.map(({ keyNote, quality }) => {
                      const info = guitar.arppegios[quality];
                      if (!info) return null;
                      const keyIndex = getNoteIndex(keyNote);
                      const notes = getNotesForKey(quality, keyNote);
                      const intervals = info.intervals.map(inter => inter === '1' ? 'root' : inter);

                      return (
                        <Grid item xs={12} lg={6} key={`${keyNote}-${quality}`}>
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 4,
                              borderRadius: 0,
                              height: '100%',
                              border: '3px solid var(--brutal-ink)',
                              boxShadow: 'var(--brutal-shadow-small)',
                              bgcolor: 'rgba(255, 253, 245, 0.82)',
                            }}
                          >
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h5" fontWeight="black" gutterBottom>
                                {keyNote} {info.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                                {notes.map((n, i) => (
                                  <Chip key={i} label={n} size="small" sx={{ borderRadius: 0, border: '2px solid var(--brutal-ink)', fontWeight: 800, bgcolor: 'white' }} />
                                ))}
                              </Box>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                                Intervals: {intervals.join(', ')}
                              </Typography>
                            </Box>

                            <TableContainer component={Box} sx={{ mt: 2 }}>
                              <Table size="small">
                                <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                                  <TableRow>
                                    <TableCell sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>Shape</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>Type</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>E</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>A</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>D</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>G</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>B</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'black', borderBottom: '2px solid var(--brutal-ink)' }}>e</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {['C', 'A', 'G', 'E', 'D'].map((shape) => {
                                    const chordArr = getTransposedChordShape(quality, shape, keyIndex);
                                    const arpArr = getArpeggioFrets(quality, shape, keyIndex);

                                    return (
                                      <React.Fragment key={shape}>
                                        <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                          <TableCell rowSpan={2} sx={{ fontWeight: 'bold', color: 'primary.main', borderBottom: '1px solid #e2e8f0' }}>{shape}</TableCell>
                                          <TableCell align="center" sx={{ fontSize: '0.75rem', py: 0.5, fontWeight: 700, borderBottom: '1px solid #e2e8f0' }}>Chord</TableCell>
                                          {chordArr.map((f, i) => (
                                            <TableCell key={i} align="center" sx={{ fontWeight: 'medium', borderBottom: '1px solid #e2e8f0' }}>{f}</TableCell>
                                          ))}
                                        </TableRow>
                                        <TableRow sx={{ borderBottom: '2px solid #e2e8f0' }}>
                                          <TableCell align="center" sx={{ fontSize: '0.75rem', py: 0.5, fontWeight: 700 }}>Arp</TableCell>
                                          {arpArr.map((f, i) => (
                                            <TableCell key={i} align="center" sx={{ fontSize: '0.85rem' }}>{f}</TableCell>
                                          ))}
                                        </TableRow>
                                      </React.Fragment>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>

                  {filteredChords.length > renderLimit && (
                    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
                      <Button
                        variant="contained"
                        onClick={() => setRenderLimit(prev => prev + 12)}
                        sx={{
                          fontWeight: 900,
                          py: 1.5,
                          px: 4,
                          bgcolor: 'var(--brutal-yellow)',
                          color: 'var(--brutal-ink)',
                          border: '3px solid var(--brutal-ink)',
                          boxShadow: 'var(--brutal-shadow-small)',
                          '&:hover': {
                            bgcolor: 'var(--brutal-pink)',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        Load More Chords ({visibleChords.length} of {filteredChords.length})
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { query: [] } }],
    fallback: 'blocking',
  };
};

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default TablesPage;
