import * as actionTypes from '../actionTypes';

export const addToCart = (product) => ({
    type: actionTypes.ADD_TO_CART,
    payload: product,
});

export const removeFromCart = (id) => ({
    type: actionTypes.REMOVE_FROM_CART,
    payload: id,
});

export const updateQuantity = (id, quantity) => ({
    type: actionTypes.UPDATE_QUANTITY,
    payload: { id, quantity },
});

export const clearCart = () => ({
    type: actionTypes.CLEAR_CART,
});

export const toggleCart = () => ({
    type: actionTypes.TOGGLE_CART,
});

export const hydrateCart = (cartState) => ({
    type: actionTypes.HYDRATE_CART,
    payload: cartState,
});
