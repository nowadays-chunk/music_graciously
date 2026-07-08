import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const AnthropologyAnalysis = () => {
    return <JazzArticleTemplate data={songData["anthropology"]} />;
};

export default AnthropologyAnalysis;
