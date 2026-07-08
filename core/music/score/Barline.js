export default class Barline {
    constructor(type = "single") {
        // Types: "single", "double", "end", "repeat-begin", "repeat-end", "repeat-both", "none"
        this.type = type;
    }

    serialize() {
        return { type: this.type };
    }

    static deserialize(json) {
        return new Barline(json.type);
    }

    clone() {
        return new Barline(this.type);
    }
}
