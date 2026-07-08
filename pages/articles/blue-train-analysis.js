import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BluetrainAnalysis = () => {
    return <JazzArticleTemplate data={songData['blue-train']} />;
};

export default BluetrainAnalysis;
