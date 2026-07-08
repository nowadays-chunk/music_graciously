import React, { useMemo, useEffect } from "react";
import { Grid } from "@mui/material";
import {
    Heatmap,
    BarGraph,
    PieGraph,
    RadarGraph,
    HistogramGraph,
    RangeGraph,
    ScatterGraph,
    TreemapGraph,
    LineGraph,
    RadialBarGraph,
    FlowGraph
} from "../Charts";
import {
    buildNoteUsage,
    buildIntervalUsage,
    buildKeyUsage,
    buildShapeUsage,
    buildModeUsage,
    buildStringUsage,
    buildNeckZones,
    buildFretHeatmap,
    buildFretHistogram,
    buildFretRanges,
    buildTreemapNotes,
    buildScatterPositions,
    buildRadarStringUsage,
    buildChordFlow,
    combineStats
} from "../utils";

import Interpretation from "../Interpretation";

export default function ArpeggiosTab({ boards, precomputedStats, saveStats, isHomepage, showCharts, chartHeight }) {

    const _arpNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const _arpIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const _arpNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const _arpFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const _arpFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const _arpFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const _arpTreemap = useMemo(() => buildTreemapNotes(boards), [boards]);
    const _arpScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const _arpKeys = useMemo(() => buildKeyUsage(boards), [boards]);
    const _arpShapes = useMemo(() => buildShapeUsage(boards), [boards]);
    const _arpFlow = useMemo(() => buildChordFlow(boards), [boards]);
    const _arpRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const _arpModes = useMemo(() => buildModeUsage(boards), [boards]);

    const arpStats = useMemo(() => combineStats({
        noteUsage: _arpNoteUsage,
        intervalUsage: _arpIntervalUsage,
        neckZones: _arpNeckZones,
        fretHeatmap: _arpFretHeatmap,
        fretHistogram: _arpFretHistogram,
        fretRanges: _arpFretRanges,
        treemap: _arpTreemap,
        scatter: _arpScatter,
        keys: _arpKeys,
        shapes: _arpShapes,
        flow: _arpFlow,
        radarStrings: _arpRadarStrings,
        modes: _arpModes
    }, precomputedStats), [precomputedStats, _arpNoteUsage, _arpIntervalUsage, _arpNeckZones, _arpFretHeatmap, _arpFretHistogram, _arpFretRanges, _arpTreemap, _arpScatter, _arpKeys, _arpShapes, _arpFlow, _arpRadarStrings, _arpModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('arpeggios', arpStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, arpStats]);

    const shouldShow = (title) => !showCharts || showCharts.includes(title);

    return (
        <Grid container spacing={0}>
            {shouldShow("Arpeggio Heatmap") && (
                <Grid item xs={12}>
                    {!chartHeight && <Interpretation text="Visualizes the geometric density of arpeggio note placements across the fretboard, representing the spatial distribution of linear harmonic structures." />}
                    <Heatmap title="Arpeggio Heatmap" data={arpStats.fretHeatmap} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Note Frequency") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Displays the frequency of specific notes within arpeggios, identifying the most common melodic anchors." />}
                    <BarGraph title="Arpeggio Note Frequency" data={arpStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Interval Usage") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Analyzes the intervals that define arpeggio structures, revealing the harmonic skeleton of the analyzed elements." />}
                    <PieGraph title="Arpeggio Interval Usage" data={arpStats.intervalUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Key Distribution") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Identifies the root keys most frequently used in arpeggio practice or analysis sessions." />}
                    <BarGraph title="Arpeggio Key Distribution" data={arpStats.keys} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Shape Usage") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Distribution of arpeggios across CAGED shapes, representing positional efficiency." />}
                    <PieGraph title="Arpeggio Shape Usage" data={arpStats.shapes} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Mode Occurrence in Arpeggios") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Presence of specific modal degrees within arpeggio structures." />}
                    <BarGraph title="Mode Occurrence in Arpeggios" data={arpStats.modes} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio String Usage Radar") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Visualizes string workload for arpeggios, highlighting picking patterns and string skipping frequency." />}
                    <RadarGraph title="Arpeggio String Usage Radar" data={arpStats.radarStrings} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Neck Zones") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Vertical distribution of arpeggios across different neck registers (Open, Mid, High)." />}
                    <PieGraph title="Arpeggio Neck Zones" data={arpStats.neckZones} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Fret Histogram") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Statistical density of arpeggio notes across the horizontal axis of the fretboard." />}
                    <HistogramGraph title="Arpeggio Fret Histogram" data={arpStats.fretHistogram} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Fret Range") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="The mathematical range (span) covered by arpeggio patterns on the neck." />}
                    <RangeGraph title="Arpeggio Fret Range" data={arpStats.fretRanges} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Fret vs String Scatter") && (
                <Grid item xs={12}>
                    {!chartHeight && <Interpretation text="Discrete coordinate mapping of arpeggio note positions across strings and frets." />}
                    <ScatterGraph title="Arpeggio Fret vs String Scatter" data={arpStats.scatter} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Note Treemap") && (
                <Grid item xs={12}>
                    {!chartHeight && <Interpretation text="Hierarchical view of note importance within the arpeggio dataset." />}
                    <TreemapGraph title="Arpeggio Note Treemap" data={arpStats.treemap} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Note Popularity Trend") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Identifies arpeggio notes that appear with statistical significance relative to a uniform distribution." />}
                    <LineGraph title="Arpeggio Note Popularity Trend" data={arpStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Radial Note Distribution") && (
                <Grid item xs={12} md={12}>
                    {!chartHeight && <Interpretation text="Polar representation of arpeggio note distribution, highlighting tonal symmetry." />}
                    <RadialBarGraph title="Arpeggio Radial Note Distribution" data={arpStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Arpeggio Flow Pattern") && (
                <Grid item xs={12}>
                    {!chartHeight && <Interpretation text="Voice leading and transition patterns between arpeggio nodes." />}
                    <FlowGraph title="Arpeggio Flow Pattern" data={arpStats.flow} height={chartHeight} />
                </Grid>
            )}
        </Grid>
    );
}
