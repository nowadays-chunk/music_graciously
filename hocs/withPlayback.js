// ===========================================
//   withPlayback.jsx  (FULL & FINAL VERSION)
// ===========================================
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Soundfont from 'soundfont-player';
import { updateStateProperty } from '../redux/actions';
import guitar from '../config/guitar';

/* =====================================================
   HIGHER-ORDER COMPONENT
===================================================== */
const withPlayback = (WrappedComponent) => {
    const WithPlayback = (props) => {
        const dispatch = useDispatch();
        const { selectedFretboard, selectedFretboardIndex } = props;

        /* --------------------------------------------
           CHORD DISPLAY LOCK (5 seconds)
           Prevents auto-redraw from wiping clicked chord
        -------------------------------------------- */
        const chordDisplayLocked = useRef(false);

        /* --------------------------------------------
           Signature tracking to avoid repeat triggering
        -------------------------------------------- */
        const prevSig = useRef(null);

        const getChordSignature = useCallback(() => {
            const choice = selectedFretboard.generalSettings.choice;

            return JSON.stringify({
                choice,
                key: selectedFretboard.keySettings[choice],
                chord: selectedFretboard.chordSettings.chord,
                shape: selectedFretboard.chordSettings.shape,
                notes: selectedFretboard.chordSettings.notes || []
            });
        }, [selectedFretboard]);

        /* =====================================================
           PLAY SELECTED NOTES (scale/arpeggio mode)
        ====================================================== */
        const playSelectedNotes = useCallback(async () => {
            const choice = selectedFretboard.generalSettings.choice;
            const choiceSettings = selectedFretboard[choice + 'Settings'];
            const selectedScale = selectedFretboard.scaleSettings.scale;
            const shape = selectedFretboard[choice + 'Settings'].shape;
            let rootNoteIndex = 0;

            const computeModeOffsets = (formula) => {
                let offsets = [0];
                for (let i = 1; i < formula.length; i++) {
                    offsets.push((offsets[i - 1] + formula[i - 1]) % 12);
                }
                return offsets;
            };

            if (choice === 'scale') {
                const modeIndex = selectedFretboard.modeSettings.mode || 0;
                const modeOffsets = computeModeOffsets(guitar.scales[selectedScale.toLowerCase()].formula);
                const modeOffset = modeOffsets[modeIndex];
                rootNoteIndex = (selectedFretboard.keySettings[choice] + modeOffset) % 12;
            } else if (choice === 'arppegio') {
                rootNoteIndex = selectedFretboard.keySettings[choice];
            }

            if (choice === 'chord') {
                await playChordNotes();
                return;
            }

            let selectedCagedShapes = [];

            if (!shape == choice == 'scale') {
                selectedCagedShapes = guitar.scales[selectedScale].indexes;
            } else if (!shape == choice == 'arppegio') {
                selectedCagedShapes = guitar.shapes.indexes;
            } else if (shape && choice === 'scale') {
                const shapeIndex = guitar.shapes.names.indexOf(shape);
                const scaleIndexes = guitar.scales[selectedScale].indexes;
                selectedCagedShapes = [scaleIndexes[shapeIndex]];
            } else if (shape && choice === 'arppegio') {
                const shapeIndex = guitar.shapes.names.indexOf(shape);
                const arppegioIndexes = guitar.shapes.indexes[shapeIndex];
                selectedCagedShapes = [arppegioIndexes];
            }

            let notesForShape = [];

            selectedCagedShapes.forEach((caged) => {
                const notesInShape = [];

                choiceSettings.fretboard.forEach((string, stringIndex) => {
                    for (let fretIndex = 0; fretIndex < string.length; fretIndex++) {
                        const note = string[fretIndex];
                        if (note.show) {
                            const displayedNote = note.current;
                            const octave = calculateOctave(stringIndex, fretIndex);
                            notesInShape.push({
                                note: `${displayedNote}${octave}`,
                                stringIndex,
                                fretIndex
                            });
                        }
                    }
                });

                notesForShape.push(notesInShape);
            });

            for (const scopedNotes of notesForShape) {
                if (scopedNotes.length > 0) {
                    const rootNote = scopedNotes
                        .filter(n => n.note.startsWith(guitar.notes.sharps[rootNoteIndex]))
                        .sort((a, b) => b.stringIndex - a.stringIndex || a.fretIndex - b.fretIndex)[0];

                    scopedNotes.sort((a, b) =>
                        b.stringIndex - a.stringIndex || a.fretIndex - b.fretIndex
                    );

                    const startNoteIndex = scopedNotes.indexOf(rootNote);

                    const downAfterRoot = scopedNotes.slice(startNoteIndex + 1);
                    const upScale = scopedNotes.slice().reverse();
                    const downBeforeRoot = scopedNotes.slice(0, startNoteIndex);

                    const fullSequence = [
                        rootNote,
                        ...downAfterRoot,
                        ...upScale,
                        ...downBeforeRoot,
                        rootNote,
                    ];

                    await playNotesWithinInterval(fullSequence);
                }
            }
        }, [selectedFretboard, playChordNotes, playNotesWithinInterval, calculateOctave]);

        /* =====================================================
           AUTO-UPDATE MODE (scale/arppegio learning)
        ====================================================== */
        useEffect(() => {
            if (!selectedFretboard) return;
            if (selectedFretboard.generalSettings.page !== 'learn') return;

            // Skip if a single chord was clicked (lock enabled)
            if (chordDisplayLocked.current) return;

            const newSig = getChordSignature();

            // Skip if signature unchanged
            if (prevSig.current === newSig) return;

            prevSig.current = newSig;

            // Play the currently displayed object (scale/chord/arpeggio)
            playSelectedNotes();
        }, [selectedFretboard, getChordSignature, playSelectedNotes]);

        /* =====================================================
           PLAY FULL PROGRESSION (e.g., entire song)
        ====================================================== */
        const playProgression = useCallback(async (progression) => {
            for (let i = 0; i < progression.length; i++) {
                const { name, shape, key } = progression[i];

                dispatch(updateStateProperty(selectedFretboard.id, 'generalSettings.choice', 'chord'));
                dispatch(updateStateProperty(selectedFretboard.id, 'chordSettings.chord', name));
                dispatch(updateStateProperty(selectedFretboard.id, 'chordSettings.shape', shape));
                dispatch(updateStateProperty(selectedFretboard.id, 'keySettings.chord', key));

                // Wait between chords (full progression playback)
                await new Promise(r => setTimeout(r, 1000));
            }
        }, [dispatch, selectedFretboard]);

        /* =====================================================
           PLAY ONE SINGLE CHORD (clicked chord box)
           → Show chord
           → Lock auto updates for 5000ms
           → Play it
        ====================================================== */
        const playSingleChord = async (ch) => {
            chordDisplayLocked.current = true;

            dispatch(updateStateProperty(selectedFretboard.id, 'generalSettings.choice', 'chord'));
            dispatch(updateStateProperty(selectedFretboard.id, 'chordSettings.chord', ch.name));
            dispatch(updateStateProperty(selectedFretboard.id, 'chordSettings.shape', ch.shape));
            dispatch(updateStateProperty(selectedFretboard.id, 'keySettings.chord', ch.key));

            // Play chord as short progression
            playProgression([ch]);

            // Unlock after 5 seconds
            setTimeout(() => {
                chordDisplayLocked.current = false;
            }, 5000);
        };

        /* =====================================================
           PLAY A SINGLE NOTE
        ====================================================== */
        const playNote = async (note) => {
            const guitarSound = await Soundfont.instrument(new AudioContext(), 'acoustic_guitar_nylon');
            guitarSound.play(note);
        };

        /* =====================================================
           PLAY CHORD NOTES (your original version)
        ====================================================== */
        const playChordNotes = useCallback(async () => {
            if (selectedFretboardIndex === -1) return;
            const guitarSound = await Soundfont.instrument(new AudioContext(), 'acoustic_guitar_nylon');
            const chordNotes = [];

            selectedFretboard.chordSettings.fretboard.forEach((string, stringIndex) => {
                string.forEach((note, fretIndex) => {
                    if (note.show) {
                        const noteIndex = (selectedFretboard.generalSettings.tuning[stringIndex] + fretIndex) % 12;
                        const displayedNote = guitar.notes.sharps[noteIndex];
                        const octave = calculateOctave(stringIndex, fretIndex, displayedNote);
                        chordNotes.push({
                            note: `${displayedNote}${octave}`,
                            stringIndex,
                            fretIndex
                        });
                    }
                });
            });

            chordNotes.sort((a, b) => {
                if (a.stringIndex === b.stringIndex) {
                    return a.fretIndex - b.fretIndex;
                }
                return a.stringIndex - b.stringIndex;
            });

            for (let i = chordNotes.length - 1; i >= 0; i--) {
                const { note, stringIndex, fretIndex } = chordNotes[i];
                highlightNoteForDuration(stringIndex, fretIndex, 500);
                guitarSound.play(note);
                await new Promise(r => setTimeout(r, 500));
            }

            chordNotes.forEach(chordNote => guitarSound.play(chordNote.note));
        }, [selectedFretboard, selectedFretboardIndex, calculateOctave, highlightNoteForDuration]);

        /* =====================================================
           Play Notes (interval walkthrough)
        ====================================================== */
        const playNotesWithinInterval = useCallback(async (notes) => {
            const guitarSound = await Soundfont.instrument(new AudioContext(), 'acoustic_guitar_nylon');

            for (let i = 0; i < notes.length; i++) {
                const { note, stringIndex, fretIndex } = notes[i];
                highlightNoteForDuration(stringIndex, fretIndex, 500);
                guitarSound.play(note);
                await new Promise(r => setTimeout(r, 500));
            }
        }, [highlightNoteForDuration]);

        /* =====================================================
           Highlight Notes
        ====================================================== */
        const highlightNoteForDuration = useCallback((stringIndex, fretIndex, duration) => {
            const noteElement = document.getElementById(`note-${selectedFretboardIndex}-${stringIndex}-${fretIndex}`);
            if (noteElement) {
                noteElement.classList.add('note-playing');
                setTimeout(() => {
                    noteElement.classList.remove('note-playing');
                }, duration);
            }
        }, [selectedFretboardIndex]);

        /* =====================================================
           Calculate Octave
        ====================================================== */
        const calculateOctave = useCallback((stringIndex, fretIndex) => {
            const baseOctaves = selectedFretboard.generalSettings.baseOctaves;
            let octave = baseOctaves[stringIndex];
            const tuning = selectedFretboard.generalSettings.tuning;
            const notes = guitar.notes.sharps;

            for (let i = 0; i <= fretIndex; i++) {
                const note = notes[(tuning[stringIndex] + i) % 12];
                if (note === 'B') octave++;
            }

            return octave;
        }, [selectedFretboard]);

        /* =====================================================
           RETURN WRAPPED COMPONENT
        ====================================================== */
        return (
            <WrappedComponent
                {...props}
                playProgression={playProgression}
                playChordNotes={playChordNotes}
                playSelectedNotes={playSelectedNotes}
                playSingleChord={playSingleChord}
                onNoteClick={playNote}
            />
        );
    };

    WithPlayback.displayName = `WithPlayback(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return WithPlayback;
};

export default withPlayback;
