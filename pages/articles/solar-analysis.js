import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const SolarAnalysis = () => {
    return <JazzArticleTemplate data={songData['solar']} />;
};

export default SolarAnalysis;
