import React from "react";
import { Button, Box, Typography, Grid, Paper, Stack, Divider, IconButton, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import CloseIcon from "@mui/icons-material/Close";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Link from "next/link";
import guitar from "../../../config/guitar";
import { appendLabelDisplayToPath, normalizeLabelDisplay } from "../../../core/spreading/labelDisplay";

// ---------------------------------------------------------
// COMPONENT STYLES
// ---------------------------------------------------------

const ControlPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: '1 1 auto',
  minHeight: 0,
  display: 'flex',
  overflowX: 'hidden',
  overflowY: 'auto',
  overscrollBehaviorY: 'contain',
  flexDirection: 'column',
  gap: theme.spacing(2),
  zIndex: 20000,
  background: 'var(--brutal-blue)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 4,
  boxShadow: 'var(--brutal-shadow-small)',
  border: `3px solid var(--brutal-ink)`,
  background: 'rgba(255, 253, 245, 0.82)',
  backdropFilter: 'blur(10px)',
}));

const OptionButton = styled(Button, { shouldForwardProp: (prop) => prop !== 'selected' })(
  ({ theme, selected }) => ({
    borderRadius: 4,
    textTransform: "none",
    fontWeight: 900,
    margin: "4px",
    background: selected ? "var(--brutal-yellow)" : "var(--brutal-paper)",
    color: "var(--brutal-ink)",
    border: `3px solid var(--brutal-ink)`,
    boxShadow: selected ? "var(--brutal-shadow-small)" : "none",
    "&:hover": {
      background: selected ? "var(--brutal-pink)" : "var(--brutal-yellow)",
      borderColor: "var(--brutal-ink)",
      boxShadow: "var(--brutal-shadow-small)",
    },
    transition: 'all 0.15s ease-in-out',
    minWidth: '60px',
    fontSize: '0.75rem',
    letterSpacing: 0,
  })
);

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 900,
  marginBottom: theme.spacing(1.5),
  color: theme.palette.text.primary,
  textTransform: 'uppercase',
  display: 'block',
  letterSpacing: 0,
}));

const StepLabel = styled(Typography)(({ theme }) => ({
  variant: "subtitle2",
  color: theme.palette.text.secondary,
  fontSize: '0.65rem',
  fontWeight: 900,
  textTransform: 'uppercase',
  marginBottom: theme.spacing(1),
  letterSpacing: 0,
}));

const slugSharp = (s) => (s || "").replace("#", "sharp");

