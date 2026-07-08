import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const IHearARhapsodyAnalysis = () => {
    return <JazzArticleTemplate data={songData["i-hear-a-rhapsody"]} />;
};

export default IHearARhapsodyAnalysis;
