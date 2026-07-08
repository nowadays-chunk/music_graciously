import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const TuneupAnalysis = () => {
    return <JazzArticleTemplate data={songData['tune-up']} />;
};

export default TuneupAnalysis;
