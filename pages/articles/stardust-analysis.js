import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const StardustAnalysis = () => {
    return <JazzArticleTemplate data={songData["stardust"]} />;
};

export default StardustAnalysis;
