import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MoodIndigoAnalysis = () => {
    return <JazzArticleTemplate data={songData["mood-indigo"]} />;
};

export default MoodIndigoAnalysis;
