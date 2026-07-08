import rootReducer from "./reducers/index";
import { createStore, applyMiddleware, compose } from 'redux';

// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, /* preloadedState, */ compose(
    applyMiddleware()
));

if (typeof window !== 'undefined') {
    const CART_STORAGE_KEY = 'cart_state';

    store.subscribe(() => {
        try {
            const { cart } = store.getState();
            window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
                items: cart?.items || [],
                total: cart?.total || 0,
                isOpen: cart?.isOpen || false,
            }));
        } catch (_error) {
            // Ignore localStorage write failures.
        }
    });
}

export default store;
