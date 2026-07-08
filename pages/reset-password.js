import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import AuthPanel, { AuthFooterLink, AuthSubmitButton, AuthTextField } from '../components/Auth/AuthPanel';
import { resetPassword } from '../lib/authClient';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword,
      });
      window.localStorage.removeItem('music_graciously_pending_email');
      setSuccess('Password updated. Redirecting to login...');
      router.push('/login');
    } catch (err) {
      setError(err.message || 'Unable to reset your password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Reset password | Music Graciously</title>
        <meta name="description" content="Create a new password for your Music Graciously account." />
      </Head>
      <AuthPanel
        title="Reset password"
        subtitle="Enter the 6 digit code from your email and choose a new password."
        error={error}
        success={success}
        footer={<AuthFooterLink href="/login">Back to login</AuthFooterLink>}
      >
        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <AuthTextField label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <AuthTextField label="Reset code" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} required />
          <AuthTextField label="New password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required inputProps={{ minLength: 8 }} />
          <AuthTextField label="Confirm new password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required inputProps={{ minLength: 8 }} />
          <AuthSubmitButton loading={loading}>Update password</AuthSubmitButton>
          <Typography variant="caption" sx={{ fontWeight: 800 }}>The reset code expires after a few minutes.</Typography>
        </Stack>
      </AuthPanel>
    </>
  );
}
