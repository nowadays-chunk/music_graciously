// core/music/export/MusicXMLExport.js
import { XMLBuilder } from "fast-xml-parser";

export default class MusicXMLExport {
  static generate(score) {
    const measures = score.measures.map((m, idx) => ({
      measure: {
        "@_number": idx + 1,
        note: m.voices[0].elements.map((el) =>
          el.note.pitch
            ? MusicXMLExport.noteXML(el.note)
            : MusicXMLExport.restXML(el.note)
        ),
      },
    }));

    const xmlObj = {
      "score-partwise": {
        "@_version": "3.1",
        "movement-title": score.title,
        part: {
          "@_id": "P1",
          measure: measures.map((m) => m.measure),
        },
      },
    };

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      format: true,
    });

    return builder.build(xmlObj);
  }

  static noteXML(note) {
    return {
      pitch: {
        step: note.pitch.step,
        alter: note.pitch.accidental,
        octave: note.pitch.octave,
      },
      duration: Math.round(note.duration.total * 256),
      voice: 1,
      type: MusicXMLExport.durationToType(note.duration.total),
    };
  }

  static restXML(rest) {
    return {
      rest: {},
      duration: Math.round(rest.duration.total * 256),
      voice: 1,
      type: MusicXMLExport.durationToType(rest.duration.total),
    };
  }

  static durationToType(v) {
    return {
      4: "whole",
      2: "half",
      1: "quarter",
      0.5: "eighth",
      0.25: "16th",
    }[v] || "quarter";
  }
}
