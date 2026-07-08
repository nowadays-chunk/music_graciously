import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LazyBirdAnalysis = () => {
    return <JazzArticleTemplate data={songData["lazy-bird"]} />;
};

export default LazyBirdAnalysis;
