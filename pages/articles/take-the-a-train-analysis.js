import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const TakeTheATrainAnalysis = () => {
    return <JazzArticleTemplate data={songData["take-the-a-train"]} />;
};

export default TakeTheATrainAnalysis;
