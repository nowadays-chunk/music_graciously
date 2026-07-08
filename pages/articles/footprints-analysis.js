import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const FootprintsAnalysis = () => {
    return <JazzArticleTemplate data={songData["footprints"]} />;
};

export default FootprintsAnalysis;
