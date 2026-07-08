import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FiveSpotAfterDarkAnalysis = () => {
    return <JazzArticleTemplate data={songData["five-spot-after-dark"]} />;
};

export default FiveSpotAfterDarkAnalysis;
