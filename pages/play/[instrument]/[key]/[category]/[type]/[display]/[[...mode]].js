import React from 'react';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { Box } from '@mui/material';

// Dynamically load InstrumentPlayView with SSR disabled,
// as vis-network references browser-only globals (window, document, canvas).
const InstrumentPlayView = dynamic(
  () => import('../../../../../../../components/Play/InstrumentPlayView'),
  { ssr: false }
);

const InstrumentPlayPage = ({ instrument }) => {
  return (
    <>
      {/* Head will be handled dynamically inside InstrumentPlayView to match selected parameters */}
      <Box sx={{ mt: '88px', py: 6, bgcolor: 'var(--brutal-bg)', minHeight: '100vh' }}>
        <InstrumentPlayView instrument={instrument} />
      </Box>
    </>
  );
};

export const getStaticPaths = async () => {
  // Return empty array for optimized build times and on-demand SSR compilation
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps = async ({ params }) => {
  return {
    props: {
      instrument: params.instrument,
    },
  };
};

export default InstrumentPlayPage;
