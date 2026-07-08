import React from 'react';
import PropTypes from 'prop-types';
import guitar from '../../../config/guitar';
import { styled } from '@mui/system';
import { getLabelDisplayFromSettings } from '../../../core/spreading/labelDisplay';

const FretboardContainer = styled('div')({
  background: 'rgba(255, 253, 245, 0.85)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  backdropFilter: 'blur(10px)',
  padding: '16px',
  borderRadius: '4px',
  '@media print': {
    width: '100%',
    height: '100%',
  },
});

const NeckLayout = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '16px',
  overflowX: 'auto',
  width: '100%',
});

const TunerCol = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flexShrink: 0,
});

const TunerSelect = styled('select')({
  width: '45px',
  height: '24px',
  margin: '2px 0',
  borderRadius: 4,
  border: '2px solid var(--brutal-ink)',
  textAlign: 'center',
  outline: 'none',
  fontSize: 10,
  fontWeight: 'bold',
  background: 'var(--brutal-paper)',
  boxShadow: '1px 1px 0 var(--brutal-ink)',
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
  '&::-ms-expand': {
    display: 'none',
  },
});

const SvgNeck = styled('svg')({
  border: '3px solid var(--brutal-ink)',
  background: '#e5c290', // Warm wood fretboard color
  borderRadius: '4px',
  boxShadow: '3px 3px 0 var(--brutal-ink)',
  flexShrink: 0,
  userSelect: 'none',
});

