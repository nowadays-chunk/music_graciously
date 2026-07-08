// ui/editor/SmartCommandBar.js
//
// A persistent keyboard-driven command palette for the composer.
// Activated via Ctrl+K, Cmd+K, or "/" when canvas is focused.
// Parses shorthand commands and maps them to ScoreContext actions.

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Box,
  InputBase,
  Typography,
  Chip,
  Fade,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Tooltip,
} from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PianoIcon from "@mui/icons-material/Piano";
import TuneIcon from "@mui/icons-material/Tune";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import CheckIcon from "@mui/icons-material/Check";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useScore } from "@/core/editor/ScoreContext";
import Note from "@/core/music/score/Note";
import Pitch from "@/core/music/score/Pitch";
import Duration from "@/core/music/score/Duration";
import CommandReference from "@/ui/editor/CommandReference";

// ─── Command Definitions ────────────────────────────────────────────────────

const NOTE_STEPS = ["C", "D", "E", "F", "G", "A", "B"];
const DURATIONS = { w: "Whole", h: "Half", q: "Quarter", "8": "8th", "16": "16th", "32": "32nd" };
const TECHNIQUES = ["slide", "hammer", "pull", "bend", "vibrato", "tap"];
const DYNAMICS = ["ppp", "pp", "p", "mp", "mf", "f", "ff", "fff"];
const ARTICULATIONS = ["staccato", "accent", "tenuto", "marcato"];
const ORNAMENTS = ["trill", "tremolo", "mordent"];
const KEYS = ["C", "G", "D", "A", "E", "B", "F#", "F", "Bb", "Eb", "Ab", "Db"];
const TIMES = ["4/4", "3/4", "6/8", "2/4", "5/4", "7/8", "12/8"];
const CLEFS = ["treble", "bass", "alto", "tenor"];

