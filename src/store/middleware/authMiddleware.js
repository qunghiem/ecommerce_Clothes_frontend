// src/store/middleware/authMiddleware.js
import { initializeCart, clearCartOnLogout } from '../slices/cartSlice';
import { initializeOrders, clearOrdersOnLogout } from '../slices/ordersSlice';

// Middleware to handle cart and orders initialization/cleanup
export const authMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Handle cart and orders initialization after successful auth
  if (action.type === 'auth/initializeUserCart') {
    const userId = action.payload;
    store.dispatch(initializeCart(userId));
    store.dispatch(initializeOrders(userId));
  }

  // Handle cleanup when user logs out
  if (action.type === 'cart/clearCartOnLogout') {
    store.dispatch(clearCartOnLogout());
  }

  if (action.type === 'orders/clearOrdersOnLogout') {
    store.dispatch(clearOrdersOnLogout());
  }

  return result;
};

export default authMiddleware;