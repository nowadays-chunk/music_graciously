import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { Alert, Box, Button, CircularProgress, Stack, TextField } from '@mui/material';
import PlatformShell from '../../components/music-platform/PlatformShell';
import { DashboardGrid } from '../../components/music-platform/DashboardCards';
import { fetchStudentDashboard } from '../../lib/musicGraciouslyApi';

const DEMO_STUDENT_ID = process.env.NEXT_PUBLIC_DEMO_STUDENT_ID || '';

export default function StudentDashboardPage() {
  const [studentId, setStudentId] = useState(DEMO_STUDENT_ID);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function loadDashboard(id = studentId) {
    if (!id) {
      setError('Set NEXT_PUBLIC_DEMO_STUDENT_ID or paste a student user id.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await fetchStudentDashboard(id);
      setDashboard(data);
    } catch (err) {
      setError(err?.response?.data?.detail || err.message || 'Unable to load student dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (DEMO_STUDENT_ID) loadDashboard(DEMO_STUDENT_ID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Head>
        <title>Student Dashboard | Music Graciously</title>
      </Head>
      <PlatformShell
        title="Student Dashboard"
        subtitle="Track assigned exercises, practice time, AI transcription feedback, class messages, and progress."
        actions={(
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
            <TextField size="small" label="Student ID" value={studentId} onChange={(event) => setStudentId(event.target.value)} sx={{ bgcolor: 'white', minWidth: 300 }} />
            <Button variant="contained" onClick={() => loadDashboard(studentId)} sx={{ fontWeight: 950 }}>Load</Button>
          </Stack>
        )}
      >
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {loading && <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress /></Box>}
          {dashboard && <DashboardGrid counts={dashboard.counts} classrooms={dashboard.classrooms} />}
          {!dashboard && !loading && !error && <Alert severity="info">Enter a student id to load the workspace.</Alert>}
        </Stack>
      </PlatformShell>
    </>
  );
}
