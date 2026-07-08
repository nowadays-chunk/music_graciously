import React, { useMemo } from 'react';

// --- GLAMOUR NEO-BRUTALIST PALETTES ---
// Colors mapping to CSS variables defined in ui/theme.js
export const GLAMOUR_PALETTES = [
  // Pop Glam
  {
    name: 'Pop Glam',
    colors: ['#ff4fa3', '#ffd84d', '#4ee6b8', '#55a7ff', '#ff8a3d', '#fff8e8', '#151515']
  },
  // Sunset Solo
  {
    name: 'Sunset Solo',
    colors: ['#ff8a3d', '#ffd84d', '#ff4fa3', '#55a7ff', '#4ee6b8', '#fff8e8', '#151515']
  },
  // Midnight Jazz
  {
    name: 'Midnight Jazz',
    colors: ['#55a7ff', '#ff4fa3', '#4ee6b8', '#ffd84d', '#ff8a3d', '#fff8e8', '#151515']
  },
  // Acid Scale
  {
    name: 'Acid Scale',
    colors: ['#4ee6b8', '#ffd84d', '#55a7ff', '#ff8a3d', '#ff4fa3', '#fff8e8', '#151515']
  },
  // Minty Jam
  {
    name: 'Minty Jam',
    colors: ['#ff4fa3', '#4ee6b8', '#ffd84d', '#55a7ff', '#ff8a3d', '#fff8e8', '#151515']
  },
  // Coral Chord
  {
    name: 'Coral Chord',
    colors: ['#ff8a3d', '#ff4fa3', '#4ee6b8', '#ffd84d', '#55a7ff', '#fff8e8', '#151515']
  }
];

// --- WEBSITE TERMINOLOGY ---
export const GLAMOUR_TERMS = [
  'CAGED', 'IONIAN', 'DORIAN', 'LYDIAN', 'MIXOLYDIAN', 'AEOLIAN', 'LOCRIAN',
  'PENTATONIC', 'TRIAD', 'ARPEGGIO', '5THS CIRCLE', 'FRETBOARD', 'OCTAVE',
  'TABLATURE', 'METRONOME', 'ROSETTE', 'DREADNOUGHT', 'STRATOCASTER', 'HARMONICS',
  'SUS2 CHORD', 'ADD9 CHORD', 'MINOR 7TH', 'DOMINANT 7', 'SUPER LOCRIAN',
  'JAZZ IMPROV', 'COMPOSITION', 'SOLO JAM', 'SCALE MODE', 'BEAT TEMPO',
  'CASSETTE TAPE', 'VINYL DECK', 'TUNING FORK', 'PITCH TUNER', 'INTERVALS',
  'VIOLIN BOW', 'AMP STACK', 'STAGE CROWD', 'GUITAR PICK', 'TRITONE',
  'VOICE LEADING', 'COUNTERPOINT', 'SYNCOPATION', 'A440', 'PICKUP SELECTOR'
];

// --- SEEDABLE PSEUDO-RANDOM NUMBER GENERATOR (PRNG) ---
export const createPRNG = (seed) => {
  let h = 0;
  const seedStr = String(seed || '');
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
  }
  // Linear Congruential Generator parameters
  return () => {
    h = Math.imul(48271, h) | 0;
    return (h & 0x7fffffff) / 2147483647;
  };
};

// --- BACKGROUND PATTERNS RENDERER ---
const renderBgPattern = (patternId, patternType, colors) => {
  const paper = colors[5];
  const ink = colors[6];

  switch (patternType) {
    case 'grid':
      return (
        <defs>
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={paper} />
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={ink} strokeWidth="1" opacity="0.15" />
          </pattern>
        </defs>
      );
    case 'dots':
      return (
        <defs>
          <pattern id={patternId} width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill={paper} />
            <circle cx="10" cy="10" r="2" fill={ink} opacity="0.2" />
          </pattern>
        </defs>
      );
    case 'stripes':
      return (
        <defs>
          <pattern id={patternId} width="30" height="30" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <rect width="30" height="30" fill={paper} />
            <line x1="0" y1="0" x2="0" y2="30" stroke={ink} strokeWidth="3" opacity="0.1" />
          </pattern>
        </defs>
      );
    case 'rays':
      return (
        <defs>
          <clipPath id={`${patternId}-clip`}>
            <rect width="400" height="400" rx="6" />
          </clipPath>
        </defs>
      );
    default:
      return (
        <defs>
          <rect id={patternId} width="400" height="400" fill={paper} />
        </defs>
      );
  }
};

const renderRayBackground = (patternId, colors, rand) => {
  const paper = colors[5];
  const accent = colors[rand() > 0.5 ? 0 : 3];
  const segments = 16;
  const rays = [];

  for (let i = 0; i < segments; i++) {
    if (i % 2 === 0) {
      const angle1 = (i * 360) / segments;
      const angle2 = ((i + 1) * 360) / segments;
      const rad1 = (angle1 * Math.PI) / 180;
      const rad2 = (angle2 * Math.PI) / 180;
      const x1 = 200 + 300 * Math.cos(rad1);
      const y1 = 200 + 300 * Math.sin(rad1);
      const x2 = 200 + 300 * Math.cos(rad2);
      const y2 = 200 + 300 * Math.sin(rad2);
      rays.push(
        <path key={i} d={`M 200 200 L ${x1} ${y1} L ${x2} ${y2} Z`} fill={accent} opacity="0.1" />
      );
    }
  }

  return (
    <g clipPath={`url(#${patternId}-clip)`}>
      <rect width="400" height="400" fill={paper} />
      {rays}
    </g>
  );
};

// --- SVG DESIGN TEMPLATES ---

