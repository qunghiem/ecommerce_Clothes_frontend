// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load cart from localStorage for specific user
const loadCartFromStorage = (userId = null) => {
  try {
    if (!userId) return {}; // Return empty cart if no user
    const cartKey = `cart_${userId}`;
    const storedCart = localStorage.getItem(cartKey);
    return storedCart ? JSON.parse(storedCart) : {};
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {};
  }
};

// Save cart to localStorage for specific user
const saveCartToStorage = (cartItems, userId = null) => {
  try {
    if (!userId) return; // Don't save if no user
    const cartKey = `cart_${userId}`;
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Remove cart from localStorage for specific user
const removeCartFromStorage = (userId) => {
  try {
    if (!userId) return;
    const cartKey = `cart_${userId}`;
    localStorage.removeItem(cartKey);
  } catch (error) {
    console.error('Error removing cart from localStorage:', error);
  }
};

const initialState = {
  cartItems: {},
  currentUserId: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Initialize cart when user logs in
    initializeCart: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      state.cartItems = loadCartFromStorage(userId);
    },

    // Clear cart when user logs out
    clearCartOnLogout: (state) => {
      state.cartItems = {};
      state.currentUserId = null;
    },

    addToCart: (state, action) => {
      const { itemId, size } = action.payload;
      
      if (!size) {
        toast.error("Select Product Size");
        return;
      }

      // Don't allow adding to cart if user is not logged in
      if (!state.currentUserId) {
        toast.error("Please log in to add products to your cart.");
        return;
      }

      const cartData = { ...state.cartItems };

      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = { [size]: 1 };
      }

      state.cartItems = cartData;
      saveCartToStorage(cartData, state.currentUserId);
      
      toast.success("Added to cart successfully!", {
        autoClose: 1500,
      });
    },

    updateQuantity: (state, action) => {
      if (!state.currentUserId) return;

      const { itemId, size, quantity } = action.payload;
      
      const cartData = { ...state.cartItems };

      if (quantity === 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }

      state.cartItems = cartData;
      saveCartToStorage(cartData, state.currentUserId);
      
      toast.success("Cart updated successfully!", { autoClose: 1500 });
    },

    removeFromCart: (state, action) => {
      if (!state.currentUserId) return;

      const { itemId, size } = action.payload;
      const cartData = { ...state.cartItems };

      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }

      state.cartItems = cartData;
      saveCartToStorage(cartData, state.currentUserId);
    },

    removeSelectedItems: (state, action) => {
      if (!state.currentUserId) return;

      const selectedItems = action.payload;
      
      if (selectedItems.length === 0) {
        toast.warning("Vui lòng chọn sản phẩm để xóa!", { autoClose: 1500 });
        return;
      }

      const cartData = { ...state.cartItems };
      
      selectedItems.forEach(item => {
        if (cartData[item.itemId] && cartData[item.itemId][item.size]) {
          delete cartData[item.itemId][item.size];
          
          if (Object.keys(cartData[item.itemId]).length === 0) {
            delete cartData[item.itemId];
          }
        }
      });
      
      state.cartItems = cartData;
      saveCartToStorage(cartData, state.currentUserId);
      
      toast.success(`Đã xóa ${selectedItems.length} sản phẩm khỏi giỏ hàng!`, { autoClose: 1500 });
    },

    clearCart: (state) => {
      if (!state.currentUserId) return;

      if (Object.keys(state.cartItems).length === 0) {
        toast.warning("Giỏ hàng trống!", { autoClose: 1500 });
        return;
      }

      state.cartItems = {};
      saveCartToStorage({}, state.currentUserId);
      
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng!", { autoClose: 1500 });
    },

    // New action to completely remove cart data for a user
    deleteUserCart: (state, action) => {
      const userId = action.payload;
      removeCartFromStorage(userId);
      
      // If it's the current user's cart, clear it from state too
      if (state.currentUserId === userId) {
        state.cartItems = {};
      }
    },
  },
});

export const { 
  initializeCart,
  clearCartOnLogout,
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  removeSelectedItems, 
  clearCart,
  deleteUserCart
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;
export const selectCurrentUserId = (state) => state.cart.currentUserId;

export const selectCartCount = (state) => {
  // Return 0 if user is not logged in
  if (!state.cart.currentUserId) return 0;
  
  let totalCount = 0;
  const cartItems = state.cart.cartItems;
  
  for (const item in cartItems) {
    for (const size in cartItems[item]) {
      try {
        if (cartItems[item][size] > 0) {
          totalCount += cartItems[item][size];
        }
      } catch (error) {
        console.error('Error calculating cart count:', error);
      }
    }
  }
  return totalCount;
};

export const selectCartAmount = (state) => {
  // Return 0 if user is not logged in
  if (!state.cart.currentUserId) return 0;
  
  let totalAmount = 0;
  const cartItems = state.cart.cartItems;
  const products = state.shop.products;
  
  for (const items in cartItems) {
    let itemInfo = products.find((product) => product._id === items);
    if (itemInfo) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (e) {
          console.error('Error calculating cart amount:', e);
        }
      }
    }
  }
  return totalAmount;
};

// New selector to get selected cart amount
export const selectSelectedCartAmount = (selectedItems) => (state) => {
  if (!selectedItems || selectedItems.length === 0) return 0;
  
  let totalAmount = 0;
  const products = state.shop.products;
  
  selectedItems.forEach(selectedItem => {
    const productData = products.find(product => product._id === selectedItem.itemId);
    if (productData) {
      const cartItem = state.cart.cartItems[selectedItem.itemId]?.[selectedItem.size];
      if (cartItem) {
        totalAmount += productData.price * cartItem;
      }
    }
  });
  
  return totalAmount;
};

export default cartSlice.reducer;