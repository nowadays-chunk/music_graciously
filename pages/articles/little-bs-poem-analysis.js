import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LittleBsPoemAnalysis = () => {
    return <JazzArticleTemplate data={songData["little-bs-poem"]} />;
};

export default LittleBsPoemAnalysis;
