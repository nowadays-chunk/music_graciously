// core/music/score/ScoreSerializer.js
import Score from "./Score.js";
import Measure from "./Measure.js";
import Voice from "./Voice.js";
import Note from "./Note.js";
import Rest from "./Rest.js";
import Pitch from "./Pitch.js";
import Duration from "./Duration.js";
import Articulation from "./Articulation.js";
import KeySignature from "./KeySignature.js";
import TimeSignature from "./TimeSignature.js";
import Clef from "./Clef.js";
import Tie from "./Tie.js";

export default class ScoreSerializer {
  static serialize(score) {
    return JSON.stringify(score.serialize(), null, 2);
  }

  static deserialize(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    return Score.deserialize(data);
  }

  static exportToObject(score) {
    return score.serialize();
  }

  static importFromObject(obj) {
    return Score.deserialize(obj);
  }
}
