import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const AllBluesAnalysis = () => {
    return <JazzArticleTemplate data={songData["all-blues"]} />;
};

export default AllBluesAnalysis;
