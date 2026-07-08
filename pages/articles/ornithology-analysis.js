import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const OrnithologyAnalysis = () => {
    return <JazzArticleTemplate data={songData["ornithology"]} />;
};

export default OrnithologyAnalysis;
