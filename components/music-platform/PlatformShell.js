import React from 'react';
import Link from 'next/link';
import { Box, Button, Container, Stack, Typography } from '@mui/material';

const navItems = [
  { href: '/dashboard/teacher', label: 'Teacher Dashboard' },
  { href: '/dashboard/student', label: 'Student Dashboard' },
  { href: '/classrooms', label: 'Classrooms' },
  { href: '/transcriber', label: 'Transcriber' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/ai-score-editor', label: 'AI Editor' },
];

export default function PlatformShell({ title, subtitle, children, actions }) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--brutal-paper, #fffaf0)' }}>
      <Box sx={{ borderBottom: '4px solid var(--brutal-ink, #111)', bgcolor: 'var(--brutal-yellow, #ffd400)' }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
            <Box>
              <Typography component={Link} href="/" variant="h5" sx={{ color: 'var(--brutal-ink, #111)', textDecoration: 'none', fontWeight: 950 }}>
                Music Graciously
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: 'var(--brutal-ink, #111)' }}>
                AI transcription, classrooms, score editing, and practice.
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
              {navItems.map((item) => (
                <Button key={item.href} component={Link} href={item.href} variant="outlined" size="small" sx={{ bgcolor: 'white', border: '2px solid var(--brutal-ink, #111)', color: 'var(--brutal-ink, #111)', fontWeight: 900 }}>
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', md: 'flex-end' }} justifyContent="space-between" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '4.5rem' }, lineHeight: 0.95, fontWeight: 950, color: 'var(--brutal-ink, #111)' }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="h6" sx={{ mt: 2, maxWidth: 820, fontWeight: 800, color: 'var(--brutal-ink, #111)' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          {actions}
        </Stack>
        {children}
      </Container>
    </Box>
  );
}
