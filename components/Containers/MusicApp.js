// ============================================================================
// MusicApp.jsx - FINAL VERSION (Hydration-Safe)
// ============================================================================

import React, { useEffect, useCallback, useState, useMemo, useRef } from "react";
import { IconButton, Grid, Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/system";
import Head from 'next/head';

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { connect, useDispatch } from "react-redux";
import {
  addFretboard,
  updateStateProperty,
  setProgression,
  setProgressionKey,
} from "../../redux/actions";

import withFretboardState from "../../hocs/withFretboardState";

import FretboardDisplay from "../Pages/Fretboard/FretboardDisplay";
import FretboardControls from "../Pages/Fretboard/FretboardControls";
import fretboardTheme from "../../ui/fretboardTheme";
import { ThemeProvider } from "@mui/material/styles";
import CircleOfFifths from "../Pages/CircleOfFifths/CircleOfFifths";
import Stats from "../Pages/Stats/Stats";

// Import visualizers
import PianoVisualizer from "../Play/PianoVisualizer";
import UkuleleVisualizer from "../Play/UkuleleVisualizer";
import BassVisualizer from "../Play/BassVisualizer";
import ViolinVisualizer from "../Play/ViolinVisualizer";
import DoubleBassVisualizer from "../Play/DoubleBassVisualizer";
import TrumpetVisualizer from "../Play/TrumpetVisualizer";
import SaxophoneVisualizer from "../Play/SaxophoneVisualizer";
import GuitarVisualizer from "../Play/GuitarVisualizer";

import {
  GuitarIcon,
  PianoIcon,
  UkuleleIcon,
  ViolinIcon,
  BassIcon,
  DoubleBassIcon,
  TrumpetIcon,
  SaxophoneIcon
} from "../Graphics/BrutalistIcons";

import { useScore } from "@/core/editor/ScoreContext";
import guitar from "../../config/guitar";
import { DEFAULT_KEYWORDS } from "../../data/seo";
import { normalizeLabelDisplay } from "../../core/spreading/labelDisplay";
import { getAbsoluteNotes } from "../../core/music/musicTheory";
import { getSoundfontInstrument } from "../../core/audio/AudioService";

// ============================================================================
// CONSTANTS
// ============================================================================
const SIDEBAR_CLOSED = 40;
const SIDEBAR_OPEN = 600;
const HEADER_HEIGHT = 65;
const HEADER_HEIGHT_MOBILE = 57;

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

// Root wrapper
const AppWrapper = styled("div")(({ board }) => ({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  background: board === "circle" ? "transparent" : "var(--brutal-bg)",

  ...(board === "articles" && {
    flexDirection: "row",
    border: "4px solid var(--brutal-ink)",
    boxShadow: "var(--brutal-shadow)",
    borderRadius: 4,
    overflow: "hidden",
    background: "rgba(255, 253, 245, 0.86)",
    "@media (max-width:1200px)": {
      flexDirection: "column",
    },
    "@media (max-width:600px)": {
      border: "none",
      boxShadow: "none",
      borderRadius: 0,
    },
  }),
}));

// Main content
const MainContent = styled("div")(({ drawerOpen, board }) => ({
  position: "relative",
  flex: 1,
  margin: 0,
  padding: 0,
  transition: "padding-right 0.3s ease",

  ...(drawerOpen && board !== "articles" && {
    "@media (min-width:1200px)": {
      paddingRight: SIDEBAR_OPEN,
    },
  }),

  ...(board === "articles" && {
    padding: "24px",
    boxSizing: "border-box",
    transition: "none",
    "@media (max-width:1200px)": {
      padding: "16px",
    },
    "@media (max-width:600px)": {
      padding: "0px",
    },
  }),
}));

const SelectorContainer = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  justifyContent: 'center',
  padding: '16px',
  marginBottom: '20px',
  background: 'var(--brutal-mint)',
  border: '4px solid var(--brutal-ink)',
  boxShadow: 'var(--brutal-shadow)',
  borderRadius: 4,
});

const InstrumentButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ active }) => ({
  borderRadius: 4,
  padding: '8px 16px',
  background: active ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
  color: 'var(--brutal-ink)',
  border: '3px solid var(--brutal-ink)',
  boxShadow: active ? 'var(--brutal-shadow-small)' : '2px 2px 0 var(--brutal-ink)',
  fontWeight: 900,
  fontSize: '14px',
  textTransform: 'none',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: active ? 'var(--brutal-pink)' : 'var(--brutal-yellow)',
    transform: 'translate(2px, 2px)',
    boxShadow: 'none',
  },
}));

const renderInstrumentIcon = (Icon, size = 18) => {
  return (
    <Box
      component="span"
      sx={{
        width: size,
        height: size,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        '& svg': { width: `${size}px !important`, height: `${size}px !important`, margin: '0 !important', display: 'inline-block !important' },
      }}
    >
      <Icon size={size} />
    </Box>
  );
};

// Main Inner
const MainInner = styled("div")({
  margin: 0,
  "@media (max-width:1200px)": { padding: "0px 15px" },
  "@media (max-width:600px)": { padding: "0px" },
  "@media (min-width:1200px)": { padding: "0px 180px" },
  boxSizing: "border-box",
});

// Desktop drawer
const SideDrawer = styled("div")(({ open, board }) => ({
  position: "fixed",
  top: HEADER_HEIGHT,
  right: 0,
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  width: open ? SIDEBAR_OPEN : SIDEBAR_CLOSED,
  minWidth: open ? SIDEBAR_OPEN : SIDEBAR_CLOSED,
  backgroundColor: "var(--brutal-blue)",
  borderLeft: "4px solid var(--brutal-ink)",
  boxShadow: "-6px 0 0 var(--brutal-ink)",
  zIndex: 2000,
  transition: "all 0.3s ease",
  display: "flex",
  flexDirection: "column",

  "@media (max-width:1200px)": { display: "none" },

  ...(board === "articles" && {
    position: "relative",
    top: 0,
    height: "var(--article-main-height, 720px)",
    maxHeight: "var(--article-main-height, 720px)",
    width: open ? "420px" : "80px",
    minWidth: open ? "420px" : "80px",
    boxShadow: "none",
    zIndex: 10,
    overflow: "hidden",
    "@media (max-width:1200px)": {
      display: "flex",
      width: "100%",
      minWidth: "100%",
      height: open ? "min(70dvh, var(--article-main-height, 720px))" : "60px",
      maxHeight: open ? "70dvh" : "60px",
      border: "4px solid var(--brutal-ink)",
      borderRadius: "4px",
      boxShadow: "var(--brutal-shadow-small)",
      boxSizing: "border-box",
    },
  }),
}));

const DrawerHeader = styled("div")(({ open, board }) => ({
  height: open ? 25 : 45,
  borderBottom: "4px solid var(--brutal-ink)",
  display: "flex",
  padding: open ? 10 : 0,
  alignItems: open ? "flex-start" : "center",
  justifyContent: open ? "flex-start" : "center",

  ...(board === "articles" && {
    height: "60px",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 10px",
    borderBottom: open ? "4px solid var(--brutal-ink)" : "none",
    "@media (max-width:1200px)": {
      height: "60px",
    },
  }),
}));

const DrawerToggleDesktop = styled(IconButton)({
  width: 24,
  height: 24,
  border: "3px solid var(--brutal-ink)",
  borderRadius: 4,
  background: "var(--brutal-yellow)",
  padding: 6,
  boxShadow: "var(--brutal-shadow-small)",
  "&:hover": { background: "var(--brutal-pink)" },
});

const DrawerContent = styled("div")(({ open, board }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  minHeight: 0,
  width: "100%",
  padding: open ? 24 : 0,
  opacity: open ? 1 : 0,
  pointerEvents: open ? "auto" : "none",
  transition: "opacity 0.2s ease",
  overflowY: open ? "auto" : "hidden",
  boxSizing: "border-box",

  ...(board === "articles" && {
    height: open ? "calc(100% - 60px)" : 0,
    maxHeight: open ? "calc(100% - 60px)" : 0,
    WebkitOverflowScrolling: "touch",
    overscrollBehaviorY: "contain",
  }),
}));

