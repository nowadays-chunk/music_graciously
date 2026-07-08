import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const AfternoonInParisAnalysis = () => {
    return <JazzArticleTemplate data={songData["afternoon-in-paris"]} />;
};

export default AfternoonInParisAnalysis;
