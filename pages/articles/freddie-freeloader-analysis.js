import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FreddieFreeloaderAnalysis = () => {
    return <JazzArticleTemplate data={songData["freddie-freeloader"]} />;
};

export default FreddieFreeloaderAnalysis;
