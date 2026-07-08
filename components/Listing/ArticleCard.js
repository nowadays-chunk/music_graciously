import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: '16px',
  width: '100%',
  margin: '0 auto', 
  [theme.breakpoints.up('md')]: {
    maxWidth: '65%',
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: '80%',
  },
  '@media print': {
    margin: '0',
    width: '100%',
    maxWidth: '100%',
  },
}));

const headingStyles = {
  h1: { fontSize: '20.2px' },
  h2: { fontSize: '14.2px' },
  h3: { fontSize: '8.6px' },
  h4: { fontSize: '18px' },
  h5: { fontSize: '14.4px' },
  h6: { fontSize: '12px' },
};

const ArticleCard = ({ article }) => {
  const { content } = article;

  const formattedContent = content.split('\n').map((line, index) => {
    if (line.startsWith('#')) {
      const level = line.match(/^#+/)[0].length; // Get the number of leading #
      const text = line.replace(/^#+\s*/, ''); // Remove the leading # and any space
      const headingLevel = `h${level}`;

      return (
        <Typography
          key={index}
          variant={headingLevel}
          style={{ ...headingStyles[headingLevel], marginTop: '16px' }}
        >
          {text}
        </Typography>
      );
    }
    const boldText = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    return (
      <Typography
        key={index}
        variant="body2"
        color="textSecondary"
        component="p"
        dangerouslySetInnerHTML={{ __html: boldText }}
      ></Typography>
    );
  });

  return (
    <StyledCard>
      <CardContent sx={{ fontSize: "0.3rem" }}>
        {formattedContent}
      </CardContent>
    </StyledCard>
  );
};

export default ArticleCard;
