import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LullabyOfLeavesAnalysis = () => {
    return <JazzArticleTemplate data={songData["lullaby-of-leaves"]} />;
};

export default LullabyOfLeavesAnalysis;
