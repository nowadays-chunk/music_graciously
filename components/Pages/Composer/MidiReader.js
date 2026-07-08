// ================================================
//   MidiReader.jsx
//   Loads Sample1.mid and plays it on your fretboard
// ================================================

import React, { useEffect, useRef, useState } from "react";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { Button } from "@mui/material";
import guitar from "../../../config/guitar";

const MidiReader = ({ playNote, onHighlight }) => {
  const [midiData, setMidiData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const isPlayingRef = useRef(false);

  // -------- LOAD THE LOCAL MIDI FILE --------------
  useEffect(() => {
    async function loadMidi() {
      // your file is in /config folder
      const res = await fetch("https://raw.githubusercontent.com/nowadays-chunk/midi-data-set/main/Carcassi_SonatinaI_Op1.mid");
      const arrayBuffer = await res.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      console.log("MIDI loaded:", midi);
      setMidiData(midi);
      setIsLoaded(true);
    }
    loadMidi();
  }, []);

  // Convert C#4 → 1, D4 → 2, etc.
  const noteToIndex = (noteName) => {
    const n = noteName.replace(/[0-9]/g, ""); // remove octave
    return guitar.notes.sharps.indexOf(n);
  };

  // Map MIDI note to ANY fretboard position
  const mapToFretboard = (noteIndex, tuning) => {
    for (let stringIndex = 0; stringIndex < tuning.length; stringIndex++) {
      for (let fretIndex = 0; fretIndex < 20; fretIndex++) {
        const val = (tuning[stringIndex] + fretIndex) % 12;
        if (val === noteIndex) {
          return { stringIndex, fretIndex };
        }
      }
    }
    return null;
  };

  // ------------- PLAY FUNCTION --------------------
  const play = async () => {
    if (!midiData) return;

    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel(0);

    // const synth = new Tone.Synth().toDestination();

    const tuning = guitar.tuning?.standard || [4, 11, 7, 2, 9, 4];
    // fallback EADGBE → [E=4, B=11, G=7, D=2, A=9, E=4]

    midiData.tracks.forEach((track) => {
      track.notes.forEach((n) => {
        const noteIndex = noteToIndex(n.name);
        const pos = mapToFretboard(noteIndex, tuning);

        Tone.Transport.schedule((time) => {
          // highlight on fretboard
          if (pos) {
            onHighlight({
              note: n.name,
              stringIndex: pos.stringIndex,
              fretIndex: pos.fretIndex,
            });
          }

          // sound
          playNote(n.name);
          // synth.triggerAttackRelease(n.name, n.duration, time);
        }, n.time);
      });
    });

    Tone.Transport.start();
    isPlayingRef.current = true;
  };

  // ------------- PAUSE -----------------------------
  const pause = () => {
    Tone.Transport.pause();
    isPlayingRef.current = false;
  };

  // ------------- RESTART ---------------------------
  const restart = () => {
    Tone.Transport.stop();
    Tone.Transport.start();
    isPlayingRef.current = true;
  };

  return (
    <div style={{ marginTop: 20 }}>
      {!isLoaded && <div>Loading Sample1.mid…</div>}

      {isLoaded && (
        <div style={{ display: "flex", gap: 15 }}>
          <Button variant="contained" onClick={play}>▶ Play</Button>
          <Button variant="outlined" onClick={pause}>⏸ Pause</Button>
          <Button variant="outlined" onClick={restart}>⏮ Restart</Button>
        </div>
      )}
    </div>
  );
};

export default MidiReader;
