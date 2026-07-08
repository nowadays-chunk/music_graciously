import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const RoundMidnightAnalysis = () => {
    return <JazzArticleTemplate data={songData["round-midnight"]} />;
};

export default RoundMidnightAnalysis;
