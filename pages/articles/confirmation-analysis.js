import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ConfirmationAnalysis = () => {
    return <JazzArticleTemplate data={songData["confirmation"]} />;
};

export default ConfirmationAnalysis;
