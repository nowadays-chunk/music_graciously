import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const SoWhatAnalysis = () => {
    return <JazzArticleTemplate data={songData["so-what"]} />;
};

export default SoWhatAnalysis;
