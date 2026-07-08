import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const IsraelAnalysis = () => {
    return <JazzArticleTemplate data={songData["israel"]} />;
};

export default IsraelAnalysis;
