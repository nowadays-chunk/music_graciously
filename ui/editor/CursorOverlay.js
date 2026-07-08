import React, { useEffect, useState, useRef } from "react";
import { useScore } from "@/core/editor/ScoreContext";

const LAYOUT = {
    START_X: 20,
    MEASURE_WIDTH: 200,
    MEASURES_PER_LINE: 4,
    SYSTEM_HEIGHT: {
        notation: 120,
        tab: 150,
    },
    START_Y: 40,
};

export default function CursorOverlay({ activeTab }) {
    const { playback, score } = useScore();
    const [beat, setBeat] = useState(0);
    const cursorRef = useRef(null);

    useEffect(() => {
        if (!playback) return;

        playback.onBeat = (b) => {
            setBeat(b);
        };

        return () => {
            playback.onBeat = null;
        };
    }, [playback]);

    const isVisible = score && playback && playback.isPlaying;

    // Find current measure index and local beat
    let measureIndex = 0;
    let localBeat = 0;
    let accumulatedBeats = 0;
    let beatsPerMeasure = 4;

    if (isVisible) {
        for (let i = 0; i < score.measures.length; i++) {
            const m = score.measures[i];
            const b = m.timeSignature.beats;
            if (beat >= accumulatedBeats && beat < accumulatedBeats + b) {
                measureIndex = i;
                localBeat = beat - accumulatedBeats;
                beatsPerMeasure = b;
                break;
            }
            accumulatedBeats += b;
        }
    }

    // Calculate visual position
    const lineIndex = Math.floor(measureIndex / LAYOUT.MEASURES_PER_LINE);
    const measureInLine = measureIndex % LAYOUT.MEASURES_PER_LINE;

    const x =
        LAYOUT.START_X +
        measureInLine * LAYOUT.MEASURE_WIDTH +
        (localBeat / beatsPerMeasure) * (LAYOUT.MEASURE_WIDTH - 20) +
        15; // Offset to center in start padding

    const y =
        LAYOUT.START_Y + lineIndex * LAYOUT.SYSTEM_HEIGHT[activeTab];

    // Auto-scroll
    useEffect(() => {
        if (isVisible && cursorRef.current) {
            // Only scroll if out of view
            cursorRef.current.scrollIntoView({ block: "center", behavior: "smooth" });
        }
    }, [lineIndex, isVisible]);

    if (!isVisible) return null;

    return (
        <div
            ref={cursorRef}
            style={{
                position: "absolute",
                left: x,
                top: y,
                transform: "translateX(-1px)", // Center line
                width: 2,
                height: 100, // Approximate stave height
                backgroundColor: "rgba(255, 0, 0, 0.5)",
                zIndex: 100,
                pointerEvents: "none",
                transition: "left 0.1s linear, top 0.2s ease", // Smooth animation
            }}
        />
    );
}