const normalizeIndex = (value) => {
  if (value === '' || value == null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeModeSlug = (value) =>
  String(value || '')
    .trim()
    .toLowerCase()
    .replace(/#/g, 'sharp')
    .replace(/[_\s]+/g, '-');

const getScaleNoteNames = (scaleName, keyIndex) => {
  const scale = guitar.scales[scaleName];
  if (!scale || keyIndex == null) return [];

  let currentNoteIndex = keyIndex;
  const notes = [guitar.notes.sharps[currentNoteIndex]];

  (scale.formula || []).forEach((step) => {
    currentNoteIndex = (currentNoteIndex + step) % 12;
    notes.push(guitar.notes.sharps[currentNoteIndex]);
  });

  return notes;
};

const getModeIndex = (fretboard, scaleData) => {
  const keyModeIndex = normalizeIndex(fretboard.keySettings?.mode);
  if (keyModeIndex != null && keyModeIndex >= 0) return keyModeIndex;

  const modeSetting = fretboard.modeSettings?.mode;
  const modeSettingIndex = normalizeIndex(modeSetting);
  if (modeSettingIndex != null && modeSettingIndex >= 0) return modeSettingIndex;

  if (!modeSetting || !Array.isArray(scaleData?.modes)) return -1;

  const targetSlug = normalizeModeSlug(modeSetting);
  return scaleData.modes.findIndex((mode) => normalizeModeSlug(mode.name) === targetSlug);
};

const getHighlightNotes = (fretboard) => {
  const choice = fretboard.generalSettings.choice;
  const keyIndex = normalizeIndex(fretboard.keySettings?.[choice]);
  const normalizedKeyIndex = keyIndex == null ? null : ((keyIndex % 12) + 12) % 12;
  const rootNoteName = normalizedKeyIndex == null ? null : guitar.notes.sharps[normalizedKeyIndex];

  if (choice !== 'scale' || !fretboard.scaleSettings.scale) {
    return { rootNoteName, modeRootNoteName: null };
  }

  const scaleData = guitar.scales[fretboard.scaleSettings.scale];
  const modeIndex = getModeIndex(fretboard, scaleData);
  const isDistinctMode = scaleData?.isModal && modeIndex > 0;

  if (!isDistinctMode) {
    return { rootNoteName, modeRootNoteName: null };
  }

  const scaleNotes =
    fretboard.scaleSettings.notes?.length
      ? fretboard.scaleSettings.notes
      : getScaleNoteNames(fretboard.scaleSettings.scale, normalizedKeyIndex);

  return {
    rootNoteName,
    modeRootNoteName: scaleNotes[modeIndex] || null,
  };
};

const getNoteStyle = (note, rootNoteName, modeRootNoteName) => {
  let backgroundColor = 'var(--brutal-blue)';
  const noteName = note.current || note.note;
  const isRoot = note.show && (noteName === rootNoteName || note.interval === '1');
  const isModeRoot = note.show && modeRootNoteName && noteName === modeRootNoteName;

  if (isRoot) backgroundColor = 'var(--brutal-orange)';
  if (isModeRoot) backgroundColor = 'var(--brutal-mint)';

  return { backgroundColor };
};

const getNoteLabel = (note, fallbackNote, generalSettings) => {
  const labelDisplay = getLabelDisplayFromSettings(generalSettings);

  if (labelDisplay === 'fingering') return note.finger || '';
  if (labelDisplay === 'intervals') return note.interval || '';

  return note.current || note.note || fallbackNote;
};

const FretboardDisplay = ({
  boards,
  handleFretboardSelect,
  onElementChange,
  onNoteClick,
  selectedFretboard
}) => {
  const calculateOctave = (stringIndex, fretIndex) => {
    const baseOctaves = selectedFretboard?.generalSettings?.baseOctaves || [];
    let octave = baseOctaves[stringIndex];
    const tuning = selectedFretboard?.generalSettings?.tuning || [];
    const notes = guitar.notes.sharps;

    let currentNoteIndex = tuning[stringIndex] % 12;

    for (let i = 0; i <= fretIndex; i++) {
      const note = notes[(currentNoteIndex + i) % 12];
      if (note === 'B') octave++;
    }
    return octave;
  };

  const buildDawEvent = (fretboard, stringIndex, fret) => {
    const displayedNoteIndex =
      (fretboard.generalSettings.tuning[stringIndex] + fret) % 12;

    const noteName = guitar.notes.sharps[displayedNoteIndex];
    const octave = calculateOctave(stringIndex, fret);

    // MIDI calc: tuning + fret + 12*octave
    const midi =
      (fretboard.generalSettings.tuning[stringIndex] + fret) +
      octave * 12;

    return {
      type: "note",
      raw: noteName + octave,
      pitch: {
        name: noteName,
        step: noteName[0],
        accidental: noteName.includes("#") ? "#" : "",
        octave,
        midi
      },
      guitar: {
        string: stringIndex + 1,
        fret,
        tuningIndex: fretboard.generalSettings.tuning[stringIndex]
      },
      velocity: 0.9,
      duration: 1
    };
  };

  const fretboardElements = boards.map((fretboard, fretboardIndex) => {
    const numStrings = Math.min(
      selectedFretboard.generalSettings.page.includes('references')
        ? 6
        : fretboard.generalSettings.nostrs,
      12
    );

    const numFrets = fretboard.generalSettings.nofrets;
    const isReference = (fretboard.generalSettings.page || '').includes('references') || (selectedFretboard.generalSettings.page || '').includes('references');
    
    // Layout Dimensions
    const stringSpacing = 28;
    const fretSpacing = 42;
    const paddingLeft = 40;
    const paddingRight = 20;
    const offsetTop = 15;
    
    const neckHeight = (numStrings - 1) * stringSpacing;
    const neckWidth = (numFrets - 1) * fretSpacing;
    
    const svgWidth = neckWidth + paddingLeft + paddingRight;
    const svgHeight = neckHeight + offsetTop + 30; // Extra room at bottom for fret labels

    const getFretX = (fretIndex) => {
      return paddingLeft + (fretIndex * fretSpacing);
    };

    const getStringY = (stringIndex) => {
      return offsetTop + (stringIndex * stringSpacing);
    };

    const fretNumbers = Array.from({ length: numFrets }, (_, i) => i);
    const stringIndexes = Array.from({ length: numStrings }, (_, i) => i);
    const { rootNoteName, modeRootNoteName } = getHighlightNotes(fretboard);

    return (
      <FretboardContainer
        key={`fretboard-${fretboardIndex}`}
        onFocus={() => handleFretboardSelect(fretboardIndex)}
        onClick={() => handleFretboardSelect(fretboardIndex)}
        style={{
          borderRadius: '4px',
          transition: 'border 0.2s ease',
          backgroundColor: selectedFretboard.id === fretboard.id ? 'rgba(255, 201, 0, 0.22)' : 'rgba(255, 253, 245, 0.82)'
        }}
      >
        <NeckLayout>
          {/* SVG Fretboard */}
          <SvgNeck width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
            {/* Nut line */}
            <line
              x1={paddingLeft}
              y1={offsetTop}
              x2={paddingLeft}
              y2={offsetTop + neckHeight}
              stroke="var(--brutal-ink)"
              strokeWidth="5"
            />

            {/* Fret Markers (dots) */}
            {fretNumbers.map((fret) => {
              // Standard fret positions: 3, 5, 7, 9, 15, 17, 19, 21
              if ([3, 5, 7, 9, 15, 17, 19, 21].includes(fret)) {
                const fretX = getFretX(fret);
                const prevFretX = getFretX(fret - 1);
                const dotX = prevFretX + (fretX - prevFretX) / 2;
                const dotY = offsetTop + neckHeight / 2;
                return (
                  <circle
                    key={`dot-${fret}`}
                    cx={dotX}
                    cy={dotY}
                    r="5"
                    fill="rgba(0, 0, 0, 0.2)"
                    stroke="var(--brutal-ink)"
                    strokeWidth="1.5"
                  />
                );
              }
              // Double dots at 12th & 24th frets
              if ([12, 24].includes(fret)) {
                const fretX = getFretX(fret);
                const prevFretX = getFretX(fret - 1);
                const dotX = prevFretX + (fretX - prevFretX) / 2;
                const dotY1 = offsetTop + neckHeight / 2 - 20;
                const dotY2 = offsetTop + neckHeight / 2 + 20;
                return (
                  <g key={`double-dot-${fret}`}>
                    <circle cx={dotX} cy={dotY1} r="5" fill="rgba(0, 0, 0, 0.2)" stroke="var(--brutal-ink)" strokeWidth="1.5" />
                    <circle cx={dotX} cy={dotY2} r="5" fill="rgba(0, 0, 0, 0.2)" stroke="var(--brutal-ink)" strokeWidth="1.5" />
                  </g>
                );
              }
              return null;
            })}

            {/* Vertical Frets */}
            {fretNumbers.slice(1).map((fret) => (
              <line
                key={`fret-${fret}`}
                x1={getFretX(fret)}
                y1={offsetTop}
                x2={getFretX(fret)}
                y2={offsetTop + neckHeight}
                stroke="var(--brutal-ink)"
                strokeWidth="2"
              />
            ))}

            {/* Horizontal Strings */}
            {stringIndexes.map((strIdx) => (
              <line
                key={`string-${strIdx}`}
                x1={paddingLeft - 10}
                y1={getStringY(strIdx)}
                x2={svgWidth - paddingRight}
                y2={getStringY(strIdx)}
                stroke="var(--brutal-ink)"
                strokeWidth={1.5 + strIdx * 0.5} // string gauge thickness
              />
            ))}

            {/* String note names on the left of the nut */}
            {stringIndexes.map((strIdx) => {
              const stringMidi = fretboard.generalSettings.tuning[strIdx];
              const stringNoteName = guitar.notes.sharps[stringMidi % 12];
              
              // Check if open note (fret 0) is active/shown
              const openNote = fretboard[fretboard.generalSettings.choice + 'Settings']?.fretboard?.[strIdx]?.[0] || {};
              const isOpenActive = openNote.show;

              const noteStyle = isOpenActive ? getNoteStyle(openNote, rootNoteName, modeRootNoteName) : null;

              return (
                <g key={`string-name-group-${strIdx}`}>
                  {isOpenActive && (
                    <circle
                      cx={18}
                      cy={getStringY(strIdx)}
                      r="10"
                      fill={noteStyle?.backgroundColor || 'var(--brutal-pink)'}
                      stroke="var(--brutal-ink)"
                      strokeWidth="2"
                    />
                  )}
                  <text
                    x={18}
                    y={getStringY(strIdx) + 3.5}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="900"
                    fill={isOpenActive ? '#000000' : 'rgba(0, 0, 0, 0.4)'}
                  >
                    {stringNoteName}
                  </text>
                </g>
              );
            })}

            {/* Fret numbers labels */}
            {fretNumbers.map((fret) => {
              const fretX = fret === 0 ? paddingLeft - 15 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
              return (
                <text
                  key={`num-${fret}`}
                  x={fretX}
                  y={offsetTop + neckHeight + 20}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="900"
                  fill="var(--brutal-ink)"
                >
                  {fret === 0 ? 'Open' : fret}
                </text>
              );
            })}

            {/* Interactive Note Circles */}
            {stringIndexes.map((strIdx) => (
              fretNumbers.map((fret) => {
                const note =
                  fretboard[fretboard.generalSettings.choice + 'Settings']?.fretboard?.[strIdx]?.[fret] || {};

                const displayedNoteIndex =
                  (fretboard.generalSettings.tuning[strIdx] + fret) % 12;
                const displayedNote = guitar.notes.sharps[displayedNoteIndex];

                const noteStyle = getNoteStyle(note, rootNoteName, modeRootNoteName);
                const noteLabel = getNoteLabel(note, displayedNote, fretboard.generalSettings);

                const fretX = fret === 0 ? paddingLeft - 10 : getFretX(fret - 1) + (getFretX(fret) - getFretX(fret - 1)) / 2;
                const stringY = getStringY(strIdx);

                return (
                  <g key={`note-${fretboardIndex}-${strIdx}-${fret}`}>
                    {/* Note Click hotspot */}
                    <circle
                      cx={fretX}
                      cy={stringY}
                      r="14"
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        const event = buildDawEvent(fretboard, strIdx, fret);
                        console.log("DAW event -> ", event);
                        onNoteClick(event);
                      }}
                    />

                    {note.show && fret > 0 && (
                      <g style={{ pointerEvents: 'none' }}>
                        <circle
                          cx={fretX}
                          cy={stringY}
                          r="10"
                          fill={noteStyle.backgroundColor}
                          stroke="var(--brutal-ink)"
                          strokeWidth="2.5"
                        />
                        <text
                          x={fretX}
                          y={stringY + 3.5}
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="900"
                          fill="#000000"
                        >
                          {noteLabel}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })
            ))}
          </SvgNeck>
        </NeckLayout>
      </FretboardContainer>
    );
  });

  return <div>{fretboardElements}</div>;
};

FretboardDisplay.propTypes = {
  boards: PropTypes.array,
  handleFretboardSelect: PropTypes.func.isRequired,
  onElementChange: PropTypes.func.isRequired,
  onNoteClick: PropTypes.func,
  selectedFretboard: PropTypes.object.isRequired,
};

export default FretboardDisplay;
