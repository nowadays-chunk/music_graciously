import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const JustFriendsAnalysis = () => {
    return <JazzArticleTemplate data={songData["just-friends"]} />;
};

export default JustFriendsAnalysis;
