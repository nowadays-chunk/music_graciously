// core/music/score/LayoutRules.js

const LayoutRules = {
  staff: {
    lineSpacing: 10,   // px between staff lines
    topMargin: 20,
    bottomMargin: 20,
  },

  measure: {
    minWidth: 120,
    paddingLeft: 12,
    paddingRight: 12,
  },

  note: {
    stemLength: 35,
    beamSpacing: 6,
  },

  tab: {
    stringSpacing: 14,
    fretFontSize: 12,
  },

  rendering: {
    // Controls VexFlow scaling
    scale: 1.2,
  },

  spacing: {
    quarterNote: 24,
    eighthNote: 18,
    sixteenthNote: 12,
  },
};

export default LayoutRules;
