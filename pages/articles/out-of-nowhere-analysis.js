import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const OutOfNowhereAnalysis = () => {
    return <JazzArticleTemplate data={songData["out-of-nowhere"]} />;
};

export default OutOfNowhereAnalysis;