// Suggestion catalog — used for autocomplete
const SUGGESTION_CATALOG = [
  // Duration setters
  ...Object.entries(DURATIONS).map(([sym, name]) => ({
    cmd: sym,
    label: `${sym} — Set duration: ${name}`,
    category: "Duration",
    icon: <AccessTimeIcon fontSize="small" />,
    hint: sym,
  })),
  // Note insert helpers
  ...NOTE_STEPS.flatMap((s) => [
    {
      cmd: `${s}4`,
      label: `${s}4 — Insert ${s} note (octave 4)`,
      category: "Note",
      icon: <MusicNoteIcon fontSize="small" />,
      hint: `${s}4`,
    },
  ]),
  // Quick note+duration
  {
    cmd: "q C4",
    label: "q C4 — Quarter note C4",
    category: "Note",
    icon: <MusicNoteIcon fontSize="small" />,
    hint: "[dur] [note]",
  },
  // Rest
  { cmd: "r", label: "r — Insert rest", category: "Note", icon: <MusicNoteIcon fontSize="small" />, hint: "r" },
  { cmd: "rest", label: "rest — Insert rest", category: "Note", icon: <MusicNoteIcon fontSize="small" />, hint: "rest" },
  // Tab
  { cmd: "tab", label: "tab [str] [fret] — Insert tablature note", category: "Tab", icon: <PianoIcon fontSize="small" />, hint: "tab 2 5" },
  // Technique
  ...TECHNIQUES.map((t) => ({
    cmd: t,
    label: `${t} — Set technique: ${t}`,
    category: "Technique",
    icon: <TuneIcon fontSize="small" />,
    hint: t,
  })),
  // Dynamics
  ...DYNAMICS.map((d) => ({
    cmd: d,
    label: `${d} — Toggle dynamic: ${d}`,
    category: "Dynamic",
    icon: <TuneIcon fontSize="small" />,
    hint: d,
  })),
  // Articulations
  ...ARTICULATIONS.map((a) => ({
    cmd: a,
    label: `${a} — Toggle articulation`,
    category: "Articulation",
    icon: <TuneIcon fontSize="small" />,
    hint: a,
  })),
  // Ornaments
  ...ORNAMENTS.map((o) => ({
    cmd: o,
    label: `${o} — Toggle ornament`,
    category: "Ornament",
    icon: <TuneIcon fontSize="small" />,
    hint: o,
  })),
  // Modifiers
  { cmd: ".", label: ". — Toggle dotted note", category: "Duration", icon: <AccessTimeIcon fontSize="small" />, hint: "." },
  { cmd: "3:2", label: "3:2 — Toggle triplet", category: "Duration", icon: <AccessTimeIcon fontSize="small" />, hint: "3:2" },
  { cmd: "tie", label: "tie — Toggle tie", category: "Note", icon: <MusicNoteIcon fontSize="small" />, hint: "tie" },
  { cmd: "slur", label: "slur — Toggle slur", category: "Note", icon: <MusicNoteIcon fontSize="small" />, hint: "slur" },
  { cmd: "grace", label: "grace — Toggle grace note", category: "Note", icon: <MusicNoteIcon fontSize="small" />, hint: "grace" },
  // Accidentals
  { cmd: "#", label: "# — Sharp accidental", category: "Pitch", icon: <MusicNoteIcon fontSize="small" />, hint: "#" },
  { cmd: "b", label: "b — Flat accidental", category: "Pitch", icon: <MusicNoteIcon fontSize="small" />, hint: "b" },
  { cmd: "nat", label: "nat — Natural (no accidental)", category: "Pitch", icon: <MusicNoteIcon fontSize="small" />, hint: "nat" },
  // Key / Time / Clef
  ...KEYS.map((k) => ({
    cmd: `key ${k}`,
    label: `key ${k} — Set key signature`,
    category: "Score",
    icon: <TuneIcon fontSize="small" />,
    hint: `key ${k}`,
  })),
  ...TIMES.map((t) => ({
    cmd: `time ${t}`,
    label: `time ${t} — Set time signature`,
    category: "Score",
    icon: <AccessTimeIcon fontSize="small" />,
    hint: `time ${t}`,
  })),
  ...CLEFS.map((c) => ({
    cmd: `clef ${c}`,
    label: `clef ${c} — Set clef`,
    category: "Score",
    icon: <TuneIcon fontSize="small" />,
    hint: `clef ${c}`,
  })),
  // Tempo
  { cmd: "bpm 120", label: "bpm [n] — Set tempo (BPM)", category: "Transport", icon: <PlayArrowIcon fontSize="small" />, hint: "bpm 120" },
  { cmd: "tempo 120", label: "tempo [n] — Set tempo (alias)", category: "Transport", icon: <PlayArrowIcon fontSize="small" />, hint: "tempo 120" },
  // Playback
  { cmd: "play", label: "play — Start playback", category: "Transport", icon: <PlayArrowIcon fontSize="small" />, hint: "play" },
  { cmd: "stop", label: "stop — Stop playback", category: "Transport", icon: <StopIcon fontSize="small" />, hint: "stop" },
  { cmd: "loop", label: "loop — Toggle loop (bars 0–4)", category: "Transport", icon: <PlayArrowIcon fontSize="small" />, hint: "loop" },
  // Navigation
  { cmd: ">>", label: ">> — Move cursor right", category: "Navigation", icon: <ArrowForwardIcon fontSize="small" />, hint: ">>" },
  { cmd: "<<", label: "<< — Move cursor left", category: "Navigation", icon: <ArrowBackIcon fontSize="small" />, hint: "<<" },
  // Edit
  { cmd: "undo", label: "undo — Undo last action", category: "Edit", icon: <UndoIcon fontSize="small" />, hint: "undo" },
  { cmd: "redo", label: "redo — Redo", category: "Edit", icon: <RedoIcon fontSize="small" />, hint: "redo" },
  { cmd: "del", label: "del — Delete selected note", category: "Edit", icon: <DeleteIcon fontSize="small" />, hint: "del" },
  { cmd: "delete", label: "delete — Delete selected note", category: "Edit", icon: <DeleteIcon fontSize="small" />, hint: "delete" },
  { cmd: "+m", label: "+m — Add measure", category: "Score", icon: <TuneIcon fontSize="small" />, hint: "+m" },
  { cmd: "measure", label: "measure — Add measure", category: "Score", icon: <TuneIcon fontSize="small" />, hint: "measure" },
  { cmd: "clear", label: "clear — Clear all active modifiers", category: "Edit", icon: <DeleteIcon fontSize="small" />, hint: "clear" },
  // Help
  { cmd: "help", label: "help — Open command reference", category: "Help", icon: <KeyboardIcon fontSize="small" />, hint: "help" },
  { cmd: "?", label: "? — Open command reference", category: "Help", icon: <KeyboardIcon fontSize="small" />, hint: "?" },
];

