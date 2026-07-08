// components/ScoreEditor/TabCanvas.jsx
import React, { useEffect, useRef } from "react";
import TabRenderer from "@/core/music/render/TabRenderer";

export default function TabCanvas({ score, onNoteSelect }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    const renderer = new TabRenderer({
      container: ref.current,
      score,
    });

    renderer.render();
  }, [score]);

  return (
    <div ref={ref} style={{ width: "100%" }} />
  );
}
