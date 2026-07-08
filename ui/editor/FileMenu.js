// ui/editor/FileMenu.jsx
import React from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import FileDialog from "@/core/editor/FileDialog";
import { useScore } from "@/core/editor/ScoreContext";

export default function FileMenu() {
  const { score, setScore } = useScore();
  const [anchor, setAnchor] = React.useState(null);

  const open = Boolean(anchor);

  return (
    <>
      <Button onClick={(e) => setAnchor(e.currentTarget)}>File</Button>
      <Menu open={open} anchorEl={anchor} onClose={() => setAnchor(null)}>
        <MenuItem
          onClick={() => {
            FileDialog.saveXML(score);
            setAnchor(null);
          }}
        >
          Export MusicXML
        </MenuItem>

        <MenuItem
          onClick={() => {
            FileDialog.saveMIDI(score);
            setAnchor(null);
          }}
        >
          Export MIDI
        </MenuItem>

        <MenuItem
          onClick={() => {
            document.getElementById("midi-upload").click();
            setAnchor(null);
          }}
        >
          Import MIDI
        </MenuItem>
      </Menu>

      <input
        type="file"
        id="midi-upload"
        accept=".mid,.midi"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            FileDialog.loadMIDI(file, (newScore) => {
              setScore(newScore);
            });
          }
          e.target.value = ""; // reset
        }}
      />
    </>
  );
}
