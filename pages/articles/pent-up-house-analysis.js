import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const PentUpHouseAnalysis = () => {
    return <JazzArticleTemplate data={songData["pent-up-house"]} />;
};

export default PentUpHouseAnalysis;
