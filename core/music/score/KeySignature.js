export default class KeySignature {
  constructor(key = "C") {
    this.key = key;
  }

  clone() {
    return new KeySignature(this.key);
  }

  serialize() {
    return { key: this.key };
  }

  static deserialize(d) {
    return new KeySignature(d.key);
  }
}
