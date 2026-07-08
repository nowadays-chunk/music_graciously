import React from 'react';
import JazzArticleTemplate from '../../components/Pages/Articles/JazzArticleTemplate';
import { songData } from '../../data/jazzArticles/songData';

const MyFunnyValentineAnalysis = () => {
    return <JazzArticleTemplate data={songData["my-funny-valentine"]} />;
};

export default MyFunnyValentineAnalysis;
