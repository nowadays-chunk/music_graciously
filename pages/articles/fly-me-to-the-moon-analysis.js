import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FlyMeToTheMoonAnalysis = () => {
    return <JazzArticleTemplate data={songData["fly-me-to-the-moon"]} />;
};

export default FlyMeToTheMoonAnalysis;
