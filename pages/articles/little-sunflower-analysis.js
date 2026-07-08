import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LittleSunflowerAnalysis = () => {
    return <JazzArticleTemplate data={songData["little-sunflower"]} />;
};

export default LittleSunflowerAnalysis;
