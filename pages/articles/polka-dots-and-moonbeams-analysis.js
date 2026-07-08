import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const PolkaDotsAndMoonbeamsAnalysis = () => {
    return <JazzArticleTemplate data={songData["polka-dots-and-moonbeams"]} />;
};

export default PolkaDotsAndMoonbeamsAnalysis;
