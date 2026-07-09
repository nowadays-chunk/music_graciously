import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const API_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi-graciously.fly.dev').replace(/\/$/, '');
const DEFAULT_STEMS = ['vocals', 'drums', 'bass', 'other'];
const FINAL_STATUSES = new Set(['completed', 'failed']);

async function parseJsonResponse(response) {
  const text = await response.text();
  let payload = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = { detail: text || response.statusText };
  }
  if (!response.ok) {
    const message = payload?.detail || payload?.message || response.statusText || 'Request failed';
    throw new Error(typeof message === 'string' ? message : JSON.stringify(message));
  }
  return payload;
}

async function createUrlJob({ url, userId, selectedStems, targetStem }) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/from-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url,
      user_id: userId || 'anonymous',
      selected_stems: selectedStems,
      target_stem: targetStem,
      create_pdf: true,
      create_musicxml: true,
    }),
  });
  return parseJsonResponse(response);
}

async function createUploadJob({ file, userId, selectedStems, targetStem }) {
  const form = new FormData();
  form.append('file', file);
  form.append('user_id', userId || 'anonymous');
  form.append('selected_stems', selectedStems.join(','));
  form.append('target_stem', targetStem);
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/upload`, {
    method: 'POST',
    body: form,
  });
  return parseJsonResponse(response);
}

async function fetchJob(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/${jobId}`);
  return parseJsonResponse(response);
}

async function fetchStems(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/${jobId}/stems`);
  return parseJsonResponse(response);
}

async function fetchOutputs(jobId) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/${jobId}/outputs`);
  return parseJsonResponse(response);
}

async function createDownloadUrl(jobId, key) {
  const response = await fetch(`${API_BASE_URL}/api/transcriptions/${jobId}/download?key=${encodeURIComponent(key)}`);
  return parseJsonResponse(response);
}

function StatusBadge({ status }) {
  const color = status === 'completed' ? 'success' : status === 'failed' ? 'error' : 'warning';
  return <Chip label={status || 'idle'} color={color} sx={{ fontWeight: 900, textTransform: 'uppercase' }} />;
}

