import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const RecordameAnalysis = () => {
    return <JazzArticleTemplate data={songData['recorda-me']} />;
};

export default RecordameAnalysis;
