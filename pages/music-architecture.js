import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Box, Button, Chip, Container, Divider, Grid, Paper, Stack, Typography } from '@mui/material';

const stackRows = [
  ['Frontend web', 'Next.js on Vercel'],
  ['Desktop app', 'Tauri 2 + Next.js, or Electron'],
  ['Hybrid mobile', 'Tauri 2 mobile, Capacitor, or React Native'],
  ['Backend API', 'Fastify / NestJS on Railway or Fly.io'],
  ['Long-running jobs', 'Redis queue + GPU workers'],
  ['GPU', 'RunPod, Modal, Replicate, Lambda Labs, Vast.ai, AWS/GCP GPU'],
  ['Database', 'Neon PostgreSQL'],
  ['Audio files', 'Cloudflare R2 / S3'],
  ['Scores', 'MusicXML, MIDI, PDF, GP5'],
];

const mvps = [
  {
    title: 'MVP transcription',
    items: ['Audio upload API', 'Stem separation', 'MIDI/MusicXML transcription', 'PDF export'],
  },
  {
    title: 'MVP generation',
    items: ['Monophonic or simple piano generation', 'MIDI + MusicXML output', 'Rendered audio'],
  },
  {
    title: 'MVP desktop app',
    items: ['Open projects', 'Import audio', 'Display scores', 'Edit notes', 'Export MIDI/PDF/audio'],
  },
];

const modelFamilies = [
  {
    title: 'Source separation',
    items: ['Demucs', 'Spleeter', 'MDX-Net', 'BandIt', 'BS-RoFormer'],
  },
  {
    title: 'Pitch detection',
    items: ['Basic Pitch by Spotify', 'CREPE', 'SPICE'],
  },
  {
    title: 'Polyphonic transcription',
    items: ['MT3 by Google', 'YourMT3', 'ByteDance Piano Transcription', 'Omnizart'],
  },
];

const finalModels = [
  {
    title: '1. Transcriptor',
    flow: ['Audio', 'Demucs', 'MT3', 'MusicXML + MIDI + PDF'],
  },
  {
    title: '2. Composer',
    flow: ['User preferences', 'MIDI Transformer', 'MusicXML + MIDI'],
  },
  {
    title: '3. Renderer',
    flow: ['MIDI', 'VST / SoundFont / Synthesizer', 'WAV / MP3 / FLAC'],
  },
];

const Section = ({ eyebrow, title, children, color = 'var(--brutal-paper)' }) => (
  <Paper sx={{ p: { xs: 3, md: 5 }, bgcolor: color, mb: 4 }}>
    {eyebrow && (
      <Chip label={eyebrow} sx={{ mb: 2, bgcolor: 'var(--brutal-yellow)', color: 'var(--brutal-ink)' }} />
    )}
    <Typography variant="h3" component="h2" sx={{ fontWeight: 950, fontSize: { xs: '2rem', md: '3rem' }, mb: 2 }}>
      {title}
    </Typography>
    {children}
  </Paper>
);

const BulletList = ({ items }) => (
  <Stack component="ul" spacing={1.25} sx={{ pl: 3, m: 0 }}>
    {items.map((item) => (
      <Typography component="li" key={item} sx={{ fontWeight: 750, lineHeight: 1.7 }}>
        {item}
      </Typography>
    ))}
  </Stack>
);

const Flow = ({ items }) => (
  <Stack spacing={1.25} sx={{ mt: 2 }}>
    {items.map((item, index) => (
      <React.Fragment key={item}>
        <Box sx={{ p: 1.5, bgcolor: 'var(--brutal-paper)', border: '3px solid var(--brutal-ink)', boxShadow: '3px 3px 0 var(--brutal-ink)', fontWeight: 900 }}>
          {item}
        </Box>
        {index < items.length - 1 && <Typography sx={{ fontWeight: 950, textAlign: 'center' }}>↓</Typography>}
      </React.Fragment>
    ))}
  </Stack>
);

