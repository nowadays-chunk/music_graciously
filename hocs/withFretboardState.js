import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  updateStateProperty,
  newFretboard,
  addFretboard,
  setProgression,
  newLayout
} from '../redux/actions';
import { getNoteFromFretboard } from '../redux/helpers';
import guitar from '../config/guitar';
import { LABEL_DISPLAY_MODES, getLabelDisplayFromSettings } from '../core/spreading/labelDisplay';
import { useRouter } from "next/router";

const defaultTuning = [4, 11, 7, 2, 9, 4];

const normalizeTuning = (value, fallback = defaultTuning) => {
  const source = Array.isArray(value) ? value : String(value || '').split('-');
  const normalized = source.map((num) => parseInt(num, 10));

  return normalized.every((note) => Number.isInteger(note) && note >= 0 && note < 12)
    ? normalized
    : fallback;
};

const getFingerForFret = (fretIndex, positionStart = null) => {
  if (fretIndex <= 0) return '';

  const hasPositionStart = Number.isFinite(positionStart);
  const start = hasPositionStart
    ? Math.max(1, positionStart)
    : Math.floor((fretIndex - 1) / 4) * 4 + 1;

  return String(Math.min(4, Math.max(1, fretIndex - start + 1)));
};

const getPositionStartFromFrets = (frets) => {
  const fretted = frets.filter((fret) => Number.isFinite(fret) && fret > 0);
  return fretted.length ? Math.min(...fretted) : null;
};

const setVisibleNote = (noteData, noteName, interval, fretIndex, positionStart) => {
  noteData.show = true;
  noteData.current = noteName;
  noteData.note = noteName;
  noteData.interval = interval;
  noteData.finger = getFingerForFret(fretIndex, positionStart);
};

