import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Load the MatchesNetworkDiagram component dynamically with SSR disabled,
// as vis-network references browser-only globals (window, document, canvas).
const MatchesNetworkDiagram = dynamic(
  () => import('../../components/Play/MatchesNetworkDiagram'),
  { ssr: false }
);

const MatchesPage = () => {
  const title = "Music Entities Matches Network | Scales, Chords & Arpeggios";
  const description = "Interactive force-directed network diagram showing how musical scales, modes, arpeggios, and chords match and interconnect based on note subset rules.";

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box sx={{ mt: '88px', py: 6, bgcolor: 'var(--brutal-bg)', minHeight: '100vh' }}>
        <MatchesNetworkDiagram />
      </Box>
    </>
  );
};

export default MatchesPage;
