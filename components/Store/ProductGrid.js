import React from 'react';
import {
    Box,
    Grid,
    Typography,
    FormControl,
    Select,
    MenuItem,
    Card,
    CardContent,
    CardActions,
    Button,
    Chip,
} from '@mui/material';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SortIcon from '@mui/icons-material/Sort';
import { addToCart, toggleCart } from '../../redux/actions/cartActions';
import ProductArtwork from '../Graphics/ProductArtwork';

const ProductGrid = ({ products, sortBy, onSortChange }) => {
    const dispatch = useDispatch();

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
        dispatch(toggleCart());
    };

    return (
        <Box>
            {/* Header with Sort */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {products.length} {products.length === 1 ? 'Product' : 'Products'}
                </Typography>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                        startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                    >
                        <MenuItem value="featured">Featured</MenuItem>
                        <MenuItem value="price-asc">Price: Low to High</MenuItem>
                        <MenuItem value="price-desc">Price: High to Low</MenuItem>
                        <MenuItem value="name">Name: A-Z</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Product Grid */}
            {products.length > 0 ? (
                <Grid container spacing={3}>
                    {products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                                    '&:hover': {
                                        transform: 'translate(-3px, -3px)',
                                        boxShadow: '10px 10px 0 var(--brutal-ink)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                                    <Chip
                                        label={product.type}
                                        size="small"
                                        color={product.type === 'Physical' ? 'secondary' : 'primary'}
                                    />
                                </Box>

                                <Link
                                    href={`/product/${encodeURIComponent(product.slug || product.id)}`}
                                    style={{
                                        textDecoration: 'none',
                                        color: 'inherit',
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            height: 200,
                                            position: 'relative',
                                            overflow: 'hidden',
                                            bgcolor: 'var(--brutal-paper)',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <ProductArtwork product={product} height="100%" compact />
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mb: 0.5, fontSize: '0.75rem' }}
                                        >
                                            {product.category}
                                        </Typography>
                                        <Typography
                                            variant="h6"
                                            component="h3"
                                            gutterBottom
                                            sx={{
                                                fontWeight: 'bold',
                                                fontSize: '1rem',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                            }}
                                        >
                                            {product.title}
                                        </Typography>
                                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                            ${product.price}
                                        </Typography>
                                    </CardContent>
                                </Link>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 10,
                        px: 3,
                        bgcolor: 'var(--brutal-yellow)',
                        border: '4px solid var(--brutal-ink)',
                        borderRadius: 1,
                        boxShadow: 'var(--brutal-shadow)',
                    }}
                >
                    <LibraryMusicIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No products found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters or search term
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default ProductGrid;
