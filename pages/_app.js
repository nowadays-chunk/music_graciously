"use client";

import React, { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
import globalTheme from '../ui/theme';
import { ThemeProvider } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { hydrateCart } from '../redux/actions/cartActions';
import { loadPersistedCartState } from '../redux/reducers/cart';
import '../styles/styles.css';
import '../styles/CircleOfFifths.css';
import './styles.css';
import MainAppBar from '../components/Partials/MainAppBar';
import CartDrawer from '../components/CartDrawer/CartDrawer';
import Head from 'next/head';
import Footer from '../components/Partials/Footer';
import SpreadingSearch from '../components/Search/SpreadingSearch';
import GlamourPreviewDataUrlHydrator from '../components/Graphics/GlamourPreviewDataUrlHydrator';

const mainFont = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });
const drawerWidth = 360;

export function reportWebVitals(metric) {
  const endpoint = process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT || '/api/vitals';
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    label: metric.label,
    value: metric.value,
    navigationType: metric.navigationType || null,
    rating: metric.rating || null,
    page: typeof window !== 'undefined' ? window.location.pathname : null,
    timestamp: Date.now(),
  });

  if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
    const blob = new Blob([body], { type: 'application/json' });
    navigator.sendBeacon(endpoint, blob);
    return;
  }

  fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {});
}

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  flexGrow: 1,
  padding: 0,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: '100%',
  maxWidth: '100%',
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  ...theme.mixins.toolbar,
  minHeight: 'auto',
  justifyContent: 'space-between',
  padding: theme.spacing(1.5, 2),
}));

const Container = styled('div')({
  flexGrow: 1,
  width: '100%',
  maxWidth: '100%',
  margin: 0,
  padding: 0,
  overflowX: 'hidden',
});

const DrawerContent = styled('div')(({ theme }) => ({
  width: '100%',
  zIndex: 10000,
  position: 'relative',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  padding: theme.spacing(1.5),
}));

const drawerLinkSx = {
  my: 0.5,
  border: '3px solid var(--brutal-ink)',
  borderRadius: 1,
  bgcolor: 'var(--brutal-paper)',
  color: 'var(--brutal-ink)',
  boxShadow: '4px 4px 0 var(--brutal-ink)',
  transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
  '&:hover': {
    bgcolor: 'var(--brutal-yellow)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    transform: 'translate(2px, 2px)',
  },
};

const DrawerNavItem = ({ href, label, onClick, sx }) => {
  const router = useRouter();
  const isActive = router.asPath === href || router.pathname === href || (href !== '/' && router.pathname.startsWith(href));

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={Link}
        href={href}
        onClick={onClick}
        sx={{
          ...drawerLinkSx,
          bgcolor: isActive ? 'var(--brutal-yellow)' : 'var(--brutal-paper)',
          transform: isActive ? 'translate(2px, 2px)' : 'none',
          boxShadow: isActive ? 'none' : '4px 4px 0 var(--brutal-ink)',
          '&:hover': {
            bgcolor: 'var(--brutal-yellow)',
            boxShadow: '2px 2px 0 var(--brutal-ink)',
            transform: 'translate(2px, 2px)',
          },
          ...sx,
        }}
      >
        <ListItemText primary={label} primaryTypographyProps={{ fontWeight: 900, letterSpacing: 0.2 }} />
      </ListItemButton>
    </ListItem>
  );
};

const featuredDrawerSx = (bgcolor) => ({
  gridColumn: '1 / -1',
  bgcolor,
  border: '3px solid var(--brutal-ink)',
  boxShadow: '5px 5px 0 var(--brutal-ink)',
  fontWeight: 900,
  '&:hover': {
    bgcolor: 'var(--brutal-yellow)',
    boxShadow: '2px 2px 0 var(--brutal-ink)',
    transform: 'translate(3px, 3px)',
  },
});

const drawerItems = [
  { type: 'link', label: '🎸 Play', href: '/play', sx: featuredDrawerSx('var(--brutal-yellow)') },
  { type: 'link', label: '🎼 Generate', href: '/generate', sx: featuredDrawerSx('var(--brutal-blue)') },
  { type: 'link', label: '👂 Ear Training', href: '/ear-training', sx: featuredDrawerSx('var(--brutal-mint)') },
  { type: 'link', label: '🎯 Matches', href: '/matches', sx: featuredDrawerSx('var(--brutal-pink)') },
  { type: 'link', label: '🎵 Progressions', href: '/progressions', sx: featuredDrawerSx('var(--brutal-orange)') },
  { type: 'link', label: '🧠 Detector', href: '/play/detector', sx: featuredDrawerSx('var(--brutal-paper)') },
  { type: 'link', label: '🎹 Compose', href: '/compose' },
  { type: 'link', label: '📚 References', href: '/references' },
];

