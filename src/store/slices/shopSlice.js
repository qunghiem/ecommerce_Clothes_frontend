import { createSlice } from '@reduxjs/toolkit';
import { products } from '../../assets/assets';

const initialState = {
  products: products,
  currency: '$',
  delivery_fee: 10,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setDeliveryFee: (state, action) => {
      state.delivery_fee = action.payload;
    },
  },
});

export const { setProducts, setCurrency, setDeliveryFee } = shopSlice.actions;

// Selectors
export const selectProducts = (state) => state.shop.products;
export const selectCurrency = (state) => state.shop.currency;
export const selectDeliveryFee = (state) => state.shop.delivery_fee;

export default shopSlice.reducer;