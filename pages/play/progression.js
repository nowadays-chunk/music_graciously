import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Load the ProgressionGenerator component dynamically with SSR disabled,
// as vis-network references browser-only globals (window, document, canvas).
const ProgressionGenerator = dynamic(
  () => import('../../components/Play/ProgressionGenerator'),
  { ssr: false }
);

const ProgressionPage = () => {
  const title = "Interactive Chord Progression Generator & Lyric Songwriter";
  const description = "Rapidly generate musical chord progressions, explore Roman numerals and American notations, get real-time transition suggestions, interact with visual chord connection networks, and write lyrics seamlessly with embedded chords.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box sx={{ mt: '88px', py: 6, bgcolor: 'var(--brutal-bg)', minHeight: '100vh' }}>
        <ProgressionGenerator />
      </Box>
    </>
  );
};

export default ProgressionPage;
