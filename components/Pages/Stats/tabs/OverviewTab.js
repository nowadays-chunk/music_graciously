import React, { useMemo } from "react";
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
    buildChordFlow
} from "../utils";

export default function OverviewTab({ boards }) {

    const allNoteUsage = useMemo(() => buildNoteUsage(boards), [boards]);
    const allIntervalUsage = useMemo(() => buildIntervalUsage(boards), [boards]);
    const allKeyUsage = useMemo(() => buildKeyUsage(boards), [boards]);
    const allShapeUsage = useMemo(() => buildShapeUsage(boards), [boards]);
    const allModeUsage = useMemo(() => buildModeUsage(boards), [boards]);
    const allNeckZones = useMemo(() => buildNeckZones(boards.map(b => b.fretboard)), [boards]);
    const allFretHeatmap = useMemo(() => buildFretHeatmap(boards.map(b => b.fretboard)), [boards]);
    const allFretHistogram = useMemo(() => buildFretHistogram(boards), [boards]);
    const allFretRanges = useMemo(() => buildFretRanges(boards), [boards]);
    const allTreemapNotes = useMemo(() => buildTreemapNotes(boards), [boards]);
    const allScatter = useMemo(() => buildScatterPositions(boards), [boards]);
    const allRadarStrings = useMemo(() => buildRadarStringUsage(boards), [boards]);
    const allFlow = useMemo(() => buildChordFlow(boards), [boards]);

    return (
        <Grid container spacing={1}>
            <Heatmap title="Fretboard Heatmap (All Data)" data={allFretHeatmap} />
            <Grid item xs={12} md={6}>
                <BarGraph title="Global Note Frequency" data={allNoteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Interval Usage Ratio" data={allIntervalUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <BarGraph title="Key Usage Distribution" data={allKeyUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Shape Preference Distribution" data={allShapeUsage} />
            </Grid>
            <Grid item xs={12}>
                <BarGraph title="Mode Usage" data={allModeUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadarGraph title="String Usage Radar" data={allRadarStrings} />
            </Grid>
            <Grid item xs={12} md={6}>
                <PieGraph title="Neck Zones Heat Distribution" data={allNeckZones} />
            </Grid>
            <Grid item xs={12} md={6}>
                <HistogramGraph title="Fret Density Histogram" data={allFretHistogram} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RangeGraph title="Fret Range Analysis" data={allFretRanges} />
            </Grid>
            <Grid item xs={12}>
                <ScatterGraph title="Fret vs String Density Map" data={allScatter} />
            </Grid>
            <Grid item xs={12}>
                <TreemapGraph title="Note Importance (Treemap)" data={allTreemapNotes} />
            </Grid>
            <Grid item xs={12} md={6}>
                <LineGraph title="Notes Trend (Sorted Alphabetically)" data={allNoteUsage} />
            </Grid>
            <Grid item xs={12} md={6}>
                <RadialBarGraph title="Radial Distribution of Notes" data={allNoteUsage} />
            </Grid>
            <Grid item xs={12}>
                <FlowGraph title="Chord / Scale Flow Transitions" data={allFlow} />
            </Grid>
        </Grid>
    );
}
