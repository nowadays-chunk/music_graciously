import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BilliesBounceAnalysis = () => {
    return <JazzArticleTemplate data={songData["billies-bounce"]} />;
};

export default BilliesBounceAnalysis;
