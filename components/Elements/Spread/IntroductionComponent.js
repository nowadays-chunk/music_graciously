import React from 'react';
import { styled } from '@mui/system';
import Head from 'next/head';
import { Typography, Box, Stack, Chip } from '@mui/material';
import { DEFAULT_KEYWORDS } from '../../../data/seo';

const Root = styled('div')({
  marginTop: 88,
  paddingBottom: 100,
  background: 'var(--brutal-bg)',
});

const IntroductionComponent = ({ title, subtitle, type, chips = [], children, description }) => {
  // Determine header background color based on type
  let headerBg = 'var(--brutal-pink)'; // default/chords
  if (type === 'arppegios' || type === 'arpeggios') {
    headerBg = 'var(--brutal-blue)';
  } else if (type === 'scales') {
    headerBg = 'var(--brutal-yellow)';
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description || `Learn about guitar ${type} in this comprehensive guide.`} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
      </Head>
      <Root>
        {/* TOP: Unified Heading - LEFT ALIGNED (Exact Match to Note Pages) */}
        <Box sx={{
          textAlign: "left",
          mb: 8,
          px: { xs: '15px', md: '180px' },
          py: { xs: 5, md: 7 },
          bgcolor: headerBg,
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
            {subtitle}
          </Typography>

          {chips.length > 0 && (
            <Stack direction="row" spacing={2} mt={3}>
              {chips.map((chipLabel) => (
                <Chip key={chipLabel} label={chipLabel} variant="outlined" color="primary" />
              ))}
            </Stack>
          )}
        </Box>

        {/* MIDDLE / BOTTOM: Article Content wrapped in the exact same page margins */}
        <Box sx={{ px: { xs: '15px', md: '180px' } }}>
          {children}
        </Box>
      </Root>
    </>
  );
};

export default IntroductionComponent;
