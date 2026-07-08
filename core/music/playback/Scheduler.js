// core/music/playback/Scheduler.js
export default class Scheduler {
  constructor(audioContext) {
    this.ctx = audioContext;
    this.events = [];
    this.lookahead = 0.1; // seconds
    this.timer = null;
    this.onPlayheadUpdate = null;
  }

  scheduleSequence(events, onPlayheadUpdate, onEvent) {
    this.events = events;
    this.onPlayheadUpdate = onPlayheadUpdate;
    this.onEvent = onEvent;

    this.startTime = this.ctx.currentTime;
    this.nextEventIndex = 0;

    this.timer = setInterval(() => this.tick(), this.lookahead * 500);
  }

  tick() {
    const now = this.ctx.currentTime - this.startTime;

    // schedule all events inside lookahead window
    while (
      this.nextEventIndex < this.events.length &&
      this.events[this.nextEventIndex].time < now + this.lookahead
    ) {
      const evt = this.events[this.nextEventIndex];

      this.onEvent(evt);

      this.nextEventIndex++;
      this.onPlayheadUpdate(evt.beat);
    }

    if (this.nextEventIndex >= this.events.length) {
      clearInterval(this.timer);
    }
  }

  seek(seconds) {
    this.startTime = this.ctx.currentTime - seconds;
  }

  clear() {
    if (this.timer) clearInterval(this.timer);
    this.events = [];
  }
}
