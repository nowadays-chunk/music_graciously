import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const AutumnLeavesAnalysis = () => {
    return <JazzArticleTemplate data={songData["autumn-leaves"]} />;
};

export default AutumnLeavesAnalysis;
