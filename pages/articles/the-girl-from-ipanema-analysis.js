import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const TheGirlFromIpanemaAnalysis = () => {
    return <JazzArticleTemplate data={songData["the-girl-from-ipanema"]} />;
};

export default TheGirlFromIpanemaAnalysis;
