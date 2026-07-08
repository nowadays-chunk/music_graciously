import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const LullabyofbirdlandAnalysis = () => {
    return <JazzArticleTemplate data={songData['lullaby-of-birdland']} />;
};

export default LullabyofbirdlandAnalysis;