const FretboardControls = ({
  choice,
  handleChoiceChange,
  selectedKey,
  onElementChange,
  scaleModes,
  arppegiosNames,
  onCleanFretboard,
  selectedMode,
  selectedScale,
  selectedChord,
  selectedArppegio,
  selectedShape,
  saveProgression,
  playSelectedNotes,
  progression,
  createNewBoardDisplay,
  boards,
  selectedFretboardIndex,
  setSelectedFretboardIndex,
  selectedLabelDisplay
}) => {
  const theme = useTheme();
  const keysSharps = guitar.notes.sharps;
  const labelDisplay = normalizeLabelDisplay(selectedLabelDisplay);

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  const resetAll = () => {
    onCleanFretboard();
    onElementChange(-1, "key");
    onElementChange(-1, "scale");
    onElementChange(-1, "mode");
    onElementChange("", "chord");
    onElementChange(-1, "arppegio");
    onElementChange("", "shape");
  };

  const buildSpreadingPath = () => {
    const keyName = keysSharps[selectedKey];
    if (!keyName) return null;

    const keySlug = slugSharp(keyName);

    if (choice === "chord") {
      if (!selectedChord) return null;
      return appendLabelDisplayToPath(`/spreading/chords/${keySlug}/${slugSharp(selectedChord)}`, labelDisplay);
    }

    if (choice === "arppegio") {
      if (!selectedArppegio) return null;
      return appendLabelDisplayToPath(`/spreading/arppegios/${keySlug}/${slugSharp(selectedArppegio)}`, labelDisplay);
    }

    if (choice === "scale") {
      if (!selectedScale) return null;

      const scaleObj = guitar.scales[selectedScale];

      if (scaleObj?.isModal) {
        if (selectedMode === "" || selectedMode == null) return null;
        const modeName = scaleModes[Number(selectedMode)]?.name;
        if (!modeName) return null;
        const modeSlug = modeName.toLowerCase().replace(/\s+/g, "-");
        return appendLabelDisplayToPath(`/spreading/scales/${keySlug}/${selectedScale}/modal/${modeSlug}`, labelDisplay);
      }

      return appendLabelDisplayToPath(`/spreading/scales/${keySlug}/${selectedScale}/single`, labelDisplay);
    }

    return null;
  };

  const spreadingPath = buildSpreadingPath();
  const canOpenSpreading = !!spreadingPath;

  return (
    <ControlPanel>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">Controls</Typography>
        <IconButton onClick={resetAll} size="small" color="primary" title="Reset All">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>


      {/* BOARD SWITCHER */}
      {boards && boards.length > 1 && (
        <StyledPaper elevation={0}>
          <SectionTitle>Active Board</SectionTitle>
          <Grid container spacing={1}>
            {boards.map((b, i) => (
              <Grid item xs={3} key={b.id}>
                <OptionButton
                  selected={selectedFretboardIndex === i}
                  onClick={() => setSelectedFretboardIndex(i)}
                  sx={{ justifyContent: 'center', minWidth: 'auto', px: 1 }}
                >
                  {i + 1}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* CATEGORY SELECTION - STEP 1 */}
      <StyledPaper elevation={0}>
        <StepLabel>Step 1: Category</StepLabel>
        <Stack direction="row" spacing={0} flexWrap="wrap">
          {['scale', 'chord', 'arppegio'].map((cat) => (
            <OptionButton
              key={cat}
              selected={choice === cat}
              onClick={() => handleChoiceChange(cat)}
              sx={{ justifyContent: 'center' }}
            >
              {capitalize(cat === 'arppegio' ? 'Arpeggios' : cat + 's')}
            </OptionButton>
          ))}
        </Stack>
      </StyledPaper>

      <StyledPaper elevation={0}>
        <SectionTitle>Fretboard Labels</SectionTitle>
        <ToggleButtonGroup
          exclusive
          fullWidth
          size="small"
          value={labelDisplay}
          onChange={(_, nextValue) => {
            if (nextValue) onElementChange(nextValue, "labelDisplay");
          }}
          aria-label="Fretboard label display"
        >
          <ToggleButton value="notes" aria-label="Show note names">
            Notes
          </ToggleButton>
          <ToggleButton value="fingering" aria-label="Show fingering">
            Doigtage
          </ToggleButton>
          <ToggleButton value="intervals" aria-label="Show intervals">
            Intervals
          </ToggleButton>
        </ToggleButtonGroup>
      </StyledPaper>

      {/* KEY SELECTION - STEP 2 */}
      {choice && (
        <StyledPaper elevation={0}>
          <StepLabel>Step 2: Key</StepLabel>
          <Grid container spacing={0.5}>
            {keysSharps.map((k, index) => (
              <Grid item xs={3} key={index}>
                <OptionButton
                  selected={selectedKey === index}
                  onClick={() => onElementChange(index, "key")}
                  sx={{ justifyContent: 'center', minWidth: 'auto', width: '100%', px: 0 }}
                >
                  {k}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* TYPE SELECTION - STEP 3 */}
      {(choice && selectedKey !== "" && selectedKey !== -1) && (
        <StyledPaper elevation={0}>
          <StepLabel>Step 3: {choice === 'arppegio' ? 'Arpeggio' : capitalize(choice)} Type</StepLabel>
          <Grid container spacing={0.5}>
            {choice === "scale" && Object.keys(guitar.scales).map((scaleName, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedScale === scaleName}
                  onClick={() => onElementChange(scaleName, "scale")}
                  sx={{ width: '100%' }}
                >
                  {capitalize(scaleName)}
                </OptionButton>
              </Grid>
            ))}

            {choice === "chord" && Object.keys(guitar.arppegios).map((ch, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedChord === ch}
                  onClick={() => onElementChange(ch, "chord")}
                  sx={{ width: '100%' }}
                >
                  {ch}
                </OptionButton>
              </Grid>
            ))}

            {choice === "arppegio" && arppegiosNames.map((arp, i) => (
              <Grid item xs={6} key={i}>
                <OptionButton
                  selected={selectedArppegio === arp}
                  onClick={() => onElementChange(arp, "arppegio")}
                  sx={{ width: '100%' }}
                >
                  {arp}
                </OptionButton>
              </Grid>
            ))}
          </Grid>
        </StyledPaper>
      )}

      {/* MODES - STEP 4 */}
      {choice === "scale" &&
        selectedScale &&
        guitar.scales[selectedScale]?.isModal &&
        scaleModes.length > 0 && (
          <StyledPaper elevation={0}>
            <StepLabel>Step 4: Modes</StepLabel>
            <Grid container spacing={0.5}>
              {scaleModes.map((m, i) => (
                <Grid item xs={6} key={i}>
                  <OptionButton
                    selected={Number(selectedMode) === i}
                    onClick={() => onElementChange(i, "mode")}
                    sx={{ width: '100%' }}
                  >
                    {m.name}
                  </OptionButton>
                </Grid>
              ))}
            </Grid>
          </StyledPaper>
        )}

      {/* SHAPE SELECTION - STEP 5/4 */}
      <StyledPaper elevation={0}>
        <StepLabel>Step {choice === 'scale' && selectedScale && guitar.scales[selectedScale]?.isModal ? '5' : '4'}: Shape</StepLabel>
        <Grid container spacing={0.5}>
          {guitar.shapes.names.map((shape, i) => (
            <Grid item xs={4} key={i}>
              <OptionButton
                selected={selectedShape === shape}
                onClick={() => onElementChange(shape, "shape")}
                sx={{ justifyContent: 'center', width: '100%' }}
              >
                {shape}
              </OptionButton>
            </Grid>
          ))}
        </Grid>
      </StyledPaper>

      {/* ACTIONS */}
      <Box sx={{ mt: 'auto', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Divider sx={{ my: 1 }} />

        <Grid container spacing={1}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<CleaningServicesIcon />}
              onClick={onCleanFretboard}
              sx={{ borderRadius: 1 }}
            >
              Clean
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<AddCircleOutlineIcon />}
              onClick={createNewBoardDisplay}
              sx={{ borderRadius: 1, color: 'var(--brutal-ink)' }}
            >
              Add Fretboard
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PlayCircleOutlineIcon />}
              onClick={playSelectedNotes}
              sx={{ borderRadius: 1 }}
            >
              Play Sound
            </Button>
          </Grid>

          <Grid item xs={12}>
            {canOpenSpreading ? (
              <Link
                href={spreadingPath}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none", width: '100%' }}
              >
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  startIcon={<LibraryBooksIcon />}
                  sx={{ borderRadius: 1 }}
                >
                  Read Theory
                </Button>
              </Link>
            ) : (
              <Button
                fullWidth
                variant="outlined"
                color="inherit"
                disabled
                startIcon={<LibraryBooksIcon />}
                sx={{ borderRadius: 1 }}
              >
                Read Theory
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>
    </ControlPanel>
  );
};

FretboardControls.propTypes = {
  handleChoiceChange: PropTypes.func.isRequired,
  selectedKey: PropTypes.any,
  scaleModes: PropTypes.array.isRequired,
  arppegiosNames: PropTypes.array.isRequired,
  choice: PropTypes.string.isRequired,
  onCleanFretboard: PropTypes.func.isRequired,
  selectedMode: PropTypes.any,
  selectedScale: PropTypes.string,
  selectedChord: PropTypes.string,
  selectedShape: PropTypes.string,
  selectedArppegio: PropTypes.string,
  saveProgression: PropTypes.func.isRequired,
  progression: PropTypes.array,
  onElementChange: PropTypes.func.isRequired,
  playSelectedNotes: PropTypes.func.isRequired,
  createNewBoardDisplay: PropTypes.func.isRequired,
  boards: PropTypes.array,
  selectedFretboardIndex: PropTypes.number,
  setSelectedFretboardIndex: PropTypes.func,
  selectedLabelDisplay: PropTypes.string,
};

export default FretboardControls;
