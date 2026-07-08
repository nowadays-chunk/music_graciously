import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const PannonicaAnalysis = () => {
    return <JazzArticleTemplate data={songData["pannonica"]} />;
};

export default PannonicaAnalysis;
