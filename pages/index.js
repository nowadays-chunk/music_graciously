import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import HomepageNavigationShowcase from '../components/Homepage/HomepageNavigationShowcase';

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sheets Media | Music Learning Tools</title>
        <meta name="description" content="Interactive music learning tools for playing, generating, ear training, chord progressions, maps, and references." />
      </Head>

      <Box sx={{ bgcolor: 'var(--brutal-yellow)', pt: { xs: 12, md: 14 }, pb: 8, borderBottom: '4px solid var(--brutal-ink)' }}>
        <Container maxWidth="xl">
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '3rem', md: '5.5rem' }, lineHeight: 0.95, mb: 3, fontWeight: 950, color: 'var(--brutal-ink)' }}>
            Learn, play, generate, and map music.
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, maxWidth: 820, fontWeight: 800, color: 'var(--brutal-ink)' }}>
            Explore instruments, generated ideas, ear training, chord progressions, maps, detector tools, composition, and references.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} href="/play" variant="contained" size="large" sx={{ fontWeight: 900 }}>Play</Button>
            <Button component={Link} href="/generate" variant="outlined" size="large" sx={{ bgcolor: 'var(--brutal-paper)', fontWeight: 900 }}>Generate</Button>
            <Button component={Link} href="/matches" variant="outlined" size="large" sx={{ bgcolor: 'var(--brutal-paper)', fontWeight: 900 }}>Map</Button>
          </Stack>
        </Container>
      </Box>

      <HomepageNavigationShowcase />
    </>
  );
}