// Mobile drawer
const MobileDrawer = styled("div")(({ open }) => ({
  position: "fixed",
  top: HEADER_HEIGHT_MOBILE,
  left: 0,
  right: 0,
  width: "100%",
  maxWidth: "100%",
  margin: 0,
  padding: 0,
  transform: "translateZ(0)",
  WebkitTransform: "translateZ(0)",
  WebkitOverflowScrolling: "touch",
  backgroundColor: "var(--brutal-mint)",
  borderTop: "4px solid var(--brutal-ink)",
  borderBottom: "4px solid var(--brutal-ink)",
  zIndex: 3000,
  overflowX: "hidden",
  overflowY: open ? "auto" : "hidden",
  maxHeight: open ? "100%" : SIDEBAR_CLOSED,
  transition: "max-height 0.35s ease",

  "@media (min-width:1200px)": { display: "none" },
}));

const MobileDrawerHeader = styled("div")({
  height: 40,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  borderBottom: "4px solid var(--brutal-ink)",
  paddingRight: 20,
});

const MobileDrawerToggle = styled(IconButton)({
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "3px solid var(--brutal-ink)",
  background: "var(--brutal-yellow)",
  boxShadow: "var(--brutal-shadow-small)",
});

const MobileDrawerContent = styled("div")({
  width: "100%",
  maxWidth: "100%",
  padding: "0px 40px 50px 30px",
  boxSizing: "border-box",
  overflowX: "hidden",
});

// **HYDRATION-SAFE SCROLL WRAPPER**
const FretboardScroll = styled("div")({
  width: "100%",
  maxWidth: "100%",
  overflowX: "auto",
  WebkitOverflowScrolling: "touch",
  "& > *": {
    maxWidth: "none !important",
  },
});

// Outer fretboard container
const FretboardContainer = styled("div")({
  width: "100%",
  maxWidth: "100%",
  marginBottom: 20,
  padding: "16px",
  background: "rgba(255, 253, 245, 0.78)",
  border: "4px solid var(--brutal-ink)",
  boxShadow: "var(--brutal-shadow)",
  backdropFilter: "blur(10px)",
});

// Root content wrapper
const Root = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
});

