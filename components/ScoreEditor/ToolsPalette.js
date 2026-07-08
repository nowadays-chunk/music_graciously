// components/ScoreEditor/ToolsPalette.jsx
import React from "react";

export default function ToolsPalette({ score, setScore }) {
  const addMeasure = () => {
    const cloned = ScoreSerializer.deserialize(
      ScoreSerializer.serialize(score)
    );
    cloned.addMeasure();
    setScore(cloned);
  };

  return (
    <div>
      <h3>Tools</h3>

      <button onClick={addMeasure}>+ Measure</button>

      <hr />

      <h4>Durations</h4>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {[
          { label: "𝅝 Whole", value: 4 },
          { label: "𝅗𝅥 Half", value: 2 },
          { label: "𝅘𝅥 Quarter", value: 1 },
          { label: "𝅘𝅥𝅮 8th", value: 0.5 },
          { label: "𝅘𝅥𝅯 16th", value: 0.25 },
        ].map((d) => (
          <button key={d.label}>{d.label}</button>
        ))}
      </div>

      <hr />

      <h4>Accidentals</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <button>♮</button>
        <button>♯</button>
        <button>♭</button>
      </div>

      <hr />

      <h4>Tuplets</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <button>Triplet</button>
        <button>Quintuplet</button>
      </div>

      <hr />

      <h4>Articulations</h4>
      <div style={{ display: "flex", gap: 8 }}>
        <button>Staccato</button>
        <button>Accent</button>
        <button>Tenuto</button>
      </div>
    </div>
  );
}
