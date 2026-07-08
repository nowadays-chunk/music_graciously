import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Button,
    Chip,
    Stack,
    Divider,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import MainAppBar from '../../components/Partials/MainAppBar';
import globalTheme from '../../ui/theme';
import { aboutArticles } from '../../data/aboutArticles';
import { DEFAULT_KEYWORDS } from '../../data/seo';
import AdSlot from '../../components/Ads/AdSlot';
import ArticleArtwork from '../../components/Graphics/ArticleArtwork';


const AboutPage = () => {
    const [visibleCount, setVisibleCount] = useState(6);
    const visibleArticles = aboutArticles.slice(0, visibleCount);

    return (
        <>
            <Head>
                <title>About Us | Guitar Sheets Platform</title>
                <meta name="description" content="Learn more about our mission, vision, and the tools we build for the global guitar community." />
                <meta name="keywords" content={DEFAULT_KEYWORDS} />
            </Head>

            {/* Title Section */}
            <Box sx={{ pt: 15, pb: 6, bgcolor: 'var(--brutal-yellow)', borderBottom: '4px solid var(--brutal-ink)' }}>
            <Container maxWidth="xl">
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
                    About Our Platform
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 300, maxWidth: '800px', mb: 4 }}>
                    Discover our mission to empower musicians through technology, community, and expert knowledge.
                </Typography>
            </Container>
            </Box>

            {/* Top Ad Section */}
            <Container maxWidth="xl" sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
                <AdSlot
                    adSlot="4484714764"
                    adFormat="horizontal"
                />
            </Container>



            {/* Articles Grid */}
            <Box sx={{ py: 6, bgcolor: 'var(--brutal-bg)' }}>
                <Container maxWidth="xl">
                    <Grid container spacing={4}>
                        {visibleArticles.map((article) => (
                            <Grid item xs={12} sm={6} md={4} key={article.slug}>
                                <Card sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 1,
                                    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                                    '&:hover': {
                                        transform: 'translate(-3px, -3px)',
                                        boxShadow: '10px 10px 0 var(--brutal-ink)'
                                    }
                                }}>
                                    <Box sx={{ height: 220, borderBottom: '4px solid var(--brutal-ink)', overflow: 'hidden' }}>
                                        <ArticleArtwork article={article} height="100%" compact />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1, p: 4 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Chip
                                                label={article.category}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {article.readTime}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                                            {article.title}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {article.excerpt}
                                        </Typography>
                                    </CardContent>
                                    <Box sx={{ p: 4, pt: 0 }}>
                                        <Button
                                            component={Link}
                                            href={`/about/${article.slug}`}
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                        >
                                            Read Article
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    {visibleCount < aboutArticles.length && (
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
            </Box>

            {/* Newsletter / CTA Section */}
            <Box sx={{ bgcolor: 'var(--brutal-pink)', py: 12, borderTop: '4px solid var(--brutal-ink)' }}>
                <Container maxWidth="md">
                    <Card sx={{
                        bgcolor: 'var(--brutal-paper)',
                        color: 'var(--brutal-ink)',
                        borderRadius: 1,
                        p: { xs: 4, md: 8 },
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <Box component="img" src="/graphics/neo-pattern.svg" alt="" sx={{ position: 'absolute', right: -24, bottom: -24, width: 280, opacity: 0.9 }} />
                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <Typography variant="h3" fontWeight="bold" gutterBottom>
                                Join the Evolution
                            </Typography>
                            <Typography variant="h6" sx={{ mb: 4, opacity: 0.7, maxWidth: '600px', mx: 'auto' }}>
                                Stay updated with our latest tools, tutorials, and community news.
                            </Typography>
                            <Button variant="contained" size="large" color="secondary" sx={{ px: 6 }}>
                                Subscribe to Newsletter
                            </Button>
                        </Box>
                    </Card>
                </Container>
            </Box>

        </>
    );
};

export default AboutPage;
