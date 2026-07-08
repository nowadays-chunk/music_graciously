import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const IGotRhythmAnalysis = () => {
    return <JazzArticleTemplate data={songData["i-got-rhythm"]} />;
};

export default IGotRhythmAnalysis;
