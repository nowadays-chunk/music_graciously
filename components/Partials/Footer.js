import React from 'react';
import { Box, Container, Grid, Typography, Stack, Button, Divider } from '@mui/material';
import Link from 'next/link';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                bgcolor: 'var(--brutal-blue)',
                pt: { xs: 4, sm: 6, md: 10 },
                pb: { xs: 3, sm: 4, md: 5 },
                borderTop: '4px solid var(--brutal-ink)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* ── Main link columns ── */}
                <Grid container spacing={{ xs: 3, sm: 4, md: 6 }} justifyContent="space-between" alignItems="flex-start">
                    {/* Brand */}
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src="/graphics/guitar-sheets-mark.svg"
                            alt=""
                            sx={{ width: 72, height: 72, mb: 2 }}
                        />
                        <Typography
                            variant="h6"
                            color="text.primary"
                            gutterBottom
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                                letterSpacing: 0,
                            }}
                        >
                            GUITAR SHEETS
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                maxWidth: '300px',
                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            }}
                        >
                            A comprehensive music theory platform — interactive fretboards, printable
                            sheet bundles, composition tools, and a growing musicians community.
                        </Typography>
                    </Grid>

                    {/* Product links */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            Product
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            {[
                                { label: 'Player',   href: '/play' },
                                { label: 'Composer', href: '/compose' },
                                { label: 'Clothes',  href: '/graphics-gallery' },
                                { label: 'Books',    href: '/store' },
                            ].map(({ label, href }) => (
                                <Box component="li" key={href} sx={{ mb: 1 }}>
                                    <Typography
                                        component={Link}
                                        href={href}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textDecoration: 'none', fontSize: { xs: '0.7rem', sm: '0.8rem' }, '&:hover': { color: 'primary.main' } }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* To Read links */}
                    <Grid item xs={6} sm={3} md={2}>
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                            To Read
                        </Typography>
                        <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            {[
                                { label: 'Analysis', href: '/articles' },
                                { label: 'News',     href: '/news' },
                                { label: 'About Us', href: '/about' },
                            ].map(({ label, href }) => (
                                <Box component="li" key={href} sx={{ mb: 1 }}>
                                    <Typography
                                        component={Link}
                                        href={href}
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ textDecoration: 'none', fontSize: { xs: '0.7rem', sm: '0.8rem' }, '&:hover': { color: 'primary.main' } }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    {/* Decorative SVG — top-right corner, in-flow, no transparency */}
                    <Grid
                        item
                        xs={0}
                        md={3}
                        sx={{
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'flex-end',
                            alignItems: 'flex-start',
                        }}
                    >
                        <Box
                            component="img"
                            src="/graphics/neo-pattern.svg"
                            alt=""
                            sx={{
                                width: 220,
                                height: 'auto',
                                display: 'block',
                                pointerEvents: 'none',
                            }}
                        />
                    </Grid>
                </Grid>

                {/* ── Legal / policy row — full width, below everything ── */}
                <Divider sx={{ mt: { xs: 4, md: 6 }, mb: 2, borderColor: 'rgba(0,0,0,0.12)' }} />

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        justifyContent: 'space-between',
                        gap: 2,
                    }}
                >
                    {/* Legal navigation */}
                    <Stack
                        direction="row"
                        flexWrap="wrap"
                        columnGap={0.5}
                        rowGap={0.5}
                        alignItems="center"
                    >
                        {[
                            { label: 'Our Vision', href: '/about/our-vision' },
                            { label: 'Ethics',    href: '/ethics' },
                            { label: 'Changelog', href: '/changelog' },
                            { label: 'Shipping',  href: '/shipping-policy' },
                            { label: 'Returns',   href: '/refund-policy' },
                            { label: 'Terms',     href: '/terms-of-service' },
                            { label: 'Contact',   href: '/contact' },
                        ].map(({ label, href }) => (
                            <Button
                                key={href}
                                component={Link}
                                href={href}
                                color="inherit"
                                size="small"
                                sx={{ fontSize: { xs: '0.65rem', sm: '0.72rem' }, minWidth: 'auto', px: 0.8 }}
                            >
                                {label}
                            </Button>
                        ))}
                    </Stack>

                    {/* Copyright */}
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.72rem' }, whiteSpace: 'nowrap' }}
                    >
                        © {new Date().getFullYear()} Guitar Sheets Media. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
