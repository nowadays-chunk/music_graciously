import React, { useState, useEffect, useMemo } from 'react';
import {
    Box,
    Chip,
    Menu,
    MenuItem,
    Badge,
    Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const CategoryNavbar = ({ products, onCategoryClick, onTypeClick, selectedCategories, selectedType }) => {
    const [categoryAnchor, setCategoryAnchor] = useState(null);
    const [typeAnchor, setTypeAnchor] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculate category counts (memoized to ensure consistency)
    const categoryCounts = useMemo(() => {
        return products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
    }, [products]);

    // Calculate type counts (memoized to ensure consistency)
    const typeCounts = useMemo(() => {
        return products.reduce((acc, product) => {
            acc[product.type] = (acc[product.type] || 0) + 1;
            return acc;
        }, {});
    }, [products]);

    const categories = useMemo(() => {
        const cats = Array.from(new Set(products.map(p => p.category)));
        return cats.sort();
    }, [products]);

    const types = ['All Types', 'Digital', 'Physical'];

    const handleCategoryMenuClick = (event) => {
        setCategoryAnchor(event.currentTarget);
    };

    const handleTypeMenuClick = (event) => {
        setTypeAnchor(event.currentTarget);
    };

    const handleCategorySelect = (category) => {
        onCategoryClick(category);
        setCategoryAnchor(null);
    };

    const handleTypeSelect = (type) => {
        onTypeClick(type === 'All Types' ? 'all' : type);
        setTypeAnchor(null);
    };

    const getActiveLabel = () => {
        if (selectedCategories.length === 0) return 'All Categories';
        if (selectedCategories.length === 1) return selectedCategories[0];
        return `${selectedCategories.length} Categories`;
    };

    const getTypeLabel = () => {
        if (selectedType === 'all') return 'All Types';
        return selectedType;
    };

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                py: 2,
                borderBottom: '1px solid #e0e0e0',
                flexWrap: 'wrap',
            }}
        >
            {/* Browse By Label */}
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                Browse By:
            </Typography>

            {/* Categories Dropdown */}
            <Chip
                icon={<CategoryIcon />}
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getActiveLabel()}
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    </Box>
                }
                onClick={handleCategoryMenuClick}
                variant={selectedCategories.length > 0 ? 'filled' : 'outlined'}
                color={selectedCategories.length > 0 ? 'primary' : 'default'}
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
            />

            {isMounted && (
                <Menu
                    anchorEl={categoryAnchor}
                    open={Boolean(categoryAnchor)}
                    onClose={() => setCategoryAnchor(null)}
                    PaperProps={{
                        sx: {
                            minWidth: 250,
                            maxHeight: 400,
                        },
                    }}
                >
                    <MenuItem
                        onClick={() => {
                            selectedCategories.forEach(cat => onCategoryClick(cat));
                            setCategoryAnchor(null);
                        }}
                        sx={{ fontWeight: selectedCategories.length === 0 ? 'bold' : 'normal' }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="body2">All Categories</Typography>
                            <Badge badgeContent={products.length} color="primary" sx={{ ml: 2 }} />
                        </Box>
                    </MenuItem>
                    {categories.map((category) => (
                        <MenuItem
                            key={category}
                            onClick={() => handleCategorySelect(category)}
                            sx={{
                                bgcolor: selectedCategories.includes(category) ? 'action.selected' : 'transparent',
                                fontWeight: selectedCategories.includes(category) ? 'bold' : 'normal',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Typography variant="body2">{category}</Typography>
                                <Chip
                                    label={categoryCounts[category] || 0}
                                    size="small"
                                    sx={{ ml: 2, height: 20, fontSize: '0.7rem' }}
                                />
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>
            )}

            {/* Product Type Dropdown */}
            <Chip
                icon={<LocalOfferIcon />}
                label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getTypeLabel()}
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    </Box>
                }
                onClick={handleTypeMenuClick}
                variant={selectedType !== 'all' ? 'filled' : 'outlined'}
                color={selectedType !== 'all' ? 'secondary' : 'default'}
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                        bgcolor: 'action.hover',
                    },
                }}
            />

            {isMounted && (
                <Menu
                    anchorEl={typeAnchor}
                    open={Boolean(typeAnchor)}
                    onClose={() => setTypeAnchor(null)}
                    PaperProps={{
                        sx: {
                            minWidth: 200,
                        },
                    }}
                >
                    {types.map((type) => (
                        <MenuItem
                            key={type}
                            onClick={() => handleTypeSelect(type)}
                            sx={{
                                bgcolor: (type === 'All Types' && selectedType === 'all') || (type === selectedType) ? 'action.selected' : 'transparent',
                                fontWeight: (type === 'All Types' && selectedType === 'all') || (type === selectedType) ? 'bold' : 'normal',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Typography variant="body2">{type}</Typography>
                                <Chip
                                    label={type === 'All Types' ? products.length : (typeCounts[type] || 0)}
                                    size="small"
                                    sx={{ ml: 2, height: 20, fontSize: '0.7rem' }}
                                />
                            </Box>
                        </MenuItem>
                    ))}
                </Menu>
            )}

            {/* Active Filters Display */}
            {selectedCategories.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 'auto' }}>
                    {selectedCategories.map((category) => (
                        <Chip
                            key={category}
                            label={category}
                            size="small"
                            onDelete={() => onCategoryClick(category)}
                            color="primary"
                            variant="outlined"
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default CategoryNavbar;
