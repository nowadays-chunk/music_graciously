import React, { useMemo, useState } from "react";
import Head from "next/head";
import { Box, Stack } from "@mui/material";
import { ScoreProvider } from "@/core/editor/ScoreContext";
import MenuBar from "@/ui/editor/MenuBar";
import Toolbar from "@/ui/editor/Toolbar";
import TransportBar from "@/ui/editor/TransportBar";
import ScoreCanvas from "@/ui/editor/ScoreCanvas";
import PalettePanel from "@/ui/editor/PalettePanel";
import InspectorPanel from "@/ui/editor/InspectorPanel";
import MusicApp from "@/components/Containers/MusicApp";
import FloatingPanel from "@/components/UI/FloatingPanel";
import ComposerFAB from "@/ui/editor/ComposerFAB";
import SmartCommandBar from "@/ui/editor/SmartCommandBar";
import { DEFAULT_KEYWORDS } from "../../data/seo";

const PANEL_DEFS = [
  { key: "menu",      label: "Menu" },
  { key: "toolbar",   label: "Toolbar" },
  { key: "transport", label: "Transport" },
  { key: "palette",   label: "Palette" },
  { key: "inspector", label: "Inspector" },
  { key: "fretboard", label: "Fretboard" },
];

// All panels start CLOSED — clean canvas
const ALL_CLOSED = {
  menu: false,
  toolbar: false,
  transport: false,
  palette: false,
  inspector: false,
  fretboard: false,
};

// Layout zones
const TOP_PANELS    = ["menu", "toolbar", "transport"];
const LEFT_PANELS   = ["palette"];
const RIGHT_PANELS  = ["inspector"];
const BOTTOM_PANELS = ["fretboard"];

export default function ComposePage() {
  const [open, setOpen] = useState({ ...ALL_CLOSED });

  // ── Panel content (memoized) ────────────────────────────────────────────
  const panelContent = useMemo(
    () => ({
      menu:      <MenuBar embedded />,
      toolbar:   <Toolbar embedded />,
      transport: <TransportBar embedded />,
      palette:   <PalettePanel />,
      inspector: <InspectorPanel />,
      fretboard: (
        <MusicApp
          board="compose"
          showFretboardControls={false}
          showCircleOfFifths={false}
          showFretboard={true}
          showChordComposer={false}
          showProgressor={false}
          showSongsSelector={false}
        />
      ),
    }),
    []
  );

  const togglePanel = (key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const closePanel = (key) => {
    setOpen((prev) => ({ ...prev, [key]: false }));
  };

  // Check active sidebars
  const hasLeft  = LEFT_PANELS.some((k) => open[k]);
  const hasRight = RIGHT_PANELS.some((k) => open[k]);

  return (
    <>
      <Head>
        <title>Compose Music | Guitar Sheets</title>
        <meta
          name="keywords"
          content={`${DEFAULT_KEYWORDS}, compose music, score editor, guitar composition`}
        />
        <meta
          name="description"
          content="Compose in a dense full-page sheet and tab view with docked tools and a smart command bar."
        />
      </Head>

      <ScoreProvider>
        <Box
          sx={{
            pt: { xs: '72px', sm: '82px' },
            width: "100vw",
            minHeight: "100vh",
            boxSizing: "border-box",
            bgcolor: "background.default", // Restore default theme background (light cream)
            color: "text.primary",
            pb: "56px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── 1. Top horizontal docked panels (Menu, Toolbar, Transport) ── */}
          {TOP_PANELS.some((k) => open[k]) && (
            <Stack spacing={0} sx={{ flexShrink: 0 }}>
              {TOP_PANELS.map((key) =>
                open[key] ? (
                  <FloatingPanel
                    key={key}
                    title={PANEL_DEFS.find((d) => d.key === key)?.label}
                    onClose={() => closePanel(key)}
                  >
                    {panelContent[key]}
                  </FloatingPanel>
                ) : null
              )}
            </Stack>
          )}

          {/* ── 2. Middle Row: Left Sidebar, Canvas, Right Sidebar ── */}
          <Box
            sx={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: `${hasLeft ? "280px " : ""}1fr${hasRight ? " 320px" : ""}`,
              minHeight: 0,
            }}
          >
            {/* Left sidebar — Palette */}
            {LEFT_PANELS.map((key) =>
              open[key] ? (
                <FloatingPanel
                  key={key}
                  title={PANEL_DEFS.find((d) => d.key === key)?.label}
                  onClose={() => closePanel(key)}
                  sx={{ height: "100%" }}
                >
                  {panelContent[key]}
                </FloatingPanel>
              ) : null
            )}

            {/* Score canvas — always visible */}
            <Box
              sx={{
                width: "100%",
                minHeight: "calc(100vh - 146px)",
                bgcolor: "background.paper", // Restore white sheet/canvas background
                borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                overflowX: "auto",
              }}
            >
              <ScoreCanvas />
            </Box>

            {/* Right sidebar — Inspector */}
            {RIGHT_PANELS.map((key) =>
              open[key] ? (
                <FloatingPanel
                  key={key}
                  title={PANEL_DEFS.find((d) => d.key === key)?.label}
                  onClose={() => closePanel(key)}
                  sx={{ height: "100%" }}
                >
                  {panelContent[key]}
                </FloatingPanel>
              ) : null
            )}
          </Box>

          {/* ── 3. Bottom docked panels (Fretboard, Composer) ── */}
          {BOTTOM_PANELS.some((k) => open[k]) && (
            <Stack spacing={0} sx={{ flexShrink: 0 }}>
              {BOTTOM_PANELS.map((key) =>
                open[key] ? (
                  <FloatingPanel
                    key={key}
                    title={PANEL_DEFS.find((d) => d.key === key)?.label}
                    onClose={() => closePanel(key)}
                  >
                    {panelContent[key]}
                  </FloatingPanel>
                ) : null
              )}
            </Stack>
          )}
        </Box>

        {/* ── Expandable FAB ──────────────────────────────────────────── */}
        <ComposerFAB open={open} onTogglePanel={togglePanel} />

        {/* ── Smart Command Bar ───────────────────────────────────────── */}
        <SmartCommandBar />
      </ScoreProvider>
    </>
  );
}
