import React from 'react';
import { Box, Button } from '@mui/material';

const LabelDisplayToggle = ({ currentValue, onChange, activeColor = 'var(--brutal-yellow)' }) => {
  const modes = [
    { value: 'notes', label: 'Notes' },
    { value: 'intervals', label: 'Intervals' },
    { value: 'fingering', label: 'Fingering' },
  ];

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        gap: 1.5,
        bgcolor: 'rgba(255, 253, 245, 0.95)',
        p: 1.5,
        borderRadius: '4px',
        border: '3px solid var(--brutal-ink)',
        boxShadow: 'var(--brutal-shadow)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {modes.map((mode) => {
        const isActive = currentValue === mode.value;

        return (
          <Button
            key={mode.value}
            onClick={() => onChange(mode.value)}
            sx={{
              fontWeight: '900',
              bgcolor: isActive ? activeColor : 'var(--brutal-paper)',
              color: 'var(--brutal-ink)',
              borderColor: 'var(--brutal-ink)',
              border: '3px solid var(--brutal-ink)',
              textTransform: 'none',
              minWidth: { xs: 80, sm: 110 },
              px: { xs: 1.5, sm: 2.5 },
              py: 1,
              fontSize: { xs: '0.8rem', sm: '0.9rem' },
              boxShadow: isActive ? 'none' : 'var(--brutal-shadow-small)',
              transform: isActive ? 'translate(2px, 2px)' : 'none',
              '&:hover': {
                bgcolor: isActive ? activeColor : 'var(--brutal-yellow)',
                transform: isActive ? 'translate(2px, 2px)' : 'translate(-2px, -2px)',
                boxShadow: isActive ? 'none' : 'var(--brutal-shadow)',
              },
              transition: 'all 0.15s ease-in-out',
            }}
          >
            {mode.label}
          </Button>
        );
      })}
    </Box>
  );
};

export default LabelDisplayToggle;
