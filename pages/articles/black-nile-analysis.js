import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BlackNileAnalysis = () => {
    return <JazzArticleTemplate data={songData["black-nile"]} />;
};

export default BlackNileAnalysis;
