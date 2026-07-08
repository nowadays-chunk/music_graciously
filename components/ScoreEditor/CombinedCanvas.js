// components/ScoreEditor/CombinedCanvas.jsx
import React, { useEffect, useRef } from "react";
import CombinedRenderer from "@/core/music/render/CombinedRenderer";

export default function CombinedCanvas({ score }) {
  const ref = useRef();

  useEffect(() => {
    if (!ref.current) return;

    new CombinedRenderer({
      container: ref.current,
      score,
    }).render();

  }, [score]);

  return <div ref={ref} style={{ width: "100%" }} />;
}
