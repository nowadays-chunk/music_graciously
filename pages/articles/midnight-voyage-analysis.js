import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MidnightVoyageAnalysis = () => {
    return <JazzArticleTemplate data={songData["midnight-voyage"]} />;
};

export default MidnightVoyageAnalysis;
