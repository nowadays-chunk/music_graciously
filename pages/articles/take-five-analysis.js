import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const TakeFiveAnalysis = () => {
    return <JazzArticleTemplate data={songData["take-five"]} />;
};

export default TakeFiveAnalysis;
