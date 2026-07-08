import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const NatureBoyAnalysis = () => {
    return <JazzArticleTemplate data={songData["nature-boy"]} />;
};

export default NatureBoyAnalysis;
