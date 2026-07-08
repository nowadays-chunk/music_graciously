import { getSoundfontInstrument } from './AudioService';
import { getInstrumentSampleReadiness, getSampleMapForEvent } from './SampleLibraryConfig';

export const FREE_SAMPLE_LIBRARY_SUGGESTIONS = [
  { name: 'Salamander Grand Piano', instrument: 'piano', recommendedPath: '/public/samples/instruments/piano/sustain' },
  { name: 'VSCO Community Edition', instrument: 'orchestral', recommendedPath: '/public/samples/instruments/violin/sustain' },
  { name: 'Freesound CC0 / CC BY', instrument: 'guitar, bass, ukulele, percussion', recommendedPath: '/public/samples/instruments' },
  { name: 'Pianobook', instrument: 'pianos, pads, strings', recommendedPath: '/public/samples/instruments/piano/sustain' },
];

const SOUNDFONT_FALLBACKS = {
  piano: 'acoustic_grand_piano',
  guitar: 'acoustic_guitar_nylon',
  ukulele: 'acoustic_guitar_nylon',
  bass: 'acoustic_bass',
  'double-bass': 'acoustic_bass',
  violin: 'violin',
  trumpet: 'trumpet',
  saxophone: 'alto_sax',
};

const synthCache = {};
const samplerCache = {};

const midiToName = (midi) => {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  return `${names[((midi % 12) + 12) % 12]}${Math.floor(midi / 12) - 1}`;
};

const ensureTone = async () => {
  if (typeof window === 'undefined') return null;
  const Tone = await import('tone');
  await Tone.start();
  if (Tone.context?.state === 'suspended') await Tone.context.resume();
  return Tone;
};

const createOutputChain = (Tone, instrument) => {
  const limiter = new Tone.Limiter(-1).toDestination();
  const compressor = new Tone.Compressor({ threshold: -18, ratio: 3, attack: 0.01, release: 0.2 }).connect(limiter);
  const delay = new Tone.FeedbackDelay({ delayTime: instrument === 'guitar' ? '16n' : '8n', feedback: 0.09, wet: 0.05 }).connect(compressor);
  const reverb = new Tone.Reverb({ decay: ['violin', 'trumpet', 'saxophone'].includes(instrument) ? 1.7 : 1.1, wet: 0.13 }).connect(delay);
  return reverb;
};

const shouldTrySamples = () => {
  if (typeof window === 'undefined') return false;
  return window.localStorage?.getItem('sheetsMediaUseToneSamples') === 'true';
};

export const loadToneSampler = async (instrument, sampleMap) => {
  if (!shouldTrySamples() || !sampleMap?.urls || !sampleMap?.baseUrl) return null;
  const cacheKey = `${instrument}:${sampleMap.articulation}`;
  if (samplerCache[cacheKey]) return samplerCache[cacheKey];
  try {
    const Tone = await ensureTone();
    if (!Tone) return null;
    const sampler = new Tone.Sampler({ urls: sampleMap.urls, baseUrl: sampleMap.baseUrl, release: 0.35 }).connect(createOutputChain(Tone, instrument));
    await Tone.loaded();
    samplerCache[cacheKey] = { engine: 'tone-sampler', sampler, Tone, articulation: sampleMap.articulation };
    return samplerCache[cacheKey];
  } catch (err) {
    console.warn('Tone sampler unavailable for articulation, falling back:', err);
    return null;
  }
};

const loadSynthFallback = async (instrument) => {
  if (synthCache[instrument]) return synthCache[instrument];
  const Tone = await ensureTone();
  if (!Tone) return null;
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: ['bass', 'double-bass'].includes(instrument) ? 'sine' : 'triangle' },
    envelope: { attack: 0.01, decay: 0.18, sustain: 0.35, release: 0.55 },
  }).connect(createOutputChain(Tone, instrument));
  synthCache[instrument] = { engine: 'tone-polysynth', synth, Tone };
  return synthCache[instrument];
};

export const loadBestInstrumentPlayer = async (instrument) => {
  const synth = await loadSynthFallback(instrument);
  try {
    const soundfontName = SOUNDFONT_FALLBACKS[instrument] || SOUNDFONT_FALLBACKS.guitar;
    const soundfont = await getSoundfontInstrument(soundfontName);
    return { engine: 'soundfont', soundfont, synth, instrument };
  } catch (err) {
    console.warn('Soundfont load failed, using Tone synth fallback:', err);
    return synth ? { ...synth, instrument } : { engine: 'unavailable', instrument };
  }
};

export const playPerformedEvent = async (player, event) => {
  if (!player || !event) return;
  const instrument = player.instrument || event.instrument || 'guitar';
  const sampleMap = getSampleMapForEvent(instrument, event);
  const noteName = midiToName(event.midi);
  const duration = Math.max(0.04, Number(event.duration || 0.2));
  const velocity = Math.max(0.08, Math.min(1, Number(event.velocity || 80) / 127));
  const gain = event.dynamics?.ghost ? velocity * 0.42 : velocity;

  const sampler = await loadToneSampler(instrument, sampleMap);
  if (sampler?.sampler) {
    try {
      sampler.sampler.triggerAttackRelease(noteName, duration, undefined, gain);
      return;
    } catch (err) {
      console.warn('Tone sampler note failed:', err);
    }
  }

  if (player.engine === 'soundfont' && player.soundfont) {
    try {
      player.soundfont.play(noteName, undefined, { duration, gain });
      if (player.synth?.synth) {
        setTimeout(() => player.synth.synth.triggerAttackRelease(noteName, Math.min(duration, 0.14), undefined, gain * 0.12), 8);
      }
      return;
    } catch (err) {
      console.warn('Soundfont note failed, using synth fallback:', err);
    }
  }

  const synthPlayer = player.engine === 'tone-polysynth' ? player : player.synth;
  if (synthPlayer?.synth) synthPlayer.synth.triggerAttackRelease(noteName, duration, undefined, gain);
};

export const getSamplerReadiness = (instrument) => {
  const readiness = getInstrumentSampleReadiness(instrument);
  return {
    instrument,
    hasSampleMap: readiness.hasSampleMap,
    sampleMap: readiness,
    expectedLocation: readiness.basePath,
    note: 'Multi-articulation maps are configured. Add legal audio files under the listed articulation folders, then set localStorage.sheetsMediaUseToneSamples = true to enable Tone Sampler playback.',
  };
};
