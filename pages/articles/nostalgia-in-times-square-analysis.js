import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const NostalgiaInTimesSquareAnalysis = () => {
    return <JazzArticleTemplate data={songData["nostalgia-in-times-square"]} />;
};

export default NostalgiaInTimesSquareAnalysis;
