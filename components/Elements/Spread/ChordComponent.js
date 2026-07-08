// components/ChordComponent.js
import React from 'react';
import MusicApp from '../../Containers/MusicApp'; // Adjust the path if needed
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Box, Grid, Chip, Divider, Stack, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { ScoreProvider } from "@/core/editor/ScoreContext";
import { DEFAULT_KEYWORDS } from '../../../data/seo';
import guitar from '../../../config/guitar';
import { getAbsoluteNotes, getNoteName, getIntervalName } from '../../../core/music/musicTheory';
import { DEFAULT_LABEL_DISPLAY, normalizeLabelDisplay } from '../../../core/spreading/labelDisplay';
import LabelDisplayToggle from './LabelDisplayToggle';

const Root = styled('div')({
  marginTop: 88,
  paddingBottom: 100,
  background: 'var(--brutal-bg)',
});

const ChordComponent = (props) => {
  const { boards, title, description } = props;
  const labelDisplay = normalizeLabelDisplay(props.labelDisplay || DEFAULT_LABEL_DISPLAY);
  const [activeBoardIndex, setActiveBoardIndex] = React.useState(0);
  const [activeLabelDisplay, setActiveLabelDisplay] = React.useState(labelDisplay);

  const router = useRouter();
  const { key, chord } = router.query;
  const keyUrl = props.key || key;
  const chordUrl = props.chord || chord;
  const basePath = `/spreading/chords/${keyUrl}/${chordUrl}`;

  const firstBoard = boards[0] || {};
  const preferFlats = firstBoard.key ? guitar.notes.flats.includes(firstBoard.key.replace(/sharp/g, '#')) : false;
  const rootNotes = getAbsoluteNotes('chord', firstBoard.quality, firstBoard.keyIndex);
  const rootData = guitar.arppegios[firstBoard.quality] || {};
  const matchingScales = rootData.matchingScales || [];
  const matchingArps = rootData.matchingArpeggios || [];

  // Tonal Properties Metadata
  const noteNames = rootNotes.map(n => getNoteName(n, preferFlats));
  const intervalNames = rootNotes.map(n => getIntervalName((n - rootNotes[0] + 12) % 12));

  const handleDownload = (format) => {
    if (!keyUrl || !chordUrl) return;
    const downloadUrl = `/api/download-sheet?type=chord&key=${encodeURIComponent(keyUrl)}&item=${encodeURIComponent(chordUrl)}&labelDisplay=${encodeURIComponent(activeLabelDisplay)}&format=${format}&title=${encodeURIComponent(title)}`;
    window.location.href = downloadUrl;
  };

  const handleLabelDisplayChange = (mode) => {
    setActiveLabelDisplay(mode);
    router.push(`${basePath}/${mode}`, undefined, { shallow: true });
  };

  return (
    <Root>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || "Learn guitar chord shapes."} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
      </Head>

      {/* TOP: Unified Heading - LEFT ALIGNED */}
      <Box sx={{
        textAlign: "left",
        mb: 8,
        px: { xs: '15px', md: '180px' },
        py: { xs: 5, md: 7 },
        bgcolor: 'var(--brutal-pink)',
        borderBottom: '4px solid var(--brutal-ink)',
      }}>
        <Typography
          variant="h1"
          sx={{
            fontWeight: '900',
            color: 'var(--brutal-ink)',
            lineHeight: 1.1,
            letterSpacing: 0,
            fontSize: { xs: '3rem', md: '5rem' },
            mb: 1
          }}
        >
          {title}
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ fontWeight: 500 }}>
          The 5 Essential CAGED Shapes
        </Typography>

        <Stack direction="row" spacing={2} mt={3}>
          {matchingScales.slice(0, 3).map(s => <Chip key={s} label={s} variant="outlined" color="primary" />)}
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleDownload('pdf')}
            sx={{
              fontWeight: '900',
              bgcolor: 'var(--brutal-paper)',
              color: 'var(--brutal-ink)',
              borderColor: 'var(--brutal-ink)',
              '&:hover': { bgcolor: 'var(--brutal-yellow)' }
            }}
          >
            Download PDF Sheet
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDownload('png')}
            sx={{
              fontWeight: '900',
              bgcolor: 'var(--brutal-paper)',
              color: 'var(--brutal-ink)',
              borderColor: 'var(--brutal-ink)',
              '&:hover': { bgcolor: 'var(--brutal-yellow)' }
            }}
          >
            Download PNG Image
          </Button>
        </Stack>
      </Box>

      <ScoreProvider>
        {/* MIDDLE: Fretboards Stack */}
        <Stack spacing={8}>
          {boards.map((el, index) => (
            <Box key={index}>
              <Box sx={{ px: { xs: '15px', md: '180px' }, mb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--brutal-ink)', mb: 0 }}>
                  Position {index + 1} - {el.key} {guitar.arppegios[el.quality]?.name || el.quality} (Shape {el.shape})
                </Typography>
              </Box>
              <MusicApp
                display="chord"
                labelDisplay={activeLabelDisplay}
                board={el.board}
                keyIndex={el.keyIndex}
                quality={el.quality}
                shape={el.shape}
                showStats={false}
                showFretboardControls={false}
                showCircleOfFifths={false}
                showFretboard={true}
                showChordComposer={false}
                showProgressor={false}
                showSongsSelector={false}
              />
            </Box>
          ))}
        </Stack>
      </ScoreProvider>

      {/* BOTTOM: Unified Description */}
      <Box sx={{
        mt: 10,
        px: { xs: '15px', md: '180px' }
      }}>
        <Box p={6} sx={{ bgcolor: 'rgba(255, 253, 245, 0.82)', borderRadius: 1, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)', mb: 6, backdropFilter: 'blur(10px)' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 900, mb: 4 }}>
            Chord Construction
          </Typography>
          <Grid container spacing={8}>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="800">Tonal Content</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The pitch classes that define the harmonic footprint of this {guitar.arppegios[firstBoard.quality]?.name || firstBoard.quality} chord.
              </Typography>
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Note Names:</Typography>
                <Typography variant="h6">{noteNames.join(', ')}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h5" gutterBottom fontWeight="800">Interval Map</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The mathematical sequence of intervals relative to the tonic Root ({noteNames[0]}).
              </Typography>
              <Box mb={4}>
                <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 700 }}>Interval Structure:</Typography>
                <Typography variant="h6">{intervalNames.join(', ')}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>


        {matchingArps.length > 0 && (
          <Box mt={8}>
            <Divider sx={{ mb: 4 }} />
            <Typography variant="overline" sx={{ fontWeight: 800, color: 'secondary.main', mb: 2, display: 'block' }}>
              Other Related Harmonic Structures
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {matchingArps.map(a => <Chip key={a} label={a} variant="filled" sx={{ borderRadius: 2 }} />)}
            </Box>
          </Box>
        )}
      </Box>
      <LabelDisplayToggle currentValue={activeLabelDisplay} basePath={basePath} onChange={handleLabelDisplayChange} activeColor="var(--brutal-pink)" />
    </Root>
  );
};

export default ChordComponent;
