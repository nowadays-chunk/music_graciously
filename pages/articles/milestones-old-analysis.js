import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MilestonesOldAnalysis = () => {
    return <JazzArticleTemplate data={songData["milestones-old"]} />;
};

export default MilestonesOldAnalysis;
