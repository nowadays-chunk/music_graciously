import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const JorduAnalysis = () => {
    return <JazzArticleTemplate data={songData["jordu"]} />;
};

export default JorduAnalysis;
