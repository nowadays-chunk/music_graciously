import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FunkalleroAnalysis = () => {
    return <JazzArticleTemplate data={songData["funkallero"]} />;
};

export default FunkalleroAnalysis;
