import React from 'react';

// 1. Composer (Cassette tape)
export const ComposerIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <rect x="11" y="23" width="62" height="42" rx="4" fill="var(--brutal-ink)" />
        {/* Tape Body */}
        <rect x="8" y="20" width="62" height="42" rx="4" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Label Area */}
        <rect x="18" y="28" width="42" height="20" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Tape Reels */}
        <circle cx="30" cy="38" r="6" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="3" />
        <circle cx="50" cy="38" r="6" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="3" />
        <line x1="36" y1="38" x2="44" y2="38" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Trapezoid at bottom */}
        <path d="M 24 62 L 56 62 L 50 56 L 30 56 Z" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="3" />
    </svg>
);

// 2. Learning Lab (Chemistry flask bubbling with notes/circles)
export const LearningLabIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <path d="M 38 18 L 48 18 L 48 28 L 62 58 A 6 6 0 0 1 56 66 L 28 66 A 6 6 0 0 1 22 58 L 36 28 Z" fill="var(--brutal-ink)" transform="translate(3, 3)" />
        {/* Beaker Body */}
        <path d="M 36 15 L 44 15 L 44 26 L 58 56 A 5 5 0 0 1 53 63 L 27 63 A 5 5 0 0 1 22 56 L 36 26 Z" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Liquid inside */}
        <path d="M 25 50 L 55 50 A 5 5 0 0 1 53 63 L 27 63 A 5 5 0 0 1 25 50 Z" fill="var(--brutal-blue)" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Rim */}
        <rect x="33" y="12" width="14" height="4" rx="1" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Bubbles */}
        <circle cx="34" cy="38" r="4" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        {/* Musical note floating */}
        <path d="M 46 22 L 52 20 L 52 28 M 46 26 C 46 29, 42 29, 42 26 C 42 23, 46 23, 46 26 Z" fill="var(--brutal-ink)" stroke="var(--brutal-ink)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// 3. News (Megaphone broadcasting)
export const NewsIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <g transform="translate(3, 3)">
            <path d="M 22 40 L 32 50 L 28 62 L 20 60 Z" fill="var(--brutal-ink)" />
            <path d="M 32 24 L 52 16 L 56 50 L 32 42 Z" fill="var(--brutal-ink)" />
            <rect x="18" y="26" width="14" height="16" rx="2" fill="var(--brutal-ink)" />
        </g>
        {/* Megaphone handle */}
        <path d="M 22 40 L 32 50 L 28 62 L 20 60 Z" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinejoin="round" />
        {/* Megaphone Body */}
        <path d="M 32 24 L 52 16 L 56 50 L 32 42 Z" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinejoin="round" />
        {/* Back piece */}
        <rect x="18" y="26" width="14" height="16" rx="2" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Waves */}
        <path d="M 64 22 C 68 28, 68 38, 64 44" fill="none" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 70 16 C 76 25, 76 41, 70 50" fill="none" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinecap="round" />
        {/* Sparks */}
        <path d="M 52 10 L 56 6" stroke="var(--brutal-orange)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M 58 56 L 62 60" stroke="var(--brutal-orange)" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
);

// 4. Theory Tables (Fretboard / Matrix Grid)
export const TablesIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <rect x="15" y="21" width="54" height="46" rx="4" fill="var(--brutal-ink)" />
        {/* Grid Border */}
        <rect x="11" y="17" width="54" height="46" rx="4" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Grid lines */}
        <line x1="11" y1="32" x2="65" y2="32" stroke="var(--brutal-ink)" strokeWidth="3" />
        <line x1="11" y1="48" x2="65" y2="48" stroke="var(--brutal-ink)" strokeWidth="3" />
        <line x1="29" y1="17" x2="29" y2="63" stroke="var(--brutal-ink)" strokeWidth="3" />
        <line x1="47" y1="17" x2="47" y2="63" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Filled cells / highlights */}
        <rect x="30" y="18" width="16" height="13" fill="var(--brutal-pink)" stroke="none" />
        <rect x="48" y="33" width="16" height="14" fill="var(--brutal-yellow)" stroke="none" />
        {/* Note dots */}
        <circle cx="20" cy="25" r="4.5" fill="var(--brutal-orange)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="56" cy="25" r="4.5" fill="var(--brutal-mint)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="38" cy="40" r="4.5" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="20" cy="55" r="4.5" fill="var(--brutal-blue)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
    </svg>
);

// 5. Circle of Fifths (Color Wheel with arrow)
export const CircleIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <circle cx="43" cy="43" r="28" fill="var(--brutal-ink)" />
        {/* Outer Wheel */}
        <circle cx="40" cy="40" r="28" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Inner colored wheel */}
        <circle cx="40" cy="40" r="19" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="3.5" />
        {/* Center core */}
        <circle cx="40" cy="40" r="10" fill="var(--brutal-orange)" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Arrow pointer */}
        <path d="M 40 40 L 40 18 L 44 26 L 36 26 Z" fill="var(--brutal-ink)" stroke="var(--brutal-ink)" strokeWidth="1" />
        {/* Surrounding dots */}
        <circle cx="16" cy="24" r="3.5" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="64" cy="50" r="3.5" fill="var(--brutal-blue)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="60" cy="20" r="3" fill="var(--brutal-mint)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
    </svg>
);

