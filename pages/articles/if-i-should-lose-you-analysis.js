import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const IfIShouldLoseYouAnalysis = () => {
    return <JazzArticleTemplate data={songData["if-i-should-lose-you"]} />;
};

export default IfIShouldLoseYouAnalysis;
