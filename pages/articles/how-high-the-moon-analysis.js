import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const HowHighTheMoonAnalysis = () => {
    return <JazzArticleTemplate data={songData["how-high-the-moon"]} />;
};

export default HowHighTheMoonAnalysis;
