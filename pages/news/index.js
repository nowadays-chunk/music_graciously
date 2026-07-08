import React from 'react';
import NewsFeedExperience from '../../components/Pages/News/NewsFeedExperience';

import Head from 'next/head';
import { Box } from '@mui/material'

export default function NewsPage(props) {
    return (
        <Box sx={{ pt: { xs: '80px', sm: '100px' } }}>
            <Head>
                <title>News Feed | Guitar Sheets</title>
                <meta
                    name="description"
                    content="Discover and filter the latest music and culture stories from curated RSS sources."
                />
            </Head>
            <Box>
                <NewsFeedExperience {...props} />
            </Box>
        </Box>
    );
}
