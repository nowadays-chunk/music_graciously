import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import PlatformShell from '../../components/music-platform/PlatformShell';
import { DashboardGrid } from '../../components/music-platform/DashboardCards';
import { fetchTeacherDashboard } from '../../lib/musicGraciouslyApi';

const DEMO_TEACHER_ID = process.env.NEXT_PUBLIC_DEMO_TEACHER_ID || '';

export default function TeacherDashboardPage() {
  const [teacherId, setTeacherId] = useState(DEMO_TEACHER_ID);
  const [queryId, setQueryId] = useState(DEMO_TEACHER_ID);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard(id = queryId) {
    if (!id) {
      setError('Set NEXT_PUBLIC_DEMO_TEACHER_ID or paste a teacher user id.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchTeacherDashboard(id);
      setDashboard(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Unable to load teacher dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (DEMO_TEACHER_ID) loadDashboard(DEMO_TEACHER_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Teacher Dashboard | Music Graciously</title>
      </Head>
      <PlatformShell
        title="Teacher Dashboard"
        subtitle="Manage classrooms, assignments, transcription-powered exercises, feedback, and teacher revenue."
        actions={(
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField size="small" label="Teacher ID" value={teacherId} onChange={(event) => setTeacherId(event.target.value)} sx={{ bgcolor: 'white', minWidth: 300 }} />
            <Button variant="contained" onClick={() => { setQueryId(teacherId); loadDashboard(teacherId); }} sx={{ fontWeight: 950 }}>Load</Button>
          </Stack>
        )}
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}
          {dashboard && <DashboardGrid counts={dashboard.counts} classrooms={dashboard.classrooms} />}
          {!dashboard && !loading && !error && <Alert severity="info">Enter a teacher id to load the workspace.</Alert>}
        </Stack>
      </PlatformShell>
    </>
  );
}
