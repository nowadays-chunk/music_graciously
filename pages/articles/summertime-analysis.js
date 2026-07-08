import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const SummertimeAnalysis = () => {
    return <JazzArticleTemplate data={songData["summertime"]} />;
};

export default SummertimeAnalysis;
