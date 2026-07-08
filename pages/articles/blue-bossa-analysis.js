import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BlueBossaAnalysis = () => {
    return <JazzArticleTemplate data={songData["blue-bossa"]} />;
};

export default BlueBossaAnalysis;
