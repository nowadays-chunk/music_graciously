import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ButNotForMeAnalysis = () => {
    return <JazzArticleTemplate data={songData["but-not-for-me"]} />;
};

export default ButNotForMeAnalysis;