// 6. Stats (Analytics line chart)
export const StatsIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <rect x="13" y="17" width="58" height="50" rx="4" fill="var(--brutal-ink)" />
        {/* Chart Frame */}
        <rect x="10" y="14" width="58" height="50" rx="4" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Grid lines */}
        <line x1="10" y1="26" x2="68" y2="26" stroke="var(--brutal-ink)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="10" y1="38" x2="68" y2="38" stroke="var(--brutal-ink)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="10" y1="50" x2="68" y2="50" stroke="var(--brutal-ink)" strokeWidth="1.5" strokeDasharray="3 3" />
        {/* Chart Line path */}
        <path d="M 16 52 L 28 32 L 40 44 L 52 20 L 62 28" fill="none" stroke="var(--brutal-ink)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 16 52 L 28 32 L 40 44 L 52 20 L 62 28" fill="none" stroke="var(--brutal-yellow)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Data points */}
        <circle cx="28" cy="32" r="4.5" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="40" cy="44" r="4.5" fill="var(--brutal-mint)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="52" cy="20" r="4.5" fill="var(--brutal-orange)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
    </svg>
);

// 7. Store (Vinyl emerging from sleeve)
export const StoreIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <rect x="15" y="27" width="46" height="42" rx="3" fill="var(--brutal-ink)" />
        {/* Record (back) */}
        <circle cx="50" cy="36" r="22" fill="var(--brutal-ink)" />
        {/* Grooves */}
        <circle cx="50" cy="36" r="16" fill="none" stroke="var(--brutal-paper)" strokeWidth="1.2" strokeOpacity="0.4" />
        <circle cx="50" cy="36" r="11" fill="none" stroke="var(--brutal-paper)" strokeWidth="1.2" strokeOpacity="0.4" />
        {/* Record Label */}
        <circle cx="50" cy="36" r="6" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="2.5" />
        <circle cx="50" cy="36" r="1.5" fill="var(--brutal-ink)" />
        {/* Sleeve */}
        <rect x="12" y="24" width="46" height="42" rx="3" fill="var(--brutal-pink)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Decorative circle on sleeve */}
        <circle cx="35" cy="45" r="12" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="3" />
        {/* Music symbol inside sleeve decoration */}
        <path d="M 32 46 L 38 41 L 38 48 C 38 50, 36 50, 36 48 Z" fill="var(--brutal-ink)" stroke="var(--brutal-ink)" strokeWidth="1.5" />
    </svg>
);

// 8. Competition (Trophy cup with sparks)
export const CompetitionIcon = ({ size = 52, ...props }) => (
    <svg viewBox="0 0 80 80" width={size} height={size} xmlns="http://www.w3.org/2000/svg" {...props}>
        {/* Shadow */}
        <path d="M 26 21 L 54 21 L 54 36 C 54 44, 46 52, 43 52 L 43 60 L 51 60 L 51 65 L 29 65 L 29 60 L 37 60 L 37 52 C 34 52, 26 44, 26 36 Z" fill="var(--brutal-ink)" transform="translate(3, 3)" />
        {/* Trophy Handles */}
        <path d="M 23 25 C 16 25, 16 41, 27 41" fill="none" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 23 25 C 16 25, 16 41, 27 41" fill="none" stroke="var(--brutal-pink)" strokeWidth="2" strokeLinecap="round" />
        <path d="M 57 25 C 64 25, 64 41, 53 41" fill="none" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M 57 25 C 64 25, 64 41, 53 41" fill="none" stroke="var(--brutal-pink)" strokeWidth="2" strokeLinecap="round" />
        {/* Trophy Cup Body */}
        <path d="M 26 18 L 54 18 L 54 33 C 54 41, 46 49, 40 49 C 34 49, 26 41, 26 33 Z" fill="var(--brutal-yellow)" stroke="var(--brutal-ink)" strokeWidth="4" strokeLinejoin="round" />
        {/* Stem & Base */}
        <path d="M 40 49 L 40 57 M 32 57 L 48 57" stroke="var(--brutal-ink)" strokeWidth="4.5" strokeLinecap="round" />
        <rect x="26" y="57" width="28" height="6" rx="1" fill="var(--brutal-orange)" stroke="var(--brutal-ink)" strokeWidth="4" />
        {/* Stars */}
        <path d="M 18 12 L 20 18 L 26 20 L 20 22 L 18 28 L 16 22 L 10 20 L 16 18 Z" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M 58 10 L 59 13 L 62 14 L 59 15 L 58 18 L 57 15 L 54 14 L 57 13 Z" fill="var(--brutal-paper)" stroke="var(--brutal-ink)" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
);
