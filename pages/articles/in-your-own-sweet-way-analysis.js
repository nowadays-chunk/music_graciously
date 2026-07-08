import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const InYourOwnSweetWayAnalysis = () => {
    return <JazzArticleTemplate data={songData["in-your-own-sweet-way"]} />;
};

export default InYourOwnSweetWayAnalysis;
