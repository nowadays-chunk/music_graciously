import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AdSlot from '../../components/Ads/AdSlot';
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardContent,
    CardActionArea,
    Chip,
    Divider,
    Button
} from '@mui/material';
import { styled } from '@mui/system';
import { songData } from '../../data/jazzArticles/songData';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import ArticleArtwork from '../../components/Graphics/ArticleArtwork';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
    borderRadius: '4px',
    border: '3px solid var(--brutal-ink)',
    boxShadow: 'var(--brutal-shadow)',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translate(-3px, -3px)',
        boxShadow: '10px 10px 0 var(--brutal-ink)',
        borderColor: 'var(--brutal-ink)',
    },
}));

const HeaderSection = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(6),
    textAlign: 'left',
    background: 'var(--brutal-blue)',
    borderBottom: '4px solid var(--brutal-ink)',
}));

const ArticlesIndex = () => {
    const [visibleCount, setVisibleCount] = useState(6);
    const articles = Object.entries(songData).map(([key, data]) => ({
        key,
        ...data,
        href: `/articles/${key}-analysis`
    }));
    const visibleArticles = articles.slice(0, visibleCount);

    return (
        <Box sx={{ bgcolor: 'var(--brutal-bg)', minHeight: '100vh', pt: 0, pb: 10 }}>
            <Head>
                <title>Jazz Music Theory Analysis | Sheets Media Academy</title>
                <meta name="description" content="Deep-dive music theory analysis for jazz standards. Learn harmonic structures, soloing strategies, and historical context for your favorite songs." />
                <meta name="keywords" content={`jazz analysis, music theory, ${DEFAULT_KEYWORDS}`} />
            </Head>

            <HeaderSection>
                <Container maxWidth="xl">
                    <Typography variant="overline" color="primary" fontWeight="bold" sx={{ letterSpacing: 2 }}>
                        EDUCATIONAL CENTER
                    </Typography>
                    <Typography
                        variant="h1"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            fontSize: { xs: '3rem', md: '4.5rem' },
                            color: 'var(--brutal-ink)',
                            textAlign: 'left'
                        }}
                    >
                        Music Theory Analysis
                    </Typography>
                    <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300, maxWidth: '800px', mb: 4, lineHeight: 1.6 }}>
                        interactive fretboard laboratories, and structural breakdowns.
                    </Typography>
                </Container>
            </HeaderSection>

            {/* Top Ad Section */}
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                <AdSlot adSlot="2524023571" />
            </Container>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Grid container spacing={4}>
                    {visibleArticles.map((article) => (
                        <Grid item xs={12} sm={6} md={4} key={article.key}>
                            <StyledCard elevation={0}>
                                <Link href={article.href} passHref style={{ textDecoration: 'none', color: 'inherit', height: '100%', display: 'block' }}>
                                    <CardActionArea sx={{ height: '100%', p: 1 }}>
                                        <Box sx={{ height: 190, mb: 2, overflow: 'hidden', borderRadius: '4px', border: '3px solid var(--brutal-ink)' }}>
                                            <ArticleArtwork
                                                article={{
                                                    slug: article.key,
                                                    title: article.title,
                                                    category: 'Analysis',
                                                }}
                                                height="100%"
                                                compact
                                            />
                                        </Box>
                                        <CardContent>
                                            <Box sx={{ mb: 2 }}>
                                                <Chip
                                                    label={article.key.replace(/-/g, ' ').toUpperCase()}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 'bold', borderRadius: '6px' }}
                                                />
                                            </Box>
                                            <Typography variant="h5" component="h2" sx={{ fontWeight: 800, mb: 1, color: '#0f172a' }}>
                                                {article.title}
                                            </Typography>
                                            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 700, fontStyle: 'italic' }}>
                                                {article.subtitle}
                                            </Typography>
                                            <Divider sx={{ my: 2, opacity: 0.6 }} />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {article.description}
                                            </Typography>
                                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: '#3b82f6', fontWeight: 'bold', fontSize: '0.875rem' }}>
                                                READ ANALYSIS -&gt;
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Link>
                            </StyledCard>
                        </Grid>
                    ))}
                </Grid>
                {visibleCount < articles.length && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setVisibleCount((prev) => prev + 6)}
                            sx={{
                                px: 6,
                                py: 1.5,
                                fontWeight: 900,
                                fontSize: '1rem',
                            }}
                        >
                            Load More
                        </Button>
                    </Box>
                )}
            </Container>

            <Box sx={{ mt: 15, textAlign: 'center' }}>
                <Divider sx={{ mb: 8, maxWidth: '200px', mx: 'auto', borderWidth: 2, borderColor: 'primary.main' }} />
                <Typography variant="body2" color="text.secondary">
                    Copyright 2026 Sheets Media Academy. All Rights Reserved.
                </Typography>
            </Box>
        </Box >
    );
};

export default ArticlesIndex;
