export default class Clef {
  constructor(name = "treble") {
    this.name = name;
  }

  serialize() {
    return { name: this.name };
  }

  static deserialize(json) {
    return new Clef(json.name);
  }

  clone() {
    return new Clef(this.name);
  }
}
