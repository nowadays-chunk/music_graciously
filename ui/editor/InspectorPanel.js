// ui/editor/InspectorPanel.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Select, MenuItem,
  FormControl, InputLabel, Checkbox, FormControlLabel,
  Button, Grid, Divider
} from "@mui/material";
import { useScore } from "@/core/editor/ScoreContext";
import Pitch from "@/core/music/score/Pitch";
import Duration from "@/core/music/score/Duration";

export default function InspectorPanel() {
  const { selection: selectionManager, updateScore, deleteNote, insertNoteFromStringFret } = useScore();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(selectionManager.selected);
    return selectionManager.subscribe(setSelected);
  }, [selectionManager]);

  const handleInsertNote = () => {
    const string = parseInt(document.getElementById('quick-input-string')?.value);
    const fret = parseInt(document.getElementById('quick-input-fret')?.value);

    if (!isNaN(string) && !isNaN(fret) && string >= 1 && string <= 6 && fret >= 0) {
      insertNoteFromStringFret(string, fret);
    }
  };

  if (!selected) {
    return (
      <Box sx={{ width: 300, p: 2, borderLeft: "1px solid #ddd", bgcolor: "#fafafa" }}>
        <Typography variant="h6" gutterBottom>Inspector</Typography>



        <Typography variant="body2" color="textSecondary">
          Select a note to edit properties.
        </Typography>
      </Box>
    );
  }

  const handleUpdate = (updater) => {
    updateScore(draft => {
      // Find note in draft by ID
      let found = null;
      outer: for (const m of draft.measures) {
        for (const v of m.voices) {
          const el = v.elements.find(e => e.note.id === selected.id);
          if (el) {
            found = el.note;
            break outer;
          }
        }
      }

      if (found) {
        updater(found);
      }
    });
  };

  const changePitch = (field, value) => {
    handleUpdate(note => {
      if (!note.pitch) note.pitch = new Pitch();
      note.pitch[field] = value;
    });
  };

  const changeDuration = (val) => {
    handleUpdate(note => {
      note.duration = new Duration(val);
    });
  };

  const toggleRest = () => {
    handleUpdate(note => {
      note.isRest = !note.isRest;
    });
  };

  const handleDelete = () => {
    deleteNote(selected);
    selectionManager.clear();
  };

  const p = selected.pitch || { step: "C", alter: 0, octave: 4 };
  const d = selected.duration || { symbol: "q" };

  return (
    <Box sx={{ width: 300, p: 2, borderLeft: "1px solid #ddd", bgcolor: "#fafafa", overflowY: "auto", height: "100%" }}>
      <Typography variant="h6" gutterBottom>Note Inspector</Typography>

      <Grid container spacing={2}>

        {/* PITCH */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mt: 1 }}>Pitch</Typography>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Step</InputLabel>
            <Select
              value={p.step}
              label="Step"
              onChange={e => changePitch("step", e.target.value)}
            >
              {["C", "D", "E", "F", "G", "A", "B"].map(s => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth size="small">
            <InputLabel>Acc</InputLabel>
            <Select
              value={p.alter}
              label="Acc"
              onChange={e => changePitch("alter", e.target.value)}
            >
              <MenuItem value={0}>Nat</MenuItem>
              <MenuItem value={1}>#</MenuItem>
              <MenuItem value={-1}>b</MenuItem>
              <MenuItem value={2}>##</MenuItem>
              <MenuItem value={-2}>bb</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Oct"
            type="number"
            size="small"
            value={p.octave}
            onChange={e => changePitch("octave", parseInt(e.target.value))}
            inputProps={{ min: 0, max: 9 }}
          />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* DURATION */}
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Duration</InputLabel>
            <Select
              value={d.symbol}
              label="Duration"
              onChange={e => changeDuration(e.target.value)}
            >
              <MenuItem value="w">Whole</MenuItem>
              <MenuItem value="h">Half</MenuItem>
              <MenuItem value="q">Quarter</MenuItem>
              <MenuItem value="8">8th</MenuItem>
              <MenuItem value="16">16th</MenuItem>
              <MenuItem value="32">32nd</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox checked={selected.isRest} onChange={toggleRest} />}
            label="Rest"
          />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* GUITAR TAB */}
        <Grid item xs={12}>
          <Typography variant="subtitle2">Tablature</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="String"
            type="number"
            size="small"
            value={selected.string ?? ""}
            onChange={e => handleUpdate(n => n.string = parseInt(e.target.value))}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Fret"
            type="number"
            size="small"
            value={selected.fret ?? ""}
            onChange={e => handleUpdate(n => n.fret = parseInt(e.target.value))}
          />
        </Grid>

        <Grid item xs={12}><Divider /></Grid>

        {/* TECHNIQUES */}
        <Grid item xs={12}>
          <Typography variant="subtitle2">Techniques</Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth size="small">
            <InputLabel>Type</InputLabel>
            <Select
              value={selected.technique || ""}
              label="Type"
              onChange={(e) => handleUpdate(n => { n.technique = e.target.value || null; })}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="slide">Slide</MenuItem>
              <MenuItem value="hammer">Hammer-on</MenuItem>
              <MenuItem value="pull">Pull-off</MenuItem>
              <MenuItem value="bend">Bend</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {selected.technique === "bend" && (
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel>Bend Amount</InputLabel>
              <Select
                value={selected.bend || "Full"}
                label="Bend Amount"
                onChange={(e) => handleUpdate(n => { n.bend = e.target.value; })}
              >
                <MenuItem value="Half">Half (1/2)</MenuItem>
                <MenuItem value="Full">Full (1)</MenuItem>
                <MenuItem value="1.5">1.5</MenuItem>
                <MenuItem value="2">2</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12} sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={handleDelete}
          >
            Delete Note
          </Button>
        </Grid>

      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>DEBUG DATA</Typography>
      <Box sx={{
        bgcolor: '#333',
        color: '#0f0',
        p: 1,
        borderRadius: 1,
        fontSize: '0.7rem',
        fontFamily: 'monospace',
        overflowX: 'auto',
        mt: 1
      }}>
        <pre>{JSON.stringify(selected, null, 2)}</pre>
      </Box>
    </Box >
  );
}
