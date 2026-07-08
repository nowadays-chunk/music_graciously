import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LikeSomeoneInLoveAnalysis = () => {
    return <JazzArticleTemplate data={songData["like-someone-in-love"]} />;
};

export default LikeSomeoneInLoveAnalysis;
