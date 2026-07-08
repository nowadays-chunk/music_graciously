// ui/editor/Toolbar.jsx
import React, { useState, useEffect } from "react";
import { Box, IconButton, Tooltip, Divider, Tabs, Tab } from "@mui/material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LinkIcon from "@mui/icons-material/Link";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { useScore } from "@/core/editor/ScoreContext";
import Pitch from "@/core/music/score/Pitch";
import Note from "@/core/music/score/Note";
import Duration from "@/core/music/score/Duration";

// Tab Panel Component
function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`toolbar-tabpanel-${index}`}
      aria-labelledby={`toolbar-tab-${index}`}
      {...other}
      style={{ display: value === index ? 'flex' : 'none', alignItems: 'center', gap: 8, overflowX: 'auto', padding: '0 8px' }}
    >
      {value === index && children}
    </div>
  );
}

export default function Toolbar({ embedded = false }) {
  const { input, selection, updateScore, cursorBeat, setCursorBeat, insertNoteFromStringFret } = useScore();
  const [, forceUpdate] = useState({});
  const [activeTab, setActiveTab] = useState(0);

  // Quick Input State
  const [quickString, setQuickString] = useState(1);
  const [quickFret, setQuickFret] = useState(0);

  // Active duration state
  const [activeDuration, setActiveDuration] = useState(input.activeDuration?.symbol || "q");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(selection.selected);
    return selection.subscribe(setSelected);
  }, [selection]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const insertNote = (step) => {
    const pitch = new Pitch(step, input.activeAccidental, 4);
    const duration = input.activeDuration || new Duration("q");
    const note = new Note(pitch, duration);
    note.velocity = 0.9;

    // Apply Input Manager state
    note.notehead = input.activeNotehead;
    note.isGrace = input.isGraceActive;
    if (input.isTieActive) note.tie = "start";
    if (input.isSlurActive) note.slur = "start";
    note.articulations = [...input.activeArticulations];
    note.dynamics = [...input.activeDynamics];
    note.ornaments = [...input.activeOrnaments];
    if (input.activeVexTabTechnique) note.technique = input.activeVexTabTechnique;
    note.chordSymbol = input.activeChordSymbol;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });
    setCursorBeat(c => c + 1);
  };

  const insertRest = () => {
    const duration = input.activeDuration || new Duration("q");
    const note = new Note(new Pitch("B", 0, 4), duration);
    note.isRest = true;
    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });
    setCursorBeat(c => c + 1);
  };

  const handleSetDuration = (val) => {
    setActiveDuration(val);
    input.setDuration(val);
    forceUpdate({}); // force re-render for toolbar colors
  };

  const handleSetAccidental = (val) => {
    input.setAccidental(val);
    forceUpdate({});
  };

  const handleToggleArticulation = (val) => {
    input.toggleArticulation(val);
    forceUpdate({});
  }

  const handleQuickInsert = () => {
    insertNoteFromStringFret(parseInt(quickString), parseInt(quickFret));
  };


  const dur = (q, label) => {
    const isActive = activeDuration === q;
    const isSelected = selected && selected.duration && selected.duration.symbol === q;
    const color = (isActive || isSelected) ? "primary" : "default";

    return (
      <Tooltip title={`${q} note`}>
        <IconButton
          onClick={() => handleSetDuration(q)}
          color={color}
          sx={{
            fontSize: 14, fontWeight: 'bold', width: 36, height: 36,
            border: (isActive || isSelected) ? '2px solid' : '1px solid #eee',
            borderColor: (isActive || isSelected) ? 'primary.main' : '#eee'
          }}
        >
          {label}
        </IconButton>
      </Tooltip>
    );
  };

  const applyTechnique = (technique) => {
    const s = selection.selected;
    if (!s) {
      // Apply to input manager instead
      input.activeVexTabTechnique = input.activeVexTabTechnique === technique ? null : technique;
      forceUpdate({});
      return;
    }

    updateScore(draft => {
      for (const m of draft.measures) {
        for (const v of m.voices) {
          const el = v.elements.find(e => e.note.id === s.id);
          if (el) {
            el.note.technique = technique;
            if (technique === 'bend' && !el.note.bend) el.note.bend = 'Full';
            return;
          }
        }
      }
    });
  };

  return (
    <Box
      sx={{
        position: embedded ? 'relative' : 'fixed',
        top: embedded ? 'auto' : 115,
        left: embedded ? 'auto' : 0,
        right: embedded ? 'auto' : 0,
        minHeight: '98px',
        boxSizing: 'border-box',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        bgcolor: "background.paper",
        zIndex: 1100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 36 }}>
          <Tab label="Notes & Rests" sx={{ minHeight: 36, py: 0 }} />
          <Tab label="Pitch & Accid" sx={{ minHeight: 36, py: 0 }} />
          <Tab label="Articulations" sx={{ minHeight: 36, py: 0 }} />
          <Tab label="Expressions" sx={{ minHeight: 36, py: 0 }} />
          <Tab label="Techniques" sx={{ minHeight: 36, py: 0 }} />
        </Tabs>
      </Box>

      <Box sx={{ p: 1, display: 'flex', minHeight: 52 }}>
        {/* Global Nav Tools (Always visible) */}
        <Box sx={{ display: 'flex', alignItems: 'center', pr: 2, borderRight: '1px solid #ddd', mr: 2 }}>
          <Tooltip title="Move Left">
            <IconButton onClick={() => window.dispatchEvent(new CustomEvent('editor:move-cursor', { detail: -1 }))}>
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Right">
            <IconButton onClick={() => window.dispatchEvent(new CustomEvent('editor:move-cursor', { detail: 1 }))}>
              <ArrowForwardIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Tab 0: Notes & Rests */}
        <CustomTabPanel value={activeTab} index={0}>
          {dur('w', 'W')} {dur('h', 'H')} {dur('q', 'Q')} {dur('8', '8')} {dur('16', '16')} {dur('32', '32')}
          <Tooltip title="Dotted Note">
            <IconButton onClick={() => handleSetDuration(activeDuration + 'd')} color={activeDuration.includes('d') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', border: '1px solid #eee', width: 36, height: 36 }}>.</IconButton>
          </Tooltip>
          <Tooltip title="Rest">
            <IconButton onClick={insertRest} sx={{ fontSize: 14, fontWeight: 'bold', width: 36, height: 36, border: '1px solid #eee' }}>R</IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          {["C", "D", "E", "F", "G", "A", "B"].map(step => (
            <Tooltip title={`Insert ${step}`} key={step}>
              <IconButton onClick={() => insertNote(step)} sx={{ width: 36, height: 36, fontSize: 14, fontWeight: 'bold', border: '1px solid #eee' }}>{step}</IconButton>
            </Tooltip>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Toggle Tie">
            <IconButton onClick={() => { input.toggleTie(); forceUpdate({}); }} color={input.isTieActive ? 'primary' : 'default'} sx={{ fontSize: 14, fontWeight: 'bold', border: '1px solid #eee' }}>TIE</IconButton>
          </Tooltip>
          <Tooltip title="Toggle Tuplet (Triplet)">
            <IconButton onClick={() => { input.setDuration(activeDuration.replace('d', ''), { num_notes: 3, notes_occupied: 2 }); forceUpdate({}); }} sx={{ fontSize: 12, fontWeight: 'bold', border: '1px solid #eee' }}>3:2</IconButton>
          </Tooltip>
        </CustomTabPanel>

        {/* Tab 1: Pitch & Accidentals */}
        <CustomTabPanel value={activeTab} index={1}>
          <Tooltip title="Sharp (&#9839;)">
            <IconButton onClick={() => handleSetAccidental(1)} color={input.activeAccidental === 1 ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 18, border: '1px solid #eee', width: 36, height: 36 }}>&#9839;</IconButton>
          </Tooltip>
          <Tooltip title="Flat (&#9837;)">
            <IconButton onClick={() => handleSetAccidental(-1)} color={input.activeAccidental === -1 ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 18, border: '1px solid #eee', width: 36, height: 36 }}>&#9837;</IconButton>
          </Tooltip>
          <Tooltip title="Natural (&#9838;)">
            <IconButton onClick={() => handleSetAccidental(0)} color={input.activeAccidental === 0 ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 18, border: '1px solid #eee', width: 36, height: 36 }}>&#9838;</IconButton>
          </Tooltip>
        </CustomTabPanel>

        {/* Tab 2: Articulations */}
        <CustomTabPanel value={activeTab} index={2}>
          <Tooltip title="Staccato">
            <IconButton onClick={() => handleToggleArticulation('staccato')} color={input.activeArticulations.includes('staccato') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee' }}>.</IconButton>
          </Tooltip>
          <Tooltip title="Accent">
            <IconButton onClick={() => handleToggleArticulation('accent')} color={input.activeArticulations.includes('accent') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee' }}>&gt;</IconButton>
          </Tooltip>
          <Tooltip title="Tenuto">
            <IconButton onClick={() => handleToggleArticulation('tenuto')} color={input.activeArticulations.includes('tenuto') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee' }}>-</IconButton>
          </Tooltip>
          <Tooltip title="Marcato">
            <IconButton onClick={() => handleToggleArticulation('marcato')} color={input.activeArticulations.includes('marcato') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee' }}>^</IconButton>
          </Tooltip>
        </CustomTabPanel>

        {/* Tab 3: Expressions (Dynamics & Ornaments) */}
        <CustomTabPanel value={activeTab} index={3}>
          {['p', 'mf', 'f'].map(dyn => (
            <Tooltip title={`Dynamic: ${dyn}`} key={dyn}>
              <IconButton onClick={() => { input.toggleDynamic(dyn); forceUpdate({}); }} color={input.activeDynamics.includes(dyn) ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee', fontStyle: 'italic' }}>{dyn}</IconButton>
            </Tooltip>
          ))}
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <Tooltip title="Trill">
            <IconButton onClick={() => { input.toggleOrnament('trill'); forceUpdate({}); }} color={input.activeOrnaments.includes('trill') ? 'primary' : 'default'} sx={{ fontWeight: 'bold', fontSize: 14, border: '1px solid #eee', fontStyle: 'italic' }}>tr</IconButton>
          </Tooltip>
        </CustomTabPanel>

        {/* Tab 4: Techniques (Guitar focus & VexTab) */}
        <CustomTabPanel value={activeTab} index={4}>
          <Tooltip title="Slide (s)">
            <IconButton onClick={() => applyTechnique('slide')} color={input.activeVexTabTechnique === 'slide' || selection.selected?.technique === 'slide' ? 'primary' : 'default'} sx={{ border: '1px solid #eee' }}>
              <TrendingUpIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hammer-on (h)">
            <IconButton onClick={() => applyTechnique('hammer')} color={input.activeVexTabTechnique === 'hammer' || selection.selected?.technique === 'hammer' ? 'primary' : 'default'} sx={{ border: '1px solid #eee' }}>
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Pull-off (p)">
            <IconButton onClick={() => applyTechnique('pull')} color={input.activeVexTabTechnique === 'pull' || selection.selected?.technique === 'pull' ? 'primary' : 'default'} sx={{ border: '1px solid #eee' }}>
              <ShowChartIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bend (b)">
            <IconButton onClick={() => applyTechnique('bend')} color={input.activeVexTabTechnique === 'bend' || selection.selected?.technique === 'bend' ? 'primary' : 'default'} sx={{ border: '1px solid #eee' }}>
              <GraphicEqIcon />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />

          {/* QUICK INPUT */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <input
              type="number"
              min="1" max="6"
              value={quickString}
              onChange={(e) => setQuickString(e.target.value)}
              style={{ width: 40, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
              placeholder="Str"
              title="String"
            />
            <input
              type="number"
              min="0" max="24"
              value={quickFret}
              onChange={(e) => setQuickFret(e.target.value)}
              style={{ width: 40, padding: 4, borderRadius: 4, border: '1px solid #ccc' }}
              placeholder="Fret"
              title="Fret"
            />
            <IconButton onClick={handleQuickInsert} color="primary" sx={{ border: '1px solid #eee', borderRadius: 1 }}>
              <Box sx={{ fontSize: 12, fontWeight: 'bold' }}>TAB</Box>
            </IconButton>
          </Box>
        </CustomTabPanel>

      </Box>
    </Box>
  );
}
