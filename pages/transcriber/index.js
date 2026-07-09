import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

const API_BASE_URL = process.env.NEXT_PUBLIC_CHECKOUT_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend-humming-hill-1299.fly.dev';

const DEFAULT_STEMS = ['vocals', 'drums', 'bass', 'other'];

function buildApiUrl(path) {
  if (!API_BASE_URL) return path;
  return `${API_BASE_URL.replace(/\/$/, '')}${path}`;
}

export default function TranscriberPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [targetStem, setTargetStem] = useState('vocals');
  const [selectedFile, setSelectedFile] = useState(null);
  const [job, setJob] = useState(null);
  const [displayedProgress, setDisplayedProgress] = useState(0);
  const [stems, setStems] = useState([]);
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Smooth progress bar animation and active micro-increments
  React.useEffect(() => {
    if (!job) {
      setDisplayedProgress(0);
      return;
    }
    const target = job.progress || 0;
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev < target) {
          return prev + 1;
        } else if (prev > target) {
          if (prev - target > 15) {
            return target;
          }
          return prev - 1;
        } else {
          // Micro-increment slowly if the job is active to show visual progress
          const isActive = job.status !== 'completed' && job.status !== 'failed';
          if (isActive && prev < 98) {
            if (Math.random() < 0.15) {
              return prev + 1;
            }
          }
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(interval);
  }, [job?.progress, job?.status]);

  const plannedOutputs = useMemo(() => {
    if (!job) return [];
    const target = job.target_stem || targetStem || 'vocals';
    return [
      `${target}.mid`,
      `${target}.musicxml`,
      `${target}.pdf`,
      'notes.json',
      'job.json',
    ];
  }, [job, targetStem]);

  async function refreshJob(jobId) {
    const response = await fetch(buildApiUrl(`/api/transcriptions/${jobId}`));
    if (!response.ok) throw new Error('Unable to refresh the transcription job.');
    const data = await response.json();
    setJob(data);

    try {
      const stemsRes = await fetch(buildApiUrl(`/api/transcriptions/${jobId}/stems`));
      if (stemsRes.ok) {
        const stemsData = await stemsRes.json();
        setStems(stemsData.stems || []);
      }
    } catch (e) {
      console.error('Error fetching stems:', e);
    }

    try {
      const outputsRes = await fetch(buildApiUrl(`/api/transcriptions/${jobId}/outputs`));
      if (outputsRes.ok) {
        const outputsData = await outputsRes.json();
        setOutputs(outputsData.outputs || null);
      }
    } catch (e) {
      console.error('Error fetching outputs:', e);
    }

    return data;
  }

  // Automatic Polling every 2s while job is not finished
  React.useEffect(() => {
    if (!job || job.status === 'completed' || job.status === 'failed') return;
    const timer = setInterval(() => {
      refreshJob(job.id).catch(console.error);
    }, 2000);
    return () => clearInterval(timer);
  }, [job?.id, job?.status]);

  async function handleDownload(key) {
    if (!job) return;
    try {
      const response = await fetch(buildApiUrl(`/api/transcriptions/${job.id}/download?key=${encodeURIComponent(key)}`));
      if (!response.ok) throw new Error('Failed to generate download link.');
      const data = await response.json();
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      alert(err.message || String(err));
    }
  }

  async function createFromUrl() {
    setError('');
    setLoading(true);
    setStems([]);
    setOutputs(null);
    try {
      const response = await fetch(buildApiUrl('/api/transcriptions/from-url'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: youtubeUrl,
          user_id: 'anonymous',
          selected_stems: DEFAULT_STEMS,
          target_stem: targetStem,
          create_pdf: true,
          create_musicxml: true,
        }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || 'Unable to create transcription from URL.');
      }
      const data = await response.json();
      setJob(data);
      refreshJob(data.id).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  async function uploadAudio() {
    if (!selectedFile) {
      setError('Select an audio file first.');
      return;
    }
    setError('');
    setLoading(true);
    setStems([]);
    setOutputs(null);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('user_id', 'anonymous');
      formData.append('selected_stems', DEFAULT_STEMS.join(','));
      formData.append('target_stem', targetStem);

      const response = await fetch(buildApiUrl('/api/transcriptions/upload'), {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.detail || 'Unable to upload audio.');
      }
      const data = await response.json();
      setJob(data);
      refreshJob(data.id).catch(console.error);
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Music Transcriber | Music Graciously</title>
        <meta
          name="description"
          content="Upload a song or paste a YouTube URL, split sources with Demucs, and prepare notes with Basic Pitch for MIDI, MusicXML, and PDF sheet music."
        />
      </Head>

      <Box sx={{ bgcolor: 'var(--brutal-yellow)', pt: { xs: 10, md: 12 }, pb: 8, borderBottom: '4px solid var(--brutal-ink)' }}>
        <Container maxWidth="lg">
          <Stack spacing={3}>
            <Chip label="New AI Music Tool" sx={{ alignSelf: 'flex-start', fontWeight: 900, bgcolor: 'var(--brutal-paper)', border: '2px solid var(--brutal-ink)' }} />
            <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '2.8rem', md: '5rem' }, lineHeight: 0.95, fontWeight: 950, color: 'var(--brutal-ink)' }}>
              Transcribe songs into playable sheet music.
            </Typography>
            <Typography variant="h5" sx={{ maxWidth: 860, fontWeight: 800, color: 'var(--brutal-ink)' }}>
              Start with an upload or YouTube URL. The backend queues the job in Upstash Redis, stores files in categorized Cloudflare R2 folders, then prepares the Demucs and Basic Pitch pipeline.
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={4}>
          {error && <Alert severity="error">{error}</Alert>}

          <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '8px 8px 0 var(--brutal-ink)' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h4" sx={{ fontWeight: 950 }}>Create a transcription job</Typography>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                  <TextField
                    label="YouTube or video URL"
                    value={youtubeUrl}
                    onChange={(event) => setYoutubeUrl(event.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Target stem"
                    value={targetStem}
                    onChange={(event) => setTargetStem(event.target.value)}
                    sx={{ minWidth: { md: 180 } }}
                  />
                  <Button variant="contained" size="large" disabled={loading || !youtubeUrl} onClick={createFromUrl} sx={{ fontWeight: 900 }}>
                    Use URL
                  </Button>
                </Stack>

                <Divider>or upload audio</Divider>

                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
                  <Button variant="outlined" component="label" sx={{ fontWeight: 900, bgcolor: 'var(--brutal-paper)' }}>
                    Choose audio file
                    <input hidden type="file" accept="audio/*,video/*" onChange={(event) => setSelectedFile(event.target.files?.[0] || null)} />
                  </Button>
                  <Typography sx={{ flex: 1, fontWeight: 700 }}>
                    {selectedFile ? selectedFile.name : 'MP3, WAV, M4A, MP4, or another audio/video source'}
                  </Typography>
                  <Button variant="contained" size="large" disabled={loading || !selectedFile} onClick={uploadAudio} sx={{ fontWeight: 900 }}>
                    Upload
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {job && (
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '8px 8px 0 var(--brutal-ink)' }}>
              <CardContent>
                <Stack spacing={3}>
                  <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 950 }}>Job {job.id}</Typography>
                      <Typography sx={{ fontWeight: 700 }}>Status: {job.status}</Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{job.message}</Typography>
                    </Box>
                    <Button variant="outlined" onClick={() => refreshJob(job.id)} sx={{ alignSelf: { md: 'start' }, fontWeight: 900, bgcolor: 'var(--brutal-paper)' }}>
                      Refresh
                    </Button>
                  </Stack>

                  <Box>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography sx={{ fontWeight: 900 }}>Progress</Typography>
                      <Typography sx={{ fontWeight: 900 }}>{displayedProgress}%</Typography>
                    </Stack>
                    <LinearProgress variant="determinate" value={Math.min(100, Math.max(0, displayedProgress))} sx={{ height: 14, borderRadius: 2 }} />
                  </Box>

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>Cloudflare R2 base folder</Typography>
                    <Typography component="code" sx={{ display: 'block', p: 2, bgcolor: 'var(--brutal-paper)', border: '2px solid var(--brutal-ink)', overflowX: 'auto' }}>
                      {job.r2_base_prefix}
                    </Typography>
                  </Box>

                  {stems.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>Stems (Partitions) Status</Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        {stems.map((stem) => {
                          let chipColor = 'default';
                          if (stem.status === 'running') chipColor = 'warning';
                          if (stem.status === 'ready') chipColor = 'success';
                          if (stem.status === 'failed') chipColor = 'error';
                          return (
                            <Chip
                              key={stem.name}
                              label={`${stem.name}: ${stem.status}`}
                              color={chipColor}
                              variant="outlined"
                              sx={{ fontWeight: 700 }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  )}

                  {job.status === 'completed' && outputs && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>Generated Outputs (Download)</Typography>
                      <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                        {Object.entries(outputs).map(([type, key]) => (
                          <Button
                            key={type}
                            variant="contained"
                            size="small"
                            onClick={() => handleDownload(key)}
                            sx={{
                              fontWeight: 900,
                              textTransform: 'uppercase',
                              border: '2px solid var(--brutal-ink)',
                              boxShadow: '2px 2px 0 var(--brutal-ink)',
                              bgcolor: 'var(--brutal-yellow)',
                              color: 'var(--brutal-ink)',
                              '&:hover': {
                                boxShadow: 'none',
                                transform: 'translate(2px, 2px)',
                                bgcolor: 'var(--brutal-yellow)',
                              }
                            }}
                          >
                            Download {type}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}

                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>Planned partition outputs</Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {plannedOutputs.map((output) => <Chip key={output} label={output} />)}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
        </Stack>
      </Container>
    </>
  );
}
