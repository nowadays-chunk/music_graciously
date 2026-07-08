// core/music/playback/PlaybackEngine.js
import Scheduler from "./Scheduler.js";
import InstrumentManager from "./InstrumentManager.js";
import TrackMixer from "./TrackMixer.js";
import MidiMapper from "./MidiMapper.js";

export default class PlaybackEngine {
  constructor({ bpm = 120, masterVolume = 0.9 } = {}) {
    // Audio objects created lazily (browser only)
    this.ctx = null;
    this.instrumentManager = null;
    this.mixer = null;
    this.scheduler = null;

    this.bpm = bpm;
    this.masterVolume = masterVolume;
    this.secondsPerBeat = 60 / bpm;

    this.isPlaying = false;
    this.playheadBeat = 0;
    this.loop = null;
    this.onBeat = null;
    this.rafId = null;
  }

  /** Initialize audio engine only when running in browser */
  _initIfNeeded() {
    if (this.ctx) return; // Already initialized
    if (typeof window === "undefined") return; // SSR protection

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();

    this.mixer = new TrackMixer(this.ctx, this.masterVolume);
    this.instrumentManager = new InstrumentManager(this.ctx);
    this.scheduler = new Scheduler(this.ctx);
  }

  setTempo(bpm) {
    this.bpm = bpm;
    this.secondsPerBeat = 60 / bpm;
  }

  setLoop(start, end) {
    this.loop = { start, end };
  }

  clearLoop() {
    this.loop = null;
  }

  async playScore(score) {
    this._initIfNeeded();
    if (!this.ctx || !score) return;

    if (this.ctx.state === "suspended") {
      await this.ctx.resume();
    }

    await this.instrumentManager.load("acoustic_guitar_nylon");

    const events = MidiMapper.scoreToEvents(score, this.secondsPerBeat);

    this.isPlaying = true;
    this.playheadBeat = 0;

    this.scheduler.scheduleSequence(
      events,
      (beat) => {
        // Scheduler callback (sparse) - kept for logic triggers if needed
        this.playheadBeat = beat;
        if (this.loop && beat >= this.loop.end) {
          this.scheduler.seek(this.loop.start * this.secondsPerBeat);
        }
      },
      (event) => {
        this.instrumentManager.play(event.midi, event.time, {
          gain: event.velocity,
          duration: event.duration,
        });
      }
    );

    this._startCursorLoop();
  }

  stop() {
    if (!this.ctx) return;

    this._stopCursorLoop();
    this.scheduler?.clear();
    this.isPlaying = false;
    this.playheadBeat = 0;
    if (this.onBeat) this.onBeat(0);
  }

  _startCursorLoop() {
    const loop = () => {
      if (!this.isPlaying || !this.ctx || !this.scheduler) return;

      // Calculate exact beat
      // access scheduler start time
      const elapsed = this.ctx.currentTime - this.scheduler.startTime;
      const beat = elapsed / this.secondsPerBeat;

      if (this.onBeat) this.onBeat(beat);

      this.rafId = requestAnimationFrame(loop);
    };
    this._stopCursorLoop();
    this.rafId = requestAnimationFrame(loop);
  }

  _stopCursorLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
