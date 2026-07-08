import React, { useEffect, useRef } from "react";
import { useScore } from "@/core/editor/ScoreContext";
import CombinedRenderer from "@/core/music/render/CombinedRenderer";

export default function ScoreCanvas({ interactive = true }) {
  const containerRef = useRef(null);
  const { score, selection } = useScore();

  useEffect(() => {
    if (!score || !containerRef.current) return;

    const renderer = new CombinedRenderer({
      container: containerRef.current,
      score,
      selection: interactive ? selection : null,
      interactive,
    });

    renderer.render();
  }, [interactive, score, selection]);

  if (!score) {
    return (
      <div style={{ padding: "24px 16px", textAlign: "center" }}>
        Loading score...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 84px)",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <div
        ref={containerRef}
        style={{
          width: "100%",
          minHeight: "calc(100vh - 84px)",
          overflow: "visible",
        }}
      />
    </div>
  );
}
