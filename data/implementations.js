export const IMPLEMENTATION_PAGES = [
  {
    slug: "real-time-audio-visualizer",
    shortLabel: "Audio Visualizer",
    title: "Real-time Audio Visualizer",
    description:
      "Live waveform and spectrum rendering with pointer-reactive lighting.",
    browserTech: ["Web Audio API", "Canvas 2D", "Pointer Events"],
  },
  {
    slug: "interactive-piano-roll-sequencer",
    shortLabel: "Piano Roll",
    title: "Interactive Piano Roll / Sequencer",
    description:
      "Drag-driven sequencer with zoom, snap grid, playback, and smart chord hints.",
    browserTech: ["Web Audio API", "Pointer Events", "Canvas 2D"],
  },
  {
    slug: "gesture-controlled-instruments",
    shortLabel: "Gesture Control",
    title: "Gesture-controlled Instruments",
    description:
      "Control pitch and modulation from device orientation and touch fallback.",
    browserTech: ["DeviceOrientationEvent", "Web Audio API"],
  },
  {
    slug: "audio-reactive-3d-environments",
    shortLabel: "Reactive 3D",
    title: "Audio-reactive 3D Environments",
    description:
      "Audio-driven pseudo-3D scene renderer with optional WebXR capability checks.",
    browserTech: ["Canvas 2D", "Web Audio API", "WebXR"],
  },
  {
    slug: "smart-looping-layering-tool",
    shortLabel: "Smart Looping",
    title: "Smart Looping / Layering Tool",
    description:
      "Multi-track loop workstation with IndexedDB persistence and harmony assist.",
    browserTech: ["Web Audio API", "Audio scheduling", "IndexedDB"],
  },
  {
    slug: "real-time-music-collaboration",
    shortLabel: "Collaboration",
    title: "Real-time Music Collaboration",
    description:
      "Multi-tab live sync jam board with latency indicators via BroadcastChannel.",
    browserTech: ["BroadcastChannel", "Performance API", "Web Audio API"],
  },
  {
    slug: "ai-assisted-composition-tools",
    shortLabel: "AI Composer",
    title: "AI-assisted Composition Tools",
    description:
      "Client-side melody autocomplete and progression hints with confidence scoring.",
    browserTech: ["Client inference heuristics", "Web Audio API"],
  },
  {
    slug: "audio-gesture-recognition-sampling",
    shortLabel: "Audio Gestures",
    title: "Audio Gesture Recognition / Sampling",
    description:
      "Microphone-driven clap and hum detection mapped to note and trigger events.",
    browserTech: ["Web Audio API", "MediaDevices", "SpeechRecognition"],
  },
  {
    slug: "multi-touch-music-canvas",
    shortLabel: "Multi-touch Canvas",
    title: "Multi-touch Music Canvas",
    description:
      "Polyphonic touch grid using simultaneous pointer streams and note synthesis.",
    browserTech: ["Pointer Events", "Touch Events", "Web Audio API"],
  },
  {
    slug: "advanced-score-playback",
    shortLabel: "Score Playback",
    title: "Advanced Score Playback",
    description:
      "Browser score playback with live highlighting, tempo control, and timing feedback.",
    browserTech: ["SVG", "Web Audio API", "Keyboard Events"],
  },
];

export const IMPLEMENTATIONS_ROOT = "/implementations";

export function implementationHref(slug) {
  return `${IMPLEMENTATIONS_ROOT}/${slug}`;
}

