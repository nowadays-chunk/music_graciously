import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ImpressionsAnalysis = () => {
    return <JazzArticleTemplate data={songData["impressions"]} />;
};

export default ImpressionsAnalysis;
