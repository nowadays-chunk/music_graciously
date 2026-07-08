import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const SongForMyFatherAnalysis = () => {
    return <JazzArticleTemplate data={songData["song-for-my-father"]} />;
};

export default SongForMyFatherAnalysis;