export const GLAMOUR_TEMPLATES = [
  // 1. ABSTRACT MUSICAL NOTE (Simple)
  {
    name: 'Abstract Musical Note',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const rotation = Math.round((rand() * 16) - 8);
      const circleR = 60 + rand() * 20;
      const pulseR = circleR + 25;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Concentric soundwaves */}
          <circle cx="200" cy="180" r={pulseR} fill="none" stroke={c3} strokeWidth="4" strokeDasharray="6 6" />
          <circle cx="200" cy="180" r={circleR} fill={c2} stroke={ink} strokeWidth="4" />
          
          {/* Shadow behind note */}
          <g transform={`translate(204, 184) rotate(${rotation})`}>
            <path d="M -15 -25 L -15 35 C -15 45 -25 50 -35 50 C -45 50 -55 42 -55 32 C -55 22 -45 15 -35 15 C -25 15 -18 20 -15 28 L -15 -25 L 20 -35 L 20 15 C 20 25 10 30 0 30 C -10 30 -20 22 -20 12 C -20 2 -10 -5 0 -5 C 10 -5 17 0 20 8 L 20 -35 Z" fill={ink} />
          </g>

          {/* Main Note */}
          <g transform={`translate(200, 180) rotate(${rotation})`}>
            <path d="M -15 -25 L -15 35 C -15 45 -25 50 -35 50 C -45 50 -55 42 -55 32 C -55 22 -45 15 -35 15 C -25 15 -18 20 -15 28 L -15 -25 L 20 -35 L 20 15 C 20 25 10 30 0 30 C -10 30 -20 22 -20 12 C -20 2 -10 -5 0 -5 C 10 -5 17 0 20 8 L 20 -35 Z" fill={c1} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
          </g>

          {/* Sparkles */}
          <path d="M 80 120 L 90 120 M 85 115 L 85 125" stroke={c4} strokeWidth="3" strokeLinecap="round" />
          <circle cx="310" cy="100" r="8" fill={c5} stroke={ink} strokeWidth="3" />
          <circle cx="290" cy="280" r="12" fill={c3} stroke={ink} strokeWidth="3" />
          
          {/* Label banner */}
          <g transform="translate(200, 340) rotate(-2)">
            <rect x="-80" y="-18" width="160" height="36" fill={c4} stroke={ink} strokeWidth="4" rx="2" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>{term1}</text>
          </g>
        </>
      );
    }
  },

  // 2. BRUTALIST G-CLEF (Simple)
  {
    name: 'Brutalist G-Clef',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const rectX = 140 + rand() * 20;
      const rectY = 100 + rand() * 20;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Block Geometry */}
          <rect x={rectX + 8} y={rectY + 8} width="110" height="200" fill={ink} rx="4" />
          <rect x={rectX} y={rectY} width="110" height="200" fill={c2} stroke={ink} strokeWidth="4" rx="4" />
          
          {/* Clef Outline Shadow */}
          <g transform="translate(193, 203) scale(0.9)">
            <path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150 C -25 150, -30 140, -30 130" fill="none" stroke={ink} strokeWidth="18" strokeLinecap="round" />
          </g>

          {/* Clef Front */}
          <g transform="translate(190, 200) scale(0.9)">
            <path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150 C -25 150, -30 140, -30 130" fill="none" stroke={c1} strokeWidth="10" strokeLinecap="round" />
            <circle cx="-10" cy="150" r="10" fill={c3} stroke={ink} strokeWidth="3" />
            <circle cx="20" cy="-110" r="8" fill={c4} stroke={ink} strokeWidth="3" />
          </g>

          {/* Small details */}
          <line x1="60" y1="80" x2="340" y2="80" stroke={ink} strokeWidth="3" strokeDasharray="6 6" />
          <line x1="60" y1="320" x2="340" y2="320" stroke={ink} strokeWidth="3" strokeDasharray="6 6" />
          
          <text x="200" y="370" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink} style={{ letterSpacing: '2px' }}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 3. CAGED CHORD DIAGRAM (Simple)
  {
    name: 'CAGED Chord Diagram',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const strings = [120, 160, 200, 240, 280];
      const frets = [100, 150, 200, 250, 300];
      
      // Dynamic positioning of note dots
      const dots = [
        { s: 0, f: 1, color: c1 },
        { s: 2, f: 2, color: c3 },
        { s: 4, f: 3, color: c4 }
      ];

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Main Fretboard Frame */}
          <rect x="95" y="75" width="210" height="250" fill={paper} stroke={ink} strokeWidth="4" />
          <rect x="95" y="75" width="210" height="15" fill={ink} />
          
          {/* Fret lines */}
          {frets.map((f, i) => (
            <line key={`f-${i}`} x1="95" y1={f} x2="305" y2={f} stroke={ink} strokeWidth="3" />
          ))}

          {/* String lines */}
          {strings.map((s, i) => (
            <line key={`s-${i}`} x1={s} y1="90" x2={s} y2="325" stroke={ink} strokeWidth={i === 0 ? "5" : "3"} />
          ))}

          {/* Note Dots with Shadows */}
          {dots.map((d, i) => {
            const cx = strings[d.s];
            const cy = frets[d.f] - 25;
            return (
              <g key={`dot-${i}`}>
                <circle cx={cx + 3} cy={cy + 3} r="14" fill={ink} />
                <circle cx={cx} cy={cy} r="14" fill={d.color} stroke={ink} strokeWidth="3" />
                <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="12" fill={ink}>R</text>
              </g>
            );
          })}

          {/* Nut marker or X / O */}
          <text x="120" y="65" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>O</text>
          <text x="160" y="65" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>X</text>
          
          {/* Badge */}
          <g transform="translate(280, 50) rotate(8)">
            <rect x="-40" y="-15" width="80" height="30" fill={c2} stroke={ink} strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="14" fill={ink}>
              {term2.slice(0, 5)}
            </text>
          </g>

          <text x="200" y="375" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 4. RETRO METRONOME (Simple)
  {
    name: 'Retro Metronome',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const angle = (rand() * 40) - 20;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Metronome Body Shadow */}
          <path d="M 205 85 L 295 295 L 115 295 Z" fill={ink} />
          {/* Metronome Body */}
          <path d="M 200 80 L 285 285 L 115 285 Z" fill={c1} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
          
          {/* Face plate */}
          <path d="M 200 120 L 255 275 L 145 275 Z" fill={paper} stroke={ink} strokeWidth="3" />

          {/* Tick marks on plate */}
          <line x1="180" y1="160" x2="220" y2="160" stroke={ink} strokeWidth="2" />
          <line x1="175" y1="190" x2="225" y2="190" stroke={ink} strokeWidth="2" />
          <line x1="170" y1="220" x2="230" y2="220" stroke={ink} strokeWidth="2" />
          <line x1="165" y1="250" x2="235" y2="250" stroke={ink} strokeWidth="2" />

          {/* Swinging Arm */}
          <g transform={`translate(200, 270) rotate(${angle})`}>
            <line x1="0" y1="0" x2="0" y2="-170" stroke={ink} strokeWidth="5" strokeLinecap="round" />
            <rect x="-8" y="-130" width="16" height="20" fill={c3} stroke={ink} strokeWidth="3" />
          </g>

          {/* Volume wave indicators */}
          <path d="M 310 140 C 330 160, 330 200, 310 220" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 330 120 C 360 150, 360 210, 330 240" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />

          <circle cx="200" cy="270" r="10" fill={c2} stroke={ink} strokeWidth="3" />

          <text x="200" y="360" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 5. ACOUSTIC ROSETTE & STRINGS (Simple)
  {
    name: 'Acoustic Rosette',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const rosetteR = 75;
      const soundholeR = 55;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Wood background circle */}
          <circle cx="200" cy="180" r="130" fill={c2} stroke={ink} strokeWidth="4" />
          
          {/* Outer Rosette Ring */}
          <circle cx="200" cy="180" r={rosetteR + 15} fill="none" stroke={c3} strokeWidth="5" />
          
          {/* Detailed Rosette Pattern ring */}
          <circle cx="200" cy="180" r={rosetteR} fill="none" stroke={c4} strokeWidth="12" strokeDasharray="8 6" />
          <circle cx="200" cy="180" r={rosetteR} fill="none" stroke={ink} strokeWidth="14" strokeDasharray="1 13" />

          {/* Inner Rosette Ring */}
          <circle cx="200" cy="180" r={rosetteR - 12} fill="none" stroke={c1} strokeWidth="4" />

          {/* Soundhole (Darkness inside) */}
          <circle cx="200" cy="180" r={soundholeR} fill={ink} />

          {/* Strings crossing vertically */}
          {[-50, -30, -10, 10, 30, 50].map((offset, i) => (
            <g key={`str-${i}`}>
              {/* String shadow */}
              <line x1={200 + offset + 3} y1="30" x2={200 + offset + 3} y2="330" stroke={ink} strokeWidth="4" opacity="0.4" />
              {/* String */}
              <line x1={200 + offset} y1="30" x2={200 + offset} y2="330" stroke={paper} strokeWidth={4 - i * 0.4} />
            </g>
          ))}

          {/* Floating Picks */}
          <g transform="translate(90, 270) rotate(-15)">
            <path d="M 0 -20 C 15 -20, 20 -10, 15 15 C 10 25, -10 25, -15 15 C -20 -10, -15 -20, 0 -20 Z" fill={c5} stroke={ink} strokeWidth="3" />
          </g>

          <text x="200" y="370" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 6. STARRY SOUNDWAVES (Simple)
  {
    name: 'Starry Soundwaves',
    complexity: 'simple',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      
      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Sound waves expanding */}
          <circle cx="200" cy="180" r="140" fill="none" stroke={c3} strokeWidth="3" strokeDasharray="10 10" />
          <circle cx="200" cy="180" r="110" fill="none" stroke={c2} strokeWidth="4" />
          <circle cx="200" cy="180" r="80" fill="none" stroke={c4} strokeWidth="5" strokeDasharray="4 4" />
          
          {/* Large Center Star Shadow */}
          <g transform="translate(204, 184) scale(1.1)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={ink} />
          </g>

          {/* Large Center Star */}
          <g transform="translate(200, 180) scale(1.1)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={c1} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="0" cy="0" r="12" fill={c5} stroke={ink} strokeWidth="3" />
          </g>

          {/* Smaller floating stars */}
          <g transform="translate(80, 90) scale(0.4)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={c2} stroke={ink} strokeWidth="6" />
          </g>
          <g transform="translate(320, 250) scale(0.5) rotate(20)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={c4} stroke={ink} strokeWidth="6" />
          </g>

          <text x="200" y="360" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 7. CASSETTE TAPE (Intermediate)
  {
    name: 'Cassette Tape',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          <g transform="translate(200, 180)">
            {/* Shadow */}
            <rect x="-135" y="-85" width="280" height="180" rx="12" fill={ink} />
            
            {/* Main Cassette Body */}
            <rect x="-140" y="-90" width="280" height="180" rx="12" fill={c1} stroke={ink} strokeWidth="5" />
            
            {/* Label Area */}
            <rect x="-100" y="-60" width="200" height="90" rx="6" fill={paper} stroke={ink} strokeWidth="4" />
            
            {/* Tape Reel Windows */}
            <rect x="-55" y="-25" width="110" height="35" rx="4" fill={c2} stroke={ink} strokeWidth="3" />
            
            {/* Reels */}
            <circle cx="-30" cy="-7" r="18" fill={paper} stroke={ink} strokeWidth="3.5" />
            <circle cx="-30" cy="-7" r="6" fill={ink} />
            <line x1="-30" y1="-20" x2="-30" y2="6" stroke={ink} strokeWidth="2" />
            <line x1="-43" y1="-7" x2="-17" y2="-7" stroke={ink} strokeWidth="2" />

            <circle cx="30" cy="-7" r="18" fill={paper} stroke={ink} strokeWidth="3.5" />
            <circle cx="30" cy="-7" r="6" fill={ink} />
            <line x1="30" y1="-20" x2="30" y2="6" stroke={ink} strokeWidth="2" />
            <line x1="17" y1="-7" x2="43" y2="-7" stroke={ink} strokeWidth="2" />

            {/* Trapezoid bottom piece */}
            <path d="M -70 90 L -55 60 L 55 60 L 70 90 Z" fill={c3} stroke={ink} strokeWidth="4" strokeLinejoin="round" />
            <circle cx="-35" cy="75" r="5" fill={ink} />
            <circle cx="35" cy="75" r="5" fill={ink} />

            {/* Label Lines & Text */}
            <line x1="-80" y1="-45" x2="80" y2="-45" stroke={c4} strokeWidth="4" />
            <line x1="-80" y1="-35" x2="80" y2="-35" stroke={c5} strokeWidth="4" />
            <text x="0" y="-48" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>A-SIDE • LO-FI REC</text>
          </g>

          <text x="200" y="335" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>
            {term1}
          </text>
          <text x="200" y="365" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="15" fill={c4}>
            {term2}
          </text>
        </>
      );
    }
  },

  // 8. CIRCLE OF FIFTHS COMPASS (Intermediate)
  {
    name: 'Circle of Fifths Compass',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      const angle = (rand() * 360);

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          <g transform="translate(200, 180)">
            {/* Shadow */}
            <circle cx="5" cy="5" r="120" fill={ink} />
            {/* Outer Circle */}
            <circle cx="0" cy="0" r="120" fill={c1} stroke={ink} strokeWidth="5" />
            
            {/* Dial divisions */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
              const rad = (a * Math.PI) / 180;
              const x1 = 70 * Math.cos(rad);
              const y1 = 70 * Math.sin(rad);
              const x2 = 120 * Math.cos(rad);
              const y2 = 120 * Math.sin(rad);
              return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={ink} strokeWidth="2.5" />;
            })}

            {/* Inner Ring */}
            <circle cx="0" cy="0" r="70" fill={c2} stroke={ink} strokeWidth="4" />
            <circle cx="0" cy="0" r="30" fill={paper} stroke={ink} strokeWidth="4" />

            {/* Pointer Needle */}
            <g transform={`rotate(${angle})`}>
              {/* Needle Shadow */}
              <path d="M 0 -105 L 12 -20 L -12 -20 Z" fill={ink} transform="translate(3,3)" />
              {/* Needle North */}
              <path d="M 0 -105 L 12 -20 L 0 0 Z" fill={c4} stroke={ink} strokeWidth="2" />
              <path d="M 0 -105 L -12 -20 L 0 0 Z" fill={c3} stroke={ink} strokeWidth="2" />
              {/* Needle South */}
              <path d="M 0 50 L 8 -10 L 0 0 Z" fill={c5} stroke={ink} strokeWidth="2" />
              <path d="M 0 50 L -8 -10 L 0 0 Z" fill={paper} stroke={ink} strokeWidth="2" />
              <circle cx="0" cy="0" r="10" fill={ink} />
            </g>

            {/* Key Letters */}
            <text x="0" y="-85" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>C</text>
            <text x="45" y="-72" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>G</text>
            <text x="78" y="-40" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>D</text>
            <text x="90" y="5" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>A</text>
            <text x="-90" y="5" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>F</text>
            <text x="-78" y="-40" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>Bb</text>
          </g>

          <text x="200" y="345" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>
            {term1}
          </text>
          <text x="200" y="370" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="14" fill={c3}>
            CIRCLE OF FIFTHS
          </text>
        </>
      );
    }
  },

  // 9. CLASSIC VINYL RECORD (Intermediate)
  {
    name: 'Classic Vinyl Record',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          <g transform="translate(170, 180)">
            {/* Record emerging - Shadow */}
            <circle cx="103" cy="3" r="105" fill={ink} />
            {/* Record Body */}
            <circle cx="100" cy="0" r="105" fill={ink} stroke={ink} strokeWidth="2" />
            
            {/* Grooves */}
            <circle cx="100" cy="0" r="85" fill="none" stroke={paper} strokeWidth="1" strokeDasharray="30 2" opacity="0.3" />
            <circle cx="100" cy="0" r="70" fill="none" stroke={paper} strokeWidth="1" opacity="0.3" />
            <circle cx="100" cy="0" r="55" fill="none" stroke={paper} strokeWidth="1" strokeDasharray="40 4" opacity="0.3" />
            
            {/* Record Label */}
            <circle cx="100" cy="0" r="30" fill={c2} stroke={ink} strokeWidth="3" />
            <circle cx="100" cy="0" r="10" fill={c4} stroke={ink} strokeWidth="2" />
            <circle cx="100" cy="0" r="3" fill={paper} />

            {/* Sleeve Shadow */}
            <rect x="-122" y="-112" width="220" height="220" rx="6" fill={ink} />
            {/* Sleeve Body */}
            <rect x="-125" y="-115" width="220" height="220" rx="6" fill={c1} stroke={ink} strokeWidth="5" />
            
            {/* Sleeve Design Circles */}
            <circle cx="-15" cy="0" r="50" fill={c3} stroke={ink} strokeWidth="4" />
            <circle cx="-15" cy="0" r="25" fill={paper} stroke={ink} strokeWidth="3" />
            
            {/* Graphical Lines */}
            <line x1="-100" y1="-80" x2="60" y2="-80" stroke={ink} strokeWidth="4" />
            <line x1="-100" y1="-65" x2="60" y2="-65" stroke={c5} strokeWidth="4" />
            <line x1="-100" y1="80" x2="60" y2="80" stroke={ink} strokeWidth="4" />

            {/* Small note icon on sleeve */}
            <path d="M -20 10 L -20 -10 L 0 -15 L 0 5 M -20 -2 C -20 2, -26 2, -26 -2 C -26 -6, -20 -6, -20 -2 Z" fill={ink} stroke={ink} strokeWidth="2" />
          </g>

          <text x="200" y="340" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fill={ink}>
            {term1}
          </text>
          <text x="200" y="370" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="14" fill={c3} style={{ letterSpacing: '4px' }}>
            LP RECORD
          </text>
        </>
      );
    }
  },

  // 10. THE ELECTRIC FRETBOARD (Intermediate)
  {
    name: 'The Electric Fretboard',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Rotated Neck Piece */}
          <g transform="translate(200, 180) rotate(-35)">
            {/* Neck shadow */}
            <rect x="-42" y="-180" width="90" height="360" fill={ink} />
            {/* Neck board */}
            <rect x="-45" y="-180" width="90" height="360" fill={c2} stroke={ink} strokeWidth="5" />
            
            {/* Frets */}
            {[-135, -90, -45, 0, 45, 90, 135].map((y, i) => (
              <line key={`fr-${i}`} x1="-45" y1={y} x2="45" y2={y} stroke={ink} strokeWidth="4" />
            ))}

            {/* Fret marker dots (real inlay) */}
            <circle cx="0" cy="-67" r="6" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="0" cy="67" r="6" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="-15" cy="157" r="5" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="15" cy="157" r="5" fill={paper} stroke={ink} strokeWidth="2" />

            {/* Six Strings */}
            {[-30, -18, -6, 6, 18, 30].map((x, i) => (
              <line key={`st-${i}`} x1={x} y1="-180" x2={x} y2="180" stroke={paper} strokeWidth={3 - i * 0.3} />
            ))}

            {/* Scale Note Highlights */}
            <circle cx="-18" cy="-112" r="12" fill={c1} stroke={ink} strokeWidth="3" />
            <text x="-18" y="-8" transform="translate(0, -100)" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>C</text>

            <circle cx="18" cy="-22" r="12" fill={c3} stroke={ink} strokeWidth="3" />
            <text x="18" y="-18" transform="translate(0, 0)" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>E</text>

            <circle cx="-6" cy="112" r="12" fill={c4} stroke={ink} strokeWidth="3" />
            <text x="-6" y="-8" transform="translate(0, 120)" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>G</text>
          </g>

          {/* Graphical accents */}
          <circle cx="70" cy="90" r="16" fill={c5} stroke={ink} strokeWidth="3" />
          <path d="M 310 90 L 330 90 M 320 80 L 320 100" stroke={c1} strokeWidth="4" strokeLinecap="round" />

          {/* Header/Footer Text */}
          <g transform="translate(200, 355) rotate(1)">
            <rect x="-100" y="-20" width="200" height="40" fill={c4} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>
              {term1}
            </text>
          </g>
        </>
      );
    }
  },

  // 11. ANALOG TUNING FORK & WAVEFORM (Intermediate)
  {
    name: 'Analog Tuning Fork',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      
      // Dynamic sine wave points
      const wavePoints = [];
      for (let x = 40; x <= 360; x += 10) {
        const y = 240 + Math.sin((x - 40) * 0.08) * 35;
        wavePoints.push(`${x},${y}`);
      }

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Oscilloscope Grid background */}
          <rect x="40" y="70" width="320" height="210" fill={c2} stroke={ink} strokeWidth="4" />
          <line x1="40" y1="175" x2="360" y2="175" stroke={ink} strokeWidth="2" strokeDasharray="4 4" />
          <line x1="200" y1="70" x2="200" y2="280" stroke={ink} strokeWidth="2" strokeDasharray="4 4" />
          
          {/* Sine Wave */}
          <polyline points={wavePoints.join(' ')} fill="none" stroke={c5} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={wavePoints.join(' ')} fill="none" stroke={paper} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

          {/* Tuning Fork Shadow */}
          <g transform="translate(204, 154)">
            <path d="M -30 -60 L -30 20 A 30 30 0 0 0 30 20 L 30 -60 L 20 -60 L 20 20 A 20 20 0 0 1 -20 20 L -20 -60 Z" fill={ink} />
            <rect x="-6" y="30" width="12" height="60" rx="3" fill={ink} />
            <circle cx="0" cy="90" r="14" fill={ink} />
          </g>

          {/* Tuning Fork Body */}
          <g transform="translate(200, 150)">
            <path d="M -30 -60 L -30 20 A 30 30 0 0 0 30 20 L 30 -60 L 20 -60 L 20 20 A 20 20 0 0 1 -20 20 L -20 -60 Z" fill={c1} stroke={ink} strokeWidth="4" />
            <rect x="-6" y="30" width="12" height="60" rx="3" fill={c1} stroke={ink} strokeWidth="4" />
            <circle cx="0" cy="90" r="12" fill={c3} stroke={ink} strokeWidth="4" />
          </g>

          {/* Sound waves emitting from prongs */}
          <path d="M 150 70 A 20 20 0 0 0 150 110" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 250 70 A 20 20 0 0 1 250 110" fill="none" stroke={ink} strokeWidth="3.5" strokeLinecap="round" />
          
          <path d="M 140 60 A 30 30 0 0 0 140 120" fill="none" stroke={c4} strokeWidth="3" strokeLinecap="round" />
          <path d="M 260 60 A 30 30 0 0 1 260 120" fill="none" stroke={c4} strokeWidth="3" strokeLinecap="round" />

          {/* Text panel */}
          <g transform="translate(200, 345) rotate(-1)">
            <rect x="-110" y="-18" width="220" height="36" fill={c4} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="15" fill={ink}>
              {term1} • 440 HZ
            </text>
          </g>
        </>
      );
    }
  },

  // 12. NEON KEYBOARD / PIANO KEYS (Intermediate)
  {
    name: 'Synth Keyboard',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      
      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Decorative Back Panel */}
          <rect x="40" y="50" width="320" height="230" fill={c3} stroke={ink} strokeWidth="4" />
          
          {/* Floating musical note curves */}
          <path d="M 80 120 Q 140 60, 200 120 T 320 120" fill="none" stroke={c5} strokeWidth="8" strokeLinecap="round" />
          <path d="M 80 120 Q 140 60, 200 120 T 320 120" fill="none" stroke={paper} strokeWidth="4" strokeLinecap="round" />

          {/* Keyboard base shadow */}
          <path d="M 38 188 L 362 188 L 382 278 L 18 278 Z" fill={ink} />
          {/* Keyboard base */}
          <path d="M 35 185 L 365 185 L 385 275 L 15 275 Z" fill={c2} stroke={ink} strokeWidth="4" strokeLinejoin="round" />

          {/* White keys (perspective lines) */}
          <polygon points="15,275 35,185 75,185 65,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="65,275 75,185 115,185 115,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="115,275 115,185 155,185 165,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="165,275 155,185 195,185 215,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="215,275 195,185 235,185 265,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="265,275 235,185 275,185 315,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="315,275 275,185 315,185 365,275" fill={paper} stroke={ink} strokeWidth="3" />
          <polygon points="365,275 315,185 355,185 385,275" fill={paper} stroke={ink} strokeWidth="3" />

          {/* Black keys (perspective) */}
          <polygon points="50,225 58,185 70,185 64,225" fill={ink} />
          <polygon points="98,225 96,185 108,185 110,225" fill={ink} />
          <polygon points="144,225 136,185 148,185 154,225" fill={ink} />
          
          <polygon points="210,225 190,185 202,185 220,225" fill={ink} />
          <polygon points="256,225 228,185 240,185 266,225" fill={ink} />
          <polygon points="302,225 266,185 278,185 312,225" fill={ink} />

          {/* Accent Stars */}
          <g transform="translate(70, 90) scale(0.3)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={c1} stroke={ink} strokeWidth="6" />
          </g>
          <g transform="translate(320, 80) scale(0.3) rotate(15)">
            <path d="M 0 -50 L 15 -15 L 50 -15 L 20 10 L 32 45 L 0 20 L -32 45 L -20 10 L -50 -15 L -15 -15 Z" fill={c4} stroke={ink} strokeWidth="6" />
          </g>

          <text x="200" y="345" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fill={ink}>
            {term1}
          </text>
          <text x="200" y="375" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="13" fill={c4} style={{ letterSpacing: '2px' }}>
            {term2}
          </text>
        </>
      );
    }
  },

  // 13. RETRO STAGE MICROPHONE (Intermediate)
  {
    name: 'Retro Stage Microphone',
    complexity: 'intermediate',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Radial Sound Waves */}
          <circle cx="200" cy="160" r="110" fill="none" stroke={c3} strokeWidth="4" strokeDasharray="10 10" />
          <circle cx="200" cy="160" r="85" fill="none" stroke={c2} strokeWidth="3.5" />
          
          {/* Mic Stand Shadow */}
          <g transform="translate(204, 164)">
            <rect x="-8" y="90" width="16" height="120" fill={ink} />
            <path d="M -45 -90 C -45 -40, -5 -30, -5 40 L -15 90 L 15 90 L 5 40 C 5 -30, 45 -40, 45 -90 Z" fill={ink} />
            <rect x="-35" y="-95" width="70" height="90" rx="35" fill={ink} />
          </g>

          {/* Mic Stand */}
          <rect x="194" y="250" width="12" height="110" fill={c4} stroke={ink} strokeWidth="4" />

          {/* Mic Mechanical Connector */}
          <path d="M 180 230 C 180 260, 220 260, 220 230 Z" fill={c5} stroke={ink} strokeWidth="4" />

          {/* Neck / Stem */}
          <path d="M 195 190 L 195 240 L 205 240 L 205 190 Z" fill={paper} stroke={ink} strokeWidth="4" />

          {/* Mic Grille Head Outer */}
          <rect x="165" y="65" width="70" height="90" rx="35" fill={c1} stroke={ink} strokeWidth="4" />
          
          {/* Inner Grille details */}
          <rect x="175" y="75" width="50" height="70" rx="25" fill={paper} stroke={ink} strokeWidth="3" />
          
          {/* Vertical ribs */}
          <line x1="200" y1="75" x2="200" y2="145" stroke={ink} strokeWidth="5" />
          <line x1="188" y1="80" x2="188" y2="140" stroke={ink} strokeWidth="3.5" />
          <line x1="212" y1="80" x2="212" y2="140" stroke={ink} strokeWidth="3.5" />

          {/* Horizontal ribs */}
          <line x1="175" y1="95" x2="225" y2="95" stroke={ink} strokeWidth="3" />
          <line x1="175" y1="110" x2="225" y2="110" stroke={ink} strokeWidth="3" />
          <line x1="175" y1="125" x2="225" y2="125" stroke={ink} strokeWidth="3" />

          {/* Horizontal center band */}
          <rect x="160" y="115" width="80" height="15" fill={c3} stroke={ink} strokeWidth="3.5" />

          <text x="200" y="375" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 14. THE GLAMOUR STRATOCASTER (Complete)
  {
    name: 'The Glamour Stratocaster',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      
      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Giant background text */}
          <text x="20" y="110" fontFamily="Arial Black, sans-serif" fontSize="72" fontWeight="900" fill={c4} opacity="0.25">ROCK</text>
          
          {/* Abstract background shapes */}
          <path d="M 300 40 L 360 100 L 260 200 Z" fill={c3} opacity="0.3" stroke={ink} strokeWidth="2" strokeDasharray="3 3" />

          {/* Guitar Body Shadow */}
          <g transform="translate(184, 194) rotate(-25)">
            <path d="M -110 -60 C -110 -120, -50 -140, 0 -130 C 50 -120, 80 -80, 80 -40 C 80 20, 110 50, 110 90 C 110 130, 70 170, 0 170 C -70 170, -110 130, -110 90 C -110 50, -80 30, -80 0 Z" fill={ink} />
            <rect x="-15" y="-240" width="30" height="200" fill={ink} />
          </g>

          {/* Guitar Neck & Fretboard (extends from body) */}
          <g transform="translate(180, 190) rotate(-25)">
            {/* Wooden neck base */}
            <rect x="-15" y="-240" width="30" height="200" fill={c2} stroke={ink} strokeWidth="4" />
            {/* Frets */}
            {[-220, -180, -140, -100, -60].map((fy, i) => (
              <line key={`fret-${i}`} x1="-15" y1={fy} x2="15" y2={fy} stroke={ink} strokeWidth="3" />
            ))}
            
            {/* Body */}
            <path d="M -110 -60 C -110 -120, -50 -140, 0 -130 C 50 -120, 80 -80, 80 -40 C 80 20, 110 50, 110 90 C 110 130, 70 170, 0 170 C -70 170, -110 130, -110 90 C -110 50, -80 30, -80 0 Z" fill={c1} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
            
            {/* Pickguard (Strat style) */}
            <path d="M -80 -20 C -80 -80, -20 -90, 10 -90 C 40 -90, 60 -60, 60 -20 C 60 40, 90 70, 80 110 C 50 140, 0 150, -40 120 C -70 90, -80 40, -80 -20 Z" fill={paper} stroke={ink} strokeWidth="4" />

            {/* Pickups */}
            <rect x="-25" y="-60" width="50" height="15" rx="4" fill={c3} stroke={ink} strokeWidth="3" />
            <circle cx="-15" cy="-52" r="2.5" fill={ink} /><circle cx="-5" cy="-52" r="2.5" fill={ink} /><circle cx="5" cy="-52" r="2.5" fill={ink} /><circle cx="15" cy="-52" r="2.5" fill={ink} />

            <rect x="-25" y="-30" width="50" height="15" rx="4" fill={c3} stroke={ink} strokeWidth="3" />
            <circle cx="-15" cy="-22" r="2.5" fill={ink} /><circle cx="-5" cy="-22" r="2.5" fill={ink} /><circle cx="5" cy="-22" r="2.5" fill={ink} /><circle cx="15" cy="-22" r="2.5" fill={ink} />
            
            <rect x="-25" y="0" width="50" height="15" rx="4" fill={c3} stroke={ink} strokeWidth="3" />
            <circle cx="-15" cy="8" r="2.5" fill={ink} /><circle cx="-5" cy="8" r="2.5" fill={ink} /><circle cx="5" cy="8" r="2.5" fill={ink} /><circle cx="15" cy="8" r="2.5" fill={ink} />

            {/* Bridge */}
            <rect x="-30" y="45" width="60" height="35" fill={c5} stroke={ink} strokeWidth="3" />
            
            {/* Control Knobs */}
            <circle cx="-30" cy="100" r="10" fill={c4} stroke={ink} strokeWidth="3" />
            <circle cx="-10" cy="120" r="10" fill={c4} stroke={ink} strokeWidth="3" />
            <circle cx="15" cy="115" r="10" fill={c4} stroke={ink} strokeWidth="3" />

            {/* Output Jack Plate */}
            <path d="M 45 100 L 75 130 C 65 140, 55 140, 45 130 Z" fill={c2} stroke={ink} strokeWidth="3" />
            <circle cx="60" cy="115" r="5" fill={ink} />
          </g>

          {/* Sparkles / Confetti */}
          <path d="M 60 290 L 70 290 M 65 285 L 65 295" stroke={c3} strokeWidth="3" strokeLinecap="round" />
          <circle cx="340" cy="280" r="7" fill={c5} stroke={ink} strokeWidth="2.5" />
          
          {/* Title Banner */}
          <g transform="translate(200, 360) rotate(-1)">
            <rect x="-110" y="-18" width="220" height="36" fill={c3} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>{term1}</text>
          </g>
        </>
      );
    }
  },

  // 15. THE ACOUSTIC DREADNOUGHT (Complete)
  {
    name: 'The Acoustic Dreadnought',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Concentric waves in background */}
          <ellipse cx="200" cy="200" rx="160" ry="120" fill="none" stroke={c5} strokeWidth="3" strokeDasharray="12 8" />
          
          {/* Dreadnought Body Shadow */}
          <g transform="translate(204, 184)">
            <path d="M -90 -120 C -60 -125, -40 -105, 0 -105 C 40 -105, 60 -125, 90 -120 C 120 -90, 110 -30, 75 -10 C 110 20, 120 100, 95 130 C 70 160, -70 160, -95 130 C -120 100, -110 20, -75 -10 C -110 -30, -120 -90, -90 -120 Z" fill={ink} />
          </g>

          {/* Dreadnought Body */}
          <g transform="translate(200, 180)">
            <path d="M -90 -120 C -60 -125, -40 -105, 0 -105 C 40 -105, 60 -125, 90 -120 C 120 -90, 110 -30, 75 -10 C 110 20, 120 100, 95 130 C 70 160, -70 160, -95 130 C -120 100, -110 20, -75 -10 C -110 -30, -120 -90, -90 -120 Z" fill={c1} stroke={ink} strokeWidth="5" strokeLinejoin="round" />
            
            {/* Edge purfling binding */}
            <path d="M -85 -115 C -57 -120, -38 -100, 0 -100 C 38 -100, 57 -120, 85 -115 C 112 -87, 102 -30, 70 -8 C 102 20, 112 95, 90 122 C 67 150, -67 150, -90 122 C -112 95, -102 20, -70 -8 C -102 -30, -112 -87, -85 -115 Z" fill="none" stroke={paper} strokeWidth="3" />

            {/* Pickguard (Teardrop shape) */}
            <path d="M 15 -35 C 45 -35, 55 10, 35 45 C 25 35, 20 5, 15 -35 Z" fill={ink} />

            {/* Soundhole Rings */}
            <circle cx="0" cy="-35" r="40" fill="none" stroke={c3} strokeWidth="8" />
            <circle cx="0" cy="-35" r="34" fill="none" stroke={c4} strokeWidth="4" />
            <circle cx="0" cy="-35" r="28" fill={ink} />

            {/* Bridge Shadow */}
            <rect x="-42" y="47" width="90" height="22" rx="4" fill={ink} />
            {/* Bridge */}
            <rect x="-45" y="44" width="90" height="22" rx="4" fill={c2} stroke={ink} strokeWidth="3.5" />
            <line x1="-35" y1="55" x2="35" y2="55" stroke={ink} strokeWidth="3" />
            <circle cx="-25" cy="55" r="2.5" fill={paper} /><circle cx="-15" cy="55" r="2.5" fill={paper} /><circle cx="-5" cy="55" r="2.5" fill={paper} />
            <circle cx="5" cy="55" r="2.5" fill={paper} /><circle cx="15" cy="55" r="2.5" fill={paper} /><circle cx="25" cy="55" r="2.5" fill={paper} />

            {/* Neck board base */}
            <rect x="-10" y="-190" width="20" height="85" fill={c5} stroke={ink} strokeWidth="3" />
          </g>

          {/* Floating chord bubbles */}
          <g transform="translate(60, 80) rotate(-10)">
            <rect x="-25" y="-12" width="50" height="24" fill={c3} stroke={ink} strokeWidth="3" rx="4" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="11" fill={ink}>Cmaj7</text>
          </g>
          <g transform="translate(330, 110) rotate(15)">
            <rect x="-25" y="-12" width="50" height="24" fill={c4} stroke={ink} strokeWidth="3" rx="4" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="11" fill={ink}>Gadd9</text>
          </g>

          <text x="200" y="360" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="22" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 16. SONGWRITER DESK COLLAGE (Complete)
  {
    name: 'Songwriter Desk Collage',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Main Paper Sheet Shadow */}
          <rect x="74" y="54" width="250" height="290" fill={ink} rx="4" transform="rotate(-3 200 200)" />
          {/* Main Paper Sheet */}
          <rect x="70" y="50" width="250" height="290" fill={paper} stroke={ink} strokeWidth="4" rx="4" transform="rotate(-3 200 200)" />

          {/* Staff Lines on Sheet */}
          <g transform="translate(200, 200) rotate(-3) translate(-200, -200)">
            {/* Title line */}
            <text x="90" y="85" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>Untitled Jam</text>
            <line x1="90" y1="95" x2="300" y2="95" stroke={c3} strokeWidth="3" />

            {/* Staff Group 1 */}
            {[120, 130, 140, 150, 160].map((ly, i) => (
              <line key={`st1-${i}`} x1="90" y1={ly} x2="300" y2={ly} stroke={ink} strokeWidth="1.5" />
            ))}
            {/* Draw clef & notes */}
            <path d="M 100 165 C 100 175, 90 175, 90 165 C 90 155, 105 145, 105 130 L 105 170" fill="none" stroke={ink} strokeWidth="2.5" />
            <circle cx="140" cy="150" r="5" fill={ink} />
            <line x1="145" y1="150" x2="145" y2="125" stroke={ink} strokeWidth="2" />
            <circle cx="180" cy="140" r="5" fill={ink} />
            <line x1="185" y1="140" x2="185" y2="115" stroke={ink} strokeWidth="2" />
            <path d="M 185 115 Q 195 120, 205 115" fill="none" stroke={ink} strokeWidth="2" />

            {/* Staff Group 2 */}
            {[190, 200, 210, 220, 230].map((ly, i) => (
              <line key={`st2-${i}`} x1="90" y1={ly} x2="300" y2={ly} stroke={ink} strokeWidth="1.5" />
            ))}
            <circle cx="120" cy="210" r="5" fill={ink} />
            <line x1="125" y1="210" x2="125" y2="185" stroke={ink} strokeWidth="2" />
            <circle cx="160" cy="200" r="5" fill={ink} />
            <line x1="165" y1="200" x2="165" y2="175" stroke={ink} strokeWidth="2" />
            <line x1="125" y1="185" x2="165" y2="175" stroke={ink} strokeWidth="3" />
          </g>

          {/* Coffee Mug Overlap Shadow */}
          <circle cx="318" cy="298" r="40" fill={ink} />
          {/* Coffee Mug */}
          <circle cx="315" cy="295" r="40" fill={c1} stroke={ink} strokeWidth="4" />
          <circle cx="315" cy="295" r="30" fill={c2} stroke={ink} strokeWidth="3" />
          {/* Handle */}
          <path d="M 353 280 C 375 280, 375 310, 353 310" fill="none" stroke={ink} strokeWidth="8" />
          <path d="M 353 280 C 375 280, 375 310, 353 310" fill="none" stroke={c1} strokeWidth="4" />

          {/* Tape Cassette lying down */}
          <g transform="translate(100, 290) rotate(15) scale(0.65)">
            <rect x="-70" y="-45" width="140" height="90" rx="6" fill={ink} />
            <rect x="-72" y="-47" width="140" height="90" rx="6" fill={c4} stroke={ink} strokeWidth="4" />
            <rect x="-50" y="-30" width="100" height="45" rx="3" fill={paper} stroke={ink} strokeWidth="3" />
            <circle cx="-20" cy="-7" r="10" fill={ink} />
            <circle cx="20" cy="-7" r="10" fill={ink} />
          </g>

          {/* Guitar Pick floating */}
          <g transform="translate(250, 80) rotate(-40)">
            <path d="M 0 -15 C 10 -15, 12 -8, 8 10 C 5 18, -5 18, -8 10 C -12 -8, -10 -15, 0 -15 Z" fill={c5} stroke={ink} strokeWidth="3" />
            <text x="0" y="3" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>M</text>
          </g>

          {/* Big Term Badge */}
          <g transform="translate(200, 365) rotate(1)">
            <rect x="-120" y="-20" width="240" height="40" fill={c3} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>
              {term1} • {term2.slice(0, 7)}
            </text>
          </g>
        </>
      );
    }
  },

  // 17. MUSIC THEORY MATRIX (Complete)
  {
    name: 'Music Theory Matrix',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Grid Layout background */}
          <rect x="30" y="30" width="340" height="300" fill={paper} stroke={ink} strokeWidth="5" />
          
          {/* Subdivisions */}
          <line x1="30" y1="130" x2="370" y2="130" stroke={ink} strokeWidth="4" />
          <line x1="30" y1="230" x2="370" y2="230" stroke={ink} strokeWidth="4" />
          <line x1="200" y1="30" x2="200" y2="330" stroke={ink} strokeWidth="4" />

          {/* Grid Quadrant 1: Circle of fifths segment */}
          <g transform="translate(115, 80)">
            <path d="M 0 0 L -40 20 A 45 45 0 0 1 -20 -40 Z" fill={c1} stroke={ink} strokeWidth="2.5" />
            <path d="M 0 0 L 20 -40 A 45 45 0 0 1 40 10 Z" fill={c2} stroke={ink} strokeWidth="2.5" />
            <circle cx="0" cy="0" r="15" fill={paper} stroke={ink} strokeWidth="2.5" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>V</text>
          </g>

          {/* Grid Quadrant 2: Chord Intervals Formula */}
          <g transform="translate(285, 80)">
            <rect x="-60" y="-30" width="120" height="60" fill={c3} stroke={ink} strokeWidth="3" />
            <text x="0" y="-5" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="12" fill={ink}>TRIAD FORMULA</text>
            <text x="0" y="18" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>1 - 3 - 5</text>
          </g>

          {/* Grid Quadrant 3: Horizontal Mini Fretboard */}
          <g transform="translate(115, 180)">
            <rect x="-70" y="-20" width="140" height="40" fill={c4} stroke={ink} strokeWidth="3" />
            <line x1="-70" y1="-7" x2="70" y2="-7" stroke={ink} strokeWidth="2" />
            <line x1="-70" y1="7" x2="70" y2="7" stroke={ink} strokeWidth="2" />
            <line x1="-35" y1="-20" x2="-35" y2="20" stroke={ink} strokeWidth="2" />
            <line x1="0" y1="-20" x2="0" y2="20" stroke={ink} strokeWidth="2" />
            <line x1="35" y1="-20" x2="35" y2="20" stroke={ink} strokeWidth="2" />
            <circle cx="-17" cy="-7" r="6" fill={c1} stroke={ink} strokeWidth="1.5" />
            <circle cx="17" cy="7" r="6" fill={c5} stroke={ink} strokeWidth="1.5" />
          </g>

          {/* Grid Quadrant 4: Mode block */}
          <g transform="translate(285, 180)">
            <rect x="-60" y="-30" width="120" height="60" fill={c2} rx="6" stroke={ink} strokeWidth="3" />
            <text x="0" y="5" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="14" fill={ink}>
              {term2.slice(0, 10)}
            </text>
          </g>

          {/* Grid Bottom: Long scale list */}
          <g transform="translate(200, 280)">
            <rect x="-150" y="-25" width="300" height="40" fill={c5} stroke={ink} strokeWidth="3.5" />
            <text x="0" y="2" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="13" fill={ink}>
              KEY: C MAJOR • SCALE: {term1}
            </text>
            <text x="0" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="9" fill={ink}>
              C - D - E - F - G - A - B - C
            </text>
          </g>

          {/* Title tag on side */}
          <g transform="translate(200, 365)">
            <rect x="-90" y="-18" width="180" height="36" fill={c1} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>THEORY MATRIX</text>
          </g>
        </>
      );
    }
  },

  // 18. THE SYNTHESIZER MODULE (Complete)
  {
    name: 'The Synthesizer Module',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;
      
      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Main Synth Panel */}
          <rect x="35" y="35" width="330" height="290" fill={c1} stroke={ink} strokeWidth="5" />
          <rect x="35" y="35" width="330" height="35" fill={ink} />
          <text x="50" y="58" fontFamily="Arial Black, sans-serif" fontSize="16" fill={paper}>GLAM-SYNTH 101</text>
          <text x="345" y="58" textAnchor="end" fontFamily="Arial Black, sans-serif" fontSize="12" fill={c4}>VCO / LFO</text>

          {/* Waveform Screen */}
          <rect x="60" y="90" width="120" height="80" fill={ink} stroke={ink} strokeWidth="3" />
          <rect x="63" y="93" width="114" height="74" fill={c2} stroke={ink} strokeWidth="2" />
          {/* Sine Grid */}
          <line x1="63" y1="130" x2="177" y2="130" stroke={ink} strokeWidth="1" strokeDasharray="3 3" />
          <line x1="120" y1="93" x2="120" y2="167" stroke={ink} strokeWidth="1" strokeDasharray="3 3" />
          {/* Sine Wave */}
          <path d="M 65 130 Q 90 100, 120 130 T 175 130" fill="none" stroke={ink} strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 65 130 Q 90 100, 120 130 T 175 130" fill="none" stroke={paper} strokeWidth="2" strokeLinecap="round" />

          {/* Dials (Rotary knobs) */}
          <g transform="translate(240, 130)">
            <circle cx="0" cy="0" r="22" fill={c3} stroke={ink} strokeWidth="3.5" />
            <circle cx="0" cy="0" r="14" fill={paper} stroke={ink} strokeWidth="3" />
            <line x1="0" y1="0" x2="10" y2="-10" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <text x="0" y="36" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>CUTOFF</text>
          </g>
          <g transform="translate(310, 130)">
            <circle cx="0" cy="0" r="22" fill={c4} stroke={ink} strokeWidth="3.5" />
            <circle cx="0" cy="0" r="14" fill={paper} stroke={ink} strokeWidth="3" />
            <line x1="0" y1="0" x2="-12" y2="-7" stroke={ink} strokeWidth="4" strokeLinecap="round" />
            <text x="0" y="36" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="10" fill={ink}>RESO</text>
          </g>

          {/* Sliders (ADSR Envelope) */}
          <g transform="translate(60, 200)">
            <rect x="0" y="0" width="130" height="95" fill={paper} stroke={ink} strokeWidth="3" />
            {/* Slider tracks */}
            {[25, 55, 85, 115].map((sx, i) => (
              <g key={i}>
                <line x1={sx} y1="15" x2={sx} y2="80" stroke={ink} strokeWidth="3" strokeLinecap="round" />
                <rect x={sx - 8} y={25 + i * 10} width="16" height="10" fill={c5} stroke={ink} strokeWidth="2" />
              </g>
            ))}
            <text x="25" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="950" fontSize="8" fill={ink}>A</text>
            <text x="55" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="950" fontSize="8" fill={ink}>D</text>
            <text x="85" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="950" fontSize="8" fill={ink}>S</text>
            <text x="115" y="90" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="950" fontSize="8" fill={ink}>R</text>
          </g>

          {/* Jacks (Patch cable ports) */}
          <g transform="translate(230, 240)">
            <circle cx="0" cy="0" r="12" fill={c2} stroke={ink} strokeWidth="3" />
            <circle cx="0" cy="0" r="5" fill={ink} />
            <text x="0" y="24" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="8" fill={ink}>LFO IN</text>
          </g>
          <g transform="translate(290, 240)">
            <circle cx="0" cy="0" r="12" fill={c2} stroke={ink} strokeWidth="3" />
            <circle cx="0" cy="0" r="5" fill={ink} />
            <text x="0" y="24" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="8" fill={ink}>GATE</text>
          </g>
          <g transform="translate(340, 240)">
            <circle cx="0" cy="0" r="12" fill={c2} stroke={ink} strokeWidth="3" />
            <circle cx="0" cy="0" r="5" fill={ink} />
            <text x="0" y="24" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="8" fill={ink}>OUT</text>
          </g>

          {/* Patch Cord (Curved cable) */}
          <path d="M 230 240 C 240 310, 280 310, 290 240" fill="none" stroke={ink} strokeWidth="8" />
          <path d="M 230 240 C 240 310, 280 310, 290 240" fill="none" stroke={c5} strokeWidth="4" />

          {/* Title Banner */}
          <g transform="translate(200, 360)">
            <rect x="-90" y="-18" width="180" height="36" fill={c4} stroke={ink} strokeWidth="4" />
            <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>{term1}</text>
          </g>
        </>
      );
    }
  },

  // 19. COSMIC AUDIO HEADSET (Complete)
  {
    name: 'Cosmic Audio Headset',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Starfield / Sparkles */}
          <circle cx="70" cy="80" r="2" fill={ink} /><circle cx="340" cy="100" r="3" fill={ink} />
          <circle cx="90" cy="270" r="3.5" fill={c3} stroke={ink} strokeWidth="1.5" />
          
          <g transform="translate(200, 180)">
            {/* Record Planet (Saturn Grooves) */}
            {/* Ring Back */}
            <path d="M -150 -10 C -150 25, 150 25, 150 -10" fill="none" stroke={ink} strokeWidth="16" strokeLinecap="round" />
            <path d="M -150 -10 C -150 25, 150 25, 150 -10" fill="none" stroke={c3} strokeWidth="10" strokeLinecap="round" />
            
            {/* Planet sphere shadow */}
            <circle cx="3" cy="3" r="70" fill={ink} />
            {/* Planet sphere */}
            <circle cx="0" cy="0" r="70" fill={c1} stroke={ink} strokeWidth="4.5" />

            {/* Grooves on sphere */}
            <circle cx="0" cy="0" r="50" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="20 10" />
            <circle cx="0" cy="0" r="30" fill="none" stroke={paper} strokeWidth="1.5" opacity="0.4" />
            <circle cx="0" cy="0" r="10" fill={c4} stroke={ink} strokeWidth="3.5" />
            
            {/* Ring Front */}
            <path d="M -150 -10 C -150 -45, 150 -45, 150 -10" fill="none" stroke={ink} strokeWidth="16" strokeLinecap="round" />
            <path d="M -150 -10 C -150 -45, 150 -45, 150 -10" fill="none" stroke={c3} strokeWidth="10" strokeLinecap="round" />

            {/* Headphones Headband Shadow */}
            <path d="M -90 -30 C -90 -120, 90 -120, 90 -30" fill="none" stroke={ink} strokeWidth="22" strokeLinecap="round" />
            {/* Headphones Headband */}
            <path d="M -90 -30 C -90 -120, 90 -120, 90 -30" fill="none" stroke={c2} strokeWidth="14" strokeLinecap="round" />
            <path d="M -80 -30 C -80 -110, 80 -110, 80 -30" fill="none" stroke={paper} strokeWidth="2" strokeLinecap="round" />

            {/* Ear Cups */}
            {/* Left cup shadow */}
            <rect x="-102" y="-42" width="24" height="74" rx="10" fill={ink} />
            {/* Left cup */}
            <rect x="-105" y="-45" width="24" height="74" rx="10" fill={c5} stroke={ink} strokeWidth="4.5" />
            <rect x="-95" y="-30" width="10" height="44" rx="5" fill={paper} />

            {/* Right cup shadow */}
            <rect x="78" y="-42" width="24" height="74" rx="10" fill={ink} />
            {/* Right cup */}
            <rect x="81" y="-45" width="24" height="74" rx="10" fill={c5} stroke={ink} strokeWidth="4.5" />
            <rect x="85" y="-30" width="10" height="44" rx="5" fill={paper} />
          </g>

          {/* Orbiting music note */}
          <g transform="translate(320, 240) rotate(15)">
            <circle cx="-10" cy="10" r="6" fill={c4} stroke={ink} strokeWidth="2" />
            <circle cx="10" cy="5" r="6" fill={c4} stroke={ink} strokeWidth="2" />
            <path d="M -6 10 L -6 -10 L 14 -15 L 14 5" fill="none" stroke={ink} strokeWidth="3" />
          </g>

          <text x="200" y="355" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fill={ink}>
            {term1}
          </text>
        </>
      );
    }
  },

  // 20. GRAND MASTERCLASS COLLAGE (Complete)
  {
    name: 'Grand Masterclass Collage',
    complexity: 'complete',
    render: (rand, colors, term1, term2, patternId, patternType) => {
      const [c1, c2, c3, c4, c5, paper, ink] = colors;

      return (
        <>
          {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
          
          {/* Spotlight yellow cone */}
          <polygon points="200,0 50,400 350,400" fill={c2} opacity="0.15" />

          {/* Keyboard base at bottom */}
          <rect x="40" y="270" width="320" height="50" fill={c4} stroke={ink} strokeWidth="4" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => (
            <line key={i} x1={40 + i * 20} y1="270" x2={40 + i * 20} y2="320" stroke={ink} strokeWidth="2" />
          ))}

          {/* Giant circle of fifths wheel behind */}
          <circle cx="200" cy="140" r="100" fill={paper} stroke={ink} strokeWidth="5" />
          <circle cx="200" cy="140" r="70" fill={c3} stroke={ink} strokeWidth="4" />
          <circle cx="200" cy="140" r="25" fill={c5} stroke={ink} strokeWidth="3" />

          {/* Ascending Guitar Neck diagonally */}
          <g transform="translate(200, 150) rotate(-45) translate(-200, -150)">
            <rect x="180" y="0" width="40" height="300" fill={c1} stroke={ink} strokeWidth="4.5" />
            {/* Frets */}
            {[30, 70, 110, 150, 190, 230, 270].map((y) => (
              <line key={y} x1="180" y1={y} x2="220" y2={y} stroke={ink} strokeWidth="3" />
            ))}
            {/* Strings */}
            <line x1="187" y1="0" x2="187" y2="300" stroke={paper} strokeWidth="2.5" />
            <line x1="195" y1="0" x2="195" y2="300" stroke={paper} strokeWidth="2" />
            <line x1="205" y1="0" x2="205" y2="300" stroke={paper} strokeWidth="2" />
            <line x1="213" y1="0" x2="213" y2="300" stroke={paper} strokeWidth="1.5" />
          </g>

          {/* Large floating note in foreground */}
          <g transform="translate(110, 110) rotate(15)">
            {/* Shadow */}
            <circle cx="18" cy="43" r="15" fill={ink} />
            <path d="M 23 40 L 23 -10 L 53 -20 L 53 10 C 53 20, 33 20, 33 10 Z" fill={ink} />
            
            {/* Note */}
            <circle cx="15" cy="40" r="15" fill={c5} stroke={ink} strokeWidth="3.5" />
            <path d="M 20 37 L 20 -13 L 50 -23 L 50 7 C 50 17, 30 17, 30 7 Z" fill={c1} stroke={ink} strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="45" cy="7" r="10" fill={c2} stroke={ink} strokeWidth="3" />
          </g>

          {/* Big Text Banner overlapping everything */}
          <g transform="translate(200, 355) rotate(-2)">
            <rect x="-130" y="-22" width="260" height="44" fill={ink} rx="4" />
            <rect x="-133" y="-25" width="260" height="44" fill={c2} stroke={ink} strokeWidth="5" rx="4" />
            <text x="0" y="4" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="18" fill={ink}>
              {term1} MASTERCLASS
            </text>
          </g>
        </>
      );
    }
  }
];

