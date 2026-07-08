import React from 'react';
import { useRouter } from 'next/router';
import {
  Autocomplete,
  Box,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import HomeIcon from '@mui/icons-material/Home';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import spreadingSearchIndex from '../../core/spreading/searchIndex';

const filterOptions = (options, state) => {
  const query = state.inputValue.trim().toLowerCase();
  if (!query) {
    // Show top-rated/most accessible items when query is empty
    return [...options]
      .sort((a, b) => (a.accessibility || 99) - (b.accessibility || 99))
      .slice(0, 50);
  }

  const queryWords = query.split(/\s+/).filter(Boolean);

  const matched = options.filter((option) => {
    const textToSearch = `${option.label} ${option.description || ''} ${option.keywords || ''}`.toLowerCase();
    // Word-by-word matching: every word in the query must be found in the item
    return queryWords.every((word) => textToSearch.includes(word));
  });

  // Sort matches primarily by accessibility rank, secondarily by alphabetical label
  return matched.sort((a, b) => {
    const rankA = a.accessibility || 99;
    const rankB = b.accessibility || 99;
    if (rankA !== rankB) {
      return rankA - rankB;
    }
    return a.label.localeCompare(b.label);
  }).slice(0, 50);
};

const variantSx = {
  header: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      minHeight: 46,
      bgcolor: '#ffffff',
      transition: 'all 0.2s ease',
      '&.Mui-focused': {
        bgcolor: '#fffef0',
        boxShadow: '6px 6px 0 var(--brutal-ink)',
        transform: 'translate(-2px, -2px)',
      },
    },
  },
  hero: {
    width: '100%',
    maxWidth: 720,
    mx: 'auto',
    '& .MuiOutlinedInput-root': {
      minHeight: { xs: 58, md: 68 },
      fontSize: { xs: '1rem', md: '1.1rem' },
      bgcolor: 'rgba(255, 255, 255, 0.78)',
      backdropFilter: 'blur(12px)',
    },
  },
  drawer: {
    width: '100%',
    '& .MuiOutlinedInput-root': {
      minHeight: 52,
      bgcolor: 'rgba(255, 255, 255, 0.76)',
      backdropFilter: 'blur(10px)',
    },
  },
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Page':
      return <HomeIcon fontSize="small" />;
    case 'Instrument':
      return <MusicNoteIcon fontSize="small" />;
    default:
      return <LibraryMusicIcon fontSize="small" />;
  }
};

const SpreadingSearch = ({
  placeholder = 'Search chords, scales, modes, project pages...',
  variant = 'header',
  autoFocus = false,
  onNavigate,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = React.useState('');

  const goToItem = React.useCallback(
    (item) => {
      if (item?.href) {
        if (typeof window !== 'undefined' && window.__showSearchSpinner) {
          window.__showSearchSpinner(true);
        }
        router.push(item.href);
        onNavigate?.();
      }
    },
    [onNavigate, router]
  );

  return (
    <Autocomplete
      disablePortal
      options={spreadingSearchIndex}
      filterOptions={filterOptions}
      groupBy={(option) => option.type}
      autoHighlight
      clearOnBlur={false}
      inputValue={inputValue}
      onInputChange={(_, value) => setInputValue(value)}
      onChange={(_, item) => goToItem(item)}
      getOptionLabel={(option) => option?.label || ''}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      noOptionsText="No matching pages, scales, or chords found"
      sx={{
        ...variantSx[variant],
        '& .MuiAutocomplete-paper': {
          border: '3px solid var(--brutal-ink)',
          boxShadow: '8px 8px 0 var(--brutal-ink)',
          borderRadius: 0,
          overflow: 'hidden',
          bgcolor: 'var(--brutal-paper) !important',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          autoFocus={autoFocus}
          placeholder={placeholder}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && inputValue.trim()) {
              // Only redirect if there is an exact case-insensitive match for the label
              const exactMatch = spreadingSearchIndex.find(
                (item) => item.label.toLowerCase() === inputValue.trim().toLowerCase()
              );
              if (exactMatch) {
                event.defaultMuiPrevented = true;
                goToItem(exactMatch);
              }
            }
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            borderBottom: '2px solid var(--brutal-ink)',
            '&:last-of-type': { borderBottom: 0 },
            transition: 'background-color 0.1s ease',
            '&:hover': {
              bgcolor: 'var(--brutal-yellow) !important',
            }
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              display: 'grid',
              placeItems: 'center',
              bgcolor: 'var(--brutal-yellow)',
              border: '2px solid var(--brutal-ink)',
              color: 'var(--brutal-ink)',
              flex: '0 0 auto',
            }}
          >
            {getTypeIcon(option.type)}
          </Box>
          <Box sx={{ minWidth: 0, flexGrow: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'var(--brutal-ink)' }}>
              {option.label}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }} noWrap>
              {option.description}
            </Typography>
          </Box>
          {option.key && (
            <Chip
              label={option.key}
              size="small"
              sx={{
                fontWeight: 900,
                border: '2px solid var(--brutal-ink)',
                borderRadius: 0,
                bgcolor: 'var(--brutal-paper)',
              }}
            />
          )}
          <ArrowForwardIcon fontSize="small" />
        </Box>
      )}
    />
  );
};

export default SpreadingSearch;
