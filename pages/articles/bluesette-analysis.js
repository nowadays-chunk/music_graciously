import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BluesetteAnalysis = () => {
    return <JazzArticleTemplate data={songData["bluesette"]} />;
};

export default BluesetteAnalysis;
