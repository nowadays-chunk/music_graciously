import React from 'react';
import {
    Container,
    Typography,
    Box,
    Divider,
    Breadcrumbs,
    Link as MuiLink,
    Chip,
    Avatar,
    Stack,
    Button,
    Grid,
    Card,
    CardContent
} from '@mui/material';

import Link from 'next/link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AdSlot from "../../Ads/AdSlot";
import ArticleArtwork from '../../Graphics/ArticleArtwork';

const ArticleLayout = ({ article, relatedArticles }) => {
    if (!article) return null;

    return (
        <Box sx={{ bgcolor: 'var(--brutal-bg)', pt: 12, pb: 8 }}>
                <Container maxWidth="xl">
                    {/* Breadcrumbs & Back Button */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Breadcrumbs aria-label="breadcrumb">
                            <MuiLink component={Link} href="/" underline="hover" color="inherit">
                                Home
                            </MuiLink>
                            <MuiLink component={Link} href="/about" underline="hover" color="inherit">
                                About
                            </MuiLink>
                            <Typography color="text.primary">{article.category}</Typography>
                        </Breadcrumbs>
                        <Button
                            component={Link}
                            href="/about"
                            startIcon={<ArrowBackIcon />}
                            variant="text"
                            sx={{ color: 'text.secondary' }}
                        >
                            Back to Articles
                        </Button>
                    </Box>

                    {/* Above article Ad */}
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <AdSlot adSlot="4659140437" adFormat="horizontal" />
                    </Box>


                    <Grid container spacing={4} justifyContent="center">
                        {/* Main Content */}
                        <Grid item xs={12} md={9}>
                            {/* Article Header */}
                            <Box sx={{ mb: 6 }}>
                                <Chip
                                    label={article.category}
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 2, fontWeight: 'bold' }}
                                />
                                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                                    {article.title}
                                </Typography>

                                <Stack direction="row" spacing={3} sx={{ color: 'text.secondary', mt: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CalendarTodayIcon sx={{ fontSize: 18 }} />
                                        <Typography variant="body2">{article.date}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AccessTimeIcon sx={{ fontSize: 18 }} />
                                        <Typography variant="body2">{article.readTime} read</Typography>
                                    </Box>
                                </Stack>
                            </Box>

                            <Divider sx={{ mb: 6 }} />

                            <Box sx={{
                                width: '100%',
                                height: { xs: 300, md: 500 },
                                borderRadius: 1,
                                mb: 6,
                                overflow: 'hidden',
                                boxShadow: 'var(--brutal-shadow)',
                                border: '4px solid var(--brutal-ink)'
                            }}>
                                <ArticleArtwork article={article} height="100%" />
                            </Box>

                            {/* Article Content */}
                            <Box
                                sx={{
                                    '& p': { mb: 3, lineHeight: 1.8, fontSize: '1.1rem', color: 'text.secondary' },
                                    '& h2': { mt: 6, mb: 3, fontWeight: 'bold' },
                                    '& h3': { mt: 4, mb: 2, fontWeight: 'bold' }
                                }}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            <Divider sx={{ my: 8 }} />

                            {/* Author Section Placeholder */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 10, p: 4, bgcolor: 'var(--brutal-yellow)', borderRadius: 1, border: '3px solid var(--brutal-ink)', boxShadow: 'var(--brutal-shadow)' }}>
                                <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main' }}>GS</Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">Guitar Sheets Editorial</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Our editorial team is dedicated to providing high-quality music education and platform insights.
                                    </Typography>
                                </Box>
                            </Box>

                            {/* Below article ad */}
                            <Box sx={{ my: 6, textAlign: 'center' }}>
                                <AdSlot adSlot="3847933285" adFormat="horizontal" />
                            </Box>


                            {/* Related Articles */}
                            {relatedArticles && relatedArticles.length > 0 && (
                                <Box sx={{ mb: 4 }}>
                                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                                        Keep Reading
                                    </Typography>
                                    <Grid container spacing={4}>
                                        {relatedArticles.map((rel) => (
                                            <Grid item xs={12} sm={6} key={rel.slug}>
                                                <Card sx={{
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: '10px 10px 0 var(--brutal-ink)' }
                                                }}>
                                                    <CardContent sx={{ flexGrow: 1 }}>
                                                        <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                                                            {rel.category}
                                                        </Typography>
                                                        <Link href={`/about/${rel.slug}`} passHref style={{ textDecoration: 'none' }}>
                                                            <Typography variant="h6" sx={{ mt: 1, mb: 2, color: 'text.primary', fontWeight: 'bold', '&:hover': { color: 'primary.main' } }}>
                                                                {rel.title}
                                                            </Typography>
                                                        </Link>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {rel.excerpt}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )}
                        </Grid>

                    </Grid>
                </Container>
            </Box>
    );
};

export default ArticleLayout;
