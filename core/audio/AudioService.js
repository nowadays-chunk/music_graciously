import Soundfont from 'soundfont-player';

let audioCtx = null;
const instrumentCache = {};

/**
 * Gets or initializes the shared, global AudioContext.
 * Also handles resuming context from a suspended state (browser autoplay policies).
 */
export const getAudioContext = () => {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch((err) => console.warn('Could not resume AudioContext:', err));
  }

  return audioCtx;
};

/**
 * Loads a Soundfont instrument and caches it in memory.
 * If already loaded, returns the cached instance immediately.
 * 
 * @param {string} instrumentName - Soundfont name (e.g. 'acoustic_grand_piano')
 * @returns {Promise<any>} The Soundfont instrument player instance
 */
export const getSoundfontInstrument = async (instrumentName) => {
  const ctx = getAudioContext();
  if (!ctx) {
    throw new Error('Web Audio API (AudioContext) is not supported in this browser.');
  }

  if (instrumentCache[instrumentName]) {
    return instrumentCache[instrumentName];
  }

  const instrument = await Soundfont.instrument(ctx, instrumentName);
  instrumentCache[instrumentName] = instrument;
  return instrument;
};

/**
 * Plays a note on a specific instrument efficiently.
 * 
 * @param {string} instrumentName - Soundfont name
 * @param {string} noteLabel - Note with octave (e.g. 'C4')
 */
export const playInstrumentNote = async (instrumentName, noteLabel) => {
  try {
    const inst = await getSoundfontInstrument(instrumentName);
    if (inst) {
      inst.play(noteLabel);
    }
  } catch (err) {
    console.error(`AudioService error playing ${noteLabel} on ${instrumentName}:`, err);
  }
};
