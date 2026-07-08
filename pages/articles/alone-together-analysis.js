import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const AloneTogetherAnalysis = () => {
    return <JazzArticleTemplate data={songData["alone-together"]} />;
};

export default AloneTogetherAnalysis;
