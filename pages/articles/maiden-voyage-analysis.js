import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MaidenvoyageAnalysis = () => {
    return <JazzArticleTemplate data={songData['maiden-voyage']} />;
};

export default MaidenvoyageAnalysis;
