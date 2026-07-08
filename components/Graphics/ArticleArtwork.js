import React from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import DynamicArtwork, { GLAMOUR_TEMPLATES } from './DynamicArtworks';

const hashString = (value = '') =>
  String(value).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

const getArticleImage = (article = {}) =>
  article.image || article.thumbnail || article.coverImage || article.urlToImage || null;

const ArticleArtwork = ({
  article = {},
  height = 240,
  compact = false,
  preferSourceImage = false,
  sx,
}) => {
  const slug = article.slug || article.id || article.title || 'article';
  const seed = hashString(slug);
  const image = getArticleImage(article);

  if (preferSourceImage && image) {
    return (
      <Box sx={{ position: 'relative', width: '100%', height, backgroundColor: 'var(--brutal-paper)', ...sx }}>
        <Image
          src={image}
          alt={article.title || 'Article image'}
          fill
          unoptimized
          style={{ objectFit: 'cover' }}
        />
      </Box>
    );
  }

  return (
    <DynamicArtwork
      seed={`${slug}-${article.category || 'editorial'}-${article.title || ''}`}
      index={seed % GLAMOUR_TEMPLATES.length}
      height={height}
      aria-label={`${article.title || 'Article'} illustration`}
      sx={{
        border: 0,
        boxShadow: 'none',
        borderRadius: 0,
        ...(compact ? { minHeight: 180 } : null),
        ...sx,
      }}
    />
  );
};

export default ArticleArtwork;
