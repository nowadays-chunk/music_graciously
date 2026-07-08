import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const JustOneOfThoseThingsAnalysis = () => {
    return <JazzArticleTemplate data={songData["just-one-of-those-things"]} />;
};

export default JustOneOfThoseThingsAnalysis;