function App({ Component, pageProps }) {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const isHomepage = router.pathname === '/';

  useEffect(() => {
    store.dispatch(hydrateCart(loadPersistedCartState()));
  }, []);

  useEffect(() => {
    let timeoutId;
    if (typeof window !== 'undefined') {
      window.__showSearchSpinner = (show) => {
        setPageLoading(Boolean(show));
        if (show) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setPageLoading(false);
          }, 8000);
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.__showSearchSpinner = null;
      }
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleStart = () => setPageLoading(true);
    const handleStop = () => setPageLoading(false);
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
    };
  }, [router]);

  const handleDrawerToggle = () => setDrawerOpen((current) => !current);
  const handleDrawerClose = () => setDrawerOpen(false);

  const drawer = (
    <DrawerContent>
      <DrawerHeader>
        <Box sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1 }}>Menu</Box>
        <IconButton
          onClick={handleDrawerClose}
          aria-label="close menu"
          sx={{
            border: '3px solid var(--brutal-ink)',
            bgcolor: 'var(--brutal-pink)',
            boxShadow: '4px 4px 0 var(--brutal-ink)',
            '&:hover': { bgcolor: 'var(--brutal-yellow)' },
          }}
        >
          {globalTheme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <Box sx={{ my: 2, p: 2, bgcolor: 'var(--brutal-mint)', border: '3px solid var(--brutal-ink)', boxShadow: '4px 4px 0 var(--brutal-ink)' }}>
        <SpreadingSearch variant="drawer" placeholder="Find a C chord, Dorian mode..." onNavigate={handleDrawerClose} />
      </Box>

      <List
        subheader={<ListSubheader disableSticky sx={{ bgcolor: 'transparent', color: 'var(--brutal-ink)', fontWeight: 900 }}>Explore</ListSubheader>}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 0.75, md: 1.5 },
          p: 0,
          '& .MuiListSubheader-root': { gridColumn: '1 / -1' },
        }}
      >
        {drawerItems.map((item) => (
          <DrawerNavItem key={item.href} href={item.href} label={item.label} onClick={handleDrawerClose} sx={item.sx} />
        ))}
      </List>

      <Divider sx={{ mt: 2 }} />
    </DrawerContent>
  );

  return (
    <>
      <Head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        <link rel="icon" type="image/svg+xml" href="/graphics/app-icon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </Head>

      <Head>
        <style jsx global>{`
          :root { --font-primary: ${mainFont.style.fontFamily}; }
          html, body {
            overflow-x: hidden !important;
            max-width: 100% !important;
            background-color: var(--brutal-bg);
            color: var(--brutal-ink);
          }
          html { font-family: var(--font-primary); font-weight: 500; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={globalTheme}>
          <CssBaseline />
          <GlamourPreviewDataUrlHydrator />
          <Box sx={{ display: 'flex', width: '100%', overflowX: 'hidden', bgcolor: 'var(--brutal-bg)', color: 'var(--brutal-ink)' }}>
            <MainAppBar open={drawerOpen} handleDrawerToggle={handleDrawerToggle} isHomepage={isHomepage} />

            <nav style={{ zIndex: 10000 }}>
              <Drawer
                sx={{
                  width: { xs: drawerWidth, md: '100%' },
                  flexShrink: 0,
                  '& .MuiDrawer-paper': {
                    top: { xs: 56, sm: 64 },
                    width: { xs: 'min(88vw, 360px)', md: '100%' },
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: { xs: 'calc(100dvh - 56px)', sm: 'calc(100dvh - 64px)' },
                    boxSizing: 'border-box',
                    zIndex: 10000,
                    position: 'fixed',
                    overflowY: 'auto',
                    bgcolor: 'var(--brutal-bg)',
                    borderRight: { xs: '4px solid var(--brutal-ink)', md: 0 },
                    borderBottom: { xs: '4px solid var(--brutal-ink)', md: '4px solid var(--brutal-ink)' },
                    boxShadow: { xs: '10px 0 0 rgba(0,0,0,0.22)', md: '0 10px 0 rgba(0,0,0,0.22)' },
                  },
                }}
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerClose}
                ModalProps={{ keepMounted: true }}
              >
                {drawer}
              </Drawer>
            </nav>

            <Main open={drawerOpen}>
              <Container>
                <Component {...pageProps} leftDrawerOpen={drawerOpen} leftDrawerWidth={drawerWidth} />
              </Container>
              <Footer />
            </Main>

            <CartDrawer />
          </Box>

          {pageLoading && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(255, 253, 245, 0.85)',
                backdropFilter: 'blur(8px)',
                zIndex: 999999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'var(--brutal-paper)',
                  border: '4px solid var(--brutal-ink)',
                  boxShadow: 'var(--brutal-shadow)',
                  borderRadius: '50%',
                }}
              >
                <svg width="56" height="56" viewBox="0 0 50 50" style={{ animation: 'spin 1s linear infinite' }}>
                  <circle cx="25" cy="25" r="20" fill="none" stroke="var(--brutal-bg)" strokeWidth="6" />
                  <path d="M25,5a20,20 0 0,1 20,20" fill="none" stroke="var(--brutal-pink)" strokeWidth="6" strokeLinecap="round" />
                </svg>
              </Box>
              <Box sx={{ fontWeight: 900, color: 'var(--brutal-ink)', textTransform: 'uppercase', letterSpacing: 1 }}>Loading...</Box>
            </Box>
          )}
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
