import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const DesafinadoAnalysis = () => {
    return <JazzArticleTemplate data={songData['desafinado']} />;
};

export default DesafinadoAnalysis;
