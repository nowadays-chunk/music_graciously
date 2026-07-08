// components/ScoreEditor/ScoreCanvas.jsx
import React, { useEffect, useRef } from "react";
import NotationRenderer from "@/core/music/render/NotationRenderer";

export default function ScoreCanvas({ score, onNoteSelect }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const renderer = new NotationRenderer({
      container: ref.current,
      score,
    });

    renderer.render();

    // TODO: Add DOM-based note selection mapping
  }, [score]);

  return (
    <div
      ref={ref}
      style={{
        width: "100%",
        minHeight: "600px",
        userSelect: "none",
      }}
    />
  );
}
