import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const DonnaLeeAnalysis = () => {
    return <JazzArticleTemplate data={songData["donna-lee"]} />;
};

export default DonnaLeeAnalysis;
