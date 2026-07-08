import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const InvitationAnalysis = () => {
    return <JazzArticleTemplate data={songData["invitation"]} />;
};

export default InvitationAnalysis;
