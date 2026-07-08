// core/editor/EditorCommands.js
import { useScore } from "./ScoreContext";
import Pitch from "@/core/music/score/Pitch";
import Note from "@/core/music/score/Note";

export default function useEditorCommands() {
  const {
    score,
    updateScore,
    selection,
    input,
    setCursorBeat
  } = useScore();

  const addNote = (step, accidental = 0, octave = 4) => {
    if (!score) return;

    const duration = input.activeDuration;
    const pitch = new Pitch(step, accidental, octave);

    updateScore((draft) => {
      const measure = draft.measureAtBeat(selection.selected?.beat || 0);
      const voice = measure.voices[0];

      voice.insertNote(new Note({ pitch, duration }));
      return draft;
    });
  };

  const onKey = (e) => {
    const key = e.key.toLowerCase();

    // note names
    if ("abcdefg".includes(key)) {
      addNote(key.toUpperCase());
    }

    // duration shortcuts
    if (key === "1") input.setDuration(4);   // whole
    if (key === "2") input.setDuration(2);   // half
    if (key === "4") input.setDuration(1);   // quarter
    if (key === "8") input.setDuration(0.5); // 8th
  };

  return { onKey };
}
