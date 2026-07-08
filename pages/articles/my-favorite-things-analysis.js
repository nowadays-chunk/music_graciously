import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MyfavoritethingsAnalysis = () => {
    return <JazzArticleTemplate data={songData['my-favorite-things']} />;
};

export default MyfavoritethingsAnalysis;
