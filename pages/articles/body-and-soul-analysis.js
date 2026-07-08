import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BodyAndSoulAnalysis = () => {
    return <JazzArticleTemplate data={songData["body-and-soul"]} />;
};

export default BodyAndSoulAnalysis;
