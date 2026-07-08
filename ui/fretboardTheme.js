import { createTheme } from '@mui/material/styles';

const ink = '#111111';
const paper = '#fffdf5';
const yellow = '#ffc900';
const mint = '#23a094';
const pink = '#ff90e8';
const blue = '#90a8ed';
const shadow = `5px 5px 0 ${ink}`;

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: blue,
            success: mint,
            contrastText: ink,
        },
        secondary: {
            main: pink,
            contrastText: ink,
        },
        background: {
            default: '#f7f2e8',
            paper,
        },
        text: {
            primary: ink,
            secondary: '#3a352f',
        },
        divider: ink,
    },
    typography: {
        fontFamily: '"Arial", "Helvetica", system-ui, sans-serif',
        h1: { fontWeight: 900, color: ink, letterSpacing: 0 },
        h2: { fontWeight: 900, color: ink, letterSpacing: 0 },
        h3: { fontWeight: 900, color: ink, letterSpacing: 0 },
        h4: { fontWeight: 900, color: ink, letterSpacing: 0 },
        h5: { fontWeight: 850, color: ink, letterSpacing: 0 },
        h6: { fontWeight: 850, color: ink, letterSpacing: 0 },
        body1: { color: ink },
        subtitle1: { color: ink },
        button: { textTransform: 'none', fontWeight: 900, letterSpacing: 0 },
    },
    shape: {
        borderRadius: 4,
    },
    components: {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    textTransform: 'none',
                    fontWeight: 900,
                    border: `3px solid ${ink}`,
                    boxShadow: shadow,
                    color: ink,
                    '&:hover': {
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `8px 8px 0 ${ink}`,
                        backgroundColor: yellow,
                    },
                },
                contained: {
                    boxShadow: shadow,
                },
                outlined: {
                    borderWidth: 3,
                    backgroundColor: paper,
                    '&:hover': {
                        borderWidth: 3,
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    border: `2px solid ${ink}`,
                    backgroundColor: paper,
                    color: ink,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    boxShadow: shadow,
                    border: `3px solid ${ink}`,
                    backgroundColor: paper,
                    transition: 'transform 150ms ease, box-shadow 150ms ease',
                    '&:hover': {
                        borderColor: ink,
                        transform: 'translate(-2px, -2px)',
                        boxShadow: `8px 8px 0 ${ink}`,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    backgroundImage: 'none',
                    backgroundColor: 'rgba(255, 253, 245, 0.8)',
                    backdropFilter: 'blur(10px)',
                },
                elevation1: {
                    boxShadow: shadow,
                    border: `3px solid ${ink}`,
                },
                elevation4: {
                    boxShadow: shadow,
                    borderBottom: `3px solid ${ink}`,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 4,
                    border: `2px solid ${ink}`,
                    backgroundColor: yellow,
                    color: ink,
                    fontWeight: 900,
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
    },
});

export default theme;
