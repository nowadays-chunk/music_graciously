import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const EyeOfTheHurricaneAnalysis = () => {
    return <JazzArticleTemplate data={songData["eye-of-the-hurricane"]} />;
};

export default EyeOfTheHurricaneAnalysis;
