import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const NardisAnalysis = () => {
    return <JazzArticleTemplate data={songData["nardis"]} />;
};

export default NardisAnalysis;
