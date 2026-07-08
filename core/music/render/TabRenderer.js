import Vex from "vexflow";
const VF = Vex;

function attachInteraction(tabNote, dawNote, selection, interactive) {
  const el = tabNote.getSVGElement?.();
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

export default class TabRenderer {
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
    const START_Y = 24;
    const targetWidth = isMobile
      ? Math.max(340, this.container.clientWidth || (typeof window !== 'undefined' ? window.innerWidth : 360))
      : Math.max(760, this.container.clientWidth || 0);
    const usableWidth = Math.max(isMobile ? 300 : 640, targetWidth - START_X * 2);
    const MEASURE_WIDTH = Math.floor(usableWidth / MEASURES_PER_LINE);
    const SYSTEM_HEIGHT = this.compact ? 136 : 170;

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
      const stave = new VF.TabStave(x, y, MEASURE_WIDTH);
      if (index === 0 || columnIndex === 0) stave.addClef("tab");

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

      const vfConnectors = []; // Slides, Hammers, Pulls

      const voices = [];

      measure._tupletsToDraw = [];
      measure._tiesToDraw = [];

      measure.voices.forEach(voice => {
        if (!voice.elements.length) return;

        const beatGroups = new Map();
        voice.elements.forEach(entry => {
          const beat = entry.beat;
          if (!beatGroups.has(beat)) beatGroups.set(beat, []);
          beatGroups.get(beat).push(entry.note);
        });

        const sortedBeats = Array.from(beatGroups.keys()).sort((a, b) => a - b);

        const vfNotes = [];
        const tupletsToDraw = [];
        const tiesToDraw = [];
        const modelInfo = []; // { group, tabNote }

        // Track active ties
        let activeTieStartNote = null;

        // 2. Create Notes
        sortedBeats.forEach(beat => {
          const group = beatGroups.get(beat);
          if (!group || group.length === 0) return;

          const mainNote = group[0];
          const vfDurationStr = mainNote.duration?.toVexflow() || "q";
          const isDotted = vfDurationStr.includes("d");
          const baseDur = vfDurationStr.replace(/d/g, "");

          let tabNote;

          if (mainNote.isRest) {
            tabNote = new VF.GhostNote({ duration: baseDur });
          } else {
            const positions = group.map(n => ({ str: n.string || 1, fret: n.fret || 0 }));
            tabNote = new VF.TabNote({
              positions: positions,
              duration: baseDur
            });

            // Bends (Modifiers)
            group.forEach((note, i) => {
              if (note.technique === 'bend') {
                tabNote.addModifier(new VF.Bend([{ type: VF.Bend.UP, text: note.bend || "Full" }]), i);
              }
              // Add text annotations for techniques that will be shown as connectors
              // This helps users see that the technique is applied even if there's no next note yet
              if (['slide', 'hammer', 'pull'].includes(note.technique)) {
                const techniqueLabels = {
                  'slide': 'sl.',
                  'hammer': 'H',
                  'pull': 'P'
                };
                const annotation = new VF.Annotation(techniqueLabels[note.technique]);
                annotation.setFont("Arial", 10, "italic");
                tabNote.addModifier(annotation, i);
              }
            });

            // Articulations
            if (mainNote.articulations && mainNote.articulations.length > 0) {
              const artMap = {
                "staccato": "a.",
                "accent": "a>",
                // Other articulations might require different handling or simply text annotations on TAB
                "tenuto": "a-",
                "marcato": "a^",
                "fermata": "a@"
              };
              mainNote.articulations.forEach(art => {
                if (artMap[art]) {
                  tabNote.addModifier(new VF.Articulation(artMap[art]).setPosition(3), 0);
                }
              });
            }

            // Dynamics
            if (mainNote.dynamics && mainNote.dynamics.length > 0) {
              mainNote.dynamics.forEach(dyn => {
                if (dyn !== "crescendo" && dyn !== "decrescendo") {
                  tabNote.addModifier(new VF.Annotation(dyn).setFont("Georgia", 14, "italic").setVerticalJustification(VF.Annotation.VerticalJustify.BOTTOM), 0);
                }
              });
            }

            // Chord Symbols
            if (mainNote.chordSymbol) {
              tabNote.addModifier(
                new VF.Annotation(mainNote.chordSymbol)
                  .setFont("Arial", 14, "bold")
                  .setVerticalJustification(VF.Annotation.VerticalJustify.TOP),
                0
              );
            }

            attachInteraction(tabNote, mainNote, this.selection, this.interactive);
          }

          if (isDotted) {
            VF.Dot.buildAndAttach([tabNote]);
          }

          vfNotes.push(tabNote);
          modelInfo.push({ group, tabNote });

          // Ties
          if (mainNote.tie === "start") {
            activeTieStartNote = tabNote;
          } else if (mainNote.tie === "stop" && activeTieStartNote) {
            tiesToDraw.push(new VF.TabTie({
              first_note: activeTieStartNote, // VexFlow 3
              last_note: tabNote,             // VexFlow 3
              first_indices: [0],
              last_indices: [0],
              firstNote: activeTieStartNote,  // VexFlow 4
              lastNote: tabNote,              // VexFlow 4
              firstIndices: [0],
              lastIndices: [0]
            }));
            activeTieStartNote = null;
          }
        });

        // 3. Create Connectors (2nd pass)
        modelInfo.forEach((curr, index) => {
          if (index >= modelInfo.length - 1) return;
          const next = modelInfo[index + 1];

          // For each note in current chord, look for connecting note in next chord
          curr.group.forEach((note, i) => {
            if (['slide', 'hammer', 'pull'].includes(note.technique)) {
              // Find matching string in next
              const nextIndex = next.group.findIndex(n => n.string === note.string);
              if (nextIndex !== -1) {
                let connector;
                const params = {
                  first_note: curr.tabNote, // VexFlow 3
                  last_note: next.tabNote,  // VexFlow 3
                  first_indices: [i],
                  last_indices: [nextIndex],
                  firstNote: curr.tabNote,  // VexFlow 4
                  lastNote: next.tabNote,   // VexFlow 4
                  firstIndices: [i],
                  lastIndices: [nextIndex],
                };

                if (note.technique === 'slide') {
                  connector = new VF.TabSlide(params);
                } else if (note.technique === 'hammer') {
                  // VexFlow 4 expects first_note/last_note in TabTie for Hammer/Pull
                  connector = new VF.TabTie(params, "H");
                } else if (note.technique === 'pull') {
                  connector = new VF.TabTie(params, "P");
                }

                if (connector) vfConnectors.push(connector);
              }
            }
          });
        });

        const vfVoice = new VF.Voice({
          num_beats: measure.timeSignature.beats,
          beat_value: measure.timeSignature.beatValue,
        });

        vfVoice.setMode(VF.Voice.Mode.SOFT);
        vfVoice.addTickables(vfNotes);
        voices.push(vfVoice);

        // Check for tuplets in the voice
        let tupletBuffer = [];
        let tupletInfo = null;

        voice.elements.forEach((entry, i) => {
          const note = entry.note;
          if (note.duration?.tuplets) {
            if (!tupletInfo) {
              tupletInfo = note.duration.tuplets;
            }
            tupletBuffer.push(vfNotes[i]);

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

        // Draw connectors
        vfConnectors.forEach(c => c.setContext(ctx).draw());
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