function OutputButton({ jobId, name, objectKey, ready }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const openDownload = async () => {
    if (!objectKey || !ready) return;
    setLoading(true);
    setError('');
    try {
      const payload = await createDownloadUrl(jobId, objectKey);
      window.open(payload.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setError(err.message || 'Download failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6" sx={{ fontWeight: 950 }}>{name}</Typography>
          <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{objectKey || 'Not planned yet'}</Typography>
          <Chip label={ready ? 'ready' : 'waiting'} color={ready ? 'success' : 'default'} sx={{ alignSelf: 'flex-start', fontWeight: 900 }} />
          <Button variant="contained" disabled={!ready || loading} onClick={openDownload} sx={{ fontWeight: 900 }}>
            {loading ? 'Opening...' : 'Download'}
          </Button>
          {error ? <Alert severity="error">{error}</Alert> : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TranscriberPage() {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [userId, setUserId] = useState('anonymous');
  const [targetStem, setTargetStem] = useState('vocals');
  const [selectedStems, setSelectedStems] = useState(DEFAULT_STEMS);
  const [job, setJob] = useState(null);
  const [stems, setStems] = useState(null);
  const [outputs, setOutputs] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const jobId = job?.id;
  const progress = Math.max(0, Math.min(100, Number(job?.progress || 0)));
  const isRunning = job && !FINAL_STATUSES.has(job.status);

  const toggleStem = (stem) => {
    setSelectedStems((current) => {
      if (current.includes(stem)) {
        const next = current.filter((item) => item !== stem);
        return next.length ? next : current;
      }
      return [...current, stem];
    });
  };

  const refreshJob = useCallback(async () => {
    if (!jobId) return;
    const [jobPayload, stemsPayload, outputsPayload] = await Promise.all([
      fetchJob(jobId),
      fetchStems(jobId),
      fetchOutputs(jobId),
    ]);
    setJob(jobPayload);
    setStems(stemsPayload);
    setOutputs(outputsPayload);
  }, [jobId]);

  useEffect(() => {
    if (!jobId || FINAL_STATUSES.has(job?.status)) return undefined;
    const interval = setInterval(() => {
      refreshJob().catch((err) => setError(err.message || 'Unable to refresh transcription job'));
    }, 2500);
    return () => clearInterval(interval);
  }, [jobId, job?.status, refreshJob]);

  const submitUrl = async () => {
    if (!url.trim()) {
      setError('Paste a YouTube or audio URL first.');
      return;
    }
    setSubmitting(true);
    setError('');
    setStems(null);
    setOutputs(null);
    try {
      const created = await createUrlJob({ url: url.trim(), userId, selectedStems, targetStem });
      setJob(created);
    } catch (err) {
      setError(err.message || 'Could not create URL transcription job');
    } finally {
      setSubmitting(false);
    }
  };

  const submitFile = async () => {
    if (!file) {
      setError('Choose an audio file first.');
      return;
    }
    setSubmitting(true);
    setError('');
    setStems(null);
    setOutputs(null);
    try {
      const created = await createUploadJob({ file, userId, selectedStems, targetStem });
      setJob(created);
    } catch (err) {
      setError(err.message || 'Could not create upload transcription job');
    } finally {
      setSubmitting(false);
    }
  };

  const readyOutputs = useMemo(() => {
    const objectMap = outputs?.outputs || {};
    const readyMap = outputs?.ready || {};
    return Object.entries(objectMap).filter(([name]) => !name.startsWith('stem:')).map(([name, objectKey]) => ({
      name,
      objectKey,
      ready: Boolean(readyMap[name]),
    }));
  }, [outputs]);

  return (
    <>
      <Head>
        <title>AI Music Transcriber | Music Graciously</title>
        <meta name="description" content="Upload audio or paste a YouTube URL, then generate stems, MIDI, MusicXML, PDF, and note metadata." />
      </Head>

      <Box sx={{ bgcolor: 'var(--brutal-yellow)', pt: { xs: 10, md: 13 }, pb: 6, borderBottom: '4px solid var(--brutal-ink)' }}>
        <Container maxWidth="xl">
          <Typography variant="h1" sx={{ fontSize: { xs: '2.8rem', md: '5rem' }, fontWeight: 950, lineHeight: 0.95, color: 'var(--brutal-ink)' }}>
            AI Music Transcriber
          </Typography>
          <Typography variant="h5" sx={{ mt: 2, maxWidth: 900, fontWeight: 800, color: 'var(--brutal-ink)' }}>
            Create one backend job, let the Fly worker process it in order, and download real R2 outputs when they are ready.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)' }}>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h4" sx={{ fontWeight: 950 }}>Create a job</Typography>
                  <TextField label="User ID" value={userId} onChange={(event) => setUserId(event.target.value)} fullWidth />
                  <TextField label="Target stem" value={targetStem} onChange={(event) => setTargetStem(event.target.value)} fullWidth helperText="Example: vocals, drums, bass, other" />

                  <Box>
                    <Typography sx={{ fontWeight: 900, mb: 1 }}>Requested stems</Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {DEFAULT_STEMS.map((stem) => (
                        <Chip
                          key={stem}
                          label={stem}
                          color={selectedStems.includes(stem) ? 'primary' : 'default'}
                          onClick={() => toggleStem(stem)}
                          sx={{ fontWeight: 900 }}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Divider />

                  <TextField label="YouTube or audio URL" value={url} onChange={(event) => setUrl(event.target.value)} fullWidth />
                  <Button variant="contained" onClick={submitUrl} disabled={submitting || !url.trim()} sx={{ fontWeight: 900 }}>
                    Start from URL
                  </Button>

                  <Divider />

                  <Button component="label" variant="outlined" sx={{ fontWeight: 900, bgcolor: 'var(--brutal-paper)' }}>
                    Choose audio file
                    <input hidden type="file" accept="audio/*,video/*" onChange={(event) => setFile(event.target.files?.[0] || null)} />
                  </Button>
                  {file ? <Typography sx={{ fontWeight: 800 }}>{file.name}</Typography> : null}
                  <Button variant="contained" onClick={submitFile} disabled={submitting || !file} sx={{ fontWeight: 900 }}>
                    Upload and start
                  </Button>

                  {submitting ? <LinearProgress /> : null}
                  {error ? <Alert severity="error">{error}</Alert> : null}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Stack spacing={3}>
              <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)' }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" gap={2}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 950 }}>Job status</Typography>
                        <Typography sx={{ wordBreak: 'break-all' }}>{jobId || 'No job yet'}</Typography>
                      </Box>
                      <StatusBadge status={job?.status || 'idle'} />
                    </Stack>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 12, borderRadius: 1 }} />
                    <Typography sx={{ fontWeight: 900 }}>{progress}%</Typography>
                    <Typography>{job?.message || 'Create a transcription job to start the worker pipeline.'}</Typography>
                    {isRunning ? (
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CircularProgress size={20} />
                        <Typography sx={{ fontWeight: 800 }}>Polling backend every 2.5 seconds...</Typography>
                      </Stack>
                    ) : null}
                    {jobId ? <Button variant="outlined" onClick={refreshJob} sx={{ alignSelf: 'flex-start', fontWeight: 900 }}>Refresh now</Button> : null}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 950, mb: 2 }}>Stems</Typography>
                  <Grid container spacing={2}>
                    {(stems?.stems || []).map((stem) => (
                      <Grid item xs={12} sm={6} key={stem.name}>
                        <Card sx={{ border: '3px solid var(--brutal-ink)' }}>
                          <CardContent>
                            <Stack spacing={1}>
                              <Typography variant="h6" sx={{ fontWeight: 950 }}>{stem.name}</Typography>
                              <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{stem.r2Key}</Typography>
                              <Chip label={stem.exists ? 'ready' : stem.status} color={stem.exists ? 'success' : 'default'} sx={{ alignSelf: 'flex-start', fontWeight: 900 }} />
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {!stems?.stems?.length ? <Grid item xs={12}><Typography>No stems yet.</Typography></Grid> : null}
                  </Grid>
                </CardContent>
              </Card>

              <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)' }}>
                <CardContent>
                  <Typography variant="h4" sx={{ fontWeight: 950, mb: 2 }}>Outputs</Typography>
                  <Grid container spacing={2}>
                    {readyOutputs.map((output) => (
                      <Grid item xs={12} sm={6} key={output.name}>
                        <OutputButton jobId={jobId} {...output} />
                      </Grid>
                    ))}
                    {!readyOutputs.length ? <Grid item xs={12}><Typography>No outputs yet.</Typography></Grid> : null}
                  </Grid>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
