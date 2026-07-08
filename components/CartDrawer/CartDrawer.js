import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Drawer,
    Box,
    Typography,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    Button,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Link from 'next/link';
import { toggleCart, removeFromCart, updateQuantity } from '../../redux/actions/cartActions';
import CartItemThumbnail from '../Cart/CartItemThumbnail';

const CartDrawer = () => {
    const dispatch = useDispatch();
    const { items, total, isOpen } = useSelector(state => state.cart);

    const handleClose = () => {
        dispatch(toggleCart());
    };

    return (
        <Drawer
            anchor="right"
            open={isOpen}
            onClose={handleClose}
            sx={{ zIndex: 99999 }}
            PaperProps={{
                sx: { width: { xs: '100%', sm: 400 }, p: 0 }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

                {/* Header */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" fontWeight="bold">Your Cart ({items.length})</Typography>
                    <IconButton onClick={handleClose}><CloseIcon /></IconButton>
                </Box>

                {/* Shipping info */}
                <Box sx={{ p: 2, bgcolor: '#fff' }}>
                    <Typography variant="body2" align="center">
                        Orders are shipped as soon as they are processed.
                    </Typography>
                </Box>

                <Divider />

                {/* Cart Items */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                    {items.length === 0 ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', p: 4 }}>
                            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2, opacity: 0.2 }} />
                            <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
                            <Button onClick={handleClose} variant="outlined" sx={{ mt: 3 }}>Continue Shopping</Button>
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {items.map((item) => (
                                <React.Fragment key={item.id}>
                                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                        <ListItemAvatar sx={{ minWidth: 'auto' }}>
                                            <CartItemThumbnail item={item} size={64} />
                                        </ListItemAvatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                <Typography variant="subtitle2" fontWeight="bold" sx={{ pr: 2 }}>{item.title}</Typography>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => dispatch(removeFromCart(item.id))}
                                                    sx={{ mt: -0.5, mr: -1 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>

                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                ${Number(item.price).toFixed(2)}
                                                {item.variantSummary ? ` | ${item.variantSummary}` : ''}
                                            </Typography>

                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                {item.allowQuantity ? (
                                                    <Box sx={{ display: 'flex', alignItems: 'center', border: '2px solid var(--brutal-ink)' }}>
                                                        <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, Math.max(1, Number(item.quantity) - 1)))}>
                                                            <RemoveIcon fontSize="small" />
                                                        </IconButton>
                                                        <Typography sx={{ minWidth: 28, textAlign: 'center', fontSize: '0.9rem', fontWeight: 900 }}>
                                                            {item.quantity}
                                                        </Typography>
                                                        <IconButton size="small" onClick={() => dispatch(updateQuantity(item.id, Number(item.quantity) + 1))}>
                                                            <AddIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                ) : (
                                                    <Typography sx={{ px: 1, fontSize: '0.9rem' }}>Qty: 1</Typography>
                                                )}
                                                <Typography variant="subtitle2" fontWeight="bold">
                                                    ${(Number(item.price) * Math.max(1, Number(item.quantity) || 1)).toFixed(2)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Box>

                {/* Footer Analysis */}
                {items.length > 0 && (
                    <Box sx={{ p: 2, bgcolor: '#fff', borderTop: '1px solid #eee' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle1">Subtotal</Typography>
                            <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                        </Box>
                        <Button
                            component={Link}
                            href="/cart"
                            variant="contained"
                            fullWidth
                            size="large"
                            onClick={handleClose} // Navigate to checkout
                            sx={{ py: 1.5 }}
                        >
                            Checkout Now
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartDrawer;
