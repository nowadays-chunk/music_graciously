// core/music/export/MidiExport.js
import { writeMidi } from "midi-file";

export default class MidiExport {
  static generate(score) {
    const header = {
      format: 0,
      numTracks: 1,
      ticksPerBeat: 480,
    };

    const track = [];

    let lastTick = 0;
    let beatCursor = 0;

    score.measures.forEach((measure) => {
      measure.voices.forEach((voice) => {
        voice.elements.forEach((el) => {
          if (!el.duration) return;
          const ticks = el.duration.total * 480;

          if (el.pitch) {
            track.push({
              deltaTime: beatCursor - lastTick,
              type: "noteOn",
              noteNumber: el.pitch.midi,
              velocity: 80,
            });

            track.push({
              deltaTime: ticks,
              type: "noteOff",
              noteNumber: el.pitch.midi,
              velocity: 0,
            });

            lastTick = beatCursor + ticks;
          }

          beatCursor += ticks;
        });
      });
    });

    const file = writeMidi({ header, tracks: [track] });

    return new Blob([file], { type: "audio/midi" });
  }
}
