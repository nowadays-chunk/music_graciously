// components/ScoreEditor/Timeline.jsx
import React, { useRef, useEffect } from "react";

export default function Timeline({ score, setScore, onSelect }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    canvas.width = 2000;
    canvas.height = 400;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#eee";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // TODO: Draw beats, notes, drag handles
    ctx.fillStyle = "black";
    ctx.font = "16px Arial";
    ctx.fillText("Timeline editor – to be extended", 10, 30);

  }, [score]);

  return (
    <canvas
      ref={ref}
      style={{
        width: "100%",
        background: "#fafafa",
        cursor: "crosshair",
      }}
    />
  );
}
