// ui/editor/CommandReference.js
//
// Full-screen reference modal for all Smart Command Bar commands.
// Organized by category with matching dark glassmorphism style.

import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  Fade,
  Backdrop,
  Chip,
  Divider,
  Tooltip,
  InputBase,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PianoIcon from "@mui/icons-material/Piano";
import TuneIcon from "@mui/icons-material/Tune";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import KeyboardIcon from "@mui/icons-material/Keyboard";

// ─── Reference Data ──────────────────────────────────────────────────────────

const REFERENCE_SECTIONS = [
  {
    title: "Notes & Pitch",
    icon: <MusicNoteIcon sx={{ fontSize: 18 }} />,
    color: "#818cf8",
    commands: [
      { cmd: "C4", desc: "Insert C note (octave 4)", example: "C4, D5, G#3, Bb2" },
      { cmd: "[dur] [note]", desc: "Set duration AND insert note", example: "q G4, h C#5, 8 E3" },
      { cmd: "r  /  rest", desc: "Insert a rest at active duration", example: "r" },
      { cmd: "#", desc: "Set accidental to Sharp (♯)", example: "#" },
      { cmd: "b", desc: "Set accidental to Flat (♭)", example: "b" },
      { cmd: "nat", desc: "Set accidental to Natural (♮)", example: "nat" },
    ],
  },
  {
    title: "Duration",
    icon: <AccessTimeIcon sx={{ fontSize: 18 }} />,
    color: "#34d399",
    commands: [
      { cmd: "w", desc: "Whole note", example: "w" },
      { cmd: "h", desc: "Half note", example: "h" },
      { cmd: "q", desc: "Quarter note", example: "q" },
      { cmd: "8", desc: "8th note", example: "8" },
      { cmd: "16", desc: "16th note", example: "16" },
      { cmd: "32", desc: "32nd note", example: "32" },
      { cmd: ".", desc: "Toggle dotted duration", example: "." },
      { cmd: "3:2", desc: "Toggle triplet", example: "3:2" },
    ],
  },
  {
    title: "Tablature",
    icon: <PianoIcon sx={{ fontSize: 18 }} />,
    color: "#f59e0b",
    commands: [
      { cmd: "tab [str] [fret]", desc: "Insert note from string/fret", example: "tab 2 5" },
      { cmd: "tab [str] [fret] [tech]", desc: "Insert + apply technique", example: "tab 1 7 slide" },
    ],
  },
  {
    title: "Modifiers",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#a78bfa",
    commands: [
      { cmd: "tie", desc: "Toggle tie on next note", example: "tie" },
      { cmd: "slur", desc: "Toggle slur on next note", example: "slur" },
      { cmd: "grace", desc: "Toggle grace note mode", example: "grace" },
      { cmd: "clear", desc: "Clear all active modifiers", example: "clear" },
    ],
  },
  {
    title: "Articulations",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#fb7185",
    commands: [
      { cmd: "staccato", desc: "Toggle staccato (.)", example: "staccato" },
      { cmd: "accent", desc: "Toggle accent (>)", example: "accent" },
      { cmd: "tenuto", desc: "Toggle tenuto (—)", example: "tenuto" },
      { cmd: "marcato", desc: "Toggle marcato (^)", example: "marcato" },
    ],
  },
  {
    title: "Dynamics",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#38bdf8",
    commands: [
      { cmd: "ppp / pp / p", desc: "Soft dynamics", example: "p" },
      { cmd: "mp / mf", desc: "Medium dynamics", example: "mf" },
      { cmd: "f / ff / fff", desc: "Loud dynamics", example: "f" },
    ],
  },
  {
    title: "Techniques",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#fb923c",
    commands: [
      { cmd: "slide", desc: "Slide technique", example: "slide" },
      { cmd: "hammer", desc: "Hammer-on", example: "hammer" },
      { cmd: "pull", desc: "Pull-off", example: "pull" },
      { cmd: "bend", desc: "Bend", example: "bend" },
      { cmd: "vibrato", desc: "Vibrato", example: "vibrato" },
      { cmd: "tap", desc: "Tap", example: "tap" },
    ],
  },
  {
    title: "Ornaments",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#c084fc",
    commands: [
      { cmd: "trill", desc: "Toggle trill ornament", example: "trill" },
      { cmd: "tremolo", desc: "Toggle tremolo", example: "tremolo" },
      { cmd: "mordent", desc: "Toggle mordent", example: "mordent" },
    ],
  },
  {
    title: "Score Settings",
    icon: <TuneIcon sx={{ fontSize: 18 }} />,
    color: "#2dd4bf",
    commands: [
      { cmd: "key [K]", desc: "Set key signature", example: "key G, key Bb, key F#" },
      { cmd: "time [n/n]", desc: "Set time signature", example: "time 3/4, time 6/8" },
      { cmd: "clef [name]", desc: "Set clef", example: "clef bass, clef treble" },
      { cmd: "+m  /  measure", desc: "Add a new measure", example: "+m" },
    ],
  },
  {
    title: "Transport & Playback",
    icon: <PlayArrowIcon sx={{ fontSize: 18 }} />,
    color: "#4ade80",
    commands: [
      { cmd: "bpm [n]  /  tempo [n]", desc: "Set tempo (20–320)", example: "bpm 140" },
      { cmd: "play", desc: "Start playback", example: "play" },
      { cmd: "stop", desc: "Stop playback", example: "stop" },
      { cmd: "loop", desc: "Loop bars 0–4", example: "loop" },
    ],
  },
  {
    title: "Navigation",
    icon: <ArrowForwardIcon sx={{ fontSize: 18 }} />,
    color: "#60a5fa",
    commands: [
      { cmd: ">>  /  next", desc: "Move cursor right", example: ">>" },
      { cmd: "<<  /  prev", desc: "Move cursor left", example: "<<" },
    ],
  },
  {
    title: "Edit",
    icon: <EditIcon sx={{ fontSize: 18 }} />,
    color: "#f87171",
    commands: [
      { cmd: "undo", desc: "Undo last action", example: "undo" },
      { cmd: "redo", desc: "Redo", example: "redo" },
      { cmd: "del  /  delete", desc: "Delete selected note", example: "del" },
      { cmd: "clear", desc: "Clear all modifiers", example: "clear" },
    ],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function CommandReference({ open, onClose }) {
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? REFERENCE_SECTIONS.map((section) => ({
        ...section,
        commands: section.commands.filter(
          (c) =>
            c.cmd.toLowerCase().includes(search.toLowerCase()) ||
            c.desc.toLowerCase().includes(search.toLowerCase()) ||
            c.example.toLowerCase().includes(search.toLowerCase())
        ),
      })).filter((s) => s.commands.length > 0)
    : REFERENCE_SECTIONS;

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(2,2,12,0.85)",
            backdropFilter: "blur(12px)",
          },
          timeout: 350,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "96vw", sm: "90vw", md: "80vw", lg: "72vw" },
            maxWidth: 1100,
            maxHeight: "88vh",
            display: "flex",
            flexDirection: "column",
            borderRadius: 4,
            overflow: "hidden",
            bgcolor: "rgba(10,10,22,0.97)",
            border: "1px solid rgba(99,102,241,0.25)",
            boxShadow:
              "0 0 0 1px rgba(99,102,241,0.08), 0 25px 80px rgba(0,0,0,0.7), 0 0 60px rgba(99,102,241,0.1)",
            outline: "none",
          }}
        >
          {/* ── Header ──────────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background:
                "linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <KeyboardIcon sx={{ color: "primary.light", fontSize: 22 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  fontSize: "1.05rem",
                  color: "grey.100",
                  letterSpacing: 0.5,
                }}
              >
                Command Reference
              </Typography>
              <Chip
                label={`${REFERENCE_SECTIONS.reduce((a, s) => a + s.commands.length, 0)} commands`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: "0.65rem",
                  bgcolor: "rgba(99,102,241,0.15)",
                  color: "primary.light",
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Search */}
              <Paper
                elevation={0}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  px: 1.5,
                  py: 0.4,
                  borderRadius: 2,
                  bgcolor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  width: { xs: 140, sm: 220 },
                }}
              >
                <SearchIcon sx={{ fontSize: 16, color: "grey.600" }} />
                <InputBase
                  placeholder="Search commands…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    flex: 1,
                    "& input": {
                      color: "grey.300",
                      fontSize: "0.78rem",
                      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                      "&::placeholder": { color: "grey.700", opacity: 1 },
                    },
                  }}
                />
              </Paper>

              <Tooltip title="Close (Esc)">
                <IconButton
                  onClick={onClose}
                  sx={{
                    color: "grey.500",
                    "&:hover": { color: "grey.300", bgcolor: "rgba(255,255,255,0.06)" },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* ── Keyboard hints bar ──────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2.5,
              px: 3,
              py: 1,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              bgcolor: "rgba(255,255,255,0.015)",
            }}
          >
            {[
              { keys: "Ctrl+K", desc: "Open command bar" },
              { keys: "/", desc: "Quick open" },
              { keys: "Enter", desc: "Execute" },
              { keys: "Tab", desc: "Autocomplete" },
              { keys: "Esc", desc: "Close" },
              { keys: "↑ ↓", desc: "Navigate suggestions" },
            ].map((hint) => (
              <Box key={hint.keys} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <Box
                  component="kbd"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    px: 0.8,
                    py: 0.2,
                    borderRadius: 1,
                    fontSize: "0.62rem",
                    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                    fontWeight: 700,
                    color: "grey.300",
                    bgcolor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    lineHeight: 1.4,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {hint.keys}
                </Box>
                <Typography sx={{ fontSize: "0.62rem", color: "grey.600" }}>
                  {hint.desc}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* ── Body (scrollable) ───────────────────────────────────────────── */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 3,
              py: 2.5,
              "&::-webkit-scrollbar": { width: 6 },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": {
                bgcolor: "rgba(99,102,241,0.2)",
                borderRadius: 3,
                "&:hover": { bgcolor: "rgba(99,102,241,0.35)" },
              },
            }}
          >
            {filtered.length === 0 && (
              <Box sx={{ textAlign: "center", py: 6 }}>
                <Typography sx={{ color: "grey.600", fontSize: "0.9rem" }}>
                  No commands match "{search}"
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              {filtered.map((section) => (
                <Box
                  key={section.title}
                  sx={{
                    borderRadius: 2.5,
                    border: "1px solid rgba(255,255,255,0.05)",
                    bgcolor: "rgba(255,255,255,0.02)",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                    "&:hover": {
                      borderColor: `${section.color}33`,
                    },
                  }}
                >
                  {/* Section header */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1.2,
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      background: `linear-gradient(135deg, ${section.color}0D 0%, transparent 100%)`,
                    }}
                  >
                    <Box sx={{ color: section.color, display: "flex" }}>
                      {section.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.82rem",
                        color: section.color,
                        letterSpacing: 0.4,
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Chip
                      label={section.commands.length}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        bgcolor: `${section.color}18`,
                        color: section.color,
                        ml: "auto",
                      }}
                    />
                  </Box>

                  {/* Commands list */}
                  <Box sx={{ px: 1.5, py: 0.75 }}>
                    {section.commands.map((cmd, idx) => (
                      <Box
                        key={cmd.cmd + idx}
                        sx={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1.5,
                          py: 0.8,
                          px: 0.5,
                          borderRadius: 1.5,
                          transition: "background 0.15s",
                          "&:hover": {
                            bgcolor: "rgba(255,255,255,0.03)",
                          },
                          "&:not(:last-child)": {
                            borderBottom: "1px solid rgba(255,255,255,0.025)",
                          },
                        }}
                      >
                        {/* Command badge */}
                        <Box
                          sx={{
                            flexShrink: 0,
                            minWidth: { xs: 80, sm: 120 },
                            maxWidth: 160,
                          }}
                        >
                          <Box
                            component="code"
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.3,
                              borderRadius: 1.2,
                              fontSize: "0.72rem",
                              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                              fontWeight: 600,
                              color: section.color,
                              bgcolor: `${section.color}12`,
                              border: `1px solid ${section.color}20`,
                              letterSpacing: 0.3,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {cmd.cmd}
                          </Box>
                        </Box>

                        {/* Description + example */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontSize: "0.74rem",
                              color: "grey.400",
                              lineHeight: 1.5,
                            }}
                          >
                            {cmd.desc}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontSize: "0.65rem",
                              color: "grey.600",
                              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                              fontStyle: "italic",
                            }}
                          >
                            → {cmd.example}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ── Footer ──────────────────────────────────────────────────────── */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 1.2,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              bgcolor: "rgba(255,255,255,0.015)",
            }}
          >
            <Typography sx={{ fontSize: "0.65rem", color: "grey.600" }}>
              Press <kbd style={{ fontWeight: 700 }}>Ctrl+K</kbd> to open the command bar, then type any command above.
            </Typography>
            <Typography sx={{ fontSize: "0.65rem", color: "grey.700" }}>
              Smart Command Bar · Guitar Sheets Composer
            </Typography>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