const withFretboardState = (WrappedComponent) => {
  const WithFretboardState = (props) => {
    const dispatch = useDispatch();
    const { boards } = props;
    const router = useRouter();

    const [selectedFretboardIndex, setSelectedFretboardIndex] = useState(0);
    const [selectedFretboard, setSelectedFretboard] = useState(
      boards[selectedFretboardIndex]
    );

    useEffect(() => {
      setSelectedFretboard(boards[selectedFretboardIndex]);
    }, [boards, selectedFretboardIndex]);

    // Restore progression once
    useEffect(() => {
      const restoredChordProgression = JSON.parse(localStorage.getItem('progression'));
      if (restoredChordProgression?.length) {
        dispatch(setProgression(restoredChordProgression));
      }
    }, [dispatch]);

    const handleFretboardSelect = (index) => {
      setSelectedFretboardIndex(index);
    };

    const displayChordPortionForBoard = useCallback((board, chordObject) => {
      const { key, chord, shape } = chordObject;

      const cagedShape = guitar.arppegios[chord]?.cagedShapes?.[shape];
      if (!cagedShape) return;

      // --- compute real frets (0–24)
      let realFrets = cagedShape.map(fret => fret === null ? null : fret + key);
      // reverse orientation for your board (low→high to high→low)
      realFrets = realFrets.reverse();

      // build chord notes
      const chordArp = guitar.arppegios[chord];
      if (!chordArp) return;
      const { formula } = chordArp;
      let currentNoteIndex = key;
      const chordNotes = [guitar.notes.sharps[currentNoteIndex]];
      formula.forEach(step => {
        currentNoteIndex = (currentNoteIndex + step) % 12;
        chordNotes.push(guitar.notes.sharps[currentNoteIndex]);
      });
      chordNotes.pop();

      const chordIntervals = chordArp.intervals;
      const positionStart = getPositionStartFromFrets(realFrets);

      const newBoard = JSON.parse(JSON.stringify(board)).chordSettings.fretboard;

      // reset board
      newBoard.forEach(string =>
        string.forEach(note => {
          note.show = false;
          note.interval = null;
          note.finger = '';
        })
      );

      // display shape
      newBoard.forEach((string, stringIndex) => {
        string.forEach((note, fretIndex) => {
          const targetFret = realFrets[stringIndex];

          if (targetFret === null) return;
          if (fretIndex !== targetFret) return;

          // find note name at this fret
          const openTuningNote =
            board.generalSettings.tuning[stringIndex];
          const noteIndex = (openTuningNote + fretIndex) % 12;
          const noteName = guitar.notes.sharps[noteIndex];

          if (chordNotes.includes(noteName)) {
            const interval = chordIntervals[chordNotes.indexOf(noteName)];
            setVisibleNote(newBoard[stringIndex][fretIndex], noteName, interval, fretIndex, positionStart);
          }
        });
      });

      // commit update
      if (
        JSON.stringify(board.chordSettings.fretboard) !==
        JSON.stringify(newBoard)
      ) {
        dispatch(
          updateStateProperty(
            board.id,
            "chordSettings.fretboard",
            newBoard
          )
        );
      }
    }, [dispatch]);

    useEffect(() => {
      (boards || []).forEach((board) => {
        const {
          chordSettings,
          keySettings,
          scaleSettings,
          generalSettings,
          modeSettings,
          arppegioSettings
        } = board;

        const choice = generalSettings.choice;
        if (isNaN(keySettings[choice])) return;

        let notes = [];
        let intervals = [];
        const shape = board[choice + "Settings"].shape;
        let modalNotes = [];

        /* ---------------------------
          1. CHORDS / ARPEGGIOS / SCALES
        ---------------------------- */
        if (choice === "chord" && chordSettings.chord && shape) {
          displayChordPortionForBoard(board, {
            key: keySettings[choice],
            chord: chordSettings.chord,
            shape
          });
          return;

        } else if (choice === "arppegio" && arppegioSettings.arppegio) {
          notes = getArppegioNotesForBoard(board, arppegioSettings.arppegio);
          intervals = getArppegioIntervalsForBoard(arppegioSettings.arppegio);

        } else if (choice === "scale" && scaleSettings.scale) {
          notes = getScaleNotesForBoard(scaleSettings.scale, keySettings.scale);
          intervals = getScaleIntervalsForBoard(scaleSettings.scale);

          if (notes.length > 0 && guitar.scales[scaleSettings.scale]?.isModal) {
            modalNotes = getModeNotes(notes, modeSettings.mode);
          }
        }

        const fretboardClone = JSON.parse(JSON.stringify(board));
        const choiceKey = `${choice}Settings`;
        const choiceBoard = fretboardClone[choiceKey]?.fretboard || [];
        const fretCount = fretboardClone.generalSettings.nofrets || 12;

        /* ---------------------------
          2. CLEAN RESET OF BOARD
        ---------------------------- */
        choiceBoard.forEach((string) => {
          string.forEach((note) => {
            note.show = false;
            note.interval = undefined;
            note.finger = '';
          });
        });

        /* ---------------------------
          3. SHAPED MODE
        ---------------------------- */
        if (shape !== "" && notes.length && intervals.length) {
          const shapeIndex = guitar.shapes.names.indexOf(shape);
          const rootNoteIndex = keySettings[choice];

          let shapeIntervals = null;
          if (choice === "arppegio") {
            shapeIntervals = guitar.shapes.indexes[arppegioSettings.arppegio]?.[shapeIndex] || guitar.shapes.indexes["M"]?.[shapeIndex];
          } else if (choice === "scale") {
            shapeIntervals = guitar.scales[scaleSettings.scale]?.indexes?.[shapeIndex];
          }

          if (shapeIntervals) {
            choiceBoard.forEach((string, stringIndex) => {
              for (let fretIndex = rootNoteIndex; fretIndex < fretCount; fretIndex++) {
                const currentNote = getNoteFromFretboard(
                  stringIndex, fretIndex, fretboardClone.generalSettings.tuning
                );
                if (!notes.includes(currentNote)) continue;

                let startInterval = shapeIntervals.start + rootNoteIndex;
                let endInterval = shapeIntervals.end + rootNoteIndex;

                const row = choiceBoard[stringIndex];
                const noteData = row?.[fretIndex];
                if (fretIndex >= startInterval && fretIndex <= endInterval) {
                  if (!noteData) continue;
                  const interval = intervals[notes.indexOf(currentNote)];
                  const fingerPositionStart = startInterval > 0 ? startInterval : null;
                  setVisibleNote(noteData, currentNote, interval, fretIndex, fingerPositionStart);
                }
              }
            });
          }
        } else {
          /* ---------------------------
            4. NON-SHAPE MODE
          ---------------------------- */
          choiceBoard.forEach((string, stringIndex) => {
            for (let fretIndex = 0; fretIndex < fretCount; fretIndex++) {
              const currentNote = getNoteFromFretboard(
                stringIndex, fretIndex, fretboardClone.generalSettings.tuning
              );
              if (!notes.includes(currentNote)) continue;

              const row = choiceBoard[stringIndex];
              const noteData = row?.[fretIndex];
              if (!noteData) continue;

              const interval = intervals[notes.indexOf(currentNote)];
              setVisibleNote(noteData, currentNote, interval, fretIndex, null);
            }
          });
        }

        /* ---------------------------
          FINALIZE AND DISPATCH
        ---------------------------- */
        fretboardClone[choiceKey].modalNotes = modalNotes;
        fretboardClone[choiceKey].notes = notes;

        if (JSON.stringify(board[choiceKey]) !== JSON.stringify(fretboardClone[choiceKey])) {
          dispatch(updateStateProperty(board.id, `${choiceKey}`, fretboardClone[choiceKey]));
        }
      });
    }, [boards, dispatch, displayChordPortionForBoard]);

    const getArppegioNotesForBoard = (board, arppegio) => {
      const formula = guitar.arppegios[arppegio]?.formula;
      const keyIndex = parseInt(board.keySettings.arppegio);

      if (!formula || isNaN(keyIndex)) return [];

      let currentIndex = keyIndex;
      const arppegioNotes = [guitar.notes.sharps[currentIndex]];

      formula.forEach((step) => {
        currentIndex = (currentIndex + step) % 12;
        arppegioNotes.push(guitar.notes.sharps[currentIndex]);
      });

      return arppegioNotes;
    };

    const getArppegioIntervalsForBoard = (arppegio) => {
      return guitar.arppegios[arppegio]?.intervals || [];
    };

    const getModeNotes = (scaleNotes, mode) => {
      return scaleNotes
        .slice(parseInt(mode))
        .concat(scaleNotes.slice(0, parseInt(mode)));
    };

    const getScaleNotesForBoard = (scale, key) => {
      if (!scale || scale === '' || isNaN(key) || !guitar.scales[scale]) return [];
      const { formula } = guitar.scales[scale];
      const keyIndex = parseInt(key);

      let currentNoteIndex = keyIndex;
      const scaleNotes = [guitar.notes.sharps[currentNoteIndex]];

      formula.forEach((step) => {
        currentNoteIndex = (currentNoteIndex + step) % 12;
        scaleNotes.push(guitar.notes.sharps[currentNoteIndex]);
      });

      return scaleNotes.filter((note) => note !== undefined);
    };

    const getScaleIntervalsForBoard = (scale) => {
      return guitar.scales[scale]?.intervals || [];
    };

    const handleChoiceChange = (newChoice) => {
      dispatch(
        updateStateProperty(selectedFretboard.id, 'generalSettings.choice', newChoice)
      );
    };

    const createNewBoardDisplay = () => {
      const newBoard = newFretboard(
        6,
        25,
        [4, 7, 2, 9, 11, 4],
        [4, 3, 3, 3, 2, 2],
        'home',
        'scale'
      );
      dispatch(addFretboard(newBoard));

    };

    const cleanFretboard = () => {
      if (selectedFretboardIndex === -1) return;

      const choice = selectedFretboard.generalSettings.choice;
      const newBoard = newLayout(
        selectedFretboard.generalSettings.nostrs,
        selectedFretboard.generalSettings.nofrets,
        selectedFretboard.generalSettings.tuning
      );

      dispatch(updateStateProperty(selectedFretboard.id, `keySettings.${choice}`, ''));
      dispatch(updateStateProperty(selectedFretboard.id, `${choice}Settings.${choice}`, ''));

      if (choice === 'chord') {
        dispatch(updateStateProperty(selectedFretboard.id, `${choice}Settings.shape`, ''));
      }

      dispatch(updateStateProperty(selectedFretboard.id, `${choice}Settings.${choice}`, ''));
      dispatch(
        updateStateProperty(
          selectedFretboard.id,
          `${selectedFretboard.generalSettings.choice}Settings.fretboard`,
          newBoard
        )
      );
    };

    const getPropertiesUpdate = (element, value, newElement, targetFretboard = selectedFretboard) => {
      switch (element) {
        case 'key':
          return [{ property: `keySettings.${targetFretboard.generalSettings.choice}`, value }];

        case 'scale':
          return [{ property: 'scaleSettings.scale', value: guitar.scales[value] ? value : '' }];

        case 'mode':
          return [
            { property: 'modeSettings.mode', value: value >= 0 && value <= 6 ? value : '' }
          ];

        case 'arppegio':
          return [
            { property: 'arppegioSettings.arppegio', value: guitar.arppegios[value] ? value : '' }
          ];

        case 'chord':
          return [
            { property: 'chordSettings.chord', value: guitar.arppegios[value] ? value : '' }
          ];

        case 'shape':
          return [
            { property: `${targetFretboard.generalSettings.choice}Settings.shape`, value: value || '' }
          ];

        case 'fret':
          return [
            { property: 'chordSettings.fret', value: value > 0 && value < 25 ? value : '' }
          ];

        case 'notesDisplay':
          return [
            { property: 'generalSettings.notesDisplay', value: newElement },
            { property: 'generalSettings.labelDisplay', value: newElement ? 'notes' : 'intervals' }
          ];

        case 'labelDisplay':
          return [
            {
              property: 'generalSettings.labelDisplay',
              value: LABEL_DISPLAY_MODES.includes(value) ? value : getLabelDisplayFromSettings(targetFretboard.generalSettings)
            },
            {
              property: 'generalSettings.notesDisplay',
              value: value !== 'intervals'
            }
          ];

        case 'tuning':
          return [
            {
              property: 'generalSettings.tuning',
              value: normalizeTuning(value, targetFretboard.generalSettings.tuning || defaultTuning)
            }
          ];

        case 'nostrs': {
          const newBoardForStr = newLayout(
            parseInt(value),
            targetFretboard.generalSettings.nofrets,
            targetFretboard.generalSettings.tuning
          );

          let baseOctaves = targetFretboard.generalSettings.baseOctaves;
          if (parseInt(value) === 6) {
            baseOctaves = [...targetFretboard.generalSettings.baseOctaves, 2];
          } else if (parseInt(value) === 7) {
            baseOctaves = [...targetFretboard.generalSettings.baseOctaves, 1];
          }

          return [
            { property: 'generalSettings.baseOctaves', value: baseOctaves },
            { property: 'generalSettings.nostrs', value: parseInt(value) || 6 },
            { property: 'scaleSettings.fretboard', value: newBoardForStr },
            { property: 'chordSettings.fretboard', value: newBoardForStr },
            { property: 'modeSettings.fretboard', value: newBoardForStr },
            { property: 'arppegioSettings.fretboard', value: newBoardForStr }
          ];
        }

        case 'nofrets': {
          const newBoardForFrets = newLayout(
            targetFretboard.generalSettings.nostrs,
            parseInt(value),
            targetFretboard.generalSettings.tuning
          );

          return [
            // default to 12 frets
            { property: 'generalSettings.nofrets', value: parseInt(value) || 12 },
            { property: 'scaleSettings.fretboard', value: newBoardForFrets },
            { property: 'chordSettings.fretboard', value: newBoardForFrets },
            { property: 'modeSettings.fretboard', value: newBoardForFrets },
            { property: 'arppegioSettings.fretboard', value: newBoardForFrets }
          ];
        }

        case 'arppegio':
          return [
            { property: 'arppegioSettings.arppegio', value: value },
            {
              property: `arppegioSettings.fretboard`,
              value: newLayout(
                targetFretboard.generalSettings.nostrs,
                parseInt(value),
                targetFretboard.generalSettings.tuning
              )
            }
          ];

        default:
          return null;
      }
    };

    const dispatchPropertiesUpdate = (updates, targetFretboard = selectedFretboard) => {
      if (updates && updates.length > 0) {
        updates.forEach((update) => {
          dispatch(updateStateProperty(targetFretboard.id, update.property, update.value));
        });
      }
    };

    const getNewElementValue = (value, element, targetFretboard = selectedFretboard) => {
      return element === 'notesDisplay'
        ? !targetFretboard.generalSettings.notesDisplay
        : value;
    };

    const onElementChange = (value, element, targetFretboard = selectedFretboard) => {
      const newElement = getNewElementValue(value, element, targetFretboard);
      const propertiesUpdate = getPropertiesUpdate(element, value, newElement, targetFretboard);
      dispatchPropertiesUpdate(propertiesUpdate, targetFretboard);
    };

    return (
      <WrappedComponent
        {...props}
        selectedFretboard={selectedFretboard}
        handleFretboardSelect={handleFretboardSelect}
        handleChoiceChange={handleChoiceChange}
        createNewBoardDisplay={createNewBoardDisplay}
        cleanFretboard={cleanFretboard}
        onElementChange={onElementChange}
        selectedFretboardIndex={selectedFretboardIndex}
        setSelectedFretboardIndex={setSelectedFretboardIndex}
        getScaleNotes={getScaleNotesForBoard}
        boards={boards}
      />
    );
  };

  WithFretboardState.displayName = `WithFretboardState(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithFretboardState;
};

export default withFretboardState;
