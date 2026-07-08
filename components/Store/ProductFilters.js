import React from 'react';
import {
    Box,
    Typography,
    TextField,
    FormControlLabel,
    Radio,
    RadioGroup,
    Button,
    Divider,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearIcon from '@mui/icons-material/Clear';

const ProductFilters = ({
    searchTerm,
    onSearchChange,
    bundleFilter,
    onBundleFilterChange,
    musicKey,
    onMusicKeyChange,
    musicType,
    onMusicTypeChange,
    onClearFilters,
    totalProducts,
}) => {
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const musicTypes = ['all', 'Chord', 'Arpeggio', 'Scale'];
    const bundleOptions = [
        { value: 'all', label: 'All Products' },
        { value: 'bundle', label: 'Bundles Only' },
        { value: 'single', label: 'Single Sheets Only' },
    ];

    const hasActiveFilters = searchTerm || bundleFilter !== 'all' || musicKey !== 'all' || musicType !== 'all';

    return (
        <Paper elevation={0} sx={{ p: 3, border: '3px solid var(--brutal-ink)', borderRadius: 1, position: 'sticky', top: 90, bgcolor: 'rgba(255, 253, 245, 0.82)', boxShadow: 'var(--brutal-shadow)' }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Filters
                </Typography>
                {hasActiveFilters && (
                    <Button
                        size="small"
                        startIcon={<ClearIcon />}
                        onClick={onClearFilters}
                        sx={{ textTransform: 'none' }}
                    >
                        Clear All
                    </Button>
                )}
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{ bgcolor: 'var(--brutal-paper)' }}
                />
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Bundle Filter */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Bundle
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <RadioGroup value={bundleFilter} onChange={(e) => onBundleFilterChange(e.target.value)}>
                        {bundleOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={<Radio size="small" />}
                                label={<Typography variant="body2">{option.label}</Typography>}
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Music Key */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Music Key
                        </Typography>
                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <RadioGroup value={musicKey} onChange={(e) => onMusicKeyChange(e.target.value)}>
                        <FormControlLabel value="all" control={<Radio size="small" />} label={<Typography variant="body2">All Keys</Typography>} sx={{ mb: 0.5 }} />
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                            {keys.map((k) => (
                                <FormControlLabel
                                    key={k}
                                    value={k}
                                    control={<Radio size="small" />}
                                    label={<Typography variant="body2">{k}</Typography>}
                                    sx={{ m: 0 }}
                                />
                            ))}
                        </Box>
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2 }} />

            {/* Music Type */}
            <Accordion defaultExpanded disableGutters elevation={0} sx={{ '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: 0 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                        Type
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0 }}>
                    <RadioGroup value={musicType} onChange={(e) => onMusicTypeChange(e.target.value)}>
                        {musicTypes.map((type) => (
                            <FormControlLabel
                                key={type}
                                value={type}
                                control={<Radio size="small" />}
                                label={<Typography variant="body2">{type === 'all' ? 'All Types' : type}</Typography>}
                                sx={{ mb: 0.5 }}
                            />
                        ))}
                    </RadioGroup>
                </AccordionDetails>
            </Accordion>

            {/* Results Count */}
            <Box sx={{ mt: 3, p: 2, bgcolor: 'var(--brutal-yellow)', border: '3px solid var(--brutal-ink)', borderRadius: 1, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    <strong>{totalProducts}</strong> {totalProducts === 1 ? 'product' : 'products'} found
                </Typography>
            </Box>
        </Paper>
    );
};

export default ProductFilters;
