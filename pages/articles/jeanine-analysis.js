import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const JeanineAnalysis = () => {
    return <JazzArticleTemplate data={songData["jeanine"]} />;
};

export default JeanineAnalysis;
