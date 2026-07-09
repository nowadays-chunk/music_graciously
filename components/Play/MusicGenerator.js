import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Chip,
  Divider,
  Checkbox,
  FormControlLabel,
  TextField,
  Slider,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import DeleteIcon from '@mui/icons-material/Delete';

const API_BASE_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://fastapi-graciously.fly.dev').replace(/\/$/, '');

const PRESETS = [
  { label: 'Ambient Lofi Beat', prompt: 'Chill lofi hiphop beat, soft rhodes piano chords, cozy crackling vinyl texture, dusty drums' },
  { label: 'Epic Orchestral Trailer', prompt: 'Epic cinematic orchestral composition, huge brass, soaring strings, thunderous percussion, action trailer vibe' },
  { label: 'Retro Synthwave Solo', prompt: '1980s retro synthwave, driving drum machine, warm analog synth bassline, soaring neon lead' },
  { label: 'Acoustic Folk Arpeggio', prompt: 'Warm acoustic fingerstyle guitar arpeggio, soft backing cello, organic woody tone, peaceful' },
];

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const SCALES = ['major', 'minor', 'dorian', 'mixolydian', 'blues'];

export default function MusicGenerator() {
  const [prompt, setPrompt] = useState(PRESETS[0].prompt);
  const [genre, setGenre] = useState('Lofi');
  const [mood, setMood] = useState('Relaxed');
  const [tempo, setTempo] = useState(120);
  const [keySig, setKeySig] = useState('C');
  const [scale, setScale] = useState('major');
  const [duration, setDuration] = useState(30);
  const [negativePrompt, setNegativePrompt] = useState('');
  
  // Mixer faders
  const [volVocals, setVolVocals] = useState(80);
  const [volMelody, setVolMelody] = useState(80);
  const [volChords, setVolChords] = useState(80);
  const [volBass, setVolBass] = useState(80);
  const [volDrums, setVolDrums] = useState(80);

  // Projects / Generations state
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [projectDetails, setProjectDetails] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [jobStatus, setJobStatus] = useState('idle');
  const [jobProgress, setJobProgress] = useState(0);
  const [jobError, setJobError] = useState('');

  // Audio Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/music-generation/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        if (data.projects?.length && !selectedProjectId) {
          selectProject(data.projects[0].id);
        }
      }
    } catch (e) {
      console.error('Error fetching projects:', e);
    }
  };

  const selectProject = async (id) => {
    setSelectedProjectId(id);
    try {
      const res = await fetch(`${API_BASE_URL}/api/music-generation/project/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProjectDetails(data);
        const latestVersion = data.versions?.[0];
        if (latestVersion?.audio_url) {
          setAudioUrl(latestVersion.audio_url);
        } else {
          setAudioUrl('');
        }
      }
    } catch (e) {
      console.error('Error loading project details:', e);
    }
  };

  const startGeneration = async () => {
    setJobError('');
    setJobStatus('queued');
    setJobProgress(0);
    try {
      const res = await fetch(`${API_BASE_URL}/api/music-generation/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'anonymous',
          project_id: selectedProjectId,
          prompt: {
            text_prompt: prompt,
            negative_prompt: negativePrompt || undefined,
            genre,
            mood,
            tempo,
            key_signature: keySig,
            scale,
            duration_seconds: duration
          }
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setJobId(data.jobId);
        if (data.projectId && !selectedProjectId) {
          setSelectedProjectId(data.projectId);
        }
      } else {
        const err = await res.json();
        setJobStatus('failed');
        setJobError(err.detail || 'Failed to trigger generation');
      }
    } catch (e) {
      setJobStatus('failed');
      setJobError(e.message || 'Network error');
    }
  };

  // Poll generation status
  useEffect(() => {
    if (!jobId || jobStatus === 'finished' || jobStatus === 'failed') return;
    
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/music-generation/jobs/${jobId}`);
        if (res.ok) {
          const data = await res.json();
          setJobStatus(data.status);
          setJobProgress(data.progress);
          
          if (data.status === 'finished') {
            clearInterval(interval);
            setJobId(null);
            fetchProjects();
            if (selectedProjectId) {
              selectProject(selectedProjectId);
            }
          } else if (data.status === 'failed') {
            clearInterval(interval);
            setJobError(data.error_message || 'Model execution failed');
            setJobId(null);
          }
        }
      } catch (e) {
        console.error('Error polling job:', e);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [jobId, jobStatus, selectedProjectId]);

  const deleteProject = async (id, event) => {
    event.stopPropagation();
    if (!window.confirm('Delete this project?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/music-generation/project/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchProjects();
        if (selectedProjectId === id) {
          setSelectedProjectId(null);
          setProjectDetails(null);
          setAudioUrl('');
        }
      }
    } catch (e) {
      console.error('Error deleting project:', e);
    }
  };

  const handlePlayToggle = () => {
    if (!audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const triggerTranscriber = async (audioKey) => {
    alert('Generated audio key sent to Transcriber. Check the transcriber status page to see generated midi and sheet music notation!');
  };

  const activeProject = projectDetails?.project;
  const activeVersion = projectDetails?.versions?.[0];

  return (
    <Box sx={{ p: 4, maxWidth: '1700px', mx: 'auto', color: 'var(--brutal-ink)' }}>
      {/* Audio player tag */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          style={{ display: 'none' }}
        />
      )}

      {/* Main Layout Grid */}
      <Grid container spacing={4}>
        {/* Left Side - Projects sidebar */}
        <Grid item xs={12} md={3}>
          <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)', minHeight: '600px', bgcolor: 'var(--brutal-paper)' }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 950, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <LibraryMusicIcon /> Project Workspace
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setSelectedProjectId(null);
                  setProjectDetails(null);
                  setAudioUrl('');
                }}
                sx={{ width: '100%', mb: 3, fontWeight: 900 }}
              >
                + New Project
              </Button>
              <Divider sx={{ mb: 2 }} />
              <List>
                {projects.map((proj) => (
                  <ListItem
                    button
                    key={proj.id}
                    selected={selectedProjectId === proj.id}
                    onClick={() => selectProject(proj.id)}
                    sx={{
                      border: '2px solid var(--brutal-ink)',
                      borderRadius: 1,
                      mb: 1.5,
                      '&.Mui-selected': { bgcolor: 'var(--brutal-yellow)', color: 'var(--brutal-ink)' },
                    }}
                  >
                    <ListItemText
                      primary={proj.title}
                      secondary={`${proj.tempo} BPM | ${proj.key_signature} ${proj.scale}`}
                      primaryTypographyProps={{ sx: { fontWeight: 900 } }}
                    />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" onClick={(e) => deleteProject(proj.id, e)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {!projects.length && <Typography>No generated projects yet.</Typography>}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Center Panel - Generator config */}
        <Grid item xs={12} md={6}>
          <Stack spacing={3}>
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
              <CardContent>
                <Typography variant="h4" sx={{ fontWeight: 950, mb: 3, bgcolor: 'var(--brutal-yellow)', p: 2, border: '3px solid var(--brutal-ink)' }}>
                  AI Music Generator DAW
                </Typography>

                {/* Prompt Presets */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Quick Presets</Typography>
                  <Stack direction="row" gap={1} flexWrap="wrap">
                    {PRESETS.map((preset) => (
                      <Chip
                        key={preset.label}
                        label={preset.label}
                        onClick={() => setPrompt(preset.prompt)}
                        sx={{ fontWeight: 800, border: '2.5px solid var(--brutal-ink)' }}
                      />
                    ))}
                  </Stack>
                </Box>

                {/* Text Prompt Editor */}
                <Stack spacing={2.5}>
                  <TextField
                    label="Describe your song idea"
                    multiline
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    fullWidth
                    helperText="Include genre, instruments, key signatures, speed, or structural details."
                    InputProps={{ sx: { fontWeight: 800, bgcolor: 'var(--brutal-paper)' } }}
                  />

                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Key</InputLabel>
                        <Select value={keySig} label="Key" onChange={(e) => setKeySig(e.target.value)}>
                          {KEYS.map(k => <MenuItem key={k} value={k}>{k}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <FormControl fullWidth>
                        <InputLabel>Scale</InputLabel>
                        <Select value={scale} label="Scale" onChange={(e) => setScale(e.target.value)}>
                          {SCALES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Tempo (BPM)"
                        type="number"
                        value={tempo}
                        onChange={(e) => setTempo(parseInt(e.target.value))}
                      />
                    </Grid>
                    <Grid item xs={6} sm={3}>
                      <TextField
                        label="Duration (s)"
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    label="Negative Prompt (Exclude sounds/instruments)"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    fullWidth
                  />

                  {/* Submit Button */}
                  <Button
                    variant="contained"
                    size="large"
                    disabled={jobStatus === 'queued' || jobStatus === 'generating' || !prompt.trim()}
                    onClick={startGeneration}
                    sx={{
                      fontWeight: 950,
                      fontSize: '1.2rem',
                      py: 1.5,
                      border: '3px solid var(--brutal-ink)',
                      boxShadow: '4px 4px 0 var(--brutal-ink)'
                    }}
                    startIcon={<AutoAwesomeIcon />}
                  >
                    Generate AI Idea
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Mixer & Waveform preview */}
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 3 }}>Mixer Panel</Typography>
                <Grid container spacing={3}>
                  {[
                    { label: 'Vocals', val: volVocals, set: setVolVocals },
                    { label: 'Melody', val: volMelody, set: setVolMelody },
                    { label: 'Chords', val: volChords, set: setVolChords },
                    { label: 'Bass', val: volBass, set: setVolBass },
                    { label: 'Drums', val: volDrums, set: setVolDrums },
                  ].map((track) => (
                    <Grid item xs={6} sm={2.4} key={track.label}>
                      <Stack spacing={1} alignItems="center">
                        <Slider
                          orientation="vertical"
                          value={track.val}
                          onChange={(e, val) => track.set(val)}
                          sx={{ height: 140, color: 'var(--brutal-ink)' }}
                        />
                        <Typography sx={{ fontWeight: 900 }}>{track.label}</Typography>
                        <Typography variant="caption">{track.val}%</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Panel - Active project inspect / downloads */}
        <Grid item xs={12} md={3}>
          <Stack spacing={3}>
            {/* Generation Job Status */}
            {(jobStatus !== 'idle' || jobId) && (
              <Card sx={{ border: '4px solid var(--brutal-ink)', bgcolor: 'var(--brutal-yellow)' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 950, mb: 1 }}>Job Runner</Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress variant="determinate" value={jobProgress} size={30} />
                    <Box>
                      <Typography sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{jobStatus}</Typography>
                      <Typography variant="body2">{jobProgress}% completed</Typography>
                    </Box>
                  </Stack>
                  {jobError && <Typography color="error" sx={{ mt: 1, fontWeight: 900 }}>{jobError}</Typography>}
                </CardContent>
              </Card>
            )}

            {/* Project Details & Assets */}
            <Card sx={{ border: '4px solid var(--brutal-ink)', boxShadow: '6px 6px 0 var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', minHeight: '400px' }}>
              <CardContent>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 2 }}>Project Details</Typography>
                {activeProject ? (
                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{activeProject.title}</Typography>
                      <Typography variant="body2">{activeProject.description || 'No description added.'}</Typography>
                    </Box>

                    {activeVersion ? (
                      <Stack spacing={2}>
                        <Typography sx={{ fontWeight: 800 }}>Version {activeVersion.version_number} Exports</Typography>
                        
                        {activeVersion.audio_url && (
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => window.open(activeVersion.audio_url, '_blank')}
                            sx={{ fontWeight: 900 }}
                          >
                            Audio WAV
                          </Button>
                        )}
                        {activeVersion.midi_url && (
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => window.open(activeVersion.midi_url, '_blank')}
                            sx={{ fontWeight: 900 }}
                          >
                            MIDI File
                          </Button>
                        )}
                        {activeVersion.xml_url && (
                          <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => window.open(activeVersion.xml_url, '_blank')}
                            sx={{ fontWeight: 900 }}
                          >
                            MusicXML Score
                          </Button>
                        )}

                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={() => triggerTranscriber(activeVersion.audio_url)}
                          sx={{ fontWeight: 900, mt: 1 }}
                        >
                          Transcribe Stems
                        </Button>
                      </Stack>
                    ) : (
                      <Typography>Generating first version files...</Typography>
                    )}
                  </Stack>
                ) : (
                  <Typography>Select or create an AI project workspace to view export download options.</Typography>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>

      {/* Bottom Transport Controls Dock */}
      {audioUrl && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'var(--brutal-yellow)',
            borderTop: '4px solid var(--brutal-ink)',
            p: 2.5,
            zIndex: 1000,
          }}
        >
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={4}>
            <Stack direction="row" spacing={1}>
              <IconButton onClick={handlePlayToggle} sx={{ border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
              <IconButton onClick={stopPlayback} sx={{ border: '3px solid var(--brutal-ink)', bgcolor: 'var(--brutal-paper)', color: 'var(--brutal-ink)' }}>
                <StopIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ minWidth: 200 }}>
              <VolumeUpIcon />
              <Slider defaultValue={80} size="small" sx={{ color: 'var(--brutal-ink)' }} />
            </Stack>
            <Typography sx={{ fontWeight: 950, letterSpacing: 0.5 }}>
              PLAYING VERSION PREVIEW
            </Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
