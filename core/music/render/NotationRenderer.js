import Vex from "vexflow";
const VF = Vex;

function attachInteraction(vfNote, dawNote, selection, interactive) {
  const el = vfNote.getSVGElement?.();
  if (!el) return;

  if (!interactive || !selection || typeof selection.select !== "function") {
    el.style.cursor = "default";
    return;
  }

  el.style.cursor = "pointer";
  el.addEventListener("click", (e) => {
    e.stopPropagation();
    selection.select(dawNote);
  });
}

export default class NotationRenderer {
  constructor({ container, score, selection, compact = false, interactive = true }) {
    this.container = container;
    this.score = score;
    this.selection = selection;
    this.compact = compact;
    this.interactive = interactive;
  }

  render() {
    if (!this.container || !this.score) return;
    this.container.innerHTML = "";

    const renderer = new VF.Renderer(this.container, VF.Renderer.Backends.SVG);
    const ctx = renderer.getContext();

    const isMobile = (this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 1024)) < 600;
    const MEASURES_PER_LINE = isMobile ? 1 : 4;
    const START_X = 20;
    const START_Y = 28;
    const targetWidth = isMobile
      ? Math.max(340, this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 360))
      : Math.max(760, this.container.clientWidth || 0);
    const usableWidth = Math.max(isMobile ? 300 : 640, targetWidth - START_X * 2);
    const MEASURE_WIDTH = Math.floor(usableWidth / MEASURES_PER_LINE);
    const SYSTEM_HEIGHT = this.compact ? 148 : 170;

    const measureCount = this.score.measures.length;
    const lineCount = Math.max(1, Math.ceil(measureCount / MEASURES_PER_LINE));
    const totalWidth = START_X * 2 + (MEASURE_WIDTH * MEASURES_PER_LINE);
    const totalHeight = START_Y + (lineCount * SYSTEM_HEIGHT) + 80;
    renderer.resize(totalWidth, totalHeight);

    this.score.measures.forEach((measure, index) => {
      const columnIndex = index % MEASURES_PER_LINE;
      const rowIndex = Math.floor(index / MEASURES_PER_LINE);
      const x = START_X + (columnIndex * MEASURE_WIDTH);
      const y = START_Y + (rowIndex * SYSTEM_HEIGHT);
      const stave = new VF.Stave(x, y, MEASURE_WIDTH);

      // Clefs, Key Signatures, and Time Signatures change mid-score
      let shouldDrawClef = index === 0 || columnIndex === 0;
      let shouldDrawKeySig = index === 0 || columnIndex === 0;
      let shouldDrawTimeSig = index === 0 || columnIndex === 0;

      if (index > 0) {
        if (this.score.measures[index - 1].clef.name !== measure.clef.name) {
          shouldDrawClef = true;
        }
        if (this.score.measures[index - 1].keySignature.key !== measure.keySignature.key) {
          shouldDrawKeySig = true;
        }
        if (this.score.measures[index - 1].timeSignature.beats !== measure.timeSignature.beats ||
          this.score.measures[index - 1].timeSignature.beatValue !== measure.timeSignature.beatValue) {
          shouldDrawTimeSig = true;
        }
      }

      if (shouldDrawClef) {
        stave.addClef(measure.clef?.name || "treble");
      }

      if (shouldDrawKeySig) {
        stave.addKeySignature(measure.keySignature.key);
      }

      if (shouldDrawTimeSig) {
        stave.addTimeSignature(measure.timeSignature.toString());
      }

      // Render Tempo markings for this measure
      if (measure.tempoMarkings && measure.tempoMarkings.length > 0) {
        measure.tempoMarkings.forEach(tm => {
          // Add a Vex.Flow.Tempo modifier
          // The API usually takes { duration, dots, bpm, name }
          stave.setTempo({ name: tm.text, bpm: tm.bpm, duration: "q", dots: 0 }, 0);
        });
      }

      // Structure & Navigation
      if (measure.rehearsalMark) {
        stave.addModifier(new VF.Repetition(VF.Repetition.type.SEGNO, stave.x, stave.y).setSymbol(measure.rehearsalMark));
      }
      if (measure.coda) {
        stave.addModifier(new VF.Repetition(VF.Repetition.type.CODA_LEFT, stave.x, stave.y));
      }
      if (measure.segno) {
        stave.addModifier(new VF.Repetition(VF.Repetition.type.SEGNO_LEFT, stave.x, stave.y));
      }
      if (measure.fine) {
        stave.addModifier(new VF.Repetition(VF.Repetition.type.FINE, stave.x, stave.y));
      }

      // Map Custom Barlines to VexFlow Barlines
      const barlineMap = {
        "single": VF.Barline.type.SINGLE,
        "double": VF.Barline.type.DOUBLE,
        "end": VF.Barline.type.END,
        "repeat-begin": VF.Barline.type.REPEAT_BEGIN,
        "repeat-end": VF.Barline.type.REPEAT_END,
        "repeat-both": VF.Barline.type.REPEAT_BOTH,
        "none": VF.Barline.type.NONE
      };

      if (measure.leftBarline && measure.leftBarline.type !== "single") {
        stave.setBegBarType(barlineMap[measure.leftBarline.type] || VF.Barline.type.SINGLE);
      }

      if (measure.rightBarline) {
        stave.setEndBarType(barlineMap[measure.rightBarline.type] || VF.Barline.type.SINGLE);
      }

      stave.setContext(ctx).draw();

      const voices = [];

      measure._tupletsToDraw = [];
      measure._tiesToDraw = [];

      measure.voices.forEach(voice => {
        if (!voice.elements.length) return;

        // GROUP NOTES BY BEAT (CHORDS)
        const beatGroups = new Map();
        voice.elements.forEach(entry => {
          const beat = entry.beat; // Assuming entry is { beat, note }
          if (!beatGroups.has(beat)) beatGroups.set(beat, []);
          beatGroups.get(beat).push(entry.note);
        });

        // Sort by beat position
        const sortedBeats = Array.from(beatGroups.keys()).sort((a, b) => a - b);

        const notes = [];
        const tupletsToDraw = [];
        const tiesToDraw = [];

        // Track active ties to build VF.StaveTie
        let activeTieStartNote = null;

        sortedBeats.forEach(beat => {
          const group = beatGroups.get(beat);
          if (!group || group.length === 0) return;

          // Use properties of the first note for the chord (duration, type)
          const mainNote = group[0];
          const vfDurationStr = mainNote.duration?.toVexflow() || "q";
          const isDotted = vfDurationStr.includes("d");
          const baseDur = vfDurationStr.replace(/d/g, "");

          let vfNote;

          if (mainNote.isRest) {
            vfNote = new VF.StaveNote({ keys: ["b/4"], duration: baseDur + "r" });
          } else {
            const keys = group.map(n => {
              return `${n.pitch.step.toLowerCase()}${n.pitch.alter === 1 ? "#" : n.pitch.alter === -1 ? "b" : n.pitch.alter === 2 ? "##" : n.pitch.alter === -2 ? "bb" : ""
                }/${n.pitch.octave}`;
            });

            vfNote = new VF.StaveNote({ keys: keys, duration: baseDur });

            // Accidentals logic
            // VERY basic algorithm: add Vex.Flow.Accidental if alter != 0
            // A more advanced engine would track the active measure accidentals based on KeySignature and previous notes
            group.forEach((n, i) => {
              if (n.pitch.alter !== 0) {
                const acc = n.pitch.alter === 1 ? "#" : n.pitch.alter === -1 ? "b" : n.pitch.alter === 2 ? "##" : "bb";
                vfNote.addModifier(new VF.Accidental(acc), i);
              }
              // Note: Should also add naturals ("n") if a previous note in the measure altered this step
            });

            // Noteheads
            if (mainNote.notehead && mainNote.notehead !== "normal") {
              const vfNoteheadMap = {
                "cross": "1",
                "diamond": "2",
                "triangle": "3",
                "x": "x",
              };
              const style = vfNoteheadMap[mainNote.notehead];
              if (style) {
                group.forEach((_, i) => vfNote.setKeyStyle(i, { style }));
              }
            }

            // Articulations
            if (mainNote.articulations && mainNote.articulations.length > 0) {
              const artMap = {
                "staccato": "a.",
                "accent": "a>",
                "tenuto": "a-",
                "marcato": "a^",
                "fermata": "a@",
                "up-bow": "a|",
                "down-bow": "am"
              };
              mainNote.articulations.forEach(art => {
                if (artMap[art]) {
                  vfNote.addModifier(new VF.Articulation(artMap[art]).setPosition(3), 0); // 3 = ABOVE
                }
              });
            }

            // Ornaments
            if (mainNote.ornaments && mainNote.ornaments.length > 0) {
              const ornMap = {
                "trill": "tr",
                "mordent": "m",
                "turn": "turn"
              };
              mainNote.ornaments.forEach(orn => {
                if (ornMap[orn]) {
                  vfNote.addModifier(new VF.Ornament(ornMap[orn]), 0);
                }
              });
            }

            // Dynamics (Textual for now)
            if (mainNote.dynamics && mainNote.dynamics.length > 0) {
              // VexFlow dynamics are usually TextDynamics or just TextModifiers. 
              // We will use Annotation for simplicity here, but a robust app might use TextDynamics.
              mainNote.dynamics.forEach(dyn => {
                if (dyn !== "crescendo" && dyn !== "decrescendo") {
                  vfNote.addModifier(new VF.Annotation(dyn).setFont("Georgia", 14, "italic").setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM), 0);
                }
              });
            }

            // Chord Symbols
            if (mainNote.chordSymbol) {
              vfNote.addModifier(
                new VF.Annotation(mainNote.chordSymbol)
                  .setFont("Arial", 14, "bold")
                  .setVerticalJustification(VF.Annotation.VerticalJustify.TOP),
                0
              );
            }

            // Attach interaction to the first note
            attachInteraction(vfNote, mainNote, this.selection, this.interactive);
          }

          if (isDotted) {
            VF.Dot.buildAndAttach([vfNote]);
          }

          notes.push(vfNote);

          // Ties
          if (mainNote.tie === "start") {
            activeTieStartNote = vfNote;
          } else if (mainNote.tie === "stop" && activeTieStartNote) {
            tiesToDraw.push(new VF.StaveTie({
              first_note: activeTieStartNote,
              last_note: vfNote,
              first_indices: [0],
              last_indices: [0]
            }));
            activeTieStartNote = null;
          }
        });

        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        vfVoice.setMode(VF.Voice.Mode.SOFT);
        vfVoice.addTickables(notes);
        voices.push(vfVoice);

        // Check for tuplets in the voice
        // (Simplified logic: groups notes of same tuplet modifier into a Vex.Flow.Tuplet)
        let tupletBuffer = [];
        let tupletInfo = null;

        voice.elements.forEach((entry, i) => {
          const note = entry.note;
          if (note.duration?.tuplets) {
            if (!tupletInfo) {
              tupletInfo = note.duration.tuplets;
            }
            // Find matching vfNote by index (assuming 1:1 mapping for simple voices)
            // For chords, this gets complicated, but we assume simple linear voices for now
            tupletBuffer.push(notes[i]);

            if (tupletBuffer.length === tupletInfo.num_notes) {
              tupletsToDraw.push(new VF.Tuplet(tupletBuffer, {
                num_notes: tupletInfo.num_notes,
                notes_occupied: tupletInfo.notes_occupied
              }));
              tupletBuffer = [];
              tupletInfo = null;
            }
          }
        });

        // Store non-Stave objects to draw later
        measure._tupletsToDraw = measure._tupletsToDraw.concat(tupletsToDraw);
        measure._tiesToDraw = measure._tiesToDraw.concat(tiesToDraw);
      });

      if (voices.length) {
        new VF.Formatter().joinVoices(voices).format(voices, MEASURE_WIDTH - 20);
        voices.forEach(v => v.draw(ctx, stave));

        if (measure._tupletsToDraw) {
          measure._tupletsToDraw.forEach(t => t.setContext(ctx).draw());
        }
        if (measure._tiesToDraw) {
          measure._tiesToDraw.forEach(t => t.setContext(ctx).draw());
        }
      }
    });
  }
}
