import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const DaahoudAnalysis = () => {
    return <JazzArticleTemplate data={songData["daahoud"]} />;
};

export default DaahoudAnalysis;
