import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const InWalkedBudAnalysis = () => {
    return <JazzArticleTemplate data={songData["in-walked-bud"]} />;
};

export default InWalkedBudAnalysis;
