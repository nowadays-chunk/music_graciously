import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const StthomasAnalysis = () => {
    return <JazzArticleTemplate data={songData['st-thomas']} />;
};

export default StthomasAnalysis;
