import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const PreludeToAKissAnalysis = () => {
    return <JazzArticleTemplate data={songData["prelude-to-a-kiss"]} />;
};

export default PreludeToAKissAnalysis;
