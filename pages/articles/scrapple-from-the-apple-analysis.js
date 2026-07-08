import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ScrappleFromTheAppleAnalysis = () => {
    return <JazzArticleTemplate data={songData["scrapple-from-the-apple"]} />;
};

export default ScrappleFromTheAppleAnalysis;
