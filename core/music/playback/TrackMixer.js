// core/music/playback/TrackMixer.js
export default class TrackMixer {
  constructor(audioContext, masterVolume = 1) {
    this.ctx = audioContext;

    this.master = this.ctx.createGain();
    this.master.gain.value = masterVolume;
    this.master.connect(this.ctx.destination);

    this.tracks = [];
  }

  createTrack(volume = 1) {
    const gain = this.ctx.createGain();
    gain.gain.value = volume;
    gain.connect(this.master);

    const track = { gain, muted: false, solo: false };
    this.tracks.push(track);
    return track;
  }

  mute(trackIndex) {
    this.tracks[trackIndex].muted = true;
    this.update();
  }

  unmute(trackIndex) {
    this.tracks[trackIndex].muted = false;
    this.update();
  }

  solo(trackIndex) {
    this.tracks.forEach((t, i) => (t.solo = i === trackIndex));
    this.update();
  }

  unsolo(trackIndex) {
    this.tracks[trackIndex].solo = false;
    this.update();
  }

  update() {
    const soloActive = this.tracks.some((t) => t.solo);

    this.tracks.forEach((t) => {
      if (soloActive) {
        t.gain.gain.value = t.solo ? 1 : 0;
      } else {
        t.gain.gain.value = t.muted ? 0 : 1;
      }
    });
  }
}
