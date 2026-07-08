import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const ItDontMeanAThingAnalysis = () => {
    return <JazzArticleTemplate data={songData["it-dont-mean-a-thing"]} />;
};

export default ItDontMeanAThingAnalysis;
