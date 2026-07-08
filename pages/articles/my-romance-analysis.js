import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MyRomanceAnalysis = () => {
    return <JazzArticleTemplate data={songData["my-romance"]} />;
};

export default MyRomanceAnalysis;
