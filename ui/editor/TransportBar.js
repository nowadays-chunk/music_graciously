// ui/editor/TransportBar.jsx
import React, { useState } from "react";
import { Box, IconButton, Slider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import LoopIcon from "@mui/icons-material/Loop";
import { useScore } from "@/core/editor/ScoreContext";

export default function TransportBar({ embedded = false }) {
  const { playback, score } = useScore();
  const [bpm, setBpm] = useState(120);

  if (!playback) {
    return (
      <Box
        sx={{
          position: embedded ? "relative" : "fixed",
          top: embedded ? "auto" : 225,
          left: embedded ? "auto" : 0,
          right: embedded ? "auto" : 0,
          minHeight: "44px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          px: 0.75,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          zIndex: 1100,
        }}
      >
        Loading audio engine...
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: embedded ? "relative" : "fixed",
        top: embedded ? "auto" : 225,
        left: embedded ? "auto" : 0,
        right: embedded ? "auto" : 0,
        minHeight: "44px",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        gap: 1,
        px: 0.75,
        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        zIndex: 1100,
      }}
    >
      <IconButton onClick={() => playback.playScore(score)}>
        <PlayArrowIcon />
      </IconButton>

      <IconButton onClick={() => playback.stop()}>
        <StopIcon />
      </IconButton>

      <IconButton onClick={() => playback.setLoop(0, 4)}>
        <LoopIcon />
      </IconButton>

      <Slider
        value={bpm}
        min={40}
        max={200}
        sx={{ width: 200 }}
        onChange={(e, v) => {
          setBpm(v);
          playback.setTempo(v);
        }}
      />

      {bpm} BPM
    </Box>
  );
}
