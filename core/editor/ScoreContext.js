// core/editor/ScoreContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from "react";

import Score from "@/core/music/score/Score";
import Note from "@/core/music/score/Note";
import Duration from "@/core/music/score/Duration";
import Pitch from "@/core/music/score/Pitch";

import UndoManager from "./UndoManager";
import SelectionManager from "./SelectionManager";
import NoteInputManager from "./NoteInputManager";

import TimeSignature from "@/core/music/score/TimeSignature";
import KeySignature from "@/core/music/score/KeySignature";
import Clef from "@/core/music/score/Clef";

import PlaybackEngine from "@/core/music/playback/PlaybackEngine";

export const ScoreContext = createContext(null);

export function ScoreProvider({ children }) {
  const [score, setScore] = useState(null);
  const [cursorBeat, setCursorBeat] = useState(0);

  const undo = useRef(new UndoManager());
  const selection = useRef(new SelectionManager());
  const input = useRef(new NoteInputManager());

  const [playback, setPlayback] = useState(null);

  // Initialize score
  useEffect(() => {
    if (!score) {
      const s = new Score({
        title: "Untitled",
        composer: "Anonymous",
        timeSignature: new TimeSignature(4, 4),
        keySignature: new KeySignature("C"),
        clef: new Clef("treble")
      });

      s.addMeasure();
      setScore(s);
    }
  }, [score]);

  // Init audio
  useEffect(() => {
    const init = () => {
      if (!playback) {
        setPlayback(new PlaybackEngine());
      }
    };

    window.addEventListener("click", init, { once: true });
    // Also init on keydown for accessibility/power users who might not click
    window.addEventListener("keydown", init, { once: true });

    return () => {
      window.removeEventListener("click", init);
      window.removeEventListener("keydown", init);
    };
  }, [playback]);

  // Cursor Navigation
  useEffect(() => {
    const onMove = (e) => setCursorBeat(c => Math.max(0, c + (e.detail || 0)));
    window.addEventListener("editor:move-cursor", onMove);
    return () => window.removeEventListener("editor:move-cursor", onMove);
  }, []);

  // Safe score update with undo snapshot
  const updateScore = (mutator) => {
    if (!score) return;

    undo.current.snapshot(score);

    setScore(prev => {
      const next = prev.clone();
      mutator(next);
      return next;
    });
  };

  // Called by fretboard DAW
  const addNoteFromFretboard = (event) => {
    if (!score || !event) return;
    if (event.type !== "note" || !event.pitch) return;

    const p = event.pitch;

    const pitch = new Pitch(
      p.step.toUpperCase(),
      p.accidental === "#" ? 1 : p.accidental === "b" ? -1 : 0,
      p.octave
    );

    const duration = input.current.activeDuration || new Duration("q", 1);

    const note = new Note(pitch, duration);

    note.midi = p.midi;
    note.velocity = event.velocity ?? 0.9;

    // Guitar metadata
    note.fret = event.guitar?.fret ?? 0;
    note.string = event.guitar?.string ?? 1;

    // Apply Input Manager state
    note.notehead = input.current.activeNotehead;
    note.isGrace = input.current.isGraceActive;

    // Simplistic handling of ties/slurs for now
    if (input.current.isTieActive) note.tie = "start";
    if (input.current.isSlurActive) note.slur = "start";

    // Arrays and Modifiers
    note.articulations = [...input.current.activeArticulations];
    note.dynamics = [...input.current.activeDynamics];
    note.ornaments = [...input.current.activeOrnaments];
    if (input.current.activeVexTabTechnique) {
      note.technique = input.current.activeVexTabTechnique;
    }

    // Harmony
    note.chordSymbol = input.current.activeChordSymbol;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });

    setCursorBeat(c => c + 1);
  };

  const undoAction = () => {
    if (!score) return;
    const current = score.serialize();
    const prev = undo.current.undo(current);
    if (prev) setScore(Score.deserialize(prev));
  };

  const redoAction = () => {
    if (!score) return;
    const current = score.serialize();
    const next = undo.current.redo(current);
    if (next) setScore(Score.deserialize(next));
  };

  const insertNoteFromStringFret = (string, fret) => {
    if (!score) return;

    // Import tuning helper
    const { getPitchFromStringFret, getMidiFromStringFret } = require('@/core/music/utils/TuningHelper');
    const guitar = require('@/config/guitar').default;

    // Calculate pitch from string/fret using tuning
    const pitch = getPitchFromStringFret(string, fret, guitar.tuning, input.current.activeAccidental);
    const midi = getMidiFromStringFret(string, fret, guitar.tuning);

    const duration = input.current.activeDuration || new Duration("q", 1);

    const note = new Note(pitch, duration);
    note.midi = midi;
    note.velocity = 0.9;
    note.string = string;
    note.fret = fret;

    // Apply Input Manager state
    note.notehead = input.current.activeNotehead;
    note.isGrace = input.current.isGraceActive;

    if (input.current.isTieActive) note.tie = "start";
    if (input.current.isSlurActive) note.slur = "start";

    // Arrays and Modifiers
    note.articulations = [...input.current.activeArticulations];
    note.dynamics = [...input.current.activeDynamics];
    note.ornaments = [...input.current.activeOrnaments];
    if (input.current.activeVexTabTechnique) {
      note.technique = input.current.activeVexTabTechnique;
    }

    // Harmony
    note.chordSymbol = input.current.activeChordSymbol;

    updateScore(draft => {
      draft.addNote(cursorBeat, note);
    });

    setCursorBeat(c => c + 1);
  };

  return (
    <ScoreContext.Provider
      value={{
        score,
        setScore,
        updateScore,
        cursorBeat,
        setCursorBeat,
        undo: undo.current,
        selection: selection.current,
        input: input.current,
        playback,
        addNoteFromFretboard,
        insertNoteFromStringFret,
        undoAction,
        redoAction,
        setClef: (measureIndex, clefName) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              draft.measures[measureIndex].clef.name = clefName;
            }
          });
        },
        setKeySignature: (measureIndex, key) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              draft.measures[measureIndex].keySignature.key = key;
            }
          });
        },
        setTimeSignature: (measureIndex, beats, beatValue) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              draft.measures[measureIndex].timeSignature.beats = beats;
              draft.measures[measureIndex].timeSignature.beatValue = beatValue;
            }
          });
        },
        setPickup: (measureIndex, isPickup) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              draft.measures[measureIndex].isPickup = isPickup;
            }
          });
        },
        addTempoMarking: (measureIndex, beat, bpm, text) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              draft.measures[measureIndex].tempoMarkings.push({ beat, bpm, text });
            }
          });
        },
        setBarline: (measureIndex, side, barlineType) => {
          updateScore(draft => {
            if (draft.measures[measureIndex]) {
              if (side === 'left') {
                draft.measures[measureIndex].leftBarline.type = barlineType;
              } else {
                draft.measures[measureIndex].rightBarline.type = barlineType;
              }
            }
          });
        },
        deleteNote: (note) => {
          updateScore(draft => {
            draft.measures.forEach(m => {
              m.voices.forEach(v => {
                const idx = v.elements.findIndex(e => (e.note && e.note.id === note.id));
                if (idx !== -1) {
                  v.elements.splice(idx, 1);
                }
                // If using a map/beat based system, we might need a different removal strategy
                // But typically VexFlow voices are lists of notes.
              });
            });
          });
        }
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export const useScore = () => useContext(ScoreContext);
