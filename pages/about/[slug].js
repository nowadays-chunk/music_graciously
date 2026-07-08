import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Grid } from '@mui/material';
import ArticleLayout from '../../components/Pages/About/ArticleLayout';
import AdSlot from '../../components/Ads/AdSlot';
import { aboutArticles } from '../../data/aboutArticles';
import { DEFAULT_KEYWORDS } from '../../data/seo';

const ArticleDetail = ({ article, relatedArticles }) => {
    const router = useRouter();

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    if (!article) {
        return <div>Article not found</div>;
    }

    return (
        <>
            <Head>
                <title>{article.title} | Guitar Sheets About</title>
                <meta name="description" content={article.excerpt} />
                <meta name="keywords" content={`${DEFAULT_KEYWORDS}, ${article.category}`} />
            </Head>
            <Box sx={{ pt: { xs: '80px', sm: '100px' }, px: { xs: 2, md: 4 } }}>
                <Box sx={{ px: { xs: 2, md: 4 } }}>
                    <ArticleLayout article={article} relatedArticles={relatedArticles} />
                </Box>
            </Box>
        </>
    );
};

export async function getStaticPaths() {
    const paths = aboutArticles.map((article) => ({
        params: { slug: article.slug },
    }));

    return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
    const article = aboutArticles.find((a) => a.slug === params.slug);

    // Get 2 related articles from the same category or just different ones
    const relatedArticles = aboutArticles
        .filter((a) => a.slug !== params.slug)
        .sort(() => 0.5 - Math.random()) // Randomize for variety
        .slice(0, 2);

    return {
        props: {
            article,
            relatedArticles,
        },
    };
}

export default ArticleDetail;
