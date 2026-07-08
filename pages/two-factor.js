import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, {
  AuthFooterLink,
  AuthSubmitButton,
  AuthTextField,
} from '../components/Auth/AuthPanel';
import { persistAuthResponse, verifyLogin } from '../lib/authClient';

export default function TwoFactorPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!router.isReady) return;

    const queryEmail =
      typeof router.query.email === 'string' ? router.query.email : '';

    const savedEmail =
      typeof window !== 'undefined'
        ? window.localStorage.getItem('music_graciously_pending_email') || ''
        : '';

    setEmail(queryEmail || savedEmail);
  }, [router.isReady, router.query.email]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await verifyLogin({
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });

      persistAuthResponse(response);

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('music_graciously_pending_email');
      }

      setSuccess('Login verified. Redirecting to your account...');

      router.push(router.query.next || '/account');
    } catch (err) {
      setError(err.message || 'Unable to verify your login code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Two-factor login | Music Graciously</title>
        <meta
          name="description"
          content="Enter your Music Graciously two-factor login code."
        />
      </Head>

      <AuthPanel
        title="Two-factor login"
        subtitle="Enter the 6-digit code sent to your email to finish signing in."
        error={error}
        success={success}
        footer={<AuthFooterLink href="/login">Back to login</AuthFooterLink>}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField
            label="Email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <AuthTextField
            label="Login code"
            inputMode="numeric"
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
            }
            required
          />

          <AuthSubmitButton loading={loading}>Verify login</AuthSubmitButton>

          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            The code expires after a few minutes. Request a new one by logging in
            again.
          </Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}