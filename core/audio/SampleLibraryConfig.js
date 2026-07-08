const NOTE_MAP_LOW = { C2: 'C2.mp3', E2: 'E2.mp3', G2: 'G2.mp3', C3: 'C3.mp3', E3: 'E3.mp3', G3: 'G3.mp3' };
const NOTE_MAP_MID = { C3: 'C3.mp3', E3: 'E3.mp3', G3: 'G3.mp3', C4: 'C4.mp3', E4: 'E4.mp3', G4: 'G4.mp3', C5: 'C5.mp3' };
const NOTE_MAP_HIGH = { G3: 'G3.mp3', C4: 'C4.mp3', E4: 'E4.mp3', G4: 'G4.mp3', C5: 'C5.mp3', E5: 'E5.mp3', G5: 'G5.mp3' };

export const SAMPLE_ROOT = '/samples/instruments';

export const ARTICULATION_FALLBACKS = {
  bends: 'bend',
  bend: 'bend',
  slides: 'slide',
  slide: 'slide',
  'hammer-ons': 'hammer-on',
  'pull-offs': 'pull-off',
  vibrato: 'vibrato',
  'palm mute': 'palm-mute',
  strum: 'strum',
  strumming: 'strum',
  fingerpicking: 'fingerpicked',
  'muted strums': 'muted',
  rolls: 'roll',
  'block chords': 'sustain',
  inversions: 'sustain',
  voicings: 'sustain',
  arpeggios: 'sustain',
  'walking bass': 'sustain',
  slap: 'slap',
  'ghost notes': 'ghost',
  pizzicato: 'pizzicato',
  legato: 'legato',
  staccato: 'staccato',
  'double stops': 'sustain',
  tonguing: 'tongued',
  slurs: 'legato',
  falls: 'fall',
  shakes: 'shake',
  'long tones': 'sustain',
  scoops: 'scoop',
};

export const INSTRUMENT_SAMPLE_LIBRARIES = {
  piano: {
    source: 'Salamander Grand Piano or Pianobook converted to browser MP3/WAV',
    basePath: `${SAMPLE_ROOT}/piano`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_MID, staccato: NOTE_MAP_MID, pedal: NOTE_MAP_MID },
  },
  guitar: {
    source: 'Freesound CC0/CC BY or self-recorded nylon/electric samples',
    basePath: `${SAMPLE_ROOT}/guitar`,
    defaultArticulation: 'sustain',
    articulations: {
      sustain: NOTE_MAP_MID,
      'palm-mute': NOTE_MAP_MID,
      slide: NOTE_MAP_MID,
      bend: NOTE_MAP_MID,
      'hammer-on': NOTE_MAP_MID,
      'pull-off': NOTE_MAP_MID,
      vibrato: NOTE_MAP_MID,
      strum: NOTE_MAP_MID,
      fingerpicked: NOTE_MAP_MID,
    },
  },
  ukulele: {
    source: 'Freesound CC0/CC BY or self-recorded ukulele samples',
    basePath: `${SAMPLE_ROOT}/ukulele`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_HIGH, strum: NOTE_MAP_HIGH, fingerpicked: NOTE_MAP_HIGH, muted: NOTE_MAP_HIGH, roll: NOTE_MAP_HIGH },
  },
  bass: {
    source: 'Freesound CC0/CC BY finger bass samples',
    basePath: `${SAMPLE_ROOT}/bass`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_LOW, slap: NOTE_MAP_LOW, ghost: NOTE_MAP_LOW, slide: NOTE_MAP_LOW },
  },
  'double-bass': {
    source: 'VSCO CE, Iowa, or Freesound pizzicato samples',
    basePath: `${SAMPLE_ROOT}/double-bass`,
    defaultArticulation: 'pizzicato',
    articulations: { pizzicato: NOTE_MAP_LOW, sustain: NOTE_MAP_LOW, slide: NOTE_MAP_LOW, ghost: NOTE_MAP_LOW },
  },
  violin: {
    source: 'VSCO CE, Iowa, Philharmonia, or Pianobook violin samples',
    basePath: `${SAMPLE_ROOT}/violin`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_HIGH, legato: NOTE_MAP_HIGH, staccato: NOTE_MAP_HIGH, vibrato: NOTE_MAP_HIGH, slide: NOTE_MAP_HIGH },
  },
  trumpet: {
    source: 'VSCO CE, Iowa, or Philharmonia trumpet samples',
    basePath: `${SAMPLE_ROOT}/trumpet`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_HIGH, tongued: NOTE_MAP_HIGH, legato: NOTE_MAP_HIGH, fall: NOTE_MAP_HIGH, shake: NOTE_MAP_HIGH },
  },
  saxophone: {
    source: 'Iowa, Philharmonia, or Freesound saxophone samples',
    basePath: `${SAMPLE_ROOT}/saxophone`,
    defaultArticulation: 'sustain',
    articulations: { sustain: NOTE_MAP_HIGH, legato: NOTE_MAP_HIGH, staccato: NOTE_MAP_HIGH, scoop: NOTE_MAP_HIGH, fall: NOTE_MAP_HIGH, ghost: NOTE_MAP_HIGH, vibrato: NOTE_MAP_HIGH },
  },
};

export const getArticulationName = (event = {}, instrument = 'guitar') => {
  const library = INSTRUMENT_SAMPLE_LIBRARIES[instrument] || INSTRUMENT_SAMPLE_LIBRARIES.guitar;
  const requested = ARTICULATION_FALLBACKS[event.technique] || ARTICULATION_FALLBACKS[event.articulation] || event.articulation || library.defaultArticulation;
  return library.articulations[requested] ? requested : library.defaultArticulation;
};

export const getSampleMapForEvent = (instrument, event = {}) => {
  const library = INSTRUMENT_SAMPLE_LIBRARIES[instrument] || INSTRUMENT_SAMPLE_LIBRARIES.guitar;
  const articulation = getArticulationName(event, instrument);
  const urls = library.articulations[articulation] || library.articulations[library.defaultArticulation];
  return {
    instrument,
    articulation,
    baseUrl: `${library.basePath}/${articulation}/`,
    urls,
    source: library.source,
  };
};

export const getInstrumentSampleReadiness = (instrument) => {
  const library = INSTRUMENT_SAMPLE_LIBRARIES[instrument] || INSTRUMENT_SAMPLE_LIBRARIES.guitar;
  return {
    instrument,
    hasSampleMap: true,
    basePath: library.basePath,
    articulations: Object.keys(library.articulations),
    defaultArticulation: library.defaultArticulation,
    source: library.source,
  };
};
