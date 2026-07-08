import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BlackorpheusAnalysis = () => {
    return <JazzArticleTemplate data={songData['black-orpheus']} />;
};

export default BlackorpheusAnalysis;
