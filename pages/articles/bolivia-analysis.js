import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BoliviaAnalysis = () => {
    return <JazzArticleTemplate data={songData["bolivia"]} />;
};

export default BoliviaAnalysis;