// ============================================================================
// COMPONENT
// ============================================================================
const MusicApp = (props) => {
  const dispatch = useDispatch();
  const articleMainRef = useRef(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [articleMainHeight, setArticleMainHeight] = useState(null);

  const {
    board,
    boards,
    selectedFretboard,
    selectedFretboardIndex,
    handleFretboardSelect,
    handleChoiceChange,
    createNewBoardDisplay,
    cleanFretboard,
    onElementChange,
    keyIndex,
    scale,
    modeIndex,
    shape,
    quality,
    display,
    labelDisplay,
    updateBoards,
    showFretboardControls,
    showFretboard,
    showCircleOfFifths,
    showStats,
    leftDrawerOpen,
    leftDrawerWidth,
    // SEO props
    title,
    description,
    keywords,
  } = props;

  const scoreContext = useScore();
  const addNoteFromFretboard = scoreContext?.addNoteFromFretboard;

  // UPDATE LOGIC
  const updateBoardsCallback = useCallback(() => {
    if (!selectedFretboard?.id) return;

    if (!isNaN(keyIndex))
      dispatch(updateBoards(selectedFretboard.id, "keySettings." + display, keyIndex));

    if (!isNaN(modeIndex))
      dispatch(updateBoards(selectedFretboard.id, "keySettings.mode", modeIndex));

    if (display === "scale") {
      dispatch(updateBoards(selectedFretboard.id, "generalSettings.choice", "scale"));
      dispatch(updateBoards(selectedFretboard.id, "scaleSettings.scale", scale));

      if (guitar.scales[scale]?.isModal) {
        dispatch(updateBoards(selectedFretboard.id, "modeSettings.mode", modeIndex));
        if (shape !== "") {
          dispatch(updateBoards(selectedFretboard.id, "modeSettings.shape", shape));
          dispatch(updateBoards(selectedFretboard.id, "scaleSettings.shape", shape));
        }
      } else {
        dispatch(updateBoards(selectedFretboard.id, "scaleSettings.shape", shape));
      }
    }

    if (display === "arppegio") {
      dispatch(updateBoards(selectedFretboard.id, "generalSettings.choice", "arppegio"));
      dispatch(updateBoards(selectedFretboard.id, "arppegioSettings.arppegio", quality));
      if (shape !== "") dispatch(updateBoards(selectedFretboard.id, "arppegioSettings.shape", shape));
    }

    if (display === "chord") {
      dispatch(updateBoards(selectedFretboard.id, "generalSettings.choice", "chord"));
      dispatch(updateBoards(selectedFretboard.id, "chordSettings.chord", quality));
      if (shape !== "") dispatch(updateBoards(selectedFretboard.id, "chordSettings.shape", shape));
    }

    if (labelDisplay) {
      const normalizedLabelDisplay = normalizeLabelDisplay(labelDisplay);
      dispatch(updateBoards(selectedFretboard.id, "generalSettings.labelDisplay", normalizedLabelDisplay));
      dispatch(updateBoards(selectedFretboard.id, "generalSettings.notesDisplay", normalizedLabelDisplay !== "intervals"));
    }
  }, [
    dispatch, display, selectedFretboard, keyIndex, modeIndex,
    scale, shape, quality, labelDisplay, updateBoards
  ]);

  useEffect(() => {
    updateBoardsCallback();
  }, [updateBoardsCallback]);

  useEffect(() => {
    if (board !== "articles" || !articleMainRef.current) return undefined;

    const updateArticleMainHeight = () => {
      const nextHeight = Math.ceil(articleMainRef.current.getBoundingClientRect().height);
      setArticleMainHeight((currentHeight) => (
        currentHeight === nextHeight ? currentHeight : nextHeight
      ));
    };

    updateArticleMainHeight();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateArticleMainHeight);
      return () => window.removeEventListener("resize", updateArticleMainHeight);
    }

    const observer = new ResizeObserver(updateArticleMainHeight);
    observer.observe(articleMainRef.current);
    window.addEventListener("resize", updateArticleMainHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateArticleMainHeight);
    };
  }, [board]);

  const [instrument, setInstrument] = useState('guitar');
  const [player, setPlayer] = useState(null);
  const [isLoadingSound, setIsLoadingSound] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoadingSound(true);
    const soundMap = {
      piano: 'acoustic_grand_piano',
      bass: 'acoustic_bass',
      'double-bass': 'acoustic_bass',
      violin: 'violin',
      trumpet: 'trumpet',
      saxophone: 'alto_sax',
    };
    const soundName = soundMap[instrument] || 'acoustic_guitar_nylon';
    getSoundfontInstrument(soundName)
      .then(p => { if (active) { setPlayer(p); setIsLoadingSound(false); } })
      .catch(() => { if (active) setIsLoadingSound(false); });
    return () => { active = false; };
  }, [instrument]);

  const activeNotes = useMemo(() => {
    if (!selectedFretboard) return [];
    const choice = selectedFretboard.generalSettings.choice;
    const keyIndex = selectedFretboard.keySettings[choice] ?? 0;
    
    let subType = '';
    if (choice === 'scale') {
      subType = selectedFretboard.scaleSettings.scale || 'major';
    } else if (choice === 'chord') {
      subType = selectedFretboard.chordSettings.chord || 'M';
    } else if (choice === 'arppegio') {
      subType = selectedFretboard.arppegioSettings.arppegio || 'M';
    }

    const cat = choice === 'arppegio' ? 'arppegio' : choice;
    const mi = choice === 'scale' ? (selectedFretboard.modeSettings.mode ?? 0) : 0;
    
    return getAbsoluteNotes(cat, subType, keyIndex, mi);
  }, [selectedFretboard]);

  const activeChoice = selectedFretboard?.generalSettings?.choice || 'scale';
  const subType = activeChoice === 'scale' 
    ? (selectedFretboard?.scaleSettings?.scale || 'major')
    : (activeChoice === 'chord' ? (selectedFretboard?.chordSettings?.chord || 'M') : (selectedFretboard?.arppegioSettings?.arppegio || 'M'));
  const modeIndexVal = selectedFretboard?.modeSettings?.mode ?? 0;
  const keyIndexVal = selectedFretboard?.keySettings?.[activeChoice] ?? 0;

  const modeRootNote = activeChoice === 'scale' && guitar.scales[subType]?.isModal && Number(modeIndexVal) > 0 ? activeNotes[0] : null;

  const playNote = (label) => {
    if (player) player.play(label);
  };

  const displayMode = selectedFretboard?.generalSettings?.labelDisplay || 'notes';

  const INSTRUMENT_STANDARD_TUNINGS = {
    guitar: { midi: [64, 59, 55, 50, 45, 40], names: ['E', 'B', 'G', 'D', 'A', 'E'] },
    bass: { midi: [28, 33, 38, 43], names: ['E', 'A', 'D', 'G'] },
    ukulele: { midi: [67, 60, 64, 69], names: ['G', 'C', 'E', 'A'] },
    violin: { midi: [55, 62, 69, 76], names: ['G', 'D', 'A', 'E'] },
    'double-bass': { midi: [28, 33, 38, 43], names: ['E', 'A', 'D', 'G'] }
  };
  
  const stdTuning = INSTRUMENT_STANDARD_TUNINGS[instrument];

  const renderVisualizer = () => {
    const visualizerProps = {
      activeNotes,
      rootNote: keyIndexVal,
      modeRootNote,
      onNoteClick: playNote,
      displayMode,
      tuning: stdTuning ? stdTuning.midi : undefined,
      stringNames: stdTuning ? stdTuning.names : undefined,
      showCagedShapes: board === 'articles' ? false : ['guitar', 'bass', 'ukulele'].includes(instrument),
      shapeType: activeChoice === 'arppegio' ? 'arpeggio' : activeChoice,
      subType,
      keyIndex: keyIndexVal,
      commonName: `${guitar.notes.sharps[keyIndexVal]} ${subType}`
    };

    switch (instrument) {
      case 'piano':       return <PianoVisualizer {...visualizerProps} />;
      case 'ukulele':     return <UkuleleVisualizer {...visualizerProps} />;
      case 'bass':        return <BassVisualizer {...visualizerProps} />;
      case 'violin':      return <ViolinVisualizer {...visualizerProps} />;
      case 'double-bass': return <DoubleBassVisualizer {...visualizerProps} />;
      case 'trumpet':     return <TrumpetVisualizer {...visualizerProps} />;
      case 'saxophone':   return <SaxophoneVisualizer {...visualizerProps} />;
      case 'guitar':
      default:            return <GuitarVisualizer {...visualizerProps} />;
    }
  };

  if (!selectedFretboard) return <div>Loading...</div>;

  return (
    <AppWrapper
      board={board}
      style={articleMainHeight ? { "--article-main-height": `${articleMainHeight}px` } : undefined}
    >

      {/* MOBILE DRAWER */}
      {showFretboardControls && board !== "articles" && (
        <MobileDrawer
          open={mobileDrawerOpen}
          sx={{
            left: leftDrawerOpen ? leftDrawerWidth : 0,
            width: leftDrawerOpen
              ? `calc(100% - ${leftDrawerWidth}px)`
              : "100%",
          }}
        >
          <MobileDrawerHeader>
            <MobileDrawerToggle onClick={() => setMobileDrawerOpen(v => !v)}>
              {mobileDrawerOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </MobileDrawerToggle>
          </MobileDrawerHeader>

          <MobileDrawerContent>
            <ThemeProvider theme={fretboardTheme}>
              <FretboardControls
                createNewBoardDisplay={createNewBoardDisplay}
                handleChoiceChange={handleChoiceChange}
                onCleanFretboard={cleanFretboard}
                selectedKey={selectedFretboard.keySettings[selectedFretboard.generalSettings.choice]}
                selectedScale={selectedFretboard.scaleSettings.scale}
                selectedChord={selectedFretboard.chordSettings.chord}
                selectedShape={
                  selectedFretboard[selectedFretboard.generalSettings.choice + "Settings"].shape
                }
                selectedMode={selectedFretboard.modeSettings.mode}
                selectedLabelDisplay={selectedFretboard.generalSettings.labelDisplay}
                onElementChange={onElementChange}
                scaleModes={
                  selectedFretboard.scaleSettings.scale && guitar.scales[selectedFretboard.scaleSettings.scale]
                    ? guitar.scales[selectedFretboard.scaleSettings.scale].modes || []
                    : []
                }
                arppegiosNames={Object.keys(guitar.arppegios)}
                choice={selectedFretboard.generalSettings.choice}
              />
            </ThemeProvider>
          </MobileDrawerContent>
        </MobileDrawer>
      )}

      {/* MAIN CONTENT */}
      <MainContent ref={articleMainRef} drawerOpen={drawerOpen} board={board}>
        <MainInner sx={{
          "@media (min-width:1200px)": { padding: ['compose', 'articles'].includes(board) ? '10px' : "0px 180px" }
        }}>
          <Root>
            {title && (
              <Head>
                <title>{title}</title>
                <meta
                  name="keywords"
                  content={keywords || DEFAULT_KEYWORDS}
                />
                <meta
                  name="description"
                  content={description}
                />
              </Head>
            )}

            {showFretboard && (
              <Box sx={{ mb: 3 }}>
                <SelectorContainer>
                  {[
                    { id: 'guitar', label: 'Guitar', Icon: GuitarIcon },
                    { id: 'piano', label: 'Piano', Icon: PianoIcon },
                    { id: 'ukulele', label: 'Ukulele', Icon: UkuleleIcon },
                    { id: 'violin', label: 'Violin', Icon: ViolinIcon },
                    { id: 'bass', label: 'Bass', Icon: BassIcon },
                    { id: 'double-bass', label: 'Double Bass', Icon: DoubleBassIcon },
                    { id: 'trumpet', label: 'Trumpet', Icon: TrumpetIcon },
                    { id: 'saxophone', label: 'Saxophone', Icon: SaxophoneIcon },
                  ].map((inst) => (
                    <InstrumentButton
                      key={inst.id}
                      active={instrument === inst.id ? 1 : 0}
                      onClick={() => setInstrument(inst.id)}
                      disabled={isLoadingSound}
                      startIcon={renderInstrumentIcon(inst.Icon, 18)}
                    >
                      {inst.label}
                    </InstrumentButton>
                  ))}
                </SelectorContainer>

                {isLoadingSound && (
                  <Box sx={{ textAlign: 'center', mb: 2, fontWeight: 'bold', color: 'var(--brutal-ink)' }}>
                    Loading instrument sounds...
                  </Box>
                )}

                { (board === 'articles' || instrument !== 'guitar') ? (
                  <Box sx={{
                    background: 'rgba(255, 253, 245, 0.85)',
                    border: board === 'articles' ? 'none' : '4px solid var(--brutal-ink)',
                    boxShadow: board === 'articles' ? 'none' : 'var(--brutal-shadow)',
                    padding: board === 'articles' ? 0 : '24px',
                    borderRadius: board === 'articles' ? 0 : '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflowX: 'auto',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}>
                    {renderVisualizer()}
                  </Box>
                ) : (
                  <FretboardContainer>
                    <FretboardScroll>
                      <ThemeProvider theme={fretboardTheme}>
                        <FretboardDisplay
                          selectedFretboard={selectedFretboard}
                          boards={boards}
                          handleFretboardSelect={(i) => {
                            handleFretboardSelect(i);
                          }}
                          onElementChange={onElementChange}
                          onNoteClick={(noteObj) => {
                            if (selectedFretboard.generalSettings.page === "compose") {
                              console.log(noteObj);
                              if (addNoteFromFretboard) addNoteFromFretboard(noteObj);
                            }
                          }}
                        />
                      </ThemeProvider>
                    </FretboardScroll>
                  </FretboardContainer>
                )}
              </Box>
            )}

            {(showCircleOfFifths || showStats) && (
              <Grid
                container
                spacing={4}
                sx={{
                  mt: 2,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                {showCircleOfFifths && (
                  <Grid
                    item
                    xs={12}
                    md={showStats ? 5 : 12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{
                      width: '100%',
                      maxWidth: '380px',
                      aspectRatio: '1 / 1',
                      margin: '0 auto'
                    }}>
                      <CircleOfFifths
                        tone={
                          (selectedFretboard.keySettings && selectedFretboard.keySettings[selectedFretboard.generalSettings.choice] !== undefined)
                            ? guitar.circleOfFifths[(selectedFretboard.keySettings[selectedFretboard.generalSettings.choice] * 7) % 12]?.key || "C"
                            : "C"
                        }
                        quality={
                          selectedFretboard.generalSettings.choice === "scale"
                            ? (selectedFretboard.scaleSettings?.scale?.toLowerCase().includes('minor') || selectedFretboard.scaleSettings?.scale?.toLowerCase().includes('aeolian') ? "Minor" : "Major")
                            : (selectedFretboard.chordSettings?.chord?.toLowerCase().includes('min') || selectedFretboard.chordSettings?.chord?.toLowerCase().includes('m7') ? "Minor" : "Major")
                        }
                        onElementChange={onElementChange}
                      />
                    </Box>
                  </Grid>
                )}

                {showStats && (
                  <Grid
                    item
                    xs={12}
                    md={showCircleOfFifths ? 7 : 12}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Box sx={{
                      width: '100%',
                      maxWidth: { xs: '100%', sm: '550px', md: '100%' },
                      margin: '0 auto'
                    }}>
                      <Stats
                        p={0}
                        boards={boards}
                        display={display}
                        board={board}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            )}

           </Root>
        </MainInner>
      </MainContent>

      {/* DESKTOP SIDEBAR / EMBEDDED CONTROLS CARD */}
      {showFretboardControls && (
        <SideDrawer open={drawerOpen} board={board}>
          <DrawerHeader open={drawerOpen} board={board}>
            <DrawerToggleDesktop onClick={() => setDrawerOpen(v => !v)}>
              {drawerOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </DrawerToggleDesktop>
          </DrawerHeader>

          {!drawerOpen && board === "articles" && (
            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              cursor: 'pointer',
              userSelect: 'none',
              gap: 2
            }} onClick={() => setDrawerOpen(true)}>
              <Typography sx={{
                fontWeight: 900,
                fontSize: '14px',
                color: 'var(--brutal-ink)',
                writingMode: 'vertical-rl',
                textOrientation: 'mixed',
                letterSpacing: 2,
              }}>
                OPEN CONTROLS ⚙️
              </Typography>
            </Box>
          )}

          {!drawerOpen && board === "articles" && (
            <Box sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              cursor: 'pointer',
              userSelect: 'none',
            }} onClick={() => setDrawerOpen(true)}>
              <Typography sx={{
                fontWeight: 900,
                fontSize: '14px',
                color: 'var(--brutal-ink)',
                letterSpacing: 1,
              }}>
                TAP TO OPEN CONTROLS ⚙️
              </Typography>
            </Box>
          )}

          <DrawerContent open={drawerOpen} board={board}>
            <ThemeProvider theme={fretboardTheme}>
              <FretboardControls
                createNewBoardDisplay={createNewBoardDisplay}
                handleChoiceChange={handleChoiceChange}
                onCleanFretboard={cleanFretboard}
                selectedKey={selectedFretboard.keySettings[selectedFretboard.generalSettings.choice]}
                selectedScale={selectedFretboard.scaleSettings.scale}
                selectedChord={selectedFretboard.chordSettings.chord}
                selectedShape={
                  selectedFretboard[selectedFretboard.generalSettings.choice + "Settings"].shape
                }
                selectedMode={selectedFretboard.modeSettings.mode}
                selectedLabelDisplay={selectedFretboard.generalSettings.labelDisplay}
                onElementChange={onElementChange}
                scaleModes={
                  selectedFretboard.scaleSettings.scale && guitar.scales[selectedFretboard.scaleSettings.scale]
                    ? guitar.scales[selectedFretboard.scaleSettings.scale].modes || []
                    : []
                }
                arppegiosNames={Object.keys(guitar.arppegios)}
                choice={selectedFretboard.generalSettings.choice}
              />
            </ThemeProvider>
          </DrawerContent>
        </SideDrawer>
      )}

    </AppWrapper>
  );
};

// ============================================================================
// REDUX CONNECTION
// ============================================================================
const mapStateToProps = (state, ownProps) => {
  const filteredBoards = state.fretboard.components.filter(
    (b) => b.generalSettings.page === ownProps.board
  );
  return {
    boards: filteredBoards,
    progressions: state.partitions,
  };
};

export default connect(mapStateToProps, {
  addFretboard,
  updateBoards: updateStateProperty,
  setProgression,
  setProgressionKey,
})(withFretboardState(MusicApp));
