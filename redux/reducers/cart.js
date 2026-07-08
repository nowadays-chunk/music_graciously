import * as actionTypes from '../actionTypes';

const CART_STORAGE_KEY = 'cart_state';

export const getEmptyCartState = () => ({
    items: [],
    total: 0,
    isOpen: false,
});

export const normalizeCartState = (cartState) => {
    const base = getEmptyCartState();

    if (!cartState || !Array.isArray(cartState.items)) {
        return base;
    }

    const items = cartState.items.map((item) => ({
        ...item,
        quantity: item.allowQuantity ? Math.max(1, Number(item.quantity) || 1) : 1,
    }));
    const total = items.reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0);

    return {
        ...base,
        items,
        total,
        isOpen: Boolean(cartState.isOpen),
    };
};

export const loadPersistedCartState = () => {
    if (typeof window === 'undefined') {
        return getEmptyCartState();
    }

    try {
        return normalizeCartState(JSON.parse(window.localStorage.getItem(CART_STORAGE_KEY) || 'null'));
    } catch (_error) {
        return getEmptyCartState();
    }
};

const initialState = getEmptyCartState();

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.HYDRATE_CART:
            return normalizeCartState(action.payload);

        case actionTypes.TOGGLE_CART:
            return {
                ...state,
                isOpen: !state.isOpen,
            };

        case actionTypes.ADD_TO_CART:
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                const nextItems = state.items.map(item =>
                    item.id === action.payload.id
                        ? {
                            ...item,
                            ...action.payload,
                            quantity: item.allowQuantity || action.payload.allowQuantity
                                ? Math.max(1, (Number(item.quantity) || 1) + (Number(action.payload.quantity) || 1))
                                : 1,
                        }
                        : item
                );

                return {
                    ...state,
                    isOpen: true, // Open cart when adding item
                    items: nextItems,
                    total: nextItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0),
                };
            }
            const quantity = action.payload.allowQuantity ? Math.max(1, Number(action.payload.quantity) || 1) : 1;
            return {
                ...state,
                isOpen: true, // Open cart when adding item
                items: [...state.items, { ...action.payload, quantity }],
                total: state.total + ((Number(action.payload.price) || 0) * quantity),
            };

        case actionTypes.REMOVE_FROM_CART:
            const itemToRemove = state.items.find(item => item.id === action.payload);
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload),
                total: state.total - (itemToRemove ? itemToRemove.price * itemToRemove.quantity : 0),
            };

        case actionTypes.UPDATE_QUANTITY:
            const updatedItems = state.items.map(item =>
                    item.id === action.payload.id
                    ? { ...item, quantity: item.allowQuantity ? Math.max(1, Number(action.payload.quantity) || 1) : 1 }
                        : item
            );
            return {
                ...state,
                items: updatedItems,
                total: updatedItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * item.quantity), 0),
            };

        case actionTypes.CLEAR_CART:
            return {
                ...state,
                items: [],
                total: 0,
            };

        default:
            return state;
    }
};

export default cartReducer;

