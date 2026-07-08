// ui/editor/KeyboardShortcutsOverlay.jsx
import React, { useEffect, useState } from "react";

export default function KeyboardShortcutsOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.shiftKey && e.key === "?") setOpen(true);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        color: "white",
        padding: 40,
        zIndex: 2000,
      }}
      onClick={() => setOpen(false)}
    >
      <h2>Keyboard Shortcuts</h2>
      <div style={{ display: 'flex', gap: 40 }}>
        <div>
          <h3>Notes</h3>
          <p><strong>A–G</strong>: Insert notes</p>
          <p><strong>R</strong>: Insert Rest</p>
          <p><strong>1, 2, 4, 8, 16, 32</strong>: Set Duration</p>
          <p><strong>. (period)</strong>: Toggle Dotted</p>
        </div>
        <div>
          <h3>Playback & Edit</h3>
          <p><strong>Space</strong>: Play/Pause</p>
          <p><strong>Ctrl+Z</strong>: Undo</p>
          <p><strong>Ctrl+Shift+Z / Ctrl+Y</strong>: Redo</p>
          <p><strong>Shift + ?</strong>: Show this menu</p>
        </div>
      </div>
    </div>
  );
}