export default function MusicArchitecturePage() {
  return (
    <>
      <Head>
        <title>Music Graciously Architecture | AI Music Transcription and Generation</title>
        <meta
          name="description"
          content="A practical AI music architecture for transcription, generation, MusicXML, MIDI, score PDF, audio rendering, desktop, mobile, and GPU workers."
        />
      </Head>

      <Box sx={{ bgcolor: 'var(--brutal-yellow)', pt: { xs: 12, md: 15 }, pb: { xs: 6, md: 9 }, borderBottom: '4px solid var(--brutal-ink)' }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Chip label="Music Graciously blueprint" sx={{ mb: 2, bgcolor: 'var(--brutal-pink)', color: 'var(--brutal-ink)' }} />
              <Typography variant="h1" sx={{ fontWeight: 950, fontSize: { xs: '3rem', md: '5.7rem' }, lineHeight: 0.92, mb: 3 }}>
                The AI music platform architecture.
              </Typography>
              <Typography variant="h5" sx={{ maxWidth: 760, fontWeight: 850, lineHeight: 1.45, mb: 3 }}>
                A practical roadmap for building audio transcription, symbolic music generation, score editing, and high-quality rendering around MIDI, MusicXML, PDF, and audio exports.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button component={Link} href="/generate" variant="contained" size="large" sx={{ fontWeight: 950 }}>
                  Try Generate
                </Button>
                <Button component={Link} href="/compose" variant="outlined" size="large" sx={{ bgcolor: 'var(--brutal-paper)', fontWeight: 950 }}>
                  Open Composer
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/assets/design/compelete-design-music-graciously.png"
                alt="Complete Music Graciously system architecture design"
                sx={{
                  width: '100%',
                  display: 'block',
                  bgcolor: 'var(--brutal-paper)',
                  border: '4px solid var(--brutal-ink)',
                  boxShadow: '10px 10px 0 var(--brutal-ink)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <Section eyebrow="Recommended stack" title="Recommended architecture">
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', minWidth: 680 }}>
              <Box component="thead" sx={{ bgcolor: 'var(--brutal-mint)' }}>
                <tr>
                  <Box component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 950 }}>Module</Box>
                  <Box component="th" sx={{ p: 2, textAlign: 'left', fontWeight: 950 }}>Recommended tech</Box>
                </tr>
              </Box>
              <tbody>
                {stackRows.map(([module, tech]) => (
                  <tr key={module}>
                    <Box component="td" sx={{ p: 2, fontWeight: 900, borderTop: '3px solid var(--brutal-ink)' }}>{module}</Box>
                    <Box component="td" sx={{ p: 2, fontWeight: 750, borderTop: '3px solid var(--brutal-ink)' }}>{tech}</Box>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </Section>

        <Section eyebrow="Project 1" title="A very accurate transcription API" color="var(--brutal-blue)">
          <Typography sx={{ fontWeight: 780, lineHeight: 1.8, mb: 2 }}>
            For a first version, do not start by training your own model. Build an API that orchestrates audio upload, source separation, transcription by instrument, rhythmic quantization, and generation of MIDI, MusicXML, and PDF files.
          </Typography>
          <BulletList items={['Upload audio', 'Separate sources', 'Transcribe each instrument', 'Quantize rhythm', 'Generate MIDI + MusicXML + PDF']} />
          <Typography sx={{ fontWeight: 780, lineHeight: 1.8, mt: 3 }}>
            Demucs and htdemucs are serious open-source foundations for separating vocals, instruments, and stems. Klangio API is also close to this need because it advertises audio-to-MIDI, MusicXML, PDF, GP5, instrument transcription, and source separation.
          </Typography>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.8, mt: 2 }}>
            Important: complete and reliable polyphonic multi-instrument transcription in under three minutes is ambitious. It can work for simple cases or GPU-powered workflows, but dense songs with drums, bass, piano, guitar, vocals, and effects will often still need human correction.
          </Typography>
        </Section>

        <Section eyebrow="Project 2" title="An AI music generation agent" color="var(--brutal-mint)">
          <Typography sx={{ fontWeight: 780, lineHeight: 1.8, mb: 2 }}>
            For the MVP, keep the scope narrow: start with one instrument. The user chooses style, key, tempo, time signature, level, length, and instrument. The agent first generates a symbolic representation such as MIDI or MusicXML, then renders audio with a virtual instrument, SoundFont, VST, or synthesis engine.
          </Typography>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.8 }}>
            Always return audio + MIDI + MusicXML + score PDF. This is better than generating WAV directly because the main requirement is a clean score.
          </Typography>
        </Section>

        <Section eyebrow="Project 3" title="Desktop, mobile, and production app" color="var(--brutal-pink)">
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'var(--brutal-paper)', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Recommended option: Tauri 2 + Next.js</Typography>
                <BulletList items={['Lighter than Electron', 'Desktop compatible', 'Can support iOS/Android depending on the case', 'Good choice if you want to keep the Next.js UI']} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, bgcolor: 'var(--brutal-paper)', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Simpler early option: Electron + Next.js</Typography>
                <BulletList items={['Heavier', 'More mature for desktop audio', 'Stronger file-system and native integration story', 'Good choice when speed matters']} />
              </Paper>
            </Grid>
          </Grid>
        </Section>

        <Section eyebrow="Final stack" title="The production pipeline">
          <Flow items={['Next.js / Tauri app', 'Backend API in Node.js', 'Redis job queue', 'Python GPU workers', 'Demucs / transcription / MIDI generation', 'MusicXML + MIDI + PDF + audio']} />
        </Section>

        <Section eyebrow="MVP strategy" title="How to build these projects concretely" color="var(--brutal-orange)">
          <Grid container spacing={3}>
            {mvps.map((mvp) => (
              <Grid item xs={12} md={4} key={mvp.title}>
                <Paper sx={{ p: 3, height: '100%', bgcolor: 'var(--brutal-paper)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 950, mb: 2 }}>{mvp.title}</Typography>
                  <BulletList items={mvp.items} />
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.8, mt: 3 }}>
            The most strategic starting point is a single instrument, such as piano or guitar. Full multi-instrument polyphonic transcription is heavy R&D; an AI music assistant that produces clean MusicXML for one instrument is much more achievable.
          </Typography>
        </Section>

        <Section eyebrow="Transcription reality" title="Demucs and Spleeter are not transcribers" color="var(--brutal-blue)">
          <Typography sx={{ fontWeight: 800, lineHeight: 1.8, mb: 3 }}>
            Demucs and Spleeter are source-separation models only. They do not perform the musical transcription itself. A full transcription pipeline needs separation, instrument-level tracks, AI transcription, quantization, and export.
          </Typography>
          <Flow items={['Audio', 'Source separation: Demucs, Spleeter, etc.', 'One track per instrument', 'AI transcription: notes, rhythm, velocity', 'Quantization', 'MIDI', 'MusicXML + PDF + rendered audio']} />
          <Divider sx={{ my: 4 }} />
          <Grid container spacing={3}>
            {modelFamilies.map((family) => (
              <Grid item xs={12} md={4} key={family.title}>
                <Paper sx={{ p: 3, height: '100%', bgcolor: 'var(--brutal-paper)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 950, mb: 2 }}>{family.title}</Typography>
                  <BulletList items={family.items} />
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Section>

        <Section eyebrow="Generation options" title="How to generate the first instrument" color="var(--brutal-mint)">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: 'var(--brutal-paper)', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Option 1 — Train your own model</Typography>
                <Typography sx={{ fontWeight: 780, lineHeight: 1.8 }}>Use a MIDI dataset, train a Transformer, generate MIDI, convert to MusicXML, create the score, then synthesize audio. This gives you the most control.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: 'var(--brutal-paper)', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Option 2 — Fine-tune an existing model</Typography>
                <Typography sx={{ fontWeight: 780, lineHeight: 1.8 }}>Interesting foundations include Meta MusicGen, Magenta Music Transformer, Magenta PerformanceRNN, MuseNet, TransformerXL Music, REMI Transformer, and Pop Music Transformer.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, bgcolor: 'var(--brutal-paper)', height: '100%' }}>
                <Typography variant="h5" sx={{ fontWeight: 950, mb: 1 }}>Option 3 — Use symbolic models directly</Typography>
                <Typography sx={{ fontWeight: 780, lineHeight: 1.8 }}>Because the app always needs a score, prefer models that generate MIDI directly instead of pure audio.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Section>

        <Section eyebrow="Long-term product" title="The project I would build">
          <Typography sx={{ fontWeight: 800, lineHeight: 1.8, mb: 3 }}>
            I would build one specialized model per instrument: PianoGPT, GuitarGPT, ViolinGPT, BassGPT, and DrumGPT. Specialized models are simpler to train, need less data, run faster, produce cleaner notation, and can later be orchestrated into full arrangements.
          </Typography>
          <Grid container spacing={3}>
            {finalModels.map((model) => (
              <Grid item xs={12} md={4} key={model.title}>
                <Paper sx={{ p: 3, height: '100%', bgcolor: 'var(--brutal-paper)' }}>
                  <Typography variant="h5" sx={{ fontWeight: 950 }}>{model.title}</Typography>
                  <Flow items={model.flow} />
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Typography sx={{ fontWeight: 900, lineHeight: 1.8, mt: 4 }}>
            This lets the Electron or Tauri application edit MusicXML and MIDI scores, replay the piece instantly, and re-export a high-quality audio render. Over time, the platform can start with piano, then expand to guitar, bass, drums, violin, and full ensembles without rewriting the entire system.
          </Typography>
        </Section>
      </Container>
    </>
  );
}
