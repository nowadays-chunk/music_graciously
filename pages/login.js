import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, { AuthFooterLink, AuthSubmitButton, AuthTextField } from '../components/Auth/AuthPanel';
import { loginAccount, persistAuthResponse } from '../lib/authClient';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await loginAccount(form);
      window.localStorage.setItem('music_graciously_pending_email', form.email.trim().toLowerCase());

      if (response.requiresEmailVerification) {
        setSuccess(response.message || 'Verification code sent.');
        router.push(`/verify-email?email=${encodeURIComponent(form.email)}`);
        return;
      }

      if (response.requiresTwoFactor) {
        setSuccess(response.message || 'Two-factor code sent.');
        router.push(`/two-factor?email=${encodeURIComponent(form.email)}`);
        return;
      }

      persistAuthResponse(response);
      router.push(router.query.next || '/account');
    } catch (err) {
      setError(err.message || 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Log in | Music Graciously</title>
        <meta name="description" content="Log in to your Music Graciously account." />
      </Head>

      <AuthPanel
        title="Log in"
        subtitle="Access your downloads, orders, and account settings."
        error={error}
        success={success}
        footer={(
          <Stack spacing={1}>
            <AuthFooterLink href="/register">Need an account? Create one</AuthFooterLink>
            <AuthFooterLink href="/forgot-password">Forgot your password?</AuthFooterLink>
          </Stack>
        )}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={updateField}
            required
          />
          <AuthTextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={updateField}
            required
          />
          <AuthSubmitButton loading={loading}>Log in</AuthSubmitButton>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>
            Login may ask for a 6-digit code sent to your email.
          </Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}
