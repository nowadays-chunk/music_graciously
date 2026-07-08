// core/music/score/Rest.js
import Duration from "./Duration";

export default class Rest {
  constructor(duration = new Duration("q")) {
    this.duration = duration;
  }

  serialize() {
    return {
      duration: this.duration.serialize(),
    };
  }

  static deserialize(json) {
    return new Rest(Duration.deserialize(json.duration));
  }

  clone() {
    return new Rest(this.duration.clone());
  }
}
