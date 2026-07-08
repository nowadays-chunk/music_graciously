import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BeatriceAnalysis = () => {
    return <JazzArticleTemplate data={songData["beatrice"]} />;
};

export default BeatriceAnalysis;