const GLAMOUR_EXPANSION_SPECS = [
  ['Violin Vibrato Runway', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'violin'],
  ['Amp Stack Confessions', 'intermediate', 'Teen 13-17', ['S', 'M', 'L'], 'amp'],
  ['Crowd Surf Cadence', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'crowd'],
  ['Circle Fifths Afterparty', 'complete', 'Adult 18-40', ['S', 'M', 'L', 'XL'], 'orbit'],
  ['Minor Seventh Mood', 'intermediate', 'Adult 20-45', ['M', 'L', 'XL'], 'bars'],
  ['Lydian Lipstick Solo', 'complete', 'Adult 18-35', ['XS', 'S', 'M', 'L'], 'guitar'],
  ['Metronome Diva', 'simple', 'Kids 8-12', ['Youth M', 'Youth L'], 'note'],
  ['Syncopation Stiletto', 'intermediate', 'Teen 15-17', ['S', 'M', 'L'], 'wave'],
  ['Bass Clef Bouncer', 'intermediate', 'Adult 20-50', ['M', 'L', 'XL'], 'bass'],
  ['Tuning Fork Glam', 'simple', 'All ages', ['S', 'M', 'L', 'XL'], 'fork'],
  ['Dominant Seventh Drama', 'complete', 'Adult 25-55', ['M', 'L', 'XL'], 'bars'],
  ['Pedalboard Paradise', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'pedals'],
  ['Vinyl Mode Orbit', 'complete', 'Adult 25-55', ['M', 'L', 'XL', 'XXL'], 'record'],
  ['Piano Roll Glitter', 'intermediate', 'Adult 18-40', ['S', 'M', 'L'], 'keys'],
  ['Arpeggio Catwalk', 'complete', 'Adult 20-45', ['M', 'L', 'XL'], 'bars'],
  ['Jazz Hands Voicing', 'intermediate', 'All ages', ['S', 'M', 'L', 'XL'], 'hands'],
  ['Backstage Rosette', 'complete', 'Adult 30-60', ['M', 'L', 'XL', 'XXL'], 'rosette'],
  ['Viola Clef Vogue', 'complete', 'Adult 20-50', ['S', 'M', 'L', 'XL'], 'violin'],
  ['Tritone Tease', 'intermediate', 'Teen 15-17', ['S', 'M', 'L'], 'orbit'],
  ['Festival Pick Shower', 'simple', 'All ages', ['Youth L', 'S', 'M', 'L'], 'pick'],
  ['Tube Amp Tantrum', 'intermediate', 'Adult 20-45', ['M', 'L', 'XL'], 'amp'],
  ['Dorian After Dark', 'complete', 'Adult 18-40', ['S', 'M', 'L', 'XL'], 'bass'],
  ['Crowd Call Response', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L', 'XL'], 'crowd'],
  ['Counterpoint Couture', 'complete', 'Adult 25-55', ['M', 'L', 'XL'], 'wave'],
  ['Voice Leading Velvet', 'intermediate', 'Adult 25-55', ['M', 'L', 'XL', 'XXL'], 'bars'],
  ['Fretboard Flashbulbs', 'complete', 'All ages', ['Youth M', 'Youth L', 'S', 'M', 'L'], 'fret'],
  ['Pickup Selector Party', 'intermediate', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'guitar'],
  ['Grand Staff Glitter', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'keys'],
  ['Finale Fret Fanfare', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L', 'XL'], 'fret'],
  ['Hendrix Excuse Me', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'hendrix'],
  ['Joplin Compromise', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'joplin'],
  ['Beatles Love', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'beatles'],
  ['Scorpions Storm', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'scorpions'],
  ['Mercury Legend', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'mic'],
  ['Beethoven Passion', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'piano'],
  ['Zeppelin Song', 'complete', 'Adult 20-50', ['M', 'L', 'XL'], 'guitar'],
  ['Pink Floyd scale', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'score'],
  ['Marley Hits', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'bass'],
  ['Watt Is Up Amp', 'intermediate', 'Teen 13-17', ['S', 'M', 'L'], 'amp'],
  ['Cable Chaos Pit', 'intermediate', 'Adult 18-40', ['S', 'M', 'L', 'XL'], 'cables'],
  ['Console Warmth fader', 'complete', 'Adult 20-45', ['M', 'L', 'XL'], 'mixer'],
  ['Compressor Dynamics squeeze', 'intermediate', 'Adult 22-48', ['S', 'M', 'L'], 'mixer'],
  ['Metronome Honest Friend', 'simple', 'All ages', ['S', 'M', 'L'], 'metronome'],
  ['Vocalist Reverb Serenade', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'mic'],
  ['Stage Crew Shadows', 'intermediate', 'Adult 18-50', ['M', 'L', 'XL', 'XXL'], 'cables'],
  ['Roadie Lift Power', 'simple', 'Adult 20-55', ['M', 'L', 'XL', 'XXL'], 'fork'],
  ['Banned Notes Theory', 'complete', 'Adult 18-40', ['S', 'M', 'L'], 'score'],
  ['Auto Tune Secrets', 'intermediate', 'Teen 15-18', ['S', 'M', 'L'], 'wave'],
  ['Headphones Audio Pulse', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L', 'XL'], 'headphones'],
  ['Drums Time Keepers', 'complete', 'All ages', ['Youth M', 'Youth L', 'S', 'M', 'L'], 'drums'],
  ['Unexpected Note Path', 'intermediate', 'Adult 20-50', ['S', 'M', 'L', 'XL'], 'score'],
  ['Frequency Reality Timbre', 'complete', 'Adult 25-60', ['M', 'L', 'XL'], 'headphones'],
  ['Console Mixer Master', 'complete', 'Adult 22-55', ['M', 'L', 'XL', 'XXL'], 'mixer'],
  ['Improv Composers AdLib', 'intermediate', 'Adult 18-45', ['S', 'M', 'L'], 'piano'],
  ['Space of Wisdom Rest', 'simple', 'All ages', ['S', 'M', 'L'], 'score'],
  ['Acoustics Reflection Sound', 'complete', 'Adult 18-40', ['S', 'M', 'L', 'XL'], 'mic'],
  ['Phase Cancellation Alignment', 'intermediate', 'Adult 20-50', ['S', 'M', 'L', 'XL'], 'cables'],
  ['Echoes and Futures', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'record'],
  ['Riff Loud Defy', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'guitar'],
  ['Stagelights Soul Remain', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L', 'XL'], 'mic'],
  ['Play Last Note', 'intermediate', 'Adult 18-50', ['M', 'L', 'XL'], 'score'],
  ['Wood and Steel Heart', 'simple', 'All ages', ['S', 'M', 'L', 'XL'], 'guitar'],
  ['No Pedal Passion', 'intermediate', 'Adult 18-40', ['S', 'M', 'L'], 'pedals'],
  ['Crank the Amp', 'complete', 'Adult 20-45', ['M', 'L', 'XL'], 'amp'],
  ['Born in Studio', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'mixer'],
  ['Fearless Improv Session', 'intermediate', 'Adult 20-50', ['S', 'M', 'L', 'XL'], 'piano'],
  ['Voice Ultimate Instrument', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'mic'],
  ['Rock Pit Light', 'complete', 'Adult 18-35', ['XS', 'S', 'M', 'L'], 'crowd'],
  ['Beyond the Frets', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'fret'],
  ['Unleash Tone Heal', 'intermediate', 'All ages', ['S', 'M', 'L', 'XL'], 'guitar'],
  ['Stand Tall Strum', 'simple', 'All ages', ['S', 'M', 'L', 'XL'], 'guitar'],
  ['Record the Sparks', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'record'],
  ['Stage Fright Gain', 'intermediate', 'Teen 15-17', ['S', 'M', 'L'], 'amp'],
  ['Cable Chaos Snake Pit', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'cables'],
  ['I Can Hear Feedback', 'intermediate', 'Teen 13-17', ['S', 'M', 'L'], 'amp'],
  ['Turn Me Up Monitor', 'simple', 'All ages', ['Youth L', 'S', 'M', 'L'], 'mic'],
  ['Jazz Police Chords', 'intermediate', 'Adult 20-50', ['M', 'L', 'XL'], 'guitar'],
  ['Console Mixer Fader', 'complete', 'Adult 25-55', ['M', 'L', 'XL', 'XXL'], 'mixer'],
  ['Elvis Presley King', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_elvis'],
  ['Michael Jackson Pop', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_jackson'],
  ['David Bowie Aladdin', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_bowie'],
  ['Freddie Mercury Showman', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_mercury'],
  ['Bob Dylan Folk', 'complete', 'All ages', ['M', 'L', 'XL'], 'portrait_dylan'],
  ['John Lennon Peace', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_lennon'],
  ['Paul McCartney Beatle', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_mccartney'],
  ['Kurt Cobain Grunge', 'complete', 'Teen 15-18', ['S', 'M', 'L'], 'portrait_cobain'],
  ['Amy Winehouse Soul', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'portrait_winehouse'],
  ['Aretha Franklin Respect', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_aretha'],
  ['Stevie Wonder Keynote', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_wonder'],
  ['Ray Charles Blues', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_ray'],
  ['Louis Armstrong Satchmo', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_armstrong'],
  ['Miles Davis Jazz', 'complete', 'Adult 20-55', ['M', 'L', 'XL'], 'portrait_miles'],
  ['Ella Fitzgerald Queen', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_ella'],
  ['Billie Holiday Gardenia', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_billie'],
  ['Nina Simone Priestess', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_nina'],
  ['Dolly Parton Country', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_dolly'],
  ['Johnny Cash Rebel', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_cash'],
  ['Willie Nelson Outlaw', 'complete', 'Adult 25-60', ['M', 'L', 'XL', 'XXL'], 'portrait_willie'],
  ['Bob Marley Freedom', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_marley'],
  ['Mick Jagger Lips', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_jagger'],
  ['Keith Richards Stone', 'complete', 'Adult 20-55', ['M', 'L', 'XL'], 'portrait_keith'],
  ['Bruce Springsteen Boss', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_springsteen'],
  ['Elton John Star', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_elton'],
  ['Billy Joel PianoMan', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_joel'],
  ['Mozart Classic', 'complete', 'All ages', ['Youth M', 'Youth L', 'S', 'M', 'L'], 'portrait_mozart'],
  ['Beethoven Storm', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_beethoven'],
  ['Bach Baroque', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_bach'],
  ['Chopin Nocturne', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_chopin'],
  ['Edith Piaf Sparrow', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_piaf'],
  ['Luciano Pavarotti Tenor', 'complete', 'All ages', ['M', 'L', 'XL', 'XXL'], 'portrait_pavarotti'],
  ['Frank Sinatra BlueEyes', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_sinatra'],
  ['Tupac Shakur Poet', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_tupac'],
  ['Notorious Biggie', 'complete', 'Adult 18-50', ['M', 'L', 'XL', 'XXL'], 'portrait_biggie'],
  ['Eminem RapGod', 'complete', 'Teen 15-18', ['S', 'M', 'L'], 'portrait_eminem'],
  ['Lady Gaga Fame', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_gaga'],
  ['Beyonce Diva', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_beyonce'],
  ['Taylor Swift Folklore', 'complete', 'All ages', ['Youth L', 'S', 'M', 'L'], 'portrait_taylor'],
  ['Daft Punk Robot', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_daftpunk'],
  ['Bjork Utopia', 'complete', 'Adult 18-45', ['XS', 'S', 'M', 'L'], 'portrait_bjork'],
  ['Robert Plant Led', 'complete', 'Adult 20-50', ['M', 'L', 'XL'], 'portrait_plant'],
  ['Jim Morrison Doors', 'complete', 'Adult 18-45', ['S', 'M', 'L', 'XL'], 'portrait_morrison'],
  ['Ozzy Osbourne Metal', 'complete', 'Adult 20-55', ['M', 'L', 'XL', 'XXL'], 'portrait_ozzy'],
  ['Angus Young AC', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_angus'],
  ['Slash Guns N Roses', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_slash'],
  ['Madonna Vogue', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_madonna'],
  ['Prince Purple', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_prince'],
  ['Janis Joplin Pearl', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_joplin_face'],
  ['Jimi Hendrix Experience', 'complete', 'All ages', ['S', 'M', 'L', 'XL'], 'portrait_hendrix_face']
];

const renderArtistPortrait = (artist, colors, ink, paper, c1, c2, c3, c4, c5) => {
  const none = 'none';
  switch (artist) {
    case 'elvis':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 65 Q -60 -40, 0 -60 Q 60 -40, 30 65" fill={ink} />
          <path d="M -42 -10 C -52 -80, 52 -80, 42 -10 C 50 15, -50 15, -42 -10" fill={ink} />
          <path d="M -50 60 L -65 110 L -25 95 L -20 110 L 20 110 L 25 95 L 65 110 L 50 60 Z" fill={c2} stroke={ink} strokeWidth="5" />
          <rect x="-38" y="-5" width="6" height="30" fill={ink} />
          <rect x="32" y="-5" width="6" height="30" fill={ink} />
        </g>
      );
    case 'jackson':
      return (
        <g transform="translate(200, 178)">
          <ellipse cx="0" cy="10" rx="60" ry="50" fill={ink} />
          <rect x="-42" y="-12" width="34" height="26" rx="8" fill={ink} stroke={c1} strokeWidth="2" />
          <rect x="8" y="-12" width="34" height="26" rx="8" fill={ink} stroke={c1} strokeWidth="2" />
          <line x1="-8" y1="-5" x2="8" y2="-5" stroke={ink} strokeWidth="4" />
          <ellipse cx="0" cy="-35" rx="72" ry="12" fill={ink} />
          <path d="M -48 -35 L -38 -78 L 38 -78 L 48 -35 Z" fill={ink} />
          <rect x="-42" y="-45" width="84" height="10" fill={c4} />
          <path d="M -15 -20 Q -24 15, -12 40" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
        </g>
      );
    case 'bowie':
      return (
        <g transform="translate(200, 178)">
          <path d="M -52 60 L -60 -40 C -40 -90, 40 -90, 60 -40 L 52 60 Z" fill={c2} stroke={ink} strokeWidth="5" />
          <path d="M -15 -76 L 15 -10 L -10 0 L 25 76 L -8 10 L 12 -4 Z" fill={c4} stroke={ink} strokeWidth="4" />
          <circle cx="-25" cy="-5" r="4" fill={ink} />
          <circle cx="25" cy="-5" r="4" fill={ink} />
        </g>
      );
    case 'mercury':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 65 Q -60 -40, 0 -60 Q 60 -40, 30 65" fill={c3} stroke={ink} strokeWidth="5" />
          <path d="M -35 -42 C -20 -72, 20 -72, 35 -42 Z" fill={ink} />
          <path d="M -26 26 Q 0 16, 26 26 Q 16 38, 0 32 Q -16 38, -26 26" fill={ink} stroke={ink} strokeWidth="2" />
          <path d="M -35 60 L -10 110 L 10 110 L 35 60" fill="none" stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'dylan':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 360) / 12;
            const rad = (angle * Math.PI) / 180;
            return <circle key={i} cx={Math.cos(rad) * 48} cy={Math.sin(rad) * 42} r="22" fill={ink} />;
          })}
          <rect x="-42" y="-12" width="34" height="24" rx="4" fill={ink} />
          <rect x="8" y="-12" width="34" height="24" rx="4" fill={ink} />
          <line x1="-8" y1="-5" x2="8" y2="-5" stroke={ink} strokeWidth="6" />
          <path d="M -60 55 L -60 110 L 60 110 L 60 55" fill="none" stroke={c1} strokeWidth="6" strokeLinecap="round" />
          <rect x="-30" y="96" width="60" height="10" fill={c4} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'lennon':
      return (
        <g transform="translate(200, 178)">
          <path d="M -65 65 C -75 -60, -25 -70, 0 -45 C 25 -70, 75 -60, 65 65 Z" fill={ink} />
          <path d="M -30 -15 C -25 -25, -5 -25, 0 -15" fill="none" stroke={paper} strokeWidth="4" />
          <circle cx="-25" cy="5" r="22" fill="none" stroke={ink} strokeWidth="6" />
          <circle cx="-25" cy="5" r="18" fill={c5} opacity="0.4" />
          <circle cx="25" cy="5" r="22" fill="none" stroke={ink} strokeWidth="6" />
          <circle cx="25" cy="5" r="18" fill={c5} opacity="0.4" />
          <line x1="-3" y1="5" x2="3" y2="5" stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'mccartney':
      return (
        <g transform="translate(200, 178)">
          <path d="M -50 55 C -65 -30, 65 -30, 50 55 C 45 25, -45 25, -50 55" fill={ink} />
          <g transform="translate(30, 40) scale(0.6) rotate(-20)">
            <rect x="-8" y="-120" width="16" height="180" fill={c2} stroke={ink} strokeWidth="4" />
            <path d="M -26 0 C -45 15, -45 45, -26 60 C -15 70, 15 70, 26 60 C 45 45, 45 15, 26 0 Z" fill={c1} stroke={ink} strokeWidth="5" />
          </g>
        </g>
      );
    case 'cobain':
      return (
        <g transform="translate(200, 178)">
          <path d="M -52 75 L -56 -40 C -40 -76, 40 -76, 56 -40 L 52 75 C 40 50, 24 60, 24 30 L -24 30 C -24 60, -40 50, -52 75 Z" fill={c2} stroke={ink} strokeWidth="5" />
          <rect x="-42" y="-10" width="34" height="24" rx="12" fill={paper} stroke={ink} strokeWidth="5" />
          <ellipse cx="-25" cy="2" rx="10" ry="7" fill={ink} />
          <rect x="8" y="-10" width="34" height="24" rx="12" fill={paper} stroke={ink} strokeWidth="5" />
          <ellipse cx="25" cy="2" rx="10" ry="7" fill={ink} />
          <line x1="-8" y1="2" x2="8" y2="2" stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'winehouse':
      return (
        <g transform="translate(200, 178)">
          <path d="M -40 60 C -82 0, -68 -95, 0 -95 C 68 -95, 82 0, 40 60 Z" fill={ink} />
          <path d="M -38 -6 L -20 -15 L -26 -2 Z" fill={ink} />
          <path d="M 38 -6 L 20 -15 L 26 -2 Z" fill={ink} />
          <path d="M -44 32 L -40 38 L -34 35 L -38 42 L -34 48 L -41 45 L -46 48 L -43 41 L -48 36 L -42 36 Z" fill={c2} />
          <path d="M 44 32 L 40 38 L 34 35 L 38 42 L 34 48 L 41 45 L 46 48 L 43 41 L 48 36 L 42 36 Z" fill={c2} />
        </g>
      );
    case 'aretha':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="-10" r="54" fill={ink} />
          <circle cx="-42" cy="10" r="32" fill={ink} />
          <circle cx="42" cy="10" r="32" fill={ink} />
          <path d="M -30 -54 L -45 -78 L -15 -68 L 0 -88 L 15 -68 L 45 -78 L 30 -54 Z" fill={c2} stroke={ink} strokeWidth="3" />
          <path d="M -40 50 C -40 90, 40 90, 40 50" fill="none" stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'wonder':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="0" r="56" fill={ink} />
          {[-45, -30, -15, 15, 30, 45].map((x) => (
            <line key={x} x1={x} y1="30" x2={x} y2="78" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          ))}
          <rect x="-44" y="-12" width="88" height="22" rx="4" fill={ink} stroke={c3} strokeWidth="3" />
          <line x1="0" y1="-12" x2="0" y2="10" stroke={c3} strokeWidth="3" />
        </g>
      );
    case 'ray':
      return (
        <g transform="translate(200, 178)">
          <path d="M -35 50 Q -56 -30, 0 -45 Q 56 -30, 35 50" fill={ink} />
          <rect x="-42" y="-12" width="34" height="24" rx="3" fill={ink} />
          <rect x="8" y="-12" width="34" height="24" rx="3" fill={ink} />
          <line x1="-8" y1="-8" x2="8" y2="-8" stroke={ink} strokeWidth="5" />
          <path d="M -26 24 C -26 42, 26 42, 26 24" fill={paper} stroke={ink} strokeWidth="4" />
          {[-16, -8, 0, 8, 16].map((x) => (
            <line key={x} x1={x} y1="24" x2={x} y2="34" stroke={ink} strokeWidth="2" />
          ))}
        </g>
      );
    case 'armstrong':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="10" r="48" fill={c1} stroke={ink} strokeWidth="4" />
          <circle cx="-38" cy="18" r="24" fill={c2} stroke={ink} strokeWidth="4" />
          <circle cx="38" cy="18" r="24" fill={c2} stroke={ink} strokeWidth="4" />
          <g transform="translate(0, 10)">
            <line x1="0" y1="0" x2="0" y2="92" stroke={ink} strokeWidth="12" />
            <line x1="0" y1="0" x2="0" y2="92" stroke={c4} strokeWidth="6" />
            <path d="M -24 92 L 24 92 L 10 74 L -10 74 Z" fill={c4} stroke={ink} strokeWidth="4" />
          </g>
        </g>
      );
    case 'miles':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 65 Q -50 -40, 0 -50 Q 50 -40, 30 65" fill={ink} />
          <rect x="-40" y="-10" width="32" height="20" rx="3" fill={ink} stroke={c1} strokeWidth="2" />
          <rect x="8" y="-10" width="32" height="20" rx="3" fill={ink} stroke={c1} strokeWidth="2" />
          <g transform="translate(10, 20) rotate(55)">
            <line x1="0" y1="0" x2="0" y2="100" stroke={ink} strokeWidth="8" />
            <line x1="0" y1="0" x2="0" y2="100" stroke={c3} strokeWidth="4" />
            <path d="M -16 100 L 16 100 L 8 85 L -8 85 Z" fill={c3} stroke={ink} strokeWidth="3" />
          </g>
        </g>
      );
    case 'ella':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="-35" r="32" fill={ink} />
          <ellipse cx="0" cy="15" rx="46" ry="38" fill={ink} />
          <path d="M -26 -5 Q -14 -12, -2 -5" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          <path d="M 26 -5 Q 14 -12, 2 -5" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          {[-25, -15, -5, 5, 15, 25].map((x, i) => (
            <circle key={i} cx={x} cy="42" r="6" fill={paper} stroke={ink} strokeWidth="2" />
          ))}
        </g>
      );
    case 'billie':
      return (
        <g transform="translate(200, 178)">
          <path d="M -40 50 Q -56 -30, 0 -45 Q 56 -30, 40 50 Z" fill={ink} />
          <g transform="translate(-32, -28)">
            <circle r="18" fill={paper} stroke={ink} strokeWidth="3" />
            <circle cx="-8" cy="-8" r="8" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="8" cy="-8" r="8" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="-8" cy="8" r="8" fill={paper} stroke={ink} strokeWidth="2" />
            <circle cx="8" cy="8" r="8" fill={paper} stroke={ink} strokeWidth="2" />
          </g>
          <path d="M 12 -5 C 16 -12, 28 -12, 32 -5" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case 'nina':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 45 C -45 10, -35 -70, 0 -75 C 35 -75, 45 10, 30 45 Z" fill={c1} stroke={ink} strokeWidth="5" />
          <path d="M -32 -20 Q 0 -5, 32 -20" fill="none" stroke={ink} strokeWidth="4" />
          <path d="M -26 -48 Q 0 -35, 26 -48" fill="none" stroke={ink} strokeWidth="4" />
          <circle cx="-38" cy="38" r="18" fill="none" stroke={c4} strokeWidth="6" />
          <circle cx="38" cy="38" r="18" fill="none" stroke={c4} strokeWidth="6" />
        </g>
      );
    case 'dolly':
      return (
        <g transform="translate(200, 178)">
          <path d="M -54 65 C -92 20, -78 -75, 0 -75 C 78 -75, 92 20, 54 65 C 42 35, -42 35, -54 65 Z" fill={c2} stroke={ink} strokeWidth="5" />
          <circle cx="-46" cy="-15" r="18" fill={c2} stroke={ink} strokeWidth="3" />
          <circle cx="46" cy="-15" r="18" fill={c2} stroke={ink} strokeWidth="3" />
          <circle cx="0" cy="-56" r="22" fill={c2} stroke={ink} strokeWidth="3" />
          <path d="M -26 0 L -18 -8 M -22 4 L -12 -2" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 26 0 L 18 -8 M 22 4 L 12 -2" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'cash':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 65 Q -56 -20, 0 -38 Q 56 -20, 30 65" fill={ink} />
          <ellipse cx="0" cy="-24" rx="72" ry="12" fill={ink} stroke={ink} strokeWidth="2" />
          <path d="M -42 -24 L -32 -68 L 32 -68 L 42 -24 Z" fill={ink} />
          <g transform="translate(-48, 20) rotate(-45)">
            <rect x="-6" y="-60" width="12" height="80" fill={c3} stroke={ink} strokeWidth="4" />
            <rect x="-14" y="-76" width="28" height="18" rx="2" fill={c5} stroke={ink} strokeWidth="4" />
          </g>
        </g>
      );
    case 'willie':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 50 Q -54 -30, 0 -38 Q 54 -30, 30 50" fill={ink} />
          <rect x="-35" y="-12" width="70" height="12" fill={c4} stroke={ink} strokeWidth="3" />
          <path d="M -32 40 L -42 100 L -30 110 L -42 100" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <path d="M 32 40 L 42 100 L 30 110 L 42 100" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <circle cx="-30" cy="110" r="5" fill={c2} />
          <circle cx="30" cy="110" r="5" fill={c2} />
        </g>
      );
    case 'marley':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 14 }).map((_, i) => {
            const angle = (i * 360) / 14;
            const rad = (angle * Math.PI) / 180;
            const rx = Math.cos(rad) * 44;
            const ry = Math.sin(rad) * 38;
            return <ellipse key={i} cx={rx} cy={ry} rx="26" ry="18" fill={ink} transform={`rotate(${angle} ${rx} ${ry})`} />;
          })}
          <path d="M -32 -25 Q 0 -15, 32 -25" fill="none" stroke="#ff4f4f" strokeWidth="8" />
          <path d="M -34 -17 Q 0 -7, 34 -17" fill="none" stroke="#ffd84d" strokeWidth="8" />
          <path d="M -36 -9 Q 0 1, 36 -9" fill="none" stroke="#4ee6b8" strokeWidth="8" />
        </g>
      );
    case 'jagger':
      return (
        <g transform="translate(200, 178)">
          <path d="M -48 60 C -60 -30, 60 -30, 48 60 Z" fill={ink} />
          <path d="M -34 10 C -20 -10, 20 -10, 34 10 C 20 30, -20 30, -34 10" fill={c4} stroke={ink} strokeWidth="6" strokeLinejoin="round" />
          <path d="M -24 10 C -15 2, 15 2, 24 10" fill="none" stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'keith':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="-44" cy={-30 + i * 12} r="14" fill={ink} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx="44" cy={-30 + i * 12} r="14" fill={ink} />
          ))}
          <path d="M -40 -35 C -40 -70, 40 -70, 40 -35 Z" fill={ink} />
          <rect x="-42" y="-30" width="84" height="12" fill={c2} stroke={ink} strokeWidth="3" transform="rotate(-4)" />
        </g>
      );
    case 'springsteen':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 60 Q -50 -30, 0 -45 Q 50 -30, 30 60" fill={c3} stroke={ink} strokeWidth="4" />
          <rect x="-34" y="-14" width="68" height="10" fill={c4} stroke={ink} strokeWidth="3" />
          <path d="M -40 55 L -60 92 L -20 82 L -15 105 L 15 105 L 20 82 L 60 92 L 40 55 Z" fill={c1} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'elton':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 50 Q -56 -35, 0 -42 Q 56 -35, 45 50 Z" fill={ink} />
          <g transform="translate(-25, 10)">
            <path d="M 0 -18 L 5 -5 L 18 -5 L 8 4 L 12 18 L 0 10 L -12 18 L -8 4 L -18 -5 L -5 -5 Z" fill={c3} stroke={ink} strokeWidth="5" />
          </g>
          <g transform="translate(25, 10)">
            <path d="M 0 -18 L 5 -5 L 18 -5 L 8 4 L 12 18 L 0 10 L -12 18 L -8 4 L -18 -5 L -5 -5 Z" fill={c3} stroke={ink} strokeWidth="5" />
          </g>
          <line x1="-8" y1="10" x2="8" y2="10" stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'joel':
      return (
        <g transform="translate(200, 178)">
          <path d="M -30 50 Q -46 -30, 0 -40 Q 46 -30, 30 50" fill={c2} stroke={ink} strokeWidth="4" />
          <path d="M -15 42 L 0 62 L 15 42 Z" fill={ink} stroke={ink} strokeWidth="3" />
          <rect x="-35" y="-8" width="28" height="18" rx="2" fill={none} stroke={ink} strokeWidth="4" />
          <rect x="7" y="-8" width="28" height="18" rx="2" fill={none} stroke={ink} strokeWidth="4" />
          <line x1="-7" y1="0" x2="7" y2="0" stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'mozart':
      return (
        <g transform="translate(200, 178)">
          <path d="M -40 50 C -56 -40, 56 -40, 40 50" fill={paper} stroke={ink} strokeWidth="5" />
          <circle cx="-38" cy="10" r="14" fill={paper} stroke={ink} strokeWidth="4" />
          <circle cx="-38" cy="30" r="14" fill={paper} stroke={ink} strokeWidth="4" />
          <circle cx="38" cy="10" r="14" fill={paper} stroke={ink} strokeWidth="4" />
          <circle cx="38" cy="30" r="14" fill={paper} stroke={ink} strokeWidth="4" />
          <path d="M -12 50 L -25 96 L 0 84 L 25 96 L 12 50 Z" fill={ink} />
        </g>
      );
    case 'beethoven':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 55 C -92 10, -78 -85, 0 -85 C 78 -85, 92 10, 45 55 L 35 30 L 48 5 L 20 -40 L -20 -40 L -48 5 L -35 30 Z" fill={ink} />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = -60 + i * 18;
            return <line key={i} x1="0" y1="-40" x2="0" y2="-92" stroke={ink} strokeWidth="8" strokeLinecap="round" transform={`rotate(${angle})`} />;
          })}
          <path d="M -30 45 Q 0 92, 30 45 Q 15 105, 0 88 Q -15 105, -30 45" fill={c4} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'bach':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 50 C -60 -50, 60 -50, 45 50 Z" fill={paper} stroke={ink} strokeWidth="5" />
          {[-35, -20, -5, 5, 20, 35].map((y) => (
            <g key={y}>
              <circle cx="-38" cy={y} r="13" fill={paper} stroke={ink} strokeWidth="3" />
              <circle cx="38" cy={y} r="13" fill={paper} stroke={ink} strokeWidth="3" />
            </g>
          ))}
        </g>
      );
    case 'chopin':
      return (
        <g transform="translate(200, 178)">
          <path d="M 40 78 C 40 -40, -10 -40, -10 10 L -30 18 L -10 24 L -14 36 L -4 36 C -4 55, 12 78, 40 78 Z" fill={ink} />
          <path d="M 12 -28 C 30 -60, 65 -30, 48 30 C 38 -5, 20 -15, 12 -28" fill={c1} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'piaf':
      return (
        <g transform="translate(200, 178)">
          <path d="M -32 40 C -45 -10, 45 -10, 32 40 Z" fill={ink} />
          <path d="M -26 0 Q -16 -12, -6 -2" fill={none} stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 26 0 Q 16 -12, 6 -2" fill={none} stroke={ink} strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case 'pavarotti':
      return (
        <g transform="translate(200, 178)">
          <path d="M -36 20 C -36 68, 36 68, 36 20 L 26 15 C 26 30, -26 30, -26 15 Z" fill={ink} />
          <circle cx="0" cy="12" r="14" fill={paper} stroke={ink} strokeWidth="4" />
          <path d="M -38 -20 C -46 20, -32 45, -30 45" fill={none} stroke={ink} strokeWidth="8" />
          <path d="M 38 -20 C 46 20, 32 45, 30 45" fill={none} stroke={ink} strokeWidth="8" />
        </g>
      );
    case 'sinatra':
      return (
        <g transform="translate(200, 178)">
          <ellipse cx="0" cy="-15" rx="68" ry="12" fill={ink} transform="rotate(-6)" />
          <path d="M -44 -15 L -34 -58 L 34 -58 L 44 -15 Z" fill={ink} transform="rotate(-6)" />
          <rect x="-38" y="-24" width="76" height="8" fill={c5} transform="rotate(-6)" />
          <path d="M -18 68 L -30 85 L 0 76 L 30 85 L 18 68 Z" fill={ink} />
        </g>
      );
    case 'tupac':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="18" r="42" fill={c3} stroke={ink} strokeWidth="4" />
          <path d="M -41 0 Q 0 10, 41 0" fill={none} stroke={paper} strokeWidth="12" />
          <path d="M -41 0 Q 0 10, 41 0" fill="none" stroke={ink} strokeWidth="4" />
          <path d="M -10 -4 L -28 -34 L -6 -18 Z" fill={paper} stroke={ink} strokeWidth="3" />
          <path d="M 10 -4 L 28 -34 L 6 -18 Z" fill={paper} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'biggie':
      return (
        <g transform="translate(200, 178)">
          <rect x="-42" y="-6" width="34" height="22" rx="2" fill={ink} />
          <rect x="8" y="-6" width="34" height="22" rx="2" fill={ink} />
          <line x1="-8" y1="2" x2="8" y2="2" stroke={ink} strokeWidth="5" />
          <g transform="translate(10, -28) rotate(12)">
            <rect x="-35" y="-12" width="70" height="24" fill={c2} stroke={ink} strokeWidth="4" />
            <path d="M -35 -12 L -45 -34 L -15 -22 L 0 -45 L 15 -22 L 45 -34 L 35 -12 Z" fill={c2} stroke={ink} strokeWidth="4" />
          </g>
        </g>
      );
    case 'eminem':
      return (
        <g transform="translate(200, 178)">
          <path d="M -46 20 C -46 -30, 46 -30, 46 20 Z" fill={ink} />
          <path d="M -54 12 C -20 28, 20 28, 54 12" fill={none} stroke={ink} strokeWidth="10" strokeLinecap="round" />
          <path d="M -50 65 L -35 110 L 35 110 L 50 65 C 30 75, -30 75, -50 65 Z" fill={c1} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'gaga':
      return (
        <g transform="translate(200, 178)">
          <path d="M -50 65 L -54 -38 C -40 -74, 40 -74, 54 -38 L 50 65 L 36 20 L -36 20 Z" fill={paper} stroke={ink} strokeWidth="5" />
          <line x1="-36" y1="-10" x2="36" y2="-10" stroke={ink} strokeWidth="5" />
          <path d="M -28 -34 L -10 -5 L -20 2 L -8 38 L -20 10 L -14 0 Z" fill={c4} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'beyonce':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 10 }).map((_, i) => {
            const y = -40 + i * 10;
            return (
              <g key={i}>
                <path d={`M -30 ${y} Q -72 ${y + 15}, -46 ${y + 30}`} fill="none" stroke={c2} strokeWidth="10" strokeLinecap="round" />
                <path d={`M 30 ${y} Q 72 ${y + 15}, 46 ${y + 30}`} fill="none" stroke={c2} strokeWidth="10" strokeLinecap="round" />
              </g>
            );
          })}
          <circle cx="0" cy="10" r="38" fill={c1} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'taylor':
      return (
        <g transform="translate(200, 178)">
          <path d="M -48 65 L -52 -38 C -38 -74, 38 -74, 52 -38 L 48 65 L 34 24 L -34 24 Z" fill={c2} stroke={ink} strokeWidth="4" />
          <path d="M -42 24 C -36 50, -20 65, -34 92" fill="none" stroke={c3} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'daftpunk':
      return (
        <g transform="translate(200, 178)">
          <rect x="-48" y="-48" width="96" height="96" rx="34" fill={c5} stroke={ink} strokeWidth="6" />
          <rect x="-48" y="-20" width="96" height="28" fill={ink} />
          <line x1="-38" y1="-6" x2="38" y2="-6" stroke={c1} strokeWidth="3" />
        </g>
      );
    case 'bjork':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 50 Q -56 -40, 0 -54 Q 56 -40, 45 50 Z" fill={ink} />
          <circle cx="-25" cy="-25" r="14" fill={c4} stroke={ink} strokeWidth="3" />
          <circle cx="25" cy="-25" r="14" fill={c4} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'plant':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 12 }).map((_, i) => {
            const y = -50 + i * 10;
            return (
              <g key={i}>
                <path d={`M -30 ${y} Q -74 ${y + 20}, -38 ${y + 35}`} fill="none" stroke={c2} strokeWidth="12" strokeLinecap="round" />
                <path d={`M 30 ${y} Q 74 ${y + 20}, 38 ${y + 35}`} fill="none" stroke={c2} strokeWidth="12" strokeLinecap="round" />
              </g>
            );
          })}
        </g>
      );
    case 'morrison':
      return (
        <g transform="translate(200, 178)">
          <path d="M -48 60 C -65 -30, 65 -30, 48 60 Z" fill={ink} />
          {[-20, -10, 0, 10, 20].map((x, i) => (
            <circle key={i} cx={x} cy="52" r="5" fill={i % 2 ? c4 : c3} stroke={ink} strokeWidth="2" />
          ))}
        </g>
      );
    case 'ozzy':
      return (
        <g transform="translate(200, 178)">
          <path d="M -50 70 L -54 -40 C -40 -72, 40 -72, 54 -40 L 50 70 Z" fill={ink} />
          <circle cx="-22" cy="0" r="16" fill={none} stroke={paper} strokeWidth="5" />
          <circle cx="-22" cy="0" r="12" fill={c1} opacity="0.8" />
          <circle cx="22" cy="0" r="16" fill={none} stroke={paper} strokeWidth="5" />
          <circle cx="22" cy="0" r="12" fill={c1} opacity="0.8" />
          <line x1="-6" y1="0" x2="6" y2="0" stroke={paper} strokeWidth="5" />
        </g>
      );
    case 'angus':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 10 C -45 -34, 45 -34, 45 10 Z" fill={c1} stroke={ink} strokeWidth="5" />
          <path d="M -52 10 C -25 24, 25 24, 52 10" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <text x="0" y="-8" textAnchor="middle" fontFamily="Arial Black" fontSize="18" fill={c2}>A</text>
        </g>
      );
    case 'slash':
      return (
        <g transform="translate(200, 178)">
          <ellipse cx="0" cy="10" rx="58" ry="46" fill={ink} />
          <path d="M -34 10 L -24 -70 L 24 -70 L 34 10 Z" fill={ink} stroke={ink} strokeWidth="3" />
          <ellipse cx="0" cy="10" rx="48" ry="8" fill={ink} />
          <rect x="-10" y="-2" width="20" height="10" fill={c3} stroke={ink} strokeWidth="2" />
        </g>
      );
    case 'madonna':
      return (
        <g transform="translate(200, 178)">
          <path d="M -42 45 Q -56 -35, 0 -45 Q 56 -35, 42 45 Z" fill={c2} stroke={ink} strokeWidth="4" />
          <circle cx="16" cy="18" r="3.5" fill={ink} />
        </g>
      );
    case 'prince':
      return (
        <g transform="translate(200, 178)">
          <ellipse cx="0" cy="-10" rx="52" ry="44" fill={ink} />
          <path d="M -20 28 L -5 26 L 0 28 L 5 26 L 20 28" fill="none" stroke={ink} strokeWidth="3" strokeLinecap="round" />
          <path d="M 0 35 L 0 85 M -20 55 L 20 55 M -15 45 C -15 25, 15 25, 15 45 C 15 65, -15 65, -15 45" fill="none" stroke={c3} strokeWidth="4" opacity="0.6" />
        </g>
      );
    case 'joplin_face':
      return (
        <g transform="translate(200, 178)">
          <path d="M -48 60 C -68 -30, 68 -30, 48 60 Z" fill={c2} stroke={ink} strokeWidth="4" />
          <circle cx="-25" cy="0" r="20" fill={none} stroke={ink} strokeWidth="6" />
          <circle cx="25" cy="0" r="20" fill={none} stroke={ink} strokeWidth="6" />
        </g>
      );
    case 'hendrix_face':
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="0" r="54" fill={ink} />
          <rect x="-42" y="-12" width="84" height="12" fill={c4} stroke={ink} strokeWidth="3" transform="rotate(-5)" />
        </g>
      );
    case 'mccartney_face':
    default:
      return (
        <g transform="translate(200, 178)">
          <circle cx="0" cy="0" r="42" fill={c1} stroke={ink} strokeWidth="5" />
        </g>
      );
  }
};

const renderExpansionMotif = (motif, colors, ink, paper) => {
  const [c1, c2, c3, c4, c5] = colors;
  if (motif.startsWith('portrait_')) {
    const artist = motif.replace('portrait_', '');
    return renderArtistPortrait(artist, colors, ink, paper, c1, c2, c3, c4, c5);
  }
  switch (motif) {
    case 'violin':
      return (
        <g transform="translate(200, 178) rotate(-8)">
          <path d="M -24 -118 C -72 -92, -54 -48, -18 -42 C -72 -24, -72 54, -18 70 C -12 112, 12 112, 18 70 C 72 54, 72 -24, 18 -42 C 54 -48, 72 -92, 24 -118 C 8 -94, -8 -94, -24 -118 Z" fill={c1} stroke={ink} strokeWidth="5" />
          <circle cx="0" cy="-8" r="22" fill={ink} />
          <rect x="-8" y="-145" width="16" height="270" fill={c2} stroke={ink} strokeWidth="4" />
          <line x1="-26" y1="-150" x2="76" y2="118" stroke={paper} strokeWidth="6" />
          <line x1="-16" y1="-126" x2="24" y2="98" stroke={paper} strokeWidth="2" />
        </g>
      );
    case 'crowd':
      return (
        <g>
          {Array.from({ length: 18 }).map((_, i) => (
            <circle key={i} cx={40 + i * 19} cy={238 + (i % 3) * 10} r="18" fill={colors[i % 5]} stroke={ink} strokeWidth="4" />
          ))}
          <path d="M 64 210 C 108 126, 160 166, 200 94 C 244 166, 296 126, 338 210" fill="none" stroke={ink} strokeWidth="12" strokeLinecap="round" />
          <path d="M 64 210 C 108 126, 160 166, 200 94 C 244 166, 296 126, 338 210" fill="none" stroke={c2} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case 'pedals':
      return (
        <g>
          {[-82, 0, 82].map((x, i) => (
            <g key={x} transform={`translate(${200 + x}, 178) rotate(${(i - 1) * 5})`}>
              <rect x="-42" y="-70" width="84" height="140" rx="8" fill={[c1, c3, c5][i]} stroke={ink} strokeWidth="5" />
              <circle cy="-38" r="12" fill={c2} stroke={ink} strokeWidth="4" />
              <rect x="-24" y="10" width="48" height="36" fill={paper} stroke={ink} strokeWidth="4" />
            </g>
          ))}
          <path d="M 76 178 C 116 128, 152 226, 190 176 S 264 124, 324 180" fill="none" stroke={ink} strokeWidth="7" />
        </g>
      );
    case 'bass':
      return (
        <g transform="translate(200, 180)">
          <path d="M -56 102 C -118 64, -88 -24, -26 -8 C -82 -62, -36 -118, 18 -82 C 58 -120, 108 -66, 56 -10 C 118 -20, 124 70, 58 102 Z" fill={c1} stroke={ink} strokeWidth="6" />
          <rect x="-8" y="-146" width="22" height="210" fill={c2} stroke={ink} strokeWidth="5" />
          <circle cx="0" cy="34" r="20" fill={ink} />
          <line x1="-18" y1="-134" x2="-18" y2="106" stroke={paper} strokeWidth="3" />
          <line x1="4" y1="-134" x2="4" y2="106" stroke={paper} strokeWidth="2" />
        </g>
      );
    case 'keys':
      return (
        <g transform="translate(200, 184)">
          <rect x="-144" y="-66" width="288" height="132" fill={paper} stroke={ink} strokeWidth="6" />
          {Array.from({ length: 12 }).map((_, i) => (
            <rect key={i} x={-144 + i * 24} y="-66" width="24" height="132" fill={i % 2 ? c2 : paper} stroke={ink} strokeWidth="2" />
          ))}
          {[-108, -84, -36, -12, 12, 60, 84, 132].map((x) => <rect key={x} x={x} y="-66" width="16" height="78" fill={ink} />)}
        </g>
      );
    case 'hands':
      return (
        <g transform="translate(200, 178)">
          <path d="M -92 24 C -130 -34, -70 -80, -34 -22 L -20 0 L -18 -88 C -18 -118, 18 -118, 18 -88 L 20 0 L 36 -34 C 66 -84, 124 -44, 96 18 C 76 64, 44 98, 0 108 C -42 98, -72 68, -92 24 Z" fill={c1} stroke={ink} strokeWidth="6" />
          <circle cx="-78" cy="-96" r="18" fill={c4} stroke={ink} strokeWidth="4" />
          <circle cx="86" cy="-82" r="14" fill={c2} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'guitar':
      return (
        <g transform="translate(200, 178) rotate(-18)">
          <ellipse cx="-28" cy="38" rx="52" ry="70" fill={c1} stroke={ink} strokeWidth="5" />
          <ellipse cx="26" cy="20" rx="48" ry="62" fill={c3} stroke={ink} strokeWidth="5" />
          <circle cx="0" cy="30" r="22" fill={ink} />
          <rect x="-12" y="-135" width="24" height="178" fill={c2} stroke={ink} strokeWidth="4" />
          <rect x="-36" y="-165" width="72" height="34" rx="4" fill={c4} stroke={ink} strokeWidth="4" />
          {[-8, -3, 2, 7].map((x) => <line key={x} x1={x} y1="-154" x2={x} y2="94" stroke={paper} strokeWidth="2" />)}
        </g>
      );
    case 'amp':
      return (
        <g transform="translate(200, 180)">
          <rect x="-120" y="-80" width="240" height="170" rx="8" fill={c1} stroke={ink} strokeWidth="5" />
          <rect x="-95" y="-45" width="190" height="92" fill={paper} stroke={ink} strokeWidth="4" />
          {[-60, -30, 0, 30, 60].map((x) => <circle key={x} cx={x} cy="-60" r="10" fill={c2} stroke={ink} strokeWidth="3" />)}
          <path d="M -80 15 C -30 -30, 30 60, 80 0" fill="none" stroke={c4} strokeWidth="8" strokeLinecap="round" />
        </g>
      );
    case 'fret':
      return (
        <g transform="translate(200, 178) rotate(10)">
          <rect x="-130" y="-72" width="260" height="144" fill={c2} stroke={ink} strokeWidth="5" />
          {[-95, -55, -15, 25, 65, 105].map((x) => <line key={x} x1={x} y1="-72" x2={x} y2="72" stroke={ink} strokeWidth="4" />)}
          {[-45, -15, 15, 45].map((y) => <line key={y} x1="-130" y1={y} x2="130" y2={y} stroke={paper} strokeWidth="3" />)}
          {[[-75, -15, c1], [5, 15, c3], [85, -45, c5]].map(([x, y, fill]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="18" fill={fill} stroke={ink} strokeWidth="4" />)}
        </g>
      );
    case 'rosette':
      return (
        <g transform="translate(200, 178)">
          <circle r="110" fill={c2} stroke={ink} strokeWidth="5" />
          <circle r="76" fill="none" stroke={c4} strokeWidth="16" strokeDasharray="12 8" />
          <circle r="52" fill={ink} />
          {[-70, -42, -14, 14, 42, 70].map((x) => <line key={x} x1={x} y1="-142" x2={x} y2="142" stroke={paper} strokeWidth="3" />)}
        </g>
      );
    case 'orbit':
      return (
        <g transform="translate(200, 178)">
          <circle r="70" fill={c1} stroke={ink} strokeWidth="5" />
          <ellipse rx="138" ry="36" fill="none" stroke={c3} strokeWidth="12" />
          <ellipse rx="138" ry="36" fill="none" stroke={ink} strokeWidth="4" strokeDasharray="10 12" />
          <circle cx="75" cy="-48" r="18" fill={c5} stroke={ink} strokeWidth="4" />
          <circle cx="-86" cy="42" r="13" fill={c2} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'bars':
      return (
        <g transform="translate(200, 190)">
          {[-96, -48, 0, 48, 96].map((x, i) => (
            <rect key={x} x={x - 16} y={-40 - i * 12} width="32" height={110 + i * 18} fill={colors[i % 5]} stroke={ink} strokeWidth="4" />
          ))}
        </g>
      );
    case 'record':
      return (
        <g transform="translate(200, 178)">
          <circle r="112" fill={ink} />
          <circle r="86" fill={c1} stroke={paper} strokeWidth="3" />
          <circle r="52" fill="none" stroke={paper} strokeWidth="2" opacity="0.7" />
          <circle r="26" fill={c4} stroke={ink} strokeWidth="4" />
          <rect x="35" y="-118" width="40" height="150" rx="20" fill={c2} stroke={ink} strokeWidth="4" transform="rotate(24)" />
        </g>
      );
    case 'fork':
      return (
        <g transform="translate(200, 178)">
          <path d="M -45 -105 L -45 -30 C -45 30, 45 30, 45 -30 L 45 -105" fill="none" stroke={ink} strokeWidth="24" strokeLinecap="round" />
          <path d="M -45 -105 L -45 -30 C -45 30, 45 30, 45 -30 L 45 -105" fill="none" stroke={c1} strokeWidth="14" strokeLinecap="round" />
          <line x1="0" y1="18" x2="0" y2="118" stroke={ink} strokeWidth="20" strokeLinecap="round" />
          <line x1="0" y1="18" x2="0" y2="118" stroke={c3} strokeWidth="10" strokeLinecap="round" />
        </g>
      );
    case 'sun':
      return (
        <g transform="translate(200, 178)">
          {Array.from({ length: 16 }).map((_, i) => <line key={i} x1="0" y1="-55" x2="0" y2="-132" stroke={i % 2 ? c3 : c4} strokeWidth="10" strokeLinecap="round" transform={`rotate(${i * 22.5})`} />)}
          <circle r="78" fill={c2} stroke={ink} strokeWidth="5" />
          <circle r="32" fill={c5} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'wave':
      return (
        <g transform="translate(200, 178)">
          {[-72, -36, 0, 36, 72].map((y, i) => <path key={y} d={`M -130 ${y} C -70 ${y - 60}, -20 ${y + 60}, 40 ${y} S 100 ${y - 45}, 130 ${y}`} fill="none" stroke={colors[i % 5]} strokeWidth="12" strokeLinecap="round" />)}
        </g>
      );
    case 'pick':
      return (
        <g transform="translate(200, 178)">
          <path d="M 0 -118 C 86 -118, 116 -50, 70 74 C 42 148, -42 148, -70 74 C -116 -50, -86 -118, 0 -118 Z" fill={c1} stroke={ink} strokeWidth="6" />
          <path d="M -42 -45 L 42 45 M 42 -45 L -42 45" stroke={c4} strokeWidth="13" strokeLinecap="round" />
          <circle r="22" fill={paper} stroke={ink} strokeWidth="4" />
        </g>
      );
    case 'note':
      return (
        <g transform="translate(200, 178) rotate(-10)">
          <circle cx="-45" cy="78" r="36" fill={c1} stroke={ink} strokeWidth="5" />
          <circle cx="58" cy="50" r="34" fill={c3} stroke={ink} strokeWidth="5" />
          <path d="M -10 76 L -10 -96 L 94 -125 L 94 50" fill="none" stroke={ink} strokeWidth="22" strokeLinejoin="round" />
          <path d="M -10 76 L -10 -96 L 94 -125 L 94 50" fill="none" stroke={c2} strokeWidth="12" strokeLinejoin="round" />
        </g>
      );
    case 'mic':
      return (
        <g transform="translate(200, 178)">
          <circle r="126" fill="none" stroke={c3} strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
          <circle r="96" fill="none" stroke={c2} strokeWidth="3" strokeDasharray="6 6" />
          <line x1="0" y1="50" x2="0" y2="140" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <line x1="-30" y1="140" x2="30" y2="140" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <path d="M -30 -10 C -30 40, 30 40, 30 -10" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
          <rect x="-18" y="-50" width="36" height="70" rx="18" fill={c1} stroke={ink} strokeWidth="5" />
          <rect x="-18" y="-50" width="36" height="30" rx="15" fill={c4} stroke={ink} strokeWidth="4" />
          <line x1="-18" y1="-35" x2="18" y2="-35" stroke={ink} strokeWidth="2" />
          <line x1="0" y1="-50" x2="0" y2="-20" stroke={ink} strokeWidth="2" />
          <rect x="-20" y="-30" width="40" height="6" fill={ink} />
        </g>
      );
    case 'piano':
      return (
        <g transform="translate(200, 180)">
          <path d="M -110 30 C -110 -60, -20 -100, 40 -100 C 90 -100, 110 -70, 110 -30 C 110 30, 80 40, 80 40 L -110 40 Z" fill={c1} stroke={ink} strokeWidth="6" />
          <line x1="40" y1="-100" x2="60" y2="10" stroke={ink} strokeWidth="6" />
          <rect x="-120" y="20" width="240" height="35" fill={paper} stroke={ink} strokeWidth="5" />
          {Array.from({ length: 15 }).map((_, i) => (
            <line key={i} x1={-120 + i * 16} y1="20" x2={-120 + i * 16} y2="55" stroke={ink} strokeWidth="2" />
          ))}
          {[-112, -96, -64, -48, -32, 0, 16, 48, 64, 80].map((x) => (
            <rect key={x} x={x} y="20" width="8" height="22" fill={ink} />
          ))}
        </g>
      );
    case 'cables':
      return (
        <g transform="translate(200, 178)">
          <path d="M -130 50 Q -90 -80, -30 -30 T 30 -30 T 90 20 T 130 -40" fill="none" stroke={c2} strokeWidth="18" strokeLinecap="round" />
          <path d="M -130 50 Q -90 -80, -30 -30 T 30 -30 T 90 20 T 130 -40" fill="none" stroke={ink} strokeWidth="10" strokeLinecap="round" />
          <path d="M -110 70 Q -60 -40, 0 0 T 80 -10 T 120 60" fill="none" stroke={c4} strokeWidth="8" strokeLinecap="round" />
          <g transform="translate(-130, 50) rotate(-45)">
            <rect x="-6" y="-20" width="12" height="30" fill={c1} stroke={ink} strokeWidth="3" rx="2" />
            <rect x="-3" y="-35" width="6" height="15" fill={paper} stroke={ink} strokeWidth="2" />
          </g>
          <g transform="translate(130, -40) rotate(135)">
            <rect x="-6" y="-20" width="12" height="30" fill={c5} stroke={ink} strokeWidth="3" rx="2" />
            <rect x="-3" y="-35" width="6" height="15" fill={paper} stroke={ink} strokeWidth="2" />
          </g>
        </g>
      );
    case 'score':
      return (
        <g transform="translate(200, 178)">
          {[-40, -20, 0, 20, 40].map((y) => (
            <path key={y} d={`M -140 ${y} C -70 ${y - 30}, 70 ${y + 30}, 140 ${y}`} fill="none" stroke={ink} strokeWidth="3" opacity="0.6" />
          ))}
          <g transform="translate(-80, -10) scale(0.7)">
            <path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150" fill="none" stroke={ink} strokeWidth="8" strokeLinecap="round" />
            <path d="M 20 80 C 20 110, -30 110, -30 80 C -30 60, -10 50, 0 50 C -20 50, -40 30, -40 0 C -40 -40, 0 -80, 20 -110 L 20 120 C 20 140, 5 150, -10 150" fill="none" stroke={c1} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g transform="translate(0, -20)">
            <ellipse cx="-10" cy="10" rx="12" ry="8" fill={c3} stroke={ink} strokeWidth="3" transform="rotate(-20)" />
            <line x1="0" y1="10" x2="0" y2="-40" stroke={ink} strokeWidth="4" />
            <path d="M 0 -40 Q 15 -35, 20 -20" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </g>
          <g transform="translate(60, 20)">
            <ellipse cx="-10" cy="10" rx="12" ry="8" fill={c4} stroke={ink} strokeWidth="3" transform="rotate(-20)" />
            <line x1="0" y1="10" x2="0" y2="-40" stroke={ink} strokeWidth="4" />
            <path d="M 0 -40 Q 15 -35, 20 -20" fill="none" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          </g>
        </g>
      );
    case 'mixer':
      return (
        <g transform="translate(200, 180)">
          <rect x="-130" y="-80" width="260" height="160" rx="6" fill={c1} stroke={ink} strokeWidth="5" />
          {[-65, 0, 65].map((x) => (
            <line key={x} x1={x} y1="-80" x2={x} y2="80" stroke={ink} strokeWidth="3" opacity="0.4" />
          ))}
          {[-97, -32, 33, 98].map((x, i) => (
            <g key={x} transform={`translate(${x}, -60)`}>
              <rect x="-10" y="-12" width="20" height="24" fill={ink} rx="2" />
              <circle cx="-4" cy="-5" r="2.5" fill={i === 2 ? '#ff6b6b' : '#38d9a9'} />
              <circle cx="4" cy="-5" r="2.5" fill={i === 2 ? '#ff6b6b' : '#38d9a9'} />
              <circle cx="-4" cy="5" r="2.5" fill="#ffd84d" />
              <circle cx="4" cy="5" r="2.5" fill="#ffd84d" />
            </g>
          ))}
          {[-97, -32, 33, 98].map((x) => (
            <line key={x} x1={x} y1="-30" x2={x} y2="60" stroke={ink} strokeWidth="4" strokeLinecap="round" />
          ))}
          <rect x="-109" y="10" width="24" height="14" rx="2" fill={c3} stroke={ink} strokeWidth="3" />
          <rect x="-44" y="-20" width="24" height="14" rx="2" fill={c4} stroke={ink} strokeWidth="3" />
          <rect x="21" y="30" width="24" height="14" rx="2" fill={c2} stroke={ink} strokeWidth="3" />
          <rect x="86" y="-5" width="24" height="14" rx="2" fill={c5} stroke={ink} strokeWidth="3" />
        </g>
      );
    case 'headphones':
      return (
        <g transform="translate(200, 178)">
          <path d="M -70 40 C -70 -70, 70 -70, 70 40" fill="none" stroke={ink} strokeWidth="18" strokeLinecap="round" />
          <path d="M -70 40 C -70 -70, 70 -70, 70 40" fill="none" stroke={c2} strokeWidth="10" strokeLinecap="round" />
          <g transform="translate(-75, 30) rotate(-10)">
            <rect x="-22" y="-36" width="44" height="72" rx="22" fill={c1} stroke={ink} strokeWidth="5" />
            <rect x="-10" y="-26" width="20" height="52" rx="10" fill={c3} stroke={ink} strokeWidth="3" />
          </g>
          <g transform="translate(75, 30) rotate(10)">
            <rect x="-22" y="-36" width="44" height="72" rx="22" fill={c1} stroke={ink} strokeWidth="5" />
            <rect x="-10" y="-26" width="20" height="52" rx="10" fill={c3} stroke={ink} strokeWidth="3" />
          </g>
          <path d="M -115 -10 A 60 60 0 0 0 -115 70" fill="none" stroke={c4} strokeWidth="4" strokeLinecap="round" strokeDasharray="4 6" />
          <path d="M 115 -10 A 60 60 0 0 1 115 70" fill="none" stroke={c4} strokeWidth="4" strokeLinecap="round" strokeDasharray="4 6" />
        </g>
      );
    case 'drums':
      return (
        <g transform="translate(200, 182)">
          <rect x="-86" y="-25" width="172" height="74" rx="4" fill={c1} stroke={ink} strokeWidth="6" />
          <rect x="-86" y="-35" width="172" height="10" fill={c2} stroke={ink} strokeWidth="4" />
          <rect x="-86" y="49" width="172" height="10" fill={c2} stroke={ink} strokeWidth="4" />
          {[-70, -35, 0, 35, 70].map((x) => (
            <line key={x} x1={x} y1="-25" x2={x} y2="49" stroke={ink} strokeWidth="3" />
          ))}
          <g transform="rotate(22)">
            <line x1="-120" y1="-45" x2="120" y2="-45" stroke={c3} strokeWidth="6" strokeLinecap="round" />
            <circle cx="120" cy="-45" r="6.5" fill={ink} />
          </g>
          <g transform="rotate(-22)">
            <line x1="-120" y1="45" x2="120" y2="45" stroke={c3} strokeWidth="6" strokeLinecap="round" />
            <circle cx="120" cy="45" r="6.5" fill={ink} />
          </g>
        </g>
      );
    case 'hendrix':
      return (
        <g transform="translate(200, 178)">
          <circle cx="-10" cy="-30" r="46" fill={ink} />
          <circle cx="28" cy="-24" r="42" fill={ink} />
          <circle cx="-28" cy="10" r="38" fill={ink} />
          <circle cx="24" cy="18" r="36" fill={ink} />
          <rect x="-44" y="-12" width="88" height="14" fill={c4} stroke={ink} strokeWidth="3" transform="rotate(-5)" />
          <g transform="translate(10, 40) rotate(-35)">
            <ellipse cx="-18" cy="18" rx="36" ry="46" fill={c1} stroke={ink} strokeWidth="5" />
            <ellipse cx="14" cy="8" rx="30" ry="40" fill={c1} stroke={ink} strokeWidth="5" />
            <rect x="-8" y="-96" width="16" height="120" fill={c2} stroke={ink} strokeWidth="4" />
            <rect x="-24" y="-116" width="48" height="22" rx="3" fill={c5} stroke={ink} strokeWidth="4" />
          </g>
        </g>
      );
    case 'joplin':
      return (
        <g transform="translate(200, 178)">
          <ellipse cx="0" cy="0" rx="96" ry="96" fill={c1} stroke={ink} strokeWidth="5" strokeDasharray="14 10" />
          <circle cx="-42" cy="-15" r="38" fill="none" stroke={ink} strokeWidth="12" />
          <circle cx="-42" cy="-15" r="32" fill={c2} stroke={ink} strokeWidth="4" opacity="0.8" />
          <circle cx="42" cy="-15" r="38" fill="none" stroke={ink} strokeWidth="12" />
          <circle cx="42" cy="-15" r="32" fill={c2} stroke={ink} strokeWidth="4" opacity="0.8" />
          <line x1="-4" y1="-15" x2="4" y2="-15" stroke={ink} strokeWidth="12" strokeLinecap="round" />
          <g transform="translate(0, 52)">
            <rect x="-14" y="-30" width="28" height="50" rx="14" fill={c3} stroke={ink} strokeWidth="5" />
            <line x1="0" y1="20" x2="0" y2="90" stroke={ink} strokeWidth="6" />
            <line x1="-14" y1="-10" x2="14" y2="-10" stroke={ink} strokeWidth="3" />
            <line x1="0" y1="-30" x2="0" y2="20" stroke={ink} strokeWidth="3" />
          </g>
        </g>
      );
    case 'beatles':
      return (
        <g transform="translate(200, 178)">
          <g transform="translate(-76, 20)">
            <circle cx="0" cy="-45" r="18" fill={ink} />
            <path d="M -14 -27 C -14 -27, -24 30, -24 70 L 12 70 C 12 30, 4 -27, 4 -27 Z" fill={ink} />
            <path d="M -22 -51 C -22 -65, 22 -65, 22 -51 C 22 -35, -22 -35, -22 -51" fill={c3} />
          </g>
          <g transform="translate(-24, 10)">
            <circle cx="0" cy="-45" r="18" fill={ink} />
            <path d="M -14 -27 C -14 -27, -24 30, -24 80 L 12 80 C 12 30, 4 -27, 4 -27 Z" fill={ink} />
            <path d="M -22 -51 C -22 -65, 22 -65, 22 -51 C 22 -35, -22 -35, -22 -51" fill={c1} />
          </g>
          <g transform="translate(28, 15)">
            <circle cx="0" cy="-45" r="18" fill={ink} />
            <path d="M -14 -27 C -14 -27, -20 30, -20 75 L 12 75 C 12 30, 4 -27, 4 -27 Z" fill={ink} />
            <path d="M -22 -51 C -22 -65, 22 -65, 22 -51 C 22 -35, -22 -35, -22 -51" fill={c4} />
          </g>
          <g transform="translate(80, 24)">
            <circle cx="0" cy="-45" r="18" fill={ink} />
            <path d="M -14 -27 C -14 -27, -18 30, -18 66 L 12 66 C 12 30, 4 -27, 4 -27 Z" fill={ink} />
            <path d="M -22 -51 C -22 -65, 22 -65, 22 -51 C 22 -35, -22 -35, -22 -51" fill={c2} />
          </g>
        </g>
      );
    case 'scorpions':
      return (
        <g transform="translate(200, 178)">
          <g transform="rotate(-30)">
            <path d="M -60 60 L 0 -20 L 60 60 L 30 75 L 0 25 L -30 75 Z" fill={c1} stroke={ink} strokeWidth="5" />
            <rect x="-8" y="-120" width="16" height="110" fill={c2} stroke={ink} strokeWidth="4" />
            <rect x="-18" y="-136" width="36" height="18" rx="2" fill={c4} stroke={ink} strokeWidth="4" />
          </g>
          <path d="M -70 40 C -120 40, -120 -50, -60 -70 C -40 -76, -10 -40, -20 -10 C -25 15, -60 20, -70 40" fill="none" stroke={c3} strokeWidth="12" strokeLinecap="round" />
          <path d="M -70 40 C -120 40, -120 -50, -60 -70 C -40 -76, -10 -40, -20 -10 C -25 15, -60 20, -70 40" fill="none" stroke={ink} strokeWidth="5" strokeLinecap="round" />
          <path d="M -20 -10 L -10 -15 L -14 -2 L -20 -10" fill={ink} />
        </g>
      );
    case 'star':
    default:
      return (
        <g transform="translate(200, 178)">
          <path d="M 0 -118 L 32 -38 L 118 -38 L 48 14 L 76 102 L 0 50 L -76 102 L -48 14 L -118 -38 L -32 -38 Z" fill={c1} stroke={ink} strokeWidth="6" strokeLinejoin="round" />
          <circle r="34" fill={c4} stroke={ink} strokeWidth="5" />
        </g>
      );
  }
};

const createExpandedGlamourTemplate = ([name, complexity, ageRange, sizes, motif], expansionIndex) => ({
  name,
  complexity,
  ageRange,
  sizes,
  render: (rand, colors, term1, term2, patternId, patternType) => {
    const [c1, c2, c3, c4, c5, paper, ink] = colors;
    const rotation = Math.round(rand() * 10 - 5);
    const shortTerm = term1.length > 13 ? term1.slice(0, 13) : term1;

    return (
      <>
        {patternType === 'rays' ? renderRayBackground(patternId, colors, rand) : <rect width="400" height="400" fill={`url(#${patternId})`} rx="6" />}
        <rect x="28" y="28" width="344" height="344" rx="8" fill="none" stroke={ink} strokeWidth="5" strokeDasharray="14 10" opacity="0.85" />
        <g transform={`rotate(${rotation} 200 178)`}>
          {renderExpansionMotif(motif, colors, ink, paper)}
        </g>
        <g transform="translate(200, 54)">
          <rect x="-132" y="-20" width="264" height="40" fill={expansionIndex % 2 ? c2 : c5} stroke={ink} strokeWidth="4" rx="3" />
          <text x="0" y="6" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="15" fill={ink}>
            {name.toUpperCase()}
          </text>
        </g>
        <g transform="translate(200, 346)">
          <rect x="-138" y="-24" width="276" height="48" fill={expansionIndex % 3 ? c4 : c3} stroke={ink} strokeWidth="4" rx="3" />
          <text x="0" y="-3" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="16" fill={ink}>
            {shortTerm}
          </text>
          <text x="0" y="15" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="10" fill={ink}>
            {ageRange} | {sizes.join(' / ')}
          </text>
        </g>
      </>
    );
  }
});

GLAMOUR_TEMPLATES.push(...GLAMOUR_EXPANSION_SPECS.map(createExpandedGlamourTemplate));

// --- MAIN REACT COMPONENT ---
export const DynamicArtwork = ({
  seed = 'guitar',
  index = null,
  complexity = null, // 'simple', 'intermediate', 'complete'
  height = 300,
  className = '',
  sx = {},
  ...props
}) => {
  // Memoize random calculations based on the seed
  const designData = useMemo(() => {
    const rand = createPRNG(seed);
    
    // 1. Pick palette
    const paletteIndex = Math.floor(rand() * GLAMOUR_PALETTES.length);
    const selectedPalette = GLAMOUR_PALETTES[paletteIndex];
    const colors = selectedPalette.colors;

    // 2. Filter templates by complexity if specified
    let filteredTemplates = GLAMOUR_TEMPLATES;
    if (complexity) {
      filteredTemplates = GLAMOUR_TEMPLATES.filter(t => t.complexity === complexity);
    }

    // 3. Select template index
    let selectedTemplate;
    if (index !== null && index >= 0 && index < GLAMOUR_TEMPLATES.length) {
      selectedTemplate = GLAMOUR_TEMPLATES[index];
    } else {
      const templateIndex = Math.floor(rand() * filteredTemplates.length);
      selectedTemplate = filteredTemplates[templateIndex];
    }

    // 4. Select random terminology terms
    const termIndex1 = Math.floor(rand() * GLAMOUR_TERMS.length);
    let termIndex2 = Math.floor(rand() * GLAMOUR_TERMS.length);
    if (termIndex1 === termIndex2) {
      termIndex2 = (termIndex2 + 1) % GLAMOUR_TERMS.length;
    }
    const term1 = GLAMOUR_TERMS[termIndex1];
    const term2 = GLAMOUR_TERMS[termIndex2];

    // 5. Select background pattern
    const patternTypes = ['grid', 'dots', 'stripes', 'rays', 'solid'];
    const patternType = patternTypes[Math.floor(rand() * patternTypes.length)];
    const patternId = `bg-pattern-${String(seed).replace(/[^a-zA-Z0-9]/g, '-')}-${Math.floor(rand() * 100000)}`;

    return {
      template: selectedTemplate,
      colors,
      paletteName: selectedPalette.name,
      term1,
      term2,
      patternId,
      patternType,
      rand
    };
  }, [seed, index, complexity]);

  const { template, colors, term1, term2, patternId, patternType, rand } = designData;

  // Perform render
  return (
    <svg
      viewBox="0 0 400 400"
      width="100%"
      height={height}
      className={`glamour-svg ${className}`}
      style={{
        display: 'block',
        border: '4px solid var(--brutal-ink)',
        boxShadow: 'var(--brutal-shadow)',
        borderRadius: '8px',
        backgroundColor: colors[5],
        overflow: 'hidden',
        ...sx
      }}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {renderBgPattern(patternId, patternType, colors)}
      {template.render(rand, colors, term1, term2, patternId, patternType)}
    </svg>
  );
};

export default DynamicArtwork;
