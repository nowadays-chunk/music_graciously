import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import Head from 'next/head';
import { DEFAULT_KEYWORDS } from '../data/seo';

const EthicsPage = () => {
    return (
        <>
            <Head>
                <title>Ethics & Vision | Guitar Sheets Media</title>
                <meta name="description" content="Our ethical commitment, founding values, and the vision driving Guitar Sheets Media — a musician-first platform built on transparency and impact." />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, ethics, altruism, music theory, Hamza Eljaouhari`} />
            </Head>
            <Container maxWidth="md" sx={{ py: 15 }}>
                <Paper elevation={0} sx={{ p: { xs: 3, md: 6 }, border: '1px solid #eee', borderRadius: 4 }}>
                    <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
                        Ethics & Our Mission
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        A commitment to altruism, professional excellence, and genuine musical impact.
                    </Typography>
                    <Divider sx={{ my: 4 }} />

                    {/* Section 1 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            1. Who We Are
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>Guitar Sheets Media</strong> (sheets.media) is a music theory reference platform created and maintained by <strong>Hamza Eljaouhari</strong> — a professional guitar player and software developer based between France and Morocco. We build interactive fretboard visualizers, printable sheet-music bundles, a composition engine, a circle of fifths tool, and a growing set of learning resources covering over <strong>828 musical entities</strong> across chords, scales, and arpeggios.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The platform runs as a lean, statically-generated Next.js application hosted on Vercel — a deliberate "no-backend" architecture that maximises security, speed, and global reach. Our store operates through Stripe Payment Links and is fully registered with <strong>Google Merchant Center</strong>.
                        </Typography>
                    </Box>

                    {/* Section 2 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            2. Service-First Philosophy
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our primary drive is to offer one of the most reliable and comprehensive Guitar Music Theory references available anywhere online. Every diagram, every fretboard rendering, and every printed sheet is produced to a high standard — checked for accuracy against established music theory conventions and updated as the platform evolves.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We believe that high-quality musical education should be <strong>accessible, accurate, and beautifully presented</strong>. The free tools (interactive player, circle of fifths, tables, stats) are offered at zero cost. Premium physical and digital bundles are priced fairly to sustain the project.
                        </Typography>
                    </Box>

                    {/* Section 3 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            3. Altruism & Impact
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Seeking impact is the founding drive of this project. Hamza bridges the gap between technical precision and musical soul — and this platform is the result. It is not merely a store, but a tool designed to <strong>empower musicians globally</strong> through clear, structured, and beautiful visualisations of music theory.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Every euro of revenue is reinvested into improving the platform: expanding the dataset, refining the design, and building the roadmap features listed on our <strong>/changelog</strong> page.
                        </Typography>
                    </Box>

                    {/* Section 4 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            4. Transparency & Integrity
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We value the trust of every customer and collaborator. Our policies — shipping, refunds, and terms of service — are written plainly and kept up to date. We operate in full compliance with international digital commerce standards and Google Merchant Center transparency requirements.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We are currently experimenting with <strong>SEO, Google Adsense, and Google Merchant Center Next</strong> to test the project's commercial viability. We do not engage in hidden fees, dark-pattern upsells, or misleading advertising.
                        </Typography>
                    </Box>

                    {/* Section 5 */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            5. Continuous Improvement
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our website is intentionally iterative. It is refined and reedited continuously to better match our users' expectations and feedback. Every update — from a copy tweak to a major new feature — is logged transparently on our Changelog page.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            When community milestones are reached, we plan to launch dedicated social media channels and a musicians marketplace where creators can sell their own sheets directly on the platform.
                        </Typography>
                    </Box>

                    {/* Quote */}
                    <Box sx={{ mt: 6, pl: 3, borderLeft: '4px solid var(--brutal-ink)' }}>
                        <Typography variant="body1" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            "To build a musical bridge between the logic of code and the emotion of the strings." — Hamza Eljaouhari
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default EthicsPage;
