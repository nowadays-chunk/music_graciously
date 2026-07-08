import React from 'react';
import { Container, Typography, Box, Paper, Divider, Chip, Stack } from '@mui/material';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../data/seo';

const ChangelogPage = () => {
    const changes = [
        {
            date: 'July 2026',
            title: 'Shipping & Policy Overhaul',
            description: 'Updated Shipping and Refund policies to reflect the removal of free shipping. Added clear shipping cost disclosure on the cart page. Revised footer layout to prevent SVG overlap on the legal-link section.',
            status: 'Completed',
        },
        {
            date: 'May 2026',
            title: 'Advanced Music Analytics — /stats',
            description: 'Full release of the /stats page. It dynamically analyses all 828 entities in our fretboard library, mapping harmonic, progressive, and melodic relationships in real time based on what you display on the fretboard.',
            status: 'Completed',
        },
        {
            date: 'April 2026',
            title: 'Theory Tables & Circle of Fifths',
            description: '/references and /circle are fully operational. Tables cover 828 references across all keys and shapes, ready for high-quality print at zero cost. The circle of fifths provides instant harmonic relationship visualisations.',
            status: 'Completed',
        },
        {
            date: 'March 2026',
            title: 'GMC Compliance & Business Transparency',
            description: 'Major update to all policy pages, footer integration, and founder disclosure to comply with Google Merchant Center requirements. Expanded Terms, Shipping, and Refund policies with full legal clarity.',
            status: 'Completed',
        },
        {
            date: 'February 2026',
            title: 'Store Module — Stripe & GMC Integration',
            description: 'Implementation of Stripe Payment Links and product synchronisation for 8 000+ music theory items across three Key of C collections (chords, scales, arpeggios). Optimised SEO and Google data-feed integration.',
            status: 'Completed',
        },
        {
            date: '2025',
            title: 'Core Architecture Foundations',
            description: 'Built the "No-Backend" static architecture on Vercel for maximum security and speed. Developed the initial fretboard visualisation engine supporting 8 instruments: guitar, piano, ukulele, violin, bass, double bass, trumpet, and saxophone.',
            status: 'Completed',
        },
    ];

    return (
        <>
            <Head>
                <title>Changelog & Roadmap | Guitar Sheets Media</title>
                <meta name="description" content="Track the latest developments, improvements, and future plans for Guitar Sheets Media — from core architecture to policy updates and new features." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, changelog, development, roadmap`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Changelog & Roadmap
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        A transparent record of what has been built, what is live, and what is coming next.
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    {/* Project Recap */}
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Where We Are — July 2026
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Guitar Sheets Media</strong> has grown from a personal side project into a fully operational music theory platform. As of today, the site covers <strong>828 musical entities</strong> (chords, scales, modes, and arpeggios) across 8 instruments, processed by an interactive fretboard player, a stats engine, printable reference tables, and a store selling premium PDF bundles.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our current focus is on <strong>SEO maturation, Adsense optimisation, and Google Merchant Center Next</strong> compliance — validating the project's commercial reach with real customers before scaling to the next milestone.
                        </Typography>
                    </Box>

                    {/* Timeline */}
                    <Stack spacing={4}>
                        {changes.map((item, index) => (
                            <Box key={index}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                    <Typography variant="subtitle2" color="primary" fontWeight="bold">
                                        {item.date}
                                    </Typography>
                                    <Chip
                                        label={item.status}
                                        size="small"
                                        color={
                                            item.status === 'Completed' ? 'success' :
                                            item.status === 'Scheduled' ? 'primary' :
                                            'warning'
                                        }
                                        variant="outlined"
                                    />
                                </Stack>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {item.description}
                                </Typography>
                                {index < changes.length - 1 && <Divider sx={{ mt: 3 }} />}
                            </Box>
                        ))}
                    </Stack>

                    {/* Feature Roadmap */}
                    <Box sx={{ mt: 10 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Feature Status & Roadmap
                        </Typography>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Operational" size="small" color="success" />
                                    <Typography variant="body1" fontWeight="bold">/play — Interactive Fretboard Player</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Live and fully functional. Supports guitar, piano, ukulele, violin, bass, double bass, trumpet, and saxophone with real-time scale, chord, and arpeggio visualisation across all keys and modes.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Operational" size="small" color="success" />
                                    <Typography variant="body1" fontWeight="bold">/stats — Advanced Music Analytics</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Fully operational. Analyses all 828 entities and maps them harmonically, progressively, and melodically based on your current fretboard selection.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Operational" size="small" color="success" />
                                    <Typography variant="body1" fontWeight="bold">/references — Theory Reference</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Working perfectly. 828 references for music theory in all keys and shapes, ready for high-quality printing for free.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Operational" size="small" color="success" />
                                    <Typography variant="body1" fontWeight="bold">/circle — Interactive Circle of Fifths</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Working perfectly. Future enhancements will use localStorage to create smart harmonic memory tied to your browsing history.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="In Maintenance" size="small" color="warning" />
                                    <Typography variant="body1" fontWeight="bold">/compose — Notation Engine</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Undergoing technical improvements to the interactive notation engine. Scheduled for a stable release aligned with the Musicians Marketplace launch.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Coming Soon" size="small" color="warning" />
                                    <Typography variant="body1" fontWeight="bold">Musicians Marketplace</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    A marketplace where musicians can use our Interactive Composer to create and sell their own sheets on the /store page, earning revenue for teaching others to play.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Discovery" size="small" color="info" />
                                    <Typography variant="body1" fontWeight="bold">/news — Musician News Feed</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Planned advanced news feed with a partially paid premium tier for exclusive industry insights.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="2027 Roadmap" size="small" color="secondary" />
                                    <Typography variant="body1" fontWeight="bold">Mobile & Tablet Apps (iOS / Android)</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    The application will be containerised in 2027 using <strong>Capacitor JS</strong> to launch on iOS and Android. Mobile and tablet development is a strategic priority given how musicians actually use learning tools.
                                </Typography>
                            </Paper>

                            <Paper sx={{ p: 2, border: '1px solid #eee' }} elevation={0}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Chip label="Data Expansion" size="small" color="info" />
                                    <Typography variant="body1" fontWeight="bold">Analysis & Data Laboratory</Typography>
                                </Stack>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Experimental phase active. A significant data expansion is planned for 2027 — receiving far more granular datasets to provide deeper insights into improvisation patterns, modal relationships, and jazz harmony.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default ChangelogPage;
