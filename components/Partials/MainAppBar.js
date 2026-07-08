import React, { useEffect, useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    IconButton,
    Container,
    Badge,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';
import { toggleCart } from '../../redux/actions/cartActions';
import SpreadingSearch from '../Search/SpreadingSearch';

const AppBarStyled = styled(AppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
    width: '100%',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

const menuItems = [
    { label: '🎸 Play', href: '/play', color: 'var(--brutal-yellow)' },
    { label: '🎼 Generate', href: '/generate', color: 'var(--brutal-blue)' },
    { label: '🏗️ Architecture', href: '/music-architecture', color: 'var(--brutal-orange)' },
    { label: '👂 Ear Training', href: '/ear-training', color: 'var(--brutal-mint)' },
    { label: '🎯 Matches', href: '/matches', color: 'var(--brutal-pink)' },
    { label: '🎵 Progressions', href: '/progressions', color: 'var(--brutal-orange)' },
    { label: '🧠 Detector', href: '/play/detector', color: 'var(--brutal-paper)' },
    { label: '🎹 Compose', href: '/compose', color: 'var(--brutal-pink)' },
    { label: '📚 References', href: '/references', color: 'var(--brutal-mint)' },
];

const navButtonSx = (color) => ({
    color: 'var(--brutal-ink)',
    fontWeight: 900,
    fontSize: '0.82rem',
    border: '3px solid var(--brutal-ink)',
    bgcolor: color,
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    px: 1.05,
    py: 0.5,
    minWidth: 'auto',
    whiteSpace: 'nowrap',
    '&:hover': {
        bgcolor: 'var(--brutal-yellow)',
        transform: 'translate(-1px, -1px)',
        boxShadow: '3px 3px 0 var(--brutal-ink)',
    },
    '&:active': {
        transform: 'translate(1px, 1px)',
        boxShadow: '1px 1px 0 var(--brutal-ink)',
    },
});

const MainAppBar = ({ open, handleDrawerToggle, isHomepage = false }) => {
    const dispatch = useDispatch();
    const cartItems = useSelector(state => state.cart?.items || []);
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const [showSearch, setShowSearch] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === '/') {
                e.preventDefault();
                setShowSearch(true);
            }
            if (e.key === 'Escape' && showSearch) {
                e.preventDefault();
                setShowSearch(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [showSearch]);

    useEffect(() => {
        if (showSearch) {
            setTimeout(() => {
                const inputEl = document.querySelector('header input');
                if (inputEl) {
                    inputEl.focus();
                    inputEl.select();
                }
            }, 100);
        }
    }, [showSearch]);

    const ToolbarContent = (
        <Toolbar
            disableGutters={isHomepage}
            sx={{
                width: '100%',
                px: isHomepage ? 0 : 2,
                pr: { xs: 2, xl: 4 },
                gap: { xs: 1, xl: 0 },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, position: 'relative', minWidth: 0 }}>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerToggle}
                    edge="start"
                    sx={{
                        mr: 2,
                        border: '3px solid var(--brutal-ink)',
                        bgcolor: open ? 'var(--brutal-pink)' : 'var(--brutal-paper)',
                        boxShadow: '4px 4px 0 var(--brutal-ink)',
                        display: { xs: 'inline-flex', xl: 'none' },
                        '&:hover': { bgcolor: 'var(--brutal-yellow)' },
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Button
                    component={Link}
                    href="/"
                    color="inherit"
                    sx={{
                        border: '3px solid var(--brutal-ink)',
                        backgroundColor: 'var(--brutal-yellow)',
                        boxShadow: 'var(--brutal-shadow-small)',
                        px: { xs: 1, md: 2 },
                        py: 0.5,
                        flex: '0 0 auto',
                        '&:hover': {
                            backgroundColor: 'var(--brutal-pink)',
                            borderColor: 'var(--brutal-ink)',
                        },
                    }}
                >
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box component="span" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            Music Graciously
                        </Box>
                        <Box component="img" src="/graphics/guitar-sheets-mark.svg" alt="" sx={{ display: 'block', width: 52, height: 52 }} />
                    </Typography>
                </Button>

                <Box sx={{ flexGrow: 1, position: 'relative', ml: 2.5, mr: 2.5, height: 56, display: { xs: 'none', xl: 'block' }, overflow: showSearch ? 'visible' : 'hidden' }}>
                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            opacity: showSearch ? 0 : 1,
                            transform: showSearch ? 'translateY(-56px)' : 'translateY(0)',
                            transition: 'opacity 0.25s ease, transform 0.25s ease',
                            pointerEvents: showSearch ? 'none' : 'auto',
                            visibility: showSearch ? 'hidden' : 'visible',
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            pb: 0.5,
                            '&::-webkit-scrollbar': { height: 4 },
                            '&::-webkit-scrollbar-thumb': { background: 'var(--brutal-ink)' },
                        }}
                    >
                        {menuItems.map(item => (
                            <Button key={item.href} component={Link} href={item.href} sx={navButtonSx(item.color)}>
                                {item.label}
                            </Button>
                        ))}
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            pl: 0.5,
                            pr: 1,
                            opacity: showSearch ? 1 : 0,
                            transform: showSearch ? 'translateY(0)' : 'translateY(56px)',
                            transition: 'opacity 0.25s ease, transform 0.25s ease',
                            pointerEvents: showSearch ? 'auto' : 'none',
                            visibility: showSearch ? 'visible' : 'hidden',
                        }}
                    >
                        <Box sx={{ flexGrow: 1, minWidth: 0, pr: 0.75 }}>
                            <SpreadingSearch autoFocus={showSearch} />
                        </Box>
                        <IconButton
                            onClick={() => setShowSearch(false)}
                            size="small"
                            sx={{
                                border: '3px solid var(--brutal-ink)',
                                bgcolor: 'var(--brutal-pink)',
                                boxShadow: '3px 3px 0 var(--brutal-ink)',
                                flexShrink: 0,
                                '&:hover': { bgcolor: 'var(--brutal-yellow)', transform: 'scale(1.05)' },
                                '&:active': { transform: 'translate(1px, 1px)', boxShadow: '1px 1px 0 var(--brutal-ink)' },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ display: { xs: 'block', xl: 'none' }, flexGrow: 1, minWidth: 12 }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 }, flex: '0 0 auto', minWidth: 0, justifyContent: 'flex-end' }}>
                <Box
                    title="Search (Ctrl + /)"
                    onClick={() => setShowSearch(true)}
                    sx={{
                        display: { xs: 'none', xl: 'inline-flex' },
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--brutal-ink)',
                        fontWeight: 900,
                        fontSize: '1.1rem',
                        border: '3px solid var(--brutal-ink)',
                        bgcolor: 'var(--brutal-paper)',
                        boxShadow: '2px 2px 0 var(--brutal-ink)',
                        width: 38,
                        height: 38,
                        borderRadius: '4px',
                        mr: 1,
                        '&:hover': { bgcolor: 'var(--brutal-yellow)', transform: 'scale(1.05)' },
                        '&:active': { transform: 'translate(1px, 1px)', boxShadow: '1px 1px 0 var(--brutal-ink)' },
                    }}
                >
                    /
                </Box>

                <Button
                    component={Link}
                    href="/store"
                    color="inherit"
                    sx={{
                        flex: '0 0 auto',
                        color: 'var(--brutal-ink)',
                        fontWeight: 900,
                        border: '3px solid var(--brutal-ink)',
                        bgcolor: 'var(--brutal-yellow)',
                        boxShadow: '4px 4px 0 var(--brutal-ink)',
                        px: { xs: 1.25, sm: 2 },
                        '&:hover': { bgcolor: 'var(--brutal-pink)', borderColor: 'var(--brutal-ink)' },
                    }}
                >
                    Store
                </Button>

                <IconButton color="inherit" onClick={() => dispatch(toggleCart())}>
                    <Badge badgeContent={cartCount} color="error">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </Box>
        </Toolbar>
    );

    if (isHomepage) {
        return (
            <AppBar position="fixed" elevation={0}>
                <Container maxWidth="xl">
                    {ToolbarContent}
                </Container>
            </AppBar>
        );
    }

    return (
        <AppBarStyled position="fixed" open={open} elevation={0}>
            {ToolbarContent}
        </AppBarStyled>
    );
};

export default MainAppBar;
