const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const choice = (items, fallback = null) => (items && items.length ? items[Math.floor(Math.random() * items.length)] : fallback);

const INSTRUMENT_ARTICULATION_DEFAULTS = {
  guitar: {
    attackTime: 0.012,
    releaseTime: 0.08,
    humanizeMs: 16,
    velocityHumanize: 9,
    supportsPitchBend: true,
    supportsSlides: true,
    supportsLegato: true,
  },
  piano: {
    attackTime: 0.004,
    releaseTime: 0.16,
    humanizeMs: 10,
    velocityHumanize: 7,
    supportsPedal: true,
    supportsLegato: true,
  },
  ukulele: {
    attackTime: 0.01,
    releaseTime: 0.07,
    humanizeMs: 18,
    velocityHumanize: 10,
    supportsSlides: true,
    supportsStrum: true,
  },
  violin: {
    attackTime: 0.045,
    releaseTime: 0.22,
    humanizeMs: 22,
    velocityHumanize: 8,
    supportsPitchBend: true,
    supportsSlides: true,
    supportsLegato: true,
    breathEveryBars: 4,
  },
  bass: {
    attackTime: 0.009,
    releaseTime: 0.1,
    humanizeMs: 14,
    velocityHumanize: 10,
    supportsSlides: true,
    supportsGhostNotes: true,
  },
  'double-bass': {
    attackTime: 0.018,
    releaseTime: 0.18,
    humanizeMs: 20,
    velocityHumanize: 11,
    supportsSlides: true,
    supportsGhostNotes: true,
  },
  trumpet: {
    attackTime: 0.028,
    releaseTime: 0.14,
    humanizeMs: 18,
    velocityHumanize: 8,
    supportsPitchBend: true,
    breathEveryBars: 2,
  },
  saxophone: {
    attackTime: 0.025,
    releaseTime: 0.16,
    humanizeMs: 18,
    velocityHumanize: 9,
    supportsPitchBend: true,
    supportsSlides: true,
    breathEveryBars: 2,
  },
};

const TECHNIQUE_TO_ARTICULATION = {
  'palm mute': 'muted',
  'muted strums': 'muted',
  'ghost notes': 'ghost',
  'chromatic approach notes': 'approach',
  strum: 'strum',
  strumming: 'strum',
  fingerpicking: 'fingerpicked',
  'alternate picking': 'picked',
  pizzicato: 'pizzicato',
  arco: 'arco',
  legato: 'legato',
  slurs: 'legato',
  staccato: 'staccato',
  slides: 'slide',
  slide: 'slide',
  bends: 'bend',
  vibrato: 'vibrato',
  falls: 'fall',
  scoops: 'scoop',
  tonguing: 'tongued',
  voicings: 'voiced',
  inversions: 'voiced',
  arpeggios: 'arpeggiated',
  'block chords': 'block',
  slap: 'slap',
  pop: 'pop',
};

const humanOffset = (amountSeconds) => (Math.random() * 2 - 1) * amountSeconds;

const getBarInfo = (event, tempo, timeSignature) => {
  const beatSeconds = 60 / tempo;
  const beatsPerBar = Number(String(timeSignature).split('/')[0]) || 4;
  const beat = Math.floor(event.startTime / beatSeconds);
  return {
    beatSeconds,
    beatsPerBar,
    beatInBar: beat % beatsPerBar,
    bar: Math.floor(beat / beatsPerBar),
  };
};

const phraseEnvelope = (event, tempo, timeSignature) => {
  const { beatInBar, beatsPerBar, bar } = getBarInfo(event, tempo, timeSignature);
  const beatAccent = beatInBar === 0 ? 1.08 : beatInBar === Math.floor(beatsPerBar / 2) ? 1.03 : 0.96;
  const fourBarArc = 0.92 + Math.sin(((bar % 4) / 4) * Math.PI) * 0.16;
  return beatAccent * fourBarArc;
};

const applySwing = (event, feel, tempo) => {
  if (!['swing', 'shuffle'].includes(feel)) return 0;
  const beatSeconds = 60 / tempo;
  const eighthIndex = Math.round(event.startTime / (beatSeconds / 2));
  const isOffbeat = eighthIndex % 2 === 1;
  if (!isOffbeat) return 0;
  return feel === 'shuffle' ? beatSeconds * 0.12 : beatSeconds * 0.08;
};

