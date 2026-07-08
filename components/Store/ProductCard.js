import React from 'react';
import { Card, CardContent, CardActions, Typography, Button, Box, Chip, Grid } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/actions/cartActions';
import ProductArtwork from '../Graphics/ProductArtwork';

const ProductCard = ({ title, price, image, type, id, ...productMeta }) => {
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart({ id, title, price, image, type, ...productMeta }));
    };

    return (
        <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
                '&:hover': { transform: 'translate(-3px, -3px)', boxShadow: '10px 10px 0 var(--brutal-ink)' }
            }}>
                <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
                    <Chip label={type} size="small" color={type === 'Physical' ? 'secondary' : 'primary'} />
                </Box>
                <Box sx={{
                    height: 200,
                    position: 'relative',
                    overflow: 'hidden',
                    bgcolor: 'var(--brutal-paper)'
                }}>
                    <ProductArtwork product={{ id, title, price, image, type, ...productMeta }} height="100%" compact />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" sx={{ fontSize: '1rem' }}>
                        {title}
                    </Typography>
                    <Typography variant="h5" color="primary.main" fontWeight="bold">
                        ${price}
                    </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        startIcon={<ShoppingCartIcon />}
                        onClick={handleAddToCart}
                    >
                        Add to Cart
                    </Button>
                </CardActions>
            </Card>
        </Grid>
    );
};

export default ProductCard;
