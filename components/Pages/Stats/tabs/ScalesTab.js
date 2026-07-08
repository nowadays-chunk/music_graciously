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

export default function ScalesTab({ boards, precomputedStats, saveStats, isHomepage, showCharts, chartHeight }) {

    const _scaleNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const _scaleIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const _scaleNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const _scaleFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const _scaleFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const _scaleFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const _scaleTreemap = useMemo(() => buildTreemapNotes(boards), [boards]);
    const _scaleScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const _scaleKeys = useMemo(() => buildKeyUsage(boards), [boards]);
    const _scaleShapes = useMemo(() => buildShapeUsage(boards), [boards]);
    const _scaleFlow = useMemo(() => buildChordFlow(boards), [boards]);
    const _scaleRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const _scaleModes = useMemo(() => buildModeUsage(boards), [boards]);

    const scaleStats = useMemo(() => combineStats({
        noteUsage: _scaleNoteUsage,
        intervalUsage: _scaleIntervalUsage,
        neckZones: _scaleNeckZones,
        fretHeatmap: _scaleFretHeatmap,
        fretHistogram: _scaleFretHistogram,
        fretRanges: _scaleFretRanges,
        treemap: _scaleTreemap,
        scatter: _scaleScatter,
        keys: _scaleKeys,
        shapes: _scaleShapes,
        flow: _scaleFlow,
        radarStrings: _scaleRadarStrings,
        modes: _scaleModes
    }, precomputedStats), [precomputedStats, _scaleNoteUsage, _scaleIntervalUsage, _scaleNeckZones, _scaleFretHeatmap, _scaleFretHistogram, _scaleFretRanges, _scaleTreemap, _scaleScatter, _scaleKeys, _scaleShapes, _scaleFlow, _scaleRadarStrings, _scaleModes]);

    useEffect(() => {
        if (!isHomepage && !precomputedStats && boards.length > 0) {
            saveStats('scales', scaleStats);
        }
    }, [isHomepage, precomputedStats, boards, saveStats, scaleStats]);

    const shouldShow = (title) => !showCharts || showCharts.includes(title);

    return (
        <Grid container spacing={0}>
            {shouldShow("Scale Heatmap") && (
                <Grid item xs={12}>
                    <Interpretation text="Visualizes the geometric density of scale note placements across the fretboard, representing the horizontal and vertical connectivity of the neck." />
                    <Heatmap title="Scale Heatmap" data={scaleStats.fretHeatmap} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Note Frequency") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Displays the frequency of specific notes within the scales, identifying the tonal foundations of the current system." />
                    <BarGraph title="Scale Note Frequency" data={scaleStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Interval Distribution") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Analyzes the intervals (seconds, thirds, etc.) that define scale structures, revealing their characteristic harmonic flavor." />
                    <PieGraph title="Scale Interval Distribution" data={scaleStats.intervalUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Key Distribution") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Identifies the root keys most frequently selected for scale studies, highlighting common practice centers." />
                    <BarGraph title="Scale Key Distribution" data={scaleStats.keys} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Shape Distribution") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Shows how scales are mapped onto the CAGED system shapes, representing positional versatility." />
                    <PieGraph title="Scale Shape Distribution" data={scaleStats.shapes} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Mode Distribution (Scales)") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Measures the occurrence of specific modes (Dorian, Phrygian, etc.) within the generated scale sheets." />
                    <BarGraph title="Mode Distribution (Scales)" data={scaleStats.modes} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale String Usage Radar") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Visualizes string workload for scale patterns, indicating picking efficiency and string-crossing frequency." />
                    <RadarGraph title="Scale String Usage Radar" data={scaleStats.radarStrings} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Neck Zones Distribution") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Distribution of scale notes across vertical regions of the guitar neck (Open, Mid, High)." />
                    <PieGraph title="Scale Neck Zones Distribution" data={scaleStats.neckZones} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Fret Histogram") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Statistical density of scale notes across frets, identifying 'sweet spots' on the neck." />
                    <HistogramGraph title="Scale Fret Histogram" data={scaleStats.fretHistogram} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Fret Range") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="The mathematical range (span) covered by scale patterns in different positions." />
                    <RangeGraph title="Scale Fret Range" data={scaleStats.fretRanges} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Fret vs String Scatter") && (
                <Grid item xs={12}>
                    <Interpretation text="A discrete coordinate map of scale note positions, visualizing the grid-like nature of the guitar fretboard." />
                    <ScatterGraph title="Scale Fret vs String Scatter" data={scaleStats.scatter} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Note Treemap") && (
                <Grid item xs={12}>
                    <Interpretation text="Hierarchical importance of notes within the scale dataset, using area to represent prominence." />
                    <TreemapGraph title="Scale Note Treemap" data={scaleStats.treemap} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Note Trend") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Identifies notes that are statistically over-represented in the current scale set compared to a balanced chromatic set." />
                    <LineGraph title="Scale Note Trend" data={scaleStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Radial Note Distribution") && (
                <Grid item xs={12} md={12}>
                    <Interpretation text="Circular representation of scale notes, emphasizing their relationship to the chromatic circle." />
                    <RadialBarGraph title="Scale Radial Note Distribution" data={scaleStats.noteUsage} height={chartHeight} />
                </Grid>
            )}
            {shouldShow("Scale Flow Pattern") && (
                <Grid item xs={12}>
                    <Interpretation text="Visualizes the movement between scale degrees, representing the linear logic of melodic flow." />
                    <FlowGraph title="Scale Flow Pattern" data={scaleStats.flow} height={chartHeight} />
                </Grid>
            )}
        </Grid>
    );
}
