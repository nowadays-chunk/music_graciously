// ============================================
// STATS.JSX — REFACTORED FOR PERFORMANCE
// ============================================
// Light mode only
// Tabs: All, Chords, Arpeggios, Scales
// 15 data visualizations per tab (60 charts total)
// ============================================

import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from "@mui/material";


import ChordsTab from "./tabs/ChordsTab";
import ArpeggiosTab from "./tabs/ArpeggiosTab";
import ScalesTab from "./tabs/ScalesTab";

import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../../../data/seo';

export default function Stats({
  board = null,
  boards = [],
  chords: initialChords = [],
  arpeggios: initialArpeggios = [],
  scales: initialScales = [],
  /* ---------------------------------------------------------
  // PRECOMPUTED STATS HANDLING
  // --------------------------------------------------------- */
  usage: initialUsage = null,
  precomputedStats: initialPrecomputedStats = {},
  p, // padding between /play page and /stats page
  showTabs = ["Chords", "Arpeggios", "Scales"],
  showCharts = null, // array of chart titles to show. null means show all.
  variant = "full", // "full" or "compact"
  display = ""
}) {
  const [tab, setTab] = useState(0);
  const [selectedGraph, setSelectedGraph] = useState("");

  const graphOptions = useMemo(() => ({
    0: [
      "Chord Heatmap", "Chord Note Frequency", "Chord Interval Usage",
      "Chord Keys Distribution", "Chord Shape Distribution", "Modal Presence in Chords",
      "Chord String Usage Radar", "Chord Neck Zones", "Chord Fret Density Histogram",
      "Chord Fret Range", "Chord Fret vs String Scatter", "Chord Note Weights",
      "Chord Notes Over Representation", "Chord Radial Distribution", "Chord Transition Flow"
    ],
    1: [
      "Arpeggio Heatmap", "Arpeggio Note Frequency", "Arpeggio Interval Usage",
      "Arpeggio Key Distribution", "Arpeggio Shape Usage", "Mode Occurrence in Arpeggios",
      "Arpeggio String Usage Radar", "Arpeggio Neck Zones", "Arpeggio Fret Histogram",
      "Arpeggio Fret Range", "Arpeggio Fret vs String Scatter", "Arpeggio Note Treemap",
      "Arpeggio Note Popularity Trend", "Arpeggio Radial Note Distribution", "Arpeggio Flow Pattern"
    ],
    2: [
      "Scale Heatmap", "Scale Note Frequency", "Scale Interval Distribution",
      "Scale Key Distribution", "Scale Shape Distribution", "Mode Distribution (Scales)",
      "Scale String Usage Radar", "Scale Neck Zones Distribution", "Scale Fret Histogram",
      "Scale Fret Range", "Scale Fret vs String Scatter", "Scale Note Treemap",
      "Scale Note Trend", "Scale Radial Note Distribution", "Scale Flow Pattern"
    ]
  }), []);

  // Initialize selectedGraph when tab changes
  React.useEffect(() => {
    const options = graphOptions[tab];
    if (options && options.length > 0 && (!selectedGraph || !options.includes(selectedGraph))) {
      setSelectedGraph(options[0]);
    }
  }, [tab, graphOptions, selectedGraph]);

  // Sync tab with showTabs if initial tab (0) is not in showTabs
  React.useEffect(() => {
    if (showTabs && showTabs.length > 0 && !showTabs.includes(["Chords", "Arpeggios", "Scales"][tab])) {
      const firstTabName = showTabs[0];
      const newTabIndex = ["Chords", "Arpeggios", "Scales"].indexOf(firstTabName);
      if (newTabIndex !== -1) setTab(newTabIndex);
    }
  }, [showTabs, tab]);

  // AUTO-SYNC TAB WITH ACTIVE SELECTION (Only when choice changes or display override)
  const lastEffectiveDisplay = React.useRef("");

  React.useEffect(() => {
    const activeChoice = display || (boards.length > 0 ? boards[0].generalSettings?.choice : "");
    const effectiveDisplay = display || activeChoice;

    if (!effectiveDisplay || effectiveDisplay === lastEffectiveDisplay.current) return;
    lastEffectiveDisplay.current = effectiveDisplay;

    let targetTab = -1;
    if (effectiveDisplay === "chord") targetTab = 0;
    else if (effectiveDisplay === "arppegio" || effectiveDisplay === "arpeggio") targetTab = 1;
    else if (effectiveDisplay === "scale") targetTab = 2;

    if (targetTab !== -1) {
      const targetTabName = ["Chords", "Arpeggios", "Scales"][targetTab];
      if (!showTabs || showTabs.includes(targetTabName)) {
        setTab(targetTab);
      }
    }
  }, [display, boards, showTabs]);

  const [usage, setUsage] = useState(initialUsage);
  const [precomputedStats, setPrecomputedStats] = useState(initialPrecomputedStats);
  const [loading, setLoading] = useState(false);

  // Client-side fetching of full stats if not provided (Stats page)
  React.useEffect(() => {
    async function fetchStats() {
      // If we are on stats page (not homepage) and don't have usage data
      if (boards.length === 0 && (!usage || Object.keys(usage).length === 0)) {
        setLoading(true);
        try {
          const [usageRes, chordsRes, arpsRes, scalesRes] = await Promise.all([
            fetch('/data/stats/usage.json'),
            fetch('/data/stats/chords.json'),
            fetch('/data/stats/arpeggios.json'),
            fetch('/data/stats/scales.json')
          ]);

          const [usageData, chordsData, arpsData, scalesData] = await Promise.all([
            usageRes.ok ? usageRes.json() : {},
            chordsRes.ok ? chordsRes.json() : {},
            arpsRes.ok ? arpsRes.json() : {},
            scalesRes.ok ? scalesRes.json() : {}
          ]);

          setUsage(usageData);
          setPrecomputedStats({
            chords: chordsData,
            arpeggios: arpsData,
            scales: scalesData
          });
        } catch (error) {
          console.error("Error fetching client-side stats:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchStats();
  }, [boards.length, usage]);

  // ---------------------------------------------------------
  // DETECT HOMEPAGE
  // ---------------------------------------------------------
  const isHomepage =
    boards.length > 0 &&
    initialChords.length === 0 &&
    initialArpeggios.length === 0 &&
    initialScales.length === 0 &&
    (!usage || Object.keys(usage).length === 0);

  const saveStats = async (filename, data) => {
    try {
      await fetch('/api/save_stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, data }),
      });
      console.log(`Saved stats for ${filename}`);
    } catch (error) {
      console.error(`Error saving stats for ${filename}:`, error);
    }
  };


  // ---------------------------------------------------------
  // SELECT SOURCE DATA
  // ---------------------------------------------------------
  const sourceBoards = useMemo(() => {
    // Homepage: use boards only
    if (isHomepage) {
      return boards.map((b) => {
        const choice = b.generalSettings.choice;
        const fb = b[choice + "Settings"]?.fretboard || [];
        return {
          fretboard: fb,
          chord: b.chordSettings?.chord || null,
          arpeggio: b.arppegioSettings?.arppegio || null,
          scale: b.scaleSettings?.scale || null,
          keyIndex: b.keySettings?.[choice] ?? null,
          shape: b[choice + "Settings"]?.shape || null,
          mode: b.modeSettings?.mode || null,
          general: b.generalSettings
        };
      });
    }
    // Stats page: We rely on precomputedStats in the tab components.
    // Return empty array to avoid spreading non-array precomputed stats objects.
    return [];
  }, [boards, isHomepage]);


  // ---------------------------------------------------------
  // TABS DEFINITION
  // ---------------------------------------------------------
  let tabs = ["Chords", "Arpeggios", "Scales"];

  // -------------------------------------------
  // FILTERED BOARDS FOR TABS
  // -------------------------------------------
  const chordBoards = useMemo(
    () => sourceBoards.filter(b => b.chord || (b.general?.choice === "chord")),
    [sourceBoards]
  );

  const arpBoards = useMemo(
    () => sourceBoards.filter(b => b.arpeggio || (b.general?.choice === "arppegio")),
    [sourceBoards]
  );

  const scaleBoards = useMemo(
    () => sourceBoards.filter(b => b.scale || (b.general?.choice === "scale")),
    [sourceBoards]
  );

  // -------------------------------------------------------------------------
  // RENDER SWITCH
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // RENDER SWITCH
  // -------------------------------------------------------------------------
  return (
    <Box sx={{ height: '100%', p: p === 0 ? 0 : 12, m: 0, bgcolor: p === 0 ? 'transparent' : 'var(--brutal-bg)' }}>
      {/* Title Section */}
      {p !== 0 && (
        <Box sx={{ mb: 6, p: { xs: 3, md: 6 }, bgcolor: 'var(--brutal-blue)', border: '4px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)' }}>
          <Typography
            variant="h1"
            sx={{
              fontWeight: 900,
              mb: 2,
              fontSize: { xs: '3rem', md: '4.5rem' },
              color: 'var(--brutal-ink)',
            }}
          >
            Performance Statistics
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300 }}>
            Analyze your harmonic data and track your progression.
          </Typography>
        </Box>
      )}

      {/* TABS (Always show if more than one) */}
      {(board !== "articles" && (showTabs && showTabs.length > 1)) && (
        <Box sx={{ display: "flex", mb: 3 }}>
          {tabs.map((label, idx) => {
            if (!showTabs.includes(label)) return null;
            return (
              <Button
                key={idx}
                onClick={() => setTab(idx)}
                variant={tab === idx ? "contained" : "outlined"}
                sx={{ flex: 1, borderRadius: 0 }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      )}

      {/* GRAPH SELECTOR (Always show) */}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel id="graph-select-label">Select Graph</InputLabel>
        <Select
          labelId="graph-select-label"
          value={selectedGraph}
          label="Select Graph"
          onChange={(e) => setSelectedGraph(e.target.value)}
        >
          {graphOptions[tab]?.map((option) => (
            <MenuItem key={option} value={option}>{option}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Active Tab Content (Always filtered to one graph) */}
      {(display === "chord" || (tab === 0 && showTabs.includes("Chords"))) && (
        <ChordsTab
          boards={chordBoards}
          precomputedStats={precomputedStats?.chords}
          saveStats={saveStats}
          isHomepage={isHomepage}
          showCharts={[selectedGraph]}
          chartHeight={300}
        />
      )}

      {(display === "arppegio" || display === "arpeggio" || (tab === 1 && showTabs.includes("Arpeggios"))) && (
        <ArpeggiosTab
          boards={arpBoards}
          precomputedStats={precomputedStats?.arpeggios}
          saveStats={saveStats}
          isHomepage={isHomepage}
          showCharts={[selectedGraph]}
          chartHeight={300}
        />
      )}

      {(display === "scale" || (tab === 2 && showTabs.includes("Scales"))) && (
        <ScalesTab
          boards={scaleBoards}
          precomputedStats={precomputedStats?.scales}
          saveStats={saveStats}
          isHomepage={isHomepage}
          showCharts={[selectedGraph]}
          chartHeight={300}
        />
      )}
    </Box>
  );
}
