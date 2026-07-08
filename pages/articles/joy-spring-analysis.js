import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const JoySpringAnalysis = () => {
    return <JazzArticleTemplate data={songData["joy-spring"]} />;
};

export default JoySpringAnalysis;