const buildExpression = (event, settings, defaults) => {
  const technique = event.technique || '';
  const articulation = TECHNIQUE_TO_ARTICULATION[technique] || (event.role === 'solo' ? 'legato' : 'sustain');
  const isGhost = articulation === 'ghost' || technique === 'ghost notes';
  const isStaccato = articulation === 'staccato';
  const isStrum = articulation === 'strum' || settings.rhythmBehavior === 'strumming';
  const isLegato = articulation === 'legato' || ['hammer-ons', 'pull-offs', 'slurs'].includes(technique);
  const dynamicCurve = phraseEnvelope(event, settings.tempo, settings.timeSignature);
  const velocityNoise = Math.round(humanOffset(defaults.velocityHumanize || 8));
  const velocity = clamp(Math.round((event.velocity || 78) * dynamicCurve + velocityNoise), isGhost ? 16 : 32, 122);
  const durationScale = isStaccato ? 0.45 : isLegato ? 1.08 : 0.92 + Math.random() * 0.1;
  return {
    articulation,
    dynamics: {
      velocity,
      accent: dynamicCurve > 1.05,
      ghost: isGhost,
      phraseWeight: Number(dynamicCurve.toFixed(3)),
    },
    expression: {
      attackTime: isGhost ? 0.003 : defaults.attackTime,
      releaseTime: isStaccato ? Math.min(0.06, defaults.releaseTime) : defaults.releaseTime,
      durationScale,
      legatoOverlap: isLegato ? 0.035 : 0,
      pedal: settings.instrument === 'piano' && ['sustained pads', 'arpeggio-based'].includes(settings.rhythmBehavior),
    },
    ornament: {
      graceNote: event.role === 'solo' && settings.complexity === 'advanced' && Math.random() > 0.9,
      anticipation: event.role === 'rhythm' && settings.feel === 'funk' && Math.random() > 0.82,
      delayedAttack: settings.feel === 'latin' && Math.random() > 0.88,
    },
    vibrato: {
      enabled: ['vibrato', 'long tones', 'legato'].includes(technique) || (['violin', 'trumpet', 'saxophone'].includes(settings.instrument) && event.duration > 0.7),
      rate: 4.8 + Math.random() * 1.6,
      depthCents: ['violin', 'saxophone'].includes(settings.instrument) ? 18 : 9,
      delay: Math.min(0.25, event.duration * 0.35),
    },
    bend: {
      enabled: ['bends', 'falls', 'scoops'].includes(technique),
      type: technique === 'falls' ? 'fall' : technique === 'scoops' ? 'scoop' : 'bend',
      cents: technique === 'falls' ? -180 : technique === 'scoops' ? 120 : 200,
    },
    slide: {
      enabled: ['slides', 'slide', 'hammer-ons', 'pull-offs'].includes(technique),
      fromMidi: event.midi + choice([-2, -1, 1, 2], 1),
      time: Math.min(0.18, event.duration * 0.3),
    },
    strum: {
      enabled: isStrum,
      direction: Math.random() > 0.5 ? 'down' : 'up',
      spreadSeconds: settings.instrument === 'ukulele' ? 0.045 : 0.065,
    },
  };
};

export const performNoteEvents = ({ noteEvents = [], settings = {}, seed = Date.now() }) => {
  const defaults = INSTRUMENT_ARTICULATION_DEFAULTS[settings.instrument] || INSTRUMENT_ARTICULATION_DEFAULTS.guitar;
  const humanizeSeconds = (defaults.humanizeMs || 12) / 1000;
  const performed = noteEvents.map((event, index) => {
    const expression = buildExpression(event, settings, defaults);
    const swingOffset = applySwing(event, settings.feel, settings.tempo || 120);
    const timingNoise = humanOffset(humanizeSeconds);
    const anticipation = expression.ornament.anticipation ? -Math.min(0.055, (60 / (settings.tempo || 120)) * 0.08) : 0;
    const delayed = expression.ornament.delayedAttack ? Math.min(0.06, event.duration * 0.1) : 0;
    const startTime = clamp(event.startTime + swingOffset + timingNoise + anticipation + delayed, 0, 30);
    const duration = clamp((event.duration || 0.25) * expression.expression.durationScale + expression.expression.legatoOverlap, 0.04, 8);
    return {
      ...event,
      startTime: Number(startTime.toFixed(4)),
      duration: Number(duration.toFixed(4)),
      velocity: expression.dynamics.velocity,
      articulation: expression.articulation,
      dynamics: expression.dynamics,
      expression: expression.expression,
      ornament: expression.ornament,
      vibrato: expression.vibrato,
      bend: expression.bend,
      slide: expression.slide,
      strum: expression.strum,
      humanization: {
        seed,
        timingOffset: Number((startTime - event.startTime).toFixed(4)),
        velocityOffset: expression.dynamics.velocity - (event.velocity || 78),
      },
      releaseTime: expression.expression.releaseTime,
      attackTime: expression.expression.attackTime,
      performanceIndex: index,
    };
  });

  return performed.sort((a, b) => a.startTime - b.startTime || a.midi - b.midi);
};

export const createPerformedMusic = (generated, settings) => ({
  ...generated,
  noteEvents: performNoteEvents({ noteEvents: generated.noteEvents, settings }),
  performance: {
    engine: 'SheetsMediaPerformanceEngine',
    version: 1,
    description: 'Humanized timing, dynamics, articulations, phrase shaping, slides, bends, vibrato metadata, strum spread, and instrument-specific playback hints.',
  },
});

export const describePerformanceUpgrade = (instrument) => {
  const defaults = INSTRUMENT_ARTICULATION_DEFAULTS[instrument] || INSTRUMENT_ARTICULATION_DEFAULTS.guitar;
  return {
    instrument,
    recommendedRenderer: 'Tone.js Sampler with multi-sampled WAV/MP3 assets in /public/samples',
    fallbackRenderer: 'Soundfont player',
    defaults,
  };
};
