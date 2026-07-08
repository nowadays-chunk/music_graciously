import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, { AuthFooterLink, AuthSubmitButton, AuthTextField } from '../components/Auth/AuthPanel';
import { persistAuthResponse, verifyEmail } from '../lib/authClient';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const queryEmail = typeof router.query.email === 'string' ? router.query.email : '';
    const savedEmail = window.localStorage.getItem('music_graciously_pending_email') || '';
    setEmail(queryEmail || savedEmail);
  }, [router.query.email]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await verifyEmail({ email: email.trim().toLowerCase(), code: code.trim() });
      persistAuthResponse(response);
      window.localStorage.removeItem('music_graciously_pending_email');
      setSuccess('Email verified. Redirecting to your account...');
      router.push('/account');
    } catch (err) {
      setError(err.message || 'Unable to verify your email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Verify email | Music Graciously</title>
        <meta name="description" content="Verify your Music Graciously account email." />
      </Head>
      <AuthPanel
        title="Verify email"
        subtitle="Enter the 6 digit code sent to your inbox."
        error={error}
        success={success}
        footer={<AuthFooterLink href="/login">Back to login</AuthFooterLink>}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <AuthTextField label="Verification code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
          <AuthSubmitButton loading={loading}>Verify account</AuthSubmitButton>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>The code expires after a few minutes.</Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}