// ─── Command Parser ──────────────────────────────────────────────────────────

function parseNote(token) {
  // Parses note strings like "C4", "G#3", "Bb5", "A4"
  // Requires explicit octave digit to avoid conflicts with dynamics (f, p, pp)
  // and accidentals (b) and techniques (b = bend)
  const match = token.match(/^([A-Ga-g])([#b]?)(\d)$/);
  if (!match) return null;
  const step = match[1].toUpperCase();
  const acc = match[2] === "#" ? 1 : match[2] === "b" ? -1 : 0;
  const octave = parseInt(match[3]);
  return { step, acc, octave };
}

function parseDuration(token) {
  const normalized = token.toLowerCase();
  if (["w", "h", "q", "8", "16", "32"].includes(normalized)) return normalized;
  if (["whole"].includes(normalized)) return "w";
  if (["half"].includes(normalized)) return "h";
  if (["quarter"].includes(normalized)) return "q";
  if (["eighth", "8th"].includes(normalized)) return "8";
  if (["sixteenth", "16th"].includes(normalized)) return "16";
  if (["32nd"].includes(normalized)) return "32";
  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function SmartCommandBar() {
  const {
    input,
    score,
    updateScore,
    cursorBeat,
    insertNoteFromStringFret,
    undoAction,
    redoAction,
    deleteNote,
    selection,
    setCursorBeat,
    playback,
    setKeySignature,
    setTimeSignature,
    setClef,
  } = useScore();

  const [active, setActive] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [feedback, setFeedback] = useState(null); // { text, ok }
  const [bpm, setBpm] = useState(120);
  const [, forceUpdate] = useState({});
  const [refOpen, setRefOpen] = useState(false);

  const inputRef = useRef(null);
  const feedbackTimer = useRef(null);

  // ── Activate on Ctrl+K / Cmd+K / "/" ─────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        (e.key === "k" && (e.ctrlKey || e.metaKey)) ||
        (e.key === "/" && !active && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA")
      ) {
        e.preventDefault();
        setActive(true);
        setValue("");
        setSuggestions([]);
        setSelectedIdx(-1);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active]);

  // ── Suggestion filtering ──────────────────────────────────────────────────
  useEffect(() => {
    if (!value.trim()) {
      setSuggestions([]);
      setSelectedIdx(-1);
      return;
    }
    const q = value.trim().toLowerCase();
    const matches = SUGGESTION_CATALOG.filter(
      (s) =>
        s.cmd.toLowerCase().startsWith(q) ||
        s.label.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    ).slice(0, 8);
    setSuggestions(matches);
    setSelectedIdx(-1);
  }, [value]);

  // ── Show feedback toast ───────────────────────────────────────────────────
  const showFeedback = useCallback((text, ok = true) => {
    setFeedback({ text, ok });
    clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 2000);
  }, []);

  // ── Execute command ───────────────────────────────────────────────────────
  const execute = useCallback(
    (raw) => {
      const tokens = raw.trim().toLowerCase().split(/\s+/);
      const first = tokens[0];
      let handled = false;

      // ── Duration set ─────────────────────────────────────────────────────
      const dur = parseDuration(first);
      if (dur && tokens.length === 1) {
        input.setDuration(dur);
        showFeedback(`Duration → ${DURATIONS[dur] || dur}`);
        forceUpdate({});
        handled = true;
      }

      // ── Dotted toggle ─────────────────────────────────────────────────────
      if (!handled && first === ".") {
        const cur = input.activeDuration?.symbol || "q";
        const next = cur.includes("d") ? cur.replace("d", "") : cur + "d";
        input.setDuration(next);
        showFeedback(`Duration → ${next} (dotted toggle)`);
        forceUpdate({});
        handled = true;
      }

      // ── Triplet toggle ────────────────────────────────────────────────────
      if (!handled && first === "3:2") {
        const cur = input.activeDuration?.symbol || "q";
        input.setDuration(cur, { num_notes: 3, notes_occupied: 2 });
        showFeedback("Triplet applied");
        forceUpdate({});
        handled = true;
      }

      // ── Note insert (note alone OR dur+note) ──────────────────────────────
      // Patterns: "G4", "C#3", "Bb5" or "q G4", "h C#5"
      if (!handled) {
        let noteToken = null;
        let durToken = null;

        if (tokens.length === 2) {
          const d = parseDuration(tokens[0]);
          const n = parseNote(tokens[1]);
          if (d && n) { durToken = d; noteToken = n; }
        } else if (tokens.length === 1) {
          const n = parseNote(tokens[0]);
          if (n) noteToken = n;
        }

        if (noteToken) {
          if (durToken) input.setDuration(durToken);
          const pitch = new Pitch(noteToken.step, noteToken.acc, noteToken.octave);
          const duration = input.activeDuration || new Duration("q");
          const note = new Note(pitch, duration);
          note.velocity = 0.9;
          note.notehead = input.activeNotehead;
          note.isGrace = input.isGraceActive;
          if (input.isTieActive) note.tie = "start";
          if (input.isSlurActive) note.slur = "start";
          note.articulations = [...input.activeArticulations];
          note.dynamics = [...input.activeDynamics];
          note.ornaments = [...input.activeOrnaments];
          if (input.activeVexTabTechnique) note.technique = input.activeVexTabTechnique;
          note.chordSymbol = input.activeChordSymbol;

          updateScore((draft) => {
            draft.addNote(cursorBeat, note);
          });
          setCursorBeat((c) => c + 1);
          showFeedback(
            `Inserted ${noteToken.step}${noteToken.acc === 1 ? "#" : noteToken.acc === -1 ? "b" : ""}${noteToken.octave} (${DURATIONS[input.activeDuration?.symbol] || "Quarter"})`
          );
          forceUpdate({});
          handled = true;
        }
      }

      // ── Rest ──────────────────────────────────────────────────────────────
      if (!handled && (first === "r" || first === "rest")) {
        const duration = input.activeDuration || new Duration("q");
        const note = new Note(new Pitch("B", 0, 4), duration);
        note.isRest = true;
        updateScore((draft) => { draft.addNote(cursorBeat, note); });
        setCursorBeat((c) => c + 1);
        showFeedback("Rest inserted");
        handled = true;
      }

      // ── Tab input: "tab [str] [fret]" ────────────────────────────────────
      if (!handled && first === "tab" && tokens.length >= 3) {
        const str = parseInt(tokens[1]);
        const fret = parseInt(tokens[2]);
        const tech = tokens[3] || null;
        if (!isNaN(str) && !isNaN(fret) && str >= 1 && str <= 6 && fret >= 0) {
          if (tech && TECHNIQUES.includes(tech)) {
            input.activeVexTabTechnique = tech;
          }
          insertNoteFromStringFret(str, fret);
          showFeedback(`Tab: string ${str}, fret ${fret}${tech ? ` + ${tech}` : ""}`);
          handled = true;
        } else {
          showFeedback("Invalid tab input — try: tab 2 5", false);
          handled = true;
        }
      }

      // ── Accidentals ───────────────────────────────────────────────────────
      if (!handled && first === "#") {
        input.setAccidental(1);
        showFeedback("Accidental → Sharp ♯");
        forceUpdate({});
        handled = true;
      }
      if (!handled && (first === "b" && tokens.length === 1)) {
        // "b" alone = flat (not bend), be careful: bend is a technique
        input.setAccidental(-1);
        showFeedback("Accidental → Flat ♭");
        forceUpdate({});
        handled = true;
      }
      if (!handled && first === "nat") {
        input.setAccidental(0);
        showFeedback("Accidental → Natural ♮");
        forceUpdate({});
        handled = true;
      }

      // ── Techniques ────────────────────────────────────────────────────────
      if (!handled && TECHNIQUES.includes(first)) {
        const wasActive = input.activeVexTabTechnique === first;
        input.activeVexTabTechnique = wasActive ? null : first;
        showFeedback(wasActive ? `${first} off` : `Technique → ${first}`);
        forceUpdate({});
        handled = true;
      }

      // ── Dynamics ──────────────────────────────────────────────────────────
      if (!handled && DYNAMICS.includes(first)) {
        input.toggleDynamic(first);
        showFeedback(`Dynamic ${input.activeDynamics.includes(first) ? "→" : "off"} ${first}`);
        forceUpdate({});
        handled = true;
      }

      // ── Articulations ─────────────────────────────────────────────────────
      if (!handled && ARTICULATIONS.includes(first)) {
        input.toggleArticulation(first);
        const on = input.activeArticulations.includes(first);
        showFeedback(`${first} ${on ? "on" : "off"}`);
        forceUpdate({});
        handled = true;
      }

      // ── Ornaments ─────────────────────────────────────────────────────────
      if (!handled && ORNAMENTS.includes(first)) {
        input.toggleOrnament(first);
        const on = input.activeOrnaments.includes(first);
        showFeedback(`${first} ${on ? "on" : "off"}`);
        forceUpdate({});
        handled = true;
      }

      // ── Toggles ───────────────────────────────────────────────────────────
      if (!handled && first === "tie") {
        input.toggleTie();
        showFeedback(`Tie ${input.isTieActive ? "on" : "off"}`);
        forceUpdate({});
        handled = true;
      }
      if (!handled && first === "slur") {
        input.toggleSlur();
        showFeedback(`Slur ${input.isSlurActive ? "on" : "off"}`);
        forceUpdate({});
        handled = true;
      }
      if (!handled && first === "grace") {
        input.toggleGrace();
        showFeedback(`Grace ${input.isGraceActive ? "on" : "off"}`);
        forceUpdate({});
        handled = true;
      }

      // ── Key signature ─────────────────────────────────────────────────────
      if (!handled && first === "key" && tokens[1]) {
        const keyMap = {};
        KEYS.forEach((k) => { keyMap[k.toLowerCase()] = k; });
        const key = keyMap[tokens[1]];
        if (key) {
          setKeySignature(0, key);
          showFeedback(`Key → ${key}`);
          handled = true;
        } else {
          showFeedback(`Unknown key: ${tokens[1]}`, false);
          handled = true;
        }
      }

      // ── Time signature ────────────────────────────────────────────────────
      if (!handled && first === "time" && tokens[1]) {
        const parts = tokens[1].split("/");
        if (parts.length === 2) {
          const beats = parseInt(parts[0]);
          const beatValue = parseInt(parts[1]);
          if (!isNaN(beats) && !isNaN(beatValue)) {
            setTimeSignature(0, beats, beatValue);
            showFeedback(`Time → ${beats}/${beatValue}`);
            handled = true;
          }
        }
        if (!handled) {
          showFeedback(`Invalid time: try "time 3/4"`, false);
          handled = true;
        }
      }

      // ── Clef ──────────────────────────────────────────────────────────────
      if (!handled && first === "clef" && tokens[1]) {
        if (CLEFS.includes(tokens[1])) {
          setClef(0, tokens[1]);
          showFeedback(`Clef → ${tokens[1]}`);
          handled = true;
        } else {
          showFeedback(`Unknown clef: ${tokens[1]}`, false);
          handled = true;
        }
      }

      // ── Tempo / BPM ───────────────────────────────────────────────────────
      if (!handled && (first === "bpm" || first === "tempo") && tokens[1]) {
        const val = parseInt(tokens[1]);
        if (!isNaN(val) && val >= 20 && val <= 320) {
          setBpm(val);
          if (playback) playback.setTempo(val);
          showFeedback(`Tempo → ${val} BPM`);
          handled = true;
        } else {
          showFeedback(`BPM out of range (20–320)`, false);
          handled = true;
        }
      }

      // ── Playback ──────────────────────────────────────────────────────────
      if (!handled && first === "play") {
        if (playback && score) { playback.playScore(score); showFeedback("▶ Playing"); }
        else showFeedback("Playback not ready", false);
        handled = true;
      }
      if (!handled && first === "stop") {
        if (playback) { playback.stop(); showFeedback("■ Stopped"); }
        handled = true;
      }
      if (!handled && first === "loop") {
        if (playback) { playback.setLoop(0, 4); showFeedback("⟳ Loop set"); }
        handled = true;
      }

      // ── Navigation ────────────────────────────────────────────────────────
      if (!handled && (first === ">>" || first === "next")) {
        window.dispatchEvent(new CustomEvent("editor:move-cursor", { detail: 1 }));
        showFeedback("Cursor →");
        handled = true;
      }
      if (!handled && (first === "<<" || first === "prev")) {
        window.dispatchEvent(new CustomEvent("editor:move-cursor", { detail: -1 }));
        showFeedback("Cursor ←");
        handled = true;
      }

      // ── Edit ──────────────────────────────────────────────────────────────
      if (!handled && first === "undo") {
        undoAction();
        showFeedback("Undo ✓");
        handled = true;
      }
      if (!handled && first === "redo") {
        redoAction();
        showFeedback("Redo ✓");
        handled = true;
      }
      if (!handled && (first === "del" || first === "delete")) {
        const sel = selection.selected;
        if (sel) {
          deleteNote(sel);
          selection.clear();
          showFeedback("Note deleted");
        } else {
          showFeedback("No note selected", false);
        }
        handled = true;
      }
      if (!handled && (first === "+m" || first === "measure")) {
        updateScore((draft) => { draft.addMeasure(); });
        showFeedback("Measure added");
        handled = true;
      }
      if (!handled && first === "clear") {
        input.clearModifiers();
        showFeedback("Modifiers cleared");
        forceUpdate({});
        handled = true;
      }

      // ── Help / Reference ──────────────────────────────────────────────────
      if (!handled && (first === "help" || first === "?")) {
        setRefOpen(true);
        showFeedback("Reference opened");
        handled = true;
      }

      if (!handled) {
        showFeedback(`Unknown command: "${raw}"`, false);
      }

      // Clear & deactivate
      setValue("");
      setSuggestions([]);
      setActive(false);
    },
    [
      input,
      score,
      updateScore,
      cursorBeat,
      insertNoteFromStringFret,
      undoAction,
      redoAction,
      deleteNote,
      selection,
      setCursorBeat,
      playback,
      setKeySignature,
      setTimeSignature,
      setClef,
      showFeedback,
      bpm,
    ]
  );

  // ── Keyboard navigation inside input ────────────────────────────────────
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setActive(false);
      setValue("");
      setSuggestions([]);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, -1));
      return;
    }
    if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      const idx = selectedIdx >= 0 ? selectedIdx : 0;
      setValue(suggestions[idx].cmd);
      setSelectedIdx(-1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd =
        selectedIdx >= 0 && suggestions[selectedIdx]
          ? suggestions[selectedIdx].cmd
          : value;
      if (cmd.trim()) execute(cmd);
      return;
    }
  };

  // ── Active modifiers display ─────────────────────────────────────────────
  const activeModifiers = useMemo(() => {
    const mods = [];
    const sym = input.activeDuration?.symbol;
    if (sym) mods.push({ label: `${DURATIONS[sym.replace("d", "")] || sym}${sym.includes("d") ? "." : ""}`, color: "primary" });
    if (input.activeAccidental === 1) mods.push({ label: "♯", color: "warning" });
    if (input.activeAccidental === -1) mods.push({ label: "♭", color: "warning" });
    if (input.isTieActive) mods.push({ label: "Tie", color: "secondary" });
    if (input.isSlurActive) mods.push({ label: "Slur", color: "secondary" });
    if (input.isGraceActive) mods.push({ label: "Grace", color: "secondary" });
    input.activeArticulations.forEach((a) => mods.push({ label: a, color: "info" }));
    input.activeDynamics.forEach((d) => mods.push({ label: d, color: "info" }));
    input.activeOrnaments.forEach((o) => mods.push({ label: o, color: "info" }));
    if (input.activeVexTabTechnique) mods.push({ label: input.activeVexTabTechnique, color: "warning" });
    mods.push({ label: `${bpm} BPM`, color: "default" });
    return mods;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input.activeDuration, input.activeAccidental, input.isTieActive, input.isSlurActive, input.isGraceActive, bpm]);

  return (
    <>
      {/* ── Feedback Toast ─────────────────────────────────────────────────── */}
      <Fade in={Boolean(feedback)}>
        <Box
          sx={{
            position: "fixed",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 3000,
            pointerEvents: "none",
          }}
        >
          {feedback && (
            <Paper
              elevation={8}
              sx={{
                px: 2.5,
                py: 1,
                borderRadius: 3,
                bgcolor: feedback.ok ? "rgba(16,185,129,0.95)" : "rgba(239,68,68,0.95)",
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: 1,
                backdropFilter: "blur(8px)",
                boxShadow: feedback.ok
                  ? "0 4px 20px rgba(16,185,129,0.4)"
                  : "0 4px 20px rgba(239,68,68,0.4)",
              }}
            >
              {feedback.ok ? (
                <CheckIcon sx={{ fontSize: 16 }} />
              ) : (
                <Typography sx={{ fontSize: 14 }}>✕</Typography>
              )}
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 600, letterSpacing: 0.3 }}>
                {feedback.text}
              </Typography>
            </Paper>
          )}
        </Box>
      </Fade>

      {/* ── Command Bar ──────────────────────────────────────────────────────── */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2400,
          px: { xs: 1, md: 3 },
          pb: 1,
          pt: 0.5,
          background: "linear-gradient(to top, rgba(10,10,18,0.98) 0%, rgba(10,10,18,0.0) 100%)",
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            maxWidth: 860,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            pointerEvents: "auto",
          }}
        >
          {/* Suggestions dropdown */}
          <Fade in={active && suggestions.length > 0}>
            <Paper
              elevation={12}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "rgba(15,15,25,0.97)",
                border: (theme) => `1px solid ${theme.palette.primary.main}50`,
                backdropFilter: "blur(20px)",
                boxShadow: (theme) => `0 -4px 40px ${theme.palette.primary.main}25`,
              }}
            >
              <List dense disablePadding>
                {suggestions.map((s, idx) => (
                  <ListItemButton
                    key={s.cmd + idx}
                    selected={idx === selectedIdx}
                    onClick={() => execute(s.cmd)}
                    sx={{
                      py: 0.6,
                      "&.Mui-selected": {
                        bgcolor: (theme) => `${theme.palette.primary.main}30`,
                      },
                      "&:hover": {
                        bgcolor: (theme) => `${theme.palette.primary.main}18`,
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: "primary.light" }}>
                      {s.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography sx={{ fontSize: "0.78rem", color: "grey.200" }}>
                          {s.label}
                        </Typography>
                      }
                    />
                    <Chip
                      label={s.category}
                      size="small"
                      sx={{
                        height: 18,
                        fontSize: "0.6rem",
                        bgcolor: (theme) => `${theme.palette.primary.main}25`,
                        color: "primary.main",
                        border: "none",
                        fontWeight: 600,
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.05)" }} />
              <Box sx={{ px: 1.5, py: 0.5, display: "flex", gap: 2 }}>
                <Typography sx={{ fontSize: "0.65rem", color: "grey.600" }}>
                  ↑↓ navigate &nbsp; Tab complete &nbsp; Enter execute &nbsp; Esc close
                </Typography>
              </Box>
            </Paper>
          </Fade>

          {/* Input bar */}
          <Paper
            elevation={active ? 12 : 4}
            onClick={() => {
              if (!active) {
                setActive(true);
                setTimeout(() => inputRef.current?.focus(), 50);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: active ? 1 : 0.6,
              borderRadius: 3,
              bgcolor: active
                ? "rgba(10,10,22,0.97)"
                : "rgba(20,20,32,0.88)",
              border: active
                ? (theme) => `1.5px solid ${theme.palette.primary.main}`
                : "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
              boxShadow: active
                ? (theme) => `0 0 0 3px ${theme.palette.primary.main}25, 0 8px 32px rgba(0,0,0,0.6)`
                : "0 4px 16px rgba(0,0,0,0.4)",
              transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
              cursor: active ? "text" : "pointer",
              overflow: "hidden",
            }}
          >
            {/* Icon */}
            <TerminalIcon
              sx={{
                color: active ? "primary.main" : "grey.600",
                fontSize: 18,
                flexShrink: 0,
                transition: "color 0.2s",
              }}
            />

            {/* Input */}
            <InputBase
              inputRef={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setActive(true)}
              placeholder={
                active
                  ? 'Type a command… e.g. "q G4", "tab 2 5 bend", "key G", "bpm 140", "undo"'
                  : "Smart Command Bar  ·  Ctrl+K"
              }
              sx={{
                flex: 1,
                "& input": {
                  color: active ? "grey.100" : "grey.500",
                  fontSize: "0.85rem",
                  letterSpacing: 0.3,
                  fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                  "&::placeholder": {
                    color: active ? "grey.600" : "grey.700",
                    opacity: 1,
                  },
                },
              }}
            />

            {/* Active modifier chips */}
            {!active && (
              <Box sx={{ display: "flex", gap: 0.5, flexWrap: "nowrap", overflow: "hidden", maxWidth: 300 }}>
                {activeModifiers.slice(0, 4).map((m, i) => (
                  <Chip
                    key={i}
                    label={m.label}
                    size="small"
                    color={m.color === "default" ? undefined : m.color}
                    sx={{
                      height: 20,
                      fontSize: "0.62rem",
                      bgcolor: m.color === "default" ? "rgba(255,255,255,0.07)" : undefined,
                      color: m.color === "default" ? "grey.500" : undefined,
                    }}
                  />
                ))}
                {activeModifiers.length > 4 && (
                  <Chip
                    label={`+${activeModifiers.length - 4}`}
                    size="small"
                    sx={{ height: 20, fontSize: "0.62rem", bgcolor: "rgba(255,255,255,0.05)", color: "grey.600" }}
                  />
                )}
              </Box>
            )}

            {/* Reference button */}
            <Tooltip title="Command Reference (?)">
              <Box
                onClick={(e) => { e.stopPropagation(); setRefOpen(true); }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  flexShrink: 0,
                  bgcolor: (theme) => `${theme.palette.primary.main}15`,
                  border: (theme) => `1px solid ${theme.palette.primary.main}30`,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    bgcolor: (theme) => `${theme.palette.primary.main}30`,
                    borderColor: (theme) => `${theme.palette.primary.main}60`,
                    transform: "scale(1.1)",
                  },
                }}
              >
                <HelpOutlineIcon sx={{ fontSize: 15, color: "primary.main" }} />
              </Box>
            </Tooltip>

            {/* Keyboard hint */}
            {!active && (
              <Tooltip title="Open command bar (Ctrl+K)">
                <Box
                  sx={{
                    display: { xs: "none", sm: "flex" },
                    alignItems: "center",
                    gap: 0.5,
                    flexShrink: 0,
                  }}
                >
                  <KeyboardIcon sx={{ fontSize: 13, color: "grey.700" }} />
                  <Typography sx={{ fontSize: "0.65rem", color: "grey.700", userSelect: "none" }}>
                    Ctrl+K
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Paper>
        </Box>
      </Box>
      {/* ── Command Reference Modal ──────────────────────────────────────── */}
      <CommandReference open={refOpen} onClose={() => setRefOpen(false)} />
    </>
  );
}
