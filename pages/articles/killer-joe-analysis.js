import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const KillerJoeAnalysis = () => {
    return <JazzArticleTemplate data={songData["killer-joe"]} />;
};

export default KillerJoeAnalysis;
