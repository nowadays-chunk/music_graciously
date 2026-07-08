import { createTheme } from '@mui/material/styles';

const ink = '#111111';
const paper = '#fffdf5';
const bg = '#f7f2e8';
const pink = '#ff90e8';
const yellow = '#ffc900';
const mint = '#23a094';
const blue = '#90a8ed';
const orange = '#ff7051';
const brutalShadow = `6px 6px 0 ${ink}`;
const brutalShadowSmall = `4px 4px 0 ${ink}`;

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: pink,
            dark: '#e66ccc',
            contrastText: ink,
        },
        secondary: {
            main: mint,
            dark: '#167e73',
            contrastText: ink,
        },
        info: {
            main: blue,
            contrastText: ink,
        },
        warning: {
            main: yellow,
            contrastText: ink,
        },
        success: {
            main: mint,
            contrastText: ink,
        },
        error: {
            main: orange,
            contrastText: ink,
        },
        background: {
            default: bg,
            paper,
        },
        text: {
            primary: ink,
            secondary: '#3a352f',
        },
        divider: ink,
    },
    shape: {
        borderRadius: 4,
    },
    spacing: 8,
    typography: {
        fontFamily: '"Arial", "Helvetica", system-ui, sans-serif',
        h1: {
            fontFamily: '"Arial Black", "Arial", system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: 0,
            textTransform: 'none',
            color: ink,
        },
        h2: {
            fontFamily: '"Arial Black", "Arial", system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: 0,
            textTransform: 'none',
            color: ink,
        },
        h3: {
            fontWeight: 900,
            letterSpacing: 0,
            color: ink,
        },
        h4: {
            fontWeight: 900,
            letterSpacing: 0,
            color: ink,
        },
        h5: {
            fontWeight: 850,
            letterSpacing: 0,
            color: ink,
        },
        h6: {
            fontWeight: 850,
            letterSpacing: 0,
            color: ink,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.58,
            color: ink,
        },
        body2: {
            fontSize: '0.9rem',
            lineHeight: 1.5,
            color: '#3a352f',
        },
        button: {
            textTransform: 'none',
            fontWeight: 900,
            letterSpacing: 0,
        },
    },
    shadows: [
        'none',
        brutalShadowSmall,
        brutalShadow,
        `8px 8px 0 ${ink}`,
        `10px 10px 0 ${ink}`,
        ...Array(20).fill(brutalShadow),
    ],
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                ':root': {
                    '--brutal-ink': ink,
                    '--brutal-bg': bg,
                    '--brutal-paper': paper,
                    '--brutal-pink': pink,
                    '--brutal-yellow': yellow,
                    '--brutal-mint': mint,
                    '--brutal-blue': blue,
                    '--brutal-orange': orange,
                    '--brutal-shadow': brutalShadow,
                    '--brutal-shadow-small': brutalShadowSmall,
                },
                body: {
                    backgroundColor: bg,
                    backgroundImage:
                        'linear-gradient(rgba(17,17,17,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,17,17,0.04) 1px, transparent 1px)',
                    backgroundSize: '34px 34px',
                },
                '::selection': {
                    backgroundColor: yellow,
                    color: ink,
                },
                a: {
                    color: 'inherit',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    padding: '12px 20px',
                    border: `3px solid ${ink}`,
                    color: ink,
                    boxShadow: brutalShadowSmall,
                    transition: 'transform 140ms ease, box-shadow 140ms ease, background-color 140ms ease',
                    '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: brutalShadow,
                    },
                    '&:active': {
                        transform: 'translate(2px, 2px)',
                        boxShadow: `2px 2px 0 ${ink}`,
                    },
                },
                containedPrimary: {
                    backgroundColor: pink,
                    color: ink,
                    '&:hover': {
                        backgroundColor: '#ffa8ef',
                    },
                },
                containedSecondary: {
                    backgroundColor: mint,
                    color: ink,
                    '&:hover': {
                        backgroundColor: '#38b9ad',
                    },
                },
                outlinedPrimary: {
                    borderColor: ink,
                    backgroundColor: paper,
                    color: ink,
                    '&:hover': {
                        borderColor: ink,
                        backgroundColor: yellow,
                    },
                },
                text: {
                    borderColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                        borderColor: ink,
                        backgroundColor: yellow,
                        boxShadow: brutalShadowSmall,
                    },
                },
                sizeSmall: {
                    padding: '8px 12px',
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    border: `3px solid ${ink}`,
                    borderRadius: 4,
                    color: ink,
                    backgroundColor: paper,
                    boxShadow: brutalShadowSmall,
                    transition: 'transform 140ms ease, box-shadow 140ms ease',
                    '&:hover': {
                        backgroundColor: yellow,
                        transform: 'translate(-2px, -2px)',
                        boxShadow: brutalShadow,
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    border: `3px solid ${ink}`,
                    boxShadow: brutalShadow,
                    backgroundColor: paper,
                    backgroundImage: 'none',
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `10px 10px 0 ${ink}`,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 253, 245, 0.78)',
                    backdropFilter: 'blur(10px)',
                    backgroundImage: 'none',
                },
                outlined: {
                    border: `3px solid ${ink}`,
                },
                elevation1: {
                    border: `3px solid ${ink}`,
                    boxShadow: brutalShadowSmall,
                },
                elevation4: {
                    border: `3px solid ${ink}`,
                    boxShadow: brutalShadow,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 253, 245, 0.82)',
                    backdropFilter: 'blur(14px)',
                    color: ink,
                    boxShadow: 'none',
                    borderBottom: `4px solid ${ink}`,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: `4px solid ${ink}`,
                    backgroundColor: bg,
                    boxShadow: brutalShadow,
                },
            },
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    border: `3px solid ${ink}`,
                    boxShadow: brutalShadow,
                    backgroundColor: paper,
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    fontWeight: 800,
                    borderBottom: `2px solid ${ink}`,
                    '&:last-of-type': {
                        borderBottom: 0,
                    },
                    '&:hover': {
                        backgroundColor: yellow,
                    },
                },
            },
        },
        MuiListItem: {
            styleOverrides: {
                root: {
                    borderBottom: `2px solid ${ink}`,
                    '&:hover': {
                        backgroundColor: yellow,
                    },
                },
            },
        },
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: ink,
                    borderBottomWidth: 3,
                    opacity: 1,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    border: `2px solid ${ink}`,
                    backgroundColor: blue,
                    color: ink,
                    fontWeight: 900,
                },
                outlined: {
                    backgroundColor: paper,
                    border: `2px solid ${ink}`,
                },
                filled: {
                    backgroundColor: yellow,
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 253, 245, 0.78)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: brutalShadowSmall,
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: ink,
                        borderWidth: 3,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: ink,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: ink,
                        borderWidth: 3,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: ink,
                    fontWeight: 800,
                    '&.Mui-focused': {
                        color: ink,
                    },
                },
            },
        },
        MuiAutocomplete: {
            styleOverrides: {
                groupLabel: {
                    backgroundColor: pink,
                    color: ink,
                    fontWeight: 900,
                    borderBottom: `3px solid ${ink}`,
                },
                option: {
                    '&[aria-selected="true"], &.Mui-focused': {
                        backgroundColor: `${yellow} !important`,
                    },
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                root: {
                    borderBottom: `3px solid ${ink}`,
                },
                indicator: {
                    height: 6,
                    backgroundColor: orange,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 900,
                    color: ink,
                    '&.Mui-selected': {
                        color: ink,
                        backgroundColor: yellow,
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderColor: ink,
                    borderBottomWidth: 2,
                },
                head: {
                    backgroundColor: yellow,
                    color: ink,
                    fontWeight: 900,
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    border: `3px solid ${ink}`,
                    borderRadius: 4,
                    boxShadow: brutalShadowSmall,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    border: `4px solid ${ink}`,
                    boxShadow: `12px 12px 0 ${ink}`,
                    backgroundColor: 'rgba(255, 253, 245, 0.86)',
                    backdropFilter: 'blur(14px)',
                },
            },
        },
        MuiSlider: {
            styleOverrides: {
                rail: {
                    color: ink,
                    opacity: 1,
                    height: 6,
                },
                track: {
                    color: mint,
                    border: `2px solid ${ink}`,
                    height: 6,
                },
                thumb: {
                    width: 22,
                    height: 22,
                    border: `3px solid ${ink}`,
                    backgroundColor: yellow,
                    boxShadow: brutalShadowSmall,
                },
            },
        },
        MuiSwitch: {
            styleOverrides: {
                switchBase: {
                    '&.Mui-checked': {
                        color: yellow,
                    },
                    '&.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: mint,
                        opacity: 1,
                    },
                },
                track: {
                    border: `2px solid ${ink}`,
                    backgroundColor: paper,
                    opacity: 1,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    border: `2px solid ${ink}`,
                    backgroundColor: ink,
                    color: paper,
                    fontWeight: 800,
                    borderRadius: 4,
                },
            },
        },
    },
});

export default theme;
