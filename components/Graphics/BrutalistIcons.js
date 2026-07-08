import React from 'react';

// Common Styling Helper
const commonSvgStyle = { display: 'inline-block', verticalAlign: 'middle' };

export const ApparelIcon = ({ size = 24, fill = "var(--brutal-pink)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 6 2 L 9 4.5 L 15 4.5 L 18 2 L 22 4 L 20.5 9.5 L 17.5 9.5 L 17.5 21 L 6.5 21 L 6.5 9.5 L 3.5 9.5 L 2 4 Z" fill={fill} />
    <path d="M 9.5 4.5 Q 12 6.5 14.5 4.5" />
  </svg>
);

export const ScaleIcon = ({ size = 24, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 12 3 L 2 21 L 22 21 Z" fill={fill} />
    <path d="M 12 11 L 8 18 L 16 18 Z" fill="#fffdf5" />
  </svg>
);

export const ShieldIcon = ({ size = 24, fill = "var(--brutal-blue)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 12 22 C 17.5 20 20 15 20 9.5 L 20 4 L 12 2 L 4 4 L 4 9.5 C 4 15 6.5 20 12 22 Z" fill={fill} />
  </svg>
);

export const LightningIcon = ({ size = 24, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 13 2 L 3 14 L 12 14 L 11 22 L 21 10 L 12 10 Z" fill={fill} />
  </svg>
);

export const ChartIcon = ({ size = 24, fill = "var(--brutal-mint)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <rect x="3" y="11" width="4" height="10" fill={fill} />
    <rect x="10" y="4" width="4" height="17" fill="var(--brutal-pink)" />
    <rect x="17" y="8" width="4" height="13" fill="var(--brutal-yellow)" />
  </svg>
);

export const TargetIcon = ({ size = 24, fill = "var(--brutal-pink)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <circle cx="12" cy="12" r="10" fill={fill} />
    <circle cx="12" cy="12" r="6" fill="#fffdf5" />
    <circle cx="12" cy="12" r="2.5" fill="var(--brutal-ink)" />
  </svg>
);

export const LockIcon = ({ size = 24, fill = "var(--brutal-mint)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <rect x="3" y="11" width="18" height="11" rx="2" fill={fill} />
    <path d="M 7 11 V 7 C 7 4.2 9.2 2 12 2 C 14.8 2 17 4.2 17 7 V 11" />
  </svg>
);

export const FilterIcon = ({ size = 24, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 4 21 V 14 M 4 10 V 3 M 12 21 V 12 M 12 8 V 3 M 20 21 V 16 M 20 12 V 3" />
    <circle cx="4" cy="12" r="3" fill={fill} />
    <circle cx="12" cy="10" r="3" fill="var(--brutal-pink)" />
    <circle cx="20" cy="14" r="3" fill="var(--brutal-blue)" />
  </svg>
);

export const LightbulbIcon = ({ size = 24, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 9 18 H 15 M 10 21 H 14 M 15 18 C 15 15 18 13.5 18 9 C 18 5.7 15.3 3 12 3 C 8.7 3 6 5.7 6 9 C 6 13.5 9 15 9 18 Z" fill={fill} />
  </svg>
);

export const FlameIcon = ({ size = 24, fill = "var(--brutal-orange)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <path d="M 12 2 C 12 2 19 6 19 12 C 19 16.5 16 21 12 21 C 8 21 5 16.5 5 12 C 5 6 12 2 12 2 Z M 12 7 C 12 7 15 9 15 12 C 15 14.5 13.5 17 12 17 C 10.5 17 9 14.5 9 12 C 9 9 12 7 12 7 Z" fill={fill} />
  </svg>
);

export const KeyIcon = ({ size = 24, fill = "var(--brutal-pink)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={commonSvgStyle}>
    <circle cx="7" cy="12" r="4" fill={fill} />
    <path d="M 11 12 H 21 M 21 12 V 15 M 17 12 V 15" />
  </svg>
);

// Instrument Icons
export const GuitarIcon = ({ size = 28, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 9 16.5 C 9 19.5 6.8 21.5 4 21.5 C 1.2 21.5 0.5 19.5 2 17 C 3.5 14.5 6 14.5 9 16.5 Z" fill={fill} />
    <path d="M 8.5 16 L 20 4.5" />
    <path d="M 18 6.5 L 21.5 5 C 22.5 4.5 22.5 3.5 21.5 3 C 20.5 2.5 19.5 2.5 19 3.5 L 17.5 7" />
    <circle cx="5" cy="18" r="1.5" fill="var(--brutal-ink)" />
  </svg>
);

export const PianoIcon = ({ size = 28, fill = "var(--brutal-paper)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <rect x="2" y="4" width="20" height="16" rx="2" fill={fill} />
    <line x1="6" y1="4" x2="6" y2="20" />
    <line x1="10" y1="4" x2="10" y2="20" />
    <line x1="14" y1="4" x2="14" y2="20" />
    <line x1="18" y1="4" x2="18" y2="20" />
    <rect x="4.5" y="4" width="3" height="10" fill="var(--brutal-ink)" />
    <rect x="8.5" y="4" width="3" height="10" fill="var(--brutal-ink)" />
    <rect x="12.5" y="4" width="3" height="10" fill="var(--brutal-ink)" />
    <rect x="16.5" y="4" width="3" height="10" fill="var(--brutal-ink)" />
  </svg>
);

export const BassIcon = ({ size = 28, fill = "var(--brutal-blue)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 8.5 15.5 C 8.5 19 6.5 21 4 21 C 1.5 21 1 19 2.5 16.5 C 4 14 6 14.5 8.5 15.5 Z" fill={fill} />
    <path d="M 8 15 L 21 2" />
    <circle cx="5" cy="17.5" r="2" fill="var(--brutal-ink)" />
  </svg>
);

export const UkuleleIcon = ({ size = 28, fill = "var(--brutal-pink)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 9.5 16.5 C 9.5 19 7.5 21 5.5 21 C 3.5 21 3 19 4.5 17 C 6 15 7.5 15 9.5 16.5 Z" fill={fill} />
    <path d="M 9 16 L 20 5" />
    <circle cx="6" cy="18" r="1" fill="var(--brutal-ink)" />
  </svg>
);

export const ViolinIcon = ({ size = 28, fill = "var(--brutal-orange)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 7.5 14.5 C 7.5 18 5 21 2.5 21 C 0.5 21 0.5 19 2 16.5 C 3.5 14 5.5 14.5 7.5 14.5 Z" fill={fill} />
    <path d="M 7 14 L 19 2" />
    <path d="M 12 18 L 22 8" stroke="var(--brutal-ink)" strokeWidth="1.5" />
  </svg>
);

export const DoubleBassIcon = ({ size = 28, fill = "var(--brutal-mint)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 7 13.5 C 7 17.5 4.5 21 2 21 C 0.2 21 0.2 18.5 2 15.5 C 3.5 12.5 5.5 13.5 7 13.5 Z" fill={fill} />
    <path d="M 6.5 13 L 18 1.5" />
    <path d="M 12 16.5 L 22 6.5" stroke="var(--brutal-ink)" strokeWidth="1.5" />
    <line x1="2" y1="21" x2="1" y2="23" stroke="var(--brutal-ink)" strokeWidth="3" />
  </svg>
);

export const SaxophoneIcon = ({ size = 28, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 3 13.5 C 1 15 1 18.5 4 20.5 C 7 22.5 11.5 21 11.5 16.5 L 11.5 3 L 19 3 L 19 6.5 L 14 6.5" fill={fill} />
    <circle cx="11.5" cy="9.5" r="1.5" fill="var(--brutal-ink)" />
    <circle cx="11.5" cy="12.5" r="1.5" fill="var(--brutal-ink)" />
  </svg>
);

export const TrumpetIcon = ({ size = 28, fill = "var(--brutal-yellow)", stroke = "var(--brutal-ink)" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', margin: '0 auto' }}>
    <path d="M 2 8 H 15 M 2 13 H 15 M 10 8 V 13 M 12 8 V 13 M 14 8 V 13 M 15 8 L 22 4 V 17 L 15 13 Z" fill={fill} />
    <circle cx="10" cy="5" r="1" fill="var(--brutal-ink)" />
    <circle cx="12" cy="5" r="1" fill="var(--brutal-ink)" />
    <circle cx="14" cy="5" r="1" fill="var(--brutal-ink)" />
  </svg>
);
