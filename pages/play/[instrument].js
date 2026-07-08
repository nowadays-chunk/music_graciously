import React from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
import InstrumentPlayView from '../../components/Play/InstrumentPlayView';

export const getStaticPaths = async () => {
  const paths = [
    { params: { instrument: 'guitar' } },
    { params: { instrument: 'piano' } },
    { params: { instrument: 'ukulele' } },
    { params: { instrument: 'violin' } },
    { params: { instrument: 'bass' } },
    { params: { instrument: 'double-bass' } },
    { params: { instrument: 'trumpet' } },
    { params: { instrument: 'saxophone' } },
  ];
  return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      instrument: params.instrument,
    },
  };
};

const InstrumentPlayPage = ({ instrument }) => {
  const formattedName = instrument
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const title = `Interactive ${formattedName} Visualizer | Play Scales & Chords`;
  const description = `Interactive ${formattedName} visualizer for practicing scales, chords, and arpeggios. Visualize finger positions, keys, or valves and play note audio dynamically.`;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Head>
      <Box sx={{ mt: '88px', py: 6, bgcolor: 'var(--brutal-bg)', minHeight: '100vh' }}>
        <InstrumentPlayView instrument={instrument} />
      </Box>
    </>
  );
};

export default InstrumentPlayPage;
