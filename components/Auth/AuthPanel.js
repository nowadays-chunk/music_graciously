import React from 'react';
import Link from 'next/link';
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';

const panelSx = {
  border: '4px solid var(--brutal-ink)',
  boxShadow: '10px 10px 0 var(--brutal-ink)',
  bgcolor: 'var(--brutal-paper)',
  p: { xs: 3, md: 5 },
};

export default function AuthPanel({
  title,
  subtitle,
  children,
  error,
  success,
  footer,
}) {
  return (
    <Box sx={{ bgcolor: 'var(--brutal-yellow)', minHeight: 'calc(100vh - 80px)', pt: { xs: 12, md: 14 }, pb: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={0} sx={panelSx}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h3" component="h1" sx={{ fontWeight: 950, lineHeight: 0.95, mb: 1 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body1" sx={{ fontWeight: 800, color: 'var(--brutal-ink)' }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}

            {children}

            {footer && (
              <Box sx={{ pt: 1, borderTop: '3px solid var(--brutal-ink)' }}>
                {footer}
              </Box>
            )}
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export function AuthTextField(props) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      {...props}
      InputProps={{
        ...props.InputProps,
        sx: {
          bgcolor: 'white',
          fontWeight: 800,
          '& fieldset': { border: '3px solid var(--brutal-ink)' },
          '&:hover fieldset': { borderColor: 'var(--brutal-ink)' },
          '&.Mui-focused fieldset': { borderColor: 'var(--brutal-pink)' },
          ...(props.InputProps?.sx || {}),
        },
      }}
      InputLabelProps={{ sx: { fontWeight: 900 }, ...(props.InputLabelProps || {}) }}
    />
  );
}

export function AuthSubmitButton({ children, loading, ...props }) {
  return (
    <Button
      type="submit"
      size="large"
      variant="contained"
      disabled={loading || props.disabled}
      {...props}
      sx={{
        fontWeight: 950,
        border: '3px solid var(--brutal-ink)',
        boxShadow: '5px 5px 0 var(--brutal-ink)',
        bgcolor: 'var(--brutal-pink)',
        color: 'var(--brutal-ink)',
        '&:hover': { bgcolor: 'var(--brutal-mint)', boxShadow: '3px 3px 0 var(--brutal-ink)' },
        ...(props.sx || {}),
      }}
    >
      {loading ? 'Please wait...' : children}
    </Button>
  );
}

export function AuthFooterLink({ href, children }) {
  return (
    <Typography sx={{ fontWeight: 800 }}>
      <Link href={href}>{children}</Link>
    </Typography>
  );
}
