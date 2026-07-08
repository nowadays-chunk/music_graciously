import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const HaveYouMetMissJonesAnalysis = () => {
    return <JazzArticleTemplate data={songData["have-you-met-miss-jones"]} />;
};

export default HaveYouMetMissJonesAnalysis;
