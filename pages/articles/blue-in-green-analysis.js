import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BlueInGreenAnalysis = () => {
    return <JazzArticleTemplate data={songData["blue-in-green"]} />;
};

export default BlueInGreenAnalysis;
