import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const DolphinDanceAnalysis = () => {
    return <JazzArticleTemplate data={songData["dolphin-dance"]} />;
};

export default DolphinDanceAnalysis;
