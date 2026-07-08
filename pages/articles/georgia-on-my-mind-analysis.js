import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const GeorgiaOnMyMindAnalysis = () => {
    return <JazzArticleTemplate data={songData["georgia-on-my-mind"]} />;
};

export default GeorgiaOnMyMindAnalysis;
