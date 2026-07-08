import React, { useState } from 'react';
import Head from 'next/head';
import { Alert, Button, Card, CardContent, Grid, Stack, TextField, Typography } from '@mui/material';
import PlatformShell from '../components/music-platform/PlatformShell';
import { createClassroom } from '../lib/musicGraciouslyApi';

export default function ClassroomsPage() {
  const [form, setForm] = useState({ teacher_id: process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '', name: '', instrument: '', description: '', price_cents: 0 });
  const [created, setCreated] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: name === 'price_cents' ? Number(value) : value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await createClassroom(form);
      setCreated(data.classroom);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Unable to create classroom.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head><title>Classrooms | Music Graciously</title></Head>
      <PlatformShell title="Classrooms" subtitle="Create online music classrooms, enroll students, assign transcription-powered exercises, and review practice time.">
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '8px 8px 0 var(--brutal-ink)', bgcolor: 'white' }}>
              <CardContent>
                <Stack component="form" spacing={2} onSubmit={submit}>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>Create a classroom</Typography>
                  {error && <Alert severity="error">{error}</Alert>}
                  {created && <Alert severity="success">Created classroom: {created.name}</Alert>}
                  <TextField label="Teacher ID" name="teacher_id" value={form.teacher_id} onChange={update} required />
                  <TextField label="Classroom name" name="name" value={form.name} onChange={update} required />
                  <TextField label="Instrument" name="instrument" value={form.instrument} onChange={update} />
                  <TextField label="Description" name="description" value={form.description} onChange={update} multiline minRows={3} />
                  <TextField label="Price in cents" name="price_cents" type="number" value={form.price_cents} onChange={update} />
                  <Button type="submit" variant="contained" disabled={loading} sx={{ fontWeight: 950 }}>Create classroom</Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ border: '4px solid var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 950, mb: 2 }}>What classrooms enable</Typography>
                <Stack spacing={1.2} sx={{ fontWeight: 850 }}>
                  <Typography>Teacher-to-student assignment workflows.</Typography>
                  <Typography>Practice timers and submission review.</Typography>
                  <Typography>Feedback threads and direct messages.</Typography>
                  <Typography>Commission-ready paid course enrollments.</Typography>
                  <Typography>AI transcription exercises generated from scores.</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PlatformShell>
    </>
  );
}
