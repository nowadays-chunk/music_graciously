import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const CantaloupeislandAnalysis = () => {
    return <JazzArticleTemplate data={songData['cantaloupe-island']} />;
};

export default CantaloupeislandAnalysis;
