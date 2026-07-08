import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Alert, Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { clearAuthState, fetchCurrentUser, logoutAccount, readAuthState } from '../lib/authClient';

const cardSx = {
  border: '4px solid var(--brutal-ink)',
  boxShadow: '10px 10px 0 var(--brutal-ink)',
  bgcolor: 'var(--brutal-paper)',
  p: { xs: 3, md: 5 },
};

export default function AccountPage() {
  const router = useRouter();
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      const saved = readAuthState();
      if (!saved?.accessToken) {
        router.replace('/login?next=/account');
        return;
      }

      setAuth(saved);
      try {
        const profile = await fetchCurrentUser(saved.accessToken);
        if (!cancelled) setUser(profile.user || profile);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Unable to load your account.');
          clearAuthState();
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAccount();
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleLogout() {
    try {
      await logoutAccount(auth?.refreshToken);
    } catch (_err) {
      // Local logout should still continue even if the remote token was already gone.
    }
    clearAuthState();
    router.push('/login');
  }

  return (
    <>
      <Head>
        <title>Account | Music Graciously</title>
        <meta name="description" content="Manage your Music Graciously account." />
      </Head>

      <Box sx={{ bgcolor: 'var(--brutal-yellow)', minHeight: 'calc(100vh - 80px)', pt: { xs: 12, md: 14 }, pb: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={cardSx}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h3" component="h1" sx={{ fontWeight: 950, lineHeight: 0.95 }}>
                  My account
                </Typography>
                <Typography sx={{ fontWeight: 800, mt: 1 }}>
                  Your Music Graciously profile, downloads, orders, and saved addresses.
                </Typography>
              </Box>

              {loading && <Alert severity="info">Loading your account...</Alert>}
              {error && <Alert severity="error">{error}</Alert>}

              {user && (
                <Stack spacing={2.5}>
                  <Box>
                    <Typography variant="overline" sx={{ fontWeight: 950 }}>Profile</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 950 }}>{user.fullName || user.email}</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{user.email}</Typography>
                    <Typography sx={{ fontWeight: 800 }}>
                      Email verified: {user.emailVerified ? 'Yes' : 'No'}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: 'var(--brutal-ink)', borderBottomWidth: 3 }} />

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button component={Link} href="/download_links" variant="contained" sx={{ fontWeight: 950 }}>
                      Download links
                    </Button>
                    <Button component={Link} href="/cart" variant="outlined" sx={{ fontWeight: 950 }}>
                      Cart
                    </Button>
                    <Button onClick={handleLogout} variant="outlined" color="error" sx={{ fontWeight: 950 }}>
                      Log out
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Stack>
          </Paper>
        </Container>
      </Box>
    </>
  );
}
