import React from 'react';
import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';

export function StatCard({ label, value, helper }) {
  return (
    <Card sx={{ border: '4px solid var(--brutal-ink, #111)', boxShadow: '8px 8px 0 var(--brutal-ink, #111)', bgcolor: 'white', height: '100%' }}>
      <CardContent>
        <Typography variant="overline" sx={{ fontWeight: 950, color: 'var(--brutal-ink, #111)' }}>{label}</Typography>
        <Typography variant="h3" sx={{ fontWeight: 950, lineHeight: 1, my: 1 }}>{value ?? 0}</Typography>
        {helper && <Typography sx={{ fontWeight: 800, color: 'text.secondary' }}>{helper}</Typography>}
      </CardContent>
    </Card>
  );
}

export function ClassroomCard({ classroom }) {
  return (
    <Card sx={{ border: '3px solid var(--brutal-ink, #111)', bgcolor: 'white' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h5" sx={{ fontWeight: 950 }}>{classroom.name}</Typography>
          <Typography sx={{ fontWeight: 800 }}>{classroom.instrument || 'All instruments'} · {classroom.status}</Typography>
          <Typography sx={{ fontWeight: 800 }}>{classroom.enrolled_students ?? classroom.enrolledStudents ?? 0} active students</Typography>
          <Box sx={{ display: 'inline-flex', alignSelf: 'flex-start', px: 1.5, py: 0.75, bgcolor: 'var(--brutal-yellow, #ffd400)', border: '2px solid var(--brutal-ink, #111)', fontWeight: 950 }}>
            {((classroom.price_cents ?? classroom.priceCents ?? 0) / 100).toFixed(2)} {(classroom.currency || 'eur').toUpperCase()}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DashboardGrid({ counts = {}, classrooms = [] }) {
  return (
    <Stack spacing={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}><StatCard label="Teacher classes" value={counts.teacher_classrooms} helper="Classes you manage" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Student classes" value={counts.student_classrooms} helper="Classes you attend" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Assignments" value={counts.teacher_assignments} helper="Draft or published" /></Grid>
        <Grid item xs={12} md={3}><StatCard label="Transcriptions" value={counts.transcription_jobs} helper="AI score jobs" /></Grid>
      </Grid>

      <Box>
        <Typography variant="h4" sx={{ fontWeight: 950, mb: 2 }}>Classrooms</Typography>
        <Grid container spacing={3}>
          {classrooms.length ? classrooms.map((classroom) => (
            <Grid item xs={12} md={4} key={classroom.id}>
              <ClassroomCard classroom={classroom} />
            </Grid>
          )) : (
            <Grid item xs={12}>
              <Card sx={{ border: '3px dashed var(--brutal-ink, #111)', bgcolor: 'white' }}>
                <CardContent>
                  <Typography sx={{ fontWeight: 900 }}>No classrooms yet. Create your first music classroom to assign exercises and review practice time.</Typography>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Stack>
  );
}
