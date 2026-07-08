import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const BluesForAliceAnalysis = () => {
    return <JazzArticleTemplate data={songData["blues-for-alice"]} />;
};

export default BluesForAliceAnalysis;
