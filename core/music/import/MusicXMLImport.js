// core/music/import/MusicXMLImport.js
import { Score, Measure, Voice, Note, Rest, Pitch, Duration, KeySignature, TimeSignature } from "@/core/music/score";

export default class MusicXMLImport {
  static parse(xmlString) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlString, "application/xml");

    const score = new Score();

    // Parse title
    const movementTitle = xml.querySelector("movement-title");
    if (movementTitle) score.title = movementTitle.textContent;

    // Parse key signature
    const fifths = xml.querySelector("key > fifths");
    if (fifths) {
      const mapping = {
        "-7": "Cb", "-6": "Gb", "-5": "Db", "-4": "Ab", "-3": "Eb", "-2": "Bb", "-1": "F",
         "0": "C",
         "1": "G", "2": "D", "3": "A", "4": "E", "5": "B", "6": "F#", "7": "C#",
      };
      score.keySignature = new KeySignature(mapping[fifths.textContent] || "C");
    }

    // Parse time signature
    const beats = xml.querySelector("time > beats");
    const beatType = xml.querySelector("time > beat-type");

    if (beats && beatType) {
      score.timeSignature = new TimeSignature(
        parseInt(beats.textContent),
        parseInt(beatType.textContent)
      );
    }

    // Parse measures
    score.measures = [];
    const measures = xml.querySelectorAll("measure");

    measures.forEach((mNode, measureIndex) => {
      const measure = new Measure({
        index: measureIndex,
        timeSignature: score.timeSignature,
      });

      const voice = new Voice(0);

      mNode.querySelectorAll("note").forEach((nNode) => {
        const isRest = nNode.querySelector("rest");

        const durationNode = nNode.querySelector("duration");
        const durationValue = parseInt(durationNode?.textContent || 1);
        const quarterEquivalent = durationValue / 256;

        if (isRest) {
          voice.addRest(new Rest(new Duration(quarterEquivalent)));
        } else {
          const step = nNode.querySelector("pitch > step").textContent;
          const octave = parseInt(nNode.querySelector("pitch > octave").textContent);
          const alter = parseInt(nNode.querySelector("pitch > alter")?.textContent || 0);

          const pitch = new Pitch(step, alter, octave);

          voice.addNote(
            new Note({
              pitch,
              duration: new Duration(quarterEquivalent),
            })
          );
        }
      });

      measure.voices = [voice];
      score.measures.push(measure);
    });

    return score;
  }
}
