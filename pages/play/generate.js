import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

const MusicGenerator = dynamic(
  () => import('../../components/Play/MusicGenerator'),
  { ssr: false }
);

const GeneratePage = () => {
  const title = 'Music Generator | 30-Second Playable Instrument Ideas';
  const description = 'Generate 30-second rhythm, solo, and rhythm plus solo ideas with instrument visualizers, chord progression context, expressive effects, and browser sampler playback.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box sx={{ mt: '88px', py: 6, bgcolor: 'var(--brutal-bg)', minHeight: '100vh' }}>
        <MusicGenerator />
      </Box>
    </>
  );
};

export default GeneratePage;
