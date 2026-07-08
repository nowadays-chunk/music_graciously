// components/ScoreEditor/Inspector.jsx
import React, { useState, useEffect } from "react";

export default function Inspector({ selectedNote, onUpdate }) {
  const [pitch, setPitch] = useState("");
  const [octave, setOctave] = useState(4);

  useEffect(() => {
    if (!selectedNote) return;
    setPitch(selectedNote.pitch.step);
    setOctave(selectedNote.pitch.octave);
  }, [selectedNote]);

  if (!selectedNote)
    return <div><h3>Inspector</h3><p>Select a note</p></div>;

  const apply = () => {
    const updated = selectedNote.clone();
    updated.pitch.step = pitch;
    updated.pitch.octave = parseInt(octave, 10);

    onUpdate(updated);
  };

  return (
    <div>
      <h3>Inspector</h3>

      <label>Pitch:</label>
      <select value={pitch} onChange={(e) => setPitch(e.target.value)}>
        {["C", "D", "E", "F", "G", "A", "B"].map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <label>Octave:</label>
      <input
        type="number"
        value={octave}
        onChange={(e) => setOctave(e.target.value)}
      />

      <button onClick={apply}>Apply</button>
    </div>
  );
}
