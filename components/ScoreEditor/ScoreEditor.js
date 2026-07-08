// components/ScoreEditor/ScoreEditor.jsx
import React, { useState, useRef, useEffect } from "react";
import ScoreCanvas from "./ScoreCanvas";
import TabCanvas from "./TabCanvas";
import CombinedCanvas from "./CombinedCanvas";
import Timeline from "./Timeline";
import ToolsPalette from "./ToolsPalette";
import Inspector from "./Inspector";
import TransportBar from "./TransportBar";

import { ScoreSerializer } from "@/core/music/score";
import { Score } from "@/core/music/score";

export default function ScoreEditor({ initialScore }) {
  const [score, setScore] = useState(
    initialScore instanceof Score ? initialScore : ScoreSerializer.deserialize(initialScore)
  );

  const [selectedNote, setSelectedNote] = useState(null);
  const [viewMode, setViewMode] = useState("combined"); // notation | tab | combined | timeline

  const updateNote = (updated) => {
    // Replace the selected note in the score
    if (!selectedNote) return;

    const newScore = ScoreSerializer.deserialize(ScoreSerializer.serialize(score));

    const m = newScore.measures[selectedNote.measure];
    const v = m.voices[selectedNote.voice];
    v.elements[selectedNote.index] = updated;

    setScore(newScore);
    setSelectedNote(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100vh" }}>
      
      {/* LEFT SIDE — TOOLBOX */}
      <div style={{
        width: "240px",
        borderRight: "1px solid #ddd",
        padding: "12px",
        overflowY: "auto"
      }}>
        <ToolsPalette score={score} setScore={setScore} />
        <Inspector selectedNote={selectedNote} onUpdate={updateNote} />
      </div>

      {/* MAIN CANVAS */}
      <div style={{ flex: 1, overflow: "auto", position: "relative" }}>

        {viewMode === "notation" && (
          <ScoreCanvas
            score={score}
            onNoteSelect={setSelectedNote}
          />
        )}

        {viewMode === "tab" && (
          <TabCanvas
            score={score}
            onNoteSelect={setSelectedNote}
          />
        )}

        {viewMode === "combined" && (
          <CombinedCanvas
            score={score}
            onNoteSelect={setSelectedNote}
          />
        )}

        {viewMode === "timeline" && (
          <Timeline
            score={score}
            setScore={setScore}
            onSelect={setSelectedNote}
          />
        )}
      </div>

      {/* BOTTOM — TRANSPORT */}
      <TransportBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        score={score}
      />
    </div>
  );
}
