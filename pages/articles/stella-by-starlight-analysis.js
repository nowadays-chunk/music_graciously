import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const StellabystarlightAnalysis = () => {
    return <JazzArticleTemplate data={songData['stella-by-starlight']} />;
};

export default StellabystarlightAnalysis;
