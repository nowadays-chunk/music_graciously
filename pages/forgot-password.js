import React, { useState } from 'react';
import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, { AuthFooterLink, AuthSubmitButton, AuthTextField } from '../components/Auth/AuthPanel';
import { forgotPassword } from '../lib/authClient';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      await forgotPassword({ email: normalizedEmail });
      window.localStorage.setItem('music_graciously_pending_email', normalizedEmail);
      setSuccess('Password reset instructions sent.');
      router.push(`/reset-password?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err) {
      setError(err.message || 'Unable to start password reset.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Forgot password | Music Graciously</title>
        <meta name="description" content="Reset your Music Graciously password." />
      </Head>
      <AuthPanel
        title="Forgot password"
        subtitle="Enter your email and we will send reset instructions."
        error={error}
        success={success}
        footer={<AuthFooterLink href="/login">Remembered it? Log in</AuthFooterLink>}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <AuthSubmitButton loading={loading}>Send reset instructions</AuthSubmitButton>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>Check the inbox connected to your Music Graciously account.</Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}
