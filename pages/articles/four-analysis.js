import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FourAnalysis = () => {
    return <JazzArticleTemplate data={songData['four']} />;
};

export default FourAnalysis;
