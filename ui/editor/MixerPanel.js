// ui/editor/MixerPanel.jsx
import React from "react";
import { Box, Typography, Slider } from "@mui/material";

export default function MixerPanel({ mixer }) {
  return (
    <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
      <Typography variant="h6">Mixer</Typography>

      {mixer.tracks.map((t, i) => (
        <Box key={i} sx={{ mt: 2 }}>
          <Typography>Track {i + 1}</Typography>
          <Slider
            value={t.gain.gain.value}
            min={0}
            max={1}
            step={0.01}
            onChange={(e, v) => {
              t.gain.gain.value = v;
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
