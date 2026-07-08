// components/ScoreEditor/TransportBar.jsx
import React from "react";

export default function TransportBar({ viewMode, onViewModeChange, score }) {
  return (
    <div style={{
      width: "100%",
      height: "60px",
      borderTop: "1px solid #ddd",
      display: "flex",
      alignItems: "center",
      paddingLeft: "20px",
      gap: "12px",
    }}>
      <button onClick={() => onViewModeChange("notation")}>Notation</button>
      <button onClick={() => onViewModeChange("tab")}>Tab</button>
      <button onClick={() => onViewModeChange("combined")}>Both</button>
      <button onClick={() => onViewModeChange("timeline")}>Timeline</button>

      <span style={{ marginLeft: "20px" }}>Playback:</span>
      <button onClick={() => playback.playScore(score)}>▶</button>
      <button onClick={() => playback.stop()}>■</button>
      <input
        type="range"
        min="40"
        max="200"
        value={bpm}
        onChange={(e) => playback.setTempo(e.target.value)}
      />

      <div style={{ marginLeft: "auto", paddingRight: "20px" }}>
        Measures: {score.measures.length}
      </div>




    </div>
  );
}
