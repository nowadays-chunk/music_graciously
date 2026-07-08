import React, { useState } from 'react';
import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, { AuthFooterLink, AuthSubmitButton, AuthTextField } from '../components/Auth/AuthPanel';
import { registerAccount } from '../lib/authClient';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');
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
      const response = await registerAccount({ fullName, email: normalizedEmail, password: secret });
      window.localStorage.setItem('music_graciously_pending_email', normalizedEmail);
      setSuccess(response.message || 'Account created. Check your email for the verification code.');
      router.push(`/verify-email?email=${encodeURIComponent(normalizedEmail)}`);
    } catch (err) {
      setError(err.message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Create account | Music Graciously</title>
        <meta name="description" content="Create your Music Graciously account." />
      </Head>
      <AuthPanel
        title="Create account"
        subtitle="Save your downloads, orders, addresses, and future music tools in one place."
        error={error}
        success={success}
        footer={<AuthFooterLink href="/login">Already have an account? Log in</AuthFooterLink>}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField label="Full name" value={fullName} onChange={(event) => setFullName(event.target.value)} />
          <AuthTextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <AuthTextField label="Password" type="password" value={secret} onChange={(event) => setSecret(event.target.value)} required helperText="Use at least 8 characters." />
          <AuthSubmitButton loading={loading}>Create account</AuthSubmitButton>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>We will email you a 6-digit verification code.</Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}
