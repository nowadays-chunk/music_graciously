// core/music/score/Articulation.js
export default class Articulation {
  constructor(type = "staccato") {
    this.type = type;
  }

  serialize() {
    return { type: this.type };
  }

  static deserialize(d) {
    return new Articulation(d.type);
  }
}
