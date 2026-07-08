import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BlueSevenAnalysis = () => {
    return <JazzArticleTemplate data={songData["blue-seven"]} />;
};

export default BlueSevenAnalysis;
