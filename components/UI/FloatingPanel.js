import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

/**
 * Docked panel — theme-integrated clean light aesthetic.
 * Preserves the theme's light backgrounds (white/cream paper) for optimal readability,
 * while utilizing premium theme accents in the title bar and borders.
 */
export default function FloatingPanel({
    title,
    onClose,
    children,
    sx = {},
}) {
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;
    const secondaryColor = theme.palette.secondary.main;
    const dividerColor = theme.palette.divider || "#111111";

    return (
        <Box
            sx={{
                borderRadius: 0,
                overflow: "hidden",
                bgcolor: "background.paper", // Preserves theme's paper color (white/cream)
                borderBottom: `1px solid ${dividerColor}`,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all 0.2s ease",
                ...sx,
            }}
        >
            {/* ── Title bar ── */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 0.8,
                    background: `linear-gradient(135deg, ${primaryColor}12 0%, ${secondaryColor}06 100%)`,
                    borderBottom: `1px solid ${dividerColor}`,
                    flexShrink: 0,
                    userSelect: "none",
                }}
            >
                <Typography
                    sx={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        color: "text.primary",
                        letterSpacing: "1.2px",
                        textTransform: "uppercase",
                    }}
                >
                    {title}
                </Typography>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{
                        width: 22,
                        height: 22,
                        color: "text.secondary",
                        "&:hover": {
                            color: "text.primary",
                            bgcolor: "action.hover",
                        },
                    }}
                >
                    <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
            </Box>

            {/* ── Content (natural light background & dark text) ── */}
            <Box
                sx={{
                    overflow: "auto",
                    bgcolor: "background.paper", // Natural cream/white background
                    color: "text.primary",       // Natural dark ink text
                    "&::-webkit-scrollbar": { width: 5, height: 5 },
                    "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
                    "&::-webkit-scrollbar-thumb": {
                        bgcolor: "action.selected",
                        borderRadius: 3,
                        "&:hover": { bgcolor: "action.focus" },
                    },
                }}
            >
                {children}
            </Box>
        </Box>
    );
}
