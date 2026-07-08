// ui/editor/ComposerFAB.js
//
// Premium expandable floating action button for the composer.
// Single trigger circle expands into a sleek panel selector. No pin/unpin.

import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Fade } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import TuneIcon from "@mui/icons-material/Tune";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import PaletteIcon from "@mui/icons-material/Palette";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PianoIcon from "@mui/icons-material/Piano";
import LibraryMusicIcon from "@mui/icons-material/LibraryMusic";

const PANEL_DEFS = [
  { key: "menu",      label: "Menu",      icon: <MenuOpenIcon />,      color: "#818cf8" },
  { key: "toolbar",   label: "Toolbar",   icon: <TuneIcon />,          color: "#34d399" },
  { key: "transport", label: "Transport", icon: <GraphicEqIcon />,     color: "#38bdf8" },
  { key: "palette",   label: "Palette",   icon: <PaletteIcon />,       color: "#a78bfa" },
  { key: "inspector", label: "Inspector", icon: <VisibilityIcon />,    color: "#fb7185" },
  { key: "fretboard", label: "Fretboard", icon: <PianoIcon />,         color: "#f59e0b" },
];

export default function ComposerFAB({ open, onTogglePanel }) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!expanded) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const openCount = Object.values(open).filter(Boolean).length;

  return (
    <Box
      ref={containerRef}
      sx={{
        position: "fixed",
        right: 20,
        bottom: 80,
        zIndex: 2500,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 0,
      }}
    >
      {/* ── Panel list (slides up when expanded) ─────────────────────── */}
      <Fade in={expanded} timeout={200}>
        <Box
          sx={{
            mb: 1.5,
            borderRadius: 3,
            overflow: "hidden",
            bgcolor: "rgba(10,10,22,0.97)",
            border: (theme) => `1px solid ${theme.palette.primary.main}30`,
            backdropFilter: "blur(24px)",
            boxShadow: (theme) =>
              `0 0 0 1px ${theme.palette.primary.main}10, 0 20px 60px rgba(0,0,0,0.65), 0 0 50px ${theme.palette.primary.main}15`,
            opacity: expanded ? 1 : 0,
            transform: expanded ? "translateY(0) scale(1)" : "translateY(12px) scale(0.95)",
            transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
            pointerEvents: expanded ? "auto" : "none",
            minWidth: 200,
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 2,
              py: 1,
              borderBottom: "1px solid rgba(255,255,255,0.04)",
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}08 100%)`,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.68rem",
                fontWeight: 700,
                color: "grey.500",
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              Panels
            </Typography>
          </Box>

          {/* Items */}
          {PANEL_DEFS.map((panel, idx) => {
            const isOpen = open[panel.key];

            return (
              <Box
                key={panel.key}
                onClick={() => onTogglePanel(panel.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  borderBottom:
                    idx < PANEL_DEFS.length - 1
                      ? "1px solid rgba(255,255,255,0.025)"
                      : "none",
                  bgcolor: isOpen ? `${panel.color}10` : "transparent",
                  "&:hover": {
                    bgcolor: isOpen ? `${panel.color}18` : "rgba(255,255,255,0.04)",
                  },
                }}
              >
                {/* Active indicator dot */}
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    flexShrink: 0,
                    bgcolor: isOpen ? panel.color : "rgba(255,255,255,0.08)",
                    boxShadow: isOpen ? `0 0 8px ${panel.color}60` : "none",
                    transition: "all 0.2s",
                  }}
                />

                {/* Icon */}
                <Box
                  sx={{
                    display: "flex",
                    color: isOpen ? panel.color : "grey.600",
                    transition: "color 0.2s",
                    "& svg": { fontSize: 18 },
                  }}
                >
                  {panel.icon}
                </Box>

                {/* Label */}
                <Typography
                  sx={{
                    flex: 1,
                    fontSize: "0.78rem",
                    fontWeight: isOpen ? 600 : 400,
                    color: isOpen ? "grey.200" : "grey.500",
                    letterSpacing: 0.2,
                    transition: "all 0.2s",
                  }}
                >
                  {panel.label}
                </Typography>

                {/* Status chip */}
                {isOpen && (
                  <Box
                    sx={{
                      px: 0.8,
                      py: 0.15,
                      borderRadius: 1,
                      bgcolor: `${panel.color}18`,
                      border: `1px solid ${panel.color}25`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.58rem",
                        fontWeight: 700,
                        color: panel.color,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                    >
                      Open
                    </Typography>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Fade>

      {/* ── Main trigger button ──────────────────────────────────────── */}
      <Box
        onClick={() => setExpanded((v) => !v)}
        sx={{
          position: "relative",
          width: 56,
          height: 56,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: expanded
            ? "linear-gradient(135deg, rgba(239,68,68,0.9) 0%, rgba(220,38,38,0.9) 100%)"
            : openCount > 0
            ? (theme) => `linear-gradient(135deg, ${theme.palette.primary.main}d0 0%, ${theme.palette.secondary.main}d0 100%)`
            : "linear-gradient(135deg, rgba(15,15,28,0.95) 0%, rgba(30,30,50,0.95) 100%)",
          border: expanded
            ? "1.5px solid rgba(239,68,68,0.4)"
            : openCount > 0
            ? (theme) => `1.5px solid ${theme.palette.primary.main}60`
            : "1.5px solid rgba(255,255,255,0.08)",
          boxShadow: expanded
            ? "0 0 30px rgba(239,68,68,0.35), 0 8px 24px rgba(0,0,0,0.5)"
            : openCount > 0
            ? (theme) => `0 0 30px ${theme.palette.primary.main}40, 0 8px 24px rgba(0,0,0,0.5)`
            : "0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
          backdropFilter: "blur(16px)",
          transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
          "&:hover": {
            transform: "scale(1.08)",
            boxShadow: expanded
              ? "0 0 40px rgba(239,68,68,0.45), 0 10px 30px rgba(0,0,0,0.5)"
              : openCount > 0
              ? (theme) => `0 0 40px ${theme.palette.primary.main}60, 0 10px 30px rgba(0,0,0,0.5)`
              : (theme) => `0 10px 30px rgba(0,0,0,0.7), 0 0 20px ${theme.palette.primary.main}15`,
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        {/* Outer ring animation */}
        {!expanded && openCount > 0 && (
          <Box
            sx={{
              position: "absolute",
              inset: -5,
              borderRadius: "50%",
              border: (theme) => `1.5px solid ${theme.palette.primary.main}40`,
              animation: "composerRing 3s ease-in-out infinite",
            }}
          />
        )}

        {/* Icon — animated cross morphing */}
        <Box
          sx={{
            position: "relative",
            width: 22,
            height: 22,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Horizontal bar */}
          <Box
            sx={{
              position: "absolute",
              width: 20,
              height: 2,
              borderRadius: 1,
              bgcolor: "white",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
            }}
          />
          {/* Vertical bar */}
          <Box
            sx={{
              position: "absolute",
              width: 2,
              height: 20,
              borderRadius: 1,
              bgcolor: "white",
              transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s",
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
              opacity: 1,
            }}
          />
        </Box>

        {/* Open count badge */}
        {!expanded && openCount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              borderRadius: "50%",
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: (theme) => `0 2px 8px ${theme.palette.primary.main}50`,
              border: "2px solid rgba(10,10,22,0.97)",
            }}
          >
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 800,
                color: "white",
                lineHeight: 1,
              }}
            >
              {openCount}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Keyframes */}
      <style>{`
        @keyframes composerRing {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.15; transform: scale(1.25); }
        }
      `}</style>
    </Box>
  );
}
