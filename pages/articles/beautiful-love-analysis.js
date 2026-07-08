import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BeautifulLoveAnalysis = () => {
    return <JazzArticleTemplate data={songData["beautiful-love"]} />;
};

export default BeautifulLoveAnalysis;
