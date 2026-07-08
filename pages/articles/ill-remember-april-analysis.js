import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const IllRememberAprilAnalysis = () => {
    return <JazzArticleTemplate data={songData["ill-remember-april"]} />;
};

export default IllRememberAprilAnalysis;
