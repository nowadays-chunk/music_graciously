// core/music/playback/MidiMapper.js
export default class MidiMapper {
  static scoreToEvents(score, secondsPerBeat) {
    const events = [];
    let beatCursor = 0;

    score.measures.forEach((measure) => {
      const measureStart = beatCursor;

      measure.voices.forEach((voice) => {
        let voiceBeat = measureStart;

        voice.elements.forEach((el) => {
          const isNote = el.pitch != null;

          if (isNote) {
            events.push({
              time: voiceBeat * secondsPerBeat,
              midi: el.pitch.midi,
              duration: el.duration.total * secondsPerBeat,
              velocity: 0.9,
              beat: voiceBeat,
            });
          }

          const dur = el.duration?.total ?? 1;  // default quarter note
          voiceBeat += dur;
        });

        beatCursor = Math.max(beatCursor, voiceBeat);
      });
    });

    return events.sort((a, b) => a.time - b.time);
  }
}
