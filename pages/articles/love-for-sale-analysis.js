import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LoveForSaleAnalysis = () => {
    return <JazzArticleTemplate data={songData["love-for-sale"]} />;
};

export default LoveForSaleAnalysis;
