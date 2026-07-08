import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const CherylAnalysis = () => {
    return <JazzArticleTemplate data={songData["cheryl"]} />;
};

export default CherylAnalysis;
