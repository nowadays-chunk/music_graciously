import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LushLifeAnalysis = () => {
    return <JazzArticleTemplate data={songData["lush-life"]} />;
};

export default LushLifeAnalysis;
