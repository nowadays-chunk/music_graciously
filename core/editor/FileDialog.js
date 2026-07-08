// core/editor/FileDialog.js
import MusicXMLExport from "@/core/music/export/MusicXMLExport";
import MusicXMLImport from "@/core/music/import/MusicXMLImport";
import MidiImport from "@/core/music/import/MidiImport";
import MidiExport from "@/core/music/export/MidiExport";

export default class FileDialog {
  static saveXML(score) {
    const xml = MusicXMLExport.generate(score);
    FileDialog._download(xml, "score.musicxml", "text/xml");
  }

  static saveMIDI(score) {
    const blob = MidiExport.generate(score);
    FileDialog._download(blob, "score.mid", "audio/midi");
  }

  static loadXML(file, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const score = MusicXMLImport.parse(reader.result);
      callback(score);
    };
    reader.readAsText(file);
  }

  static loadMIDI(file, callback) {
    const reader = new FileReader();
    reader.onload = () => {
      const score = MidiImport.parse(reader.result);
      callback(score);
    };
    reader.readAsArrayBuffer(file); // Important: MIDI is binary
  }

  static _download(data, filename, mime) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }
}
