// ui/editor/MenuBar.jsx
import React, { useState } from "react";
import { Box, Button, Menu, MenuItem, Divider } from "@mui/material";
import FileMenu from "./FileMenu";
import { useScore } from "@/core/editor/ScoreContext";

export default function MenuBar({ embedded = false }) {
  const { undoAction, redoAction, setTimeSignature, setKeySignature, setClef, setBarline } = useScore();
  const [anchorEdit, setAnchorEdit] = useState(null);
  const [anchorMeasure, setAnchorMeasure] = useState(null);

  return (
    <Box
      sx={{
        position: embedded ? 'relative' : 'fixed',
        top: embedded ? 'auto' : 65,
        left: embedded ? 'auto' : 0,
        right: embedded ? 'auto' : 0,
        minHeight: '44px',
        boxSizing: 'border-box',
        display: "flex",
        alignItems: "center",
        gap: 1,
        padding: "0 6px",
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        zIndex: 1100,
      }}
    >
      <FileMenu />

      <Button onClick={(e) => setAnchorEdit(e.currentTarget)}>Edit</Button>
      <Menu
        anchorEl={anchorEdit}
        open={Boolean(anchorEdit)}
        onClose={() => setAnchorEdit(null)}
      >
        <MenuItem onClick={() => { undoAction(); setAnchorEdit(null); }}>Undo</MenuItem>
        <MenuItem onClick={() => { redoAction(); setAnchorEdit(null); }}>Redo</MenuItem>
      </Menu>

      <Button onClick={(e) => setAnchorMeasure(e.currentTarget)}>Measure</Button>
      <Menu
        anchorEl={anchorMeasure}
        open={Boolean(anchorMeasure)}
        onClose={() => setAnchorMeasure(null)}
      >
        <MenuItem onClick={() => { setTimeSignature(0, 3, 4); setAnchorMeasure(null); }}>Set Time 3/4</MenuItem>
        <MenuItem onClick={() => { setTimeSignature(0, 4, 4); setAnchorMeasure(null); }}>Set Time 4/4</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setKeySignature(0, "G"); setAnchorMeasure(null); }}>Set Key G</MenuItem>
        <MenuItem onClick={() => { setKeySignature(0, "F"); setAnchorMeasure(null); }}>Set Key F</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setClef(0, "bass"); setAnchorMeasure(null); }}>Set Clef Bass</MenuItem>
        <MenuItem onClick={() => { setClef(0, "treble"); setAnchorMeasure(null); }}>Set Clef Treble</MenuItem>
        <Divider />
        <MenuItem onClick={() => { setBarline(0, "right", "repeat-end"); setAnchorMeasure(null); }}>Set End Repeat</MenuItem>
      </Menu>

      <Button disabled>View</Button>
      <Button disabled>Help</Button>
    </Box>
  );
}
