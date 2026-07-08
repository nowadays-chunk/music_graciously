import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ButBeautifulAnalysis = () => {
    return <JazzArticleTemplate data={songData["but-beautiful"]} />;
};

export default ButBeautifulAnalysis;
