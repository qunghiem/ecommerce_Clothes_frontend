// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './slices/shopSlice';
import cartReducer from './slices/cartSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import ordersReducer from './slices/ordersSlice';

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    cart: cartReducer,
    ui: uiReducer,
    auth: authReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});