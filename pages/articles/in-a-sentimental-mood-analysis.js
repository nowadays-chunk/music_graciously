import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const InasentimentalmoodAnalysis = () => {
    return <JazzArticleTemplate data={songData['in-a-sentimental-mood']} />;
};

export default InasentimentalmoodAnalysis;
