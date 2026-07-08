import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MyOneAndOnlyLoveAnalysis = () => {
    return <JazzArticleTemplate data={songData["my-one-and-only-love"]} />;
};

export default MyOneAndOnlyLoveAnalysis;
