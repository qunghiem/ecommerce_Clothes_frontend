import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : {};
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return {};
  }
};

// Save cart to localStorage
const saveCartToStorage = (cartItems) => {
  try {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const initialState = {
  cartItems: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { itemId, size } = action.payload;
      
      if (!size) {
        toast.error("Select Product Size");
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
      saveCartToStorage(cartData);
      
      toast.success("Thêm vào giỏ hàng thành công!", {
        autoClose: 1500,
      });
    },

    updateQuantity: (state, action) => {
      const { itemId, size, quantity, confirm = false } = action.payload;
      
      if (confirm && quantity === 0) {
        // This will be handled in the component with window.confirm
        return;
      }

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
      saveCartToStorage(cartData);
      
      toast.success("Cập nhật giỏ hàng thành công!", { autoClose: 1500 });
    },

    removeFromCart: (state, action) => {
      const { itemId, size } = action.payload;
      const cartData = { ...state.cartItems };

      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }

      state.cartItems = cartData;
      saveCartToStorage(cartData);
    },

    removeSelectedItems: (state, action) => {
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
      saveCartToStorage(cartData);
      
      toast.success(`Đã xóa ${selectedItems.length} sản phẩm khỏi giỏ hàng!`, { autoClose: 1500 });
    },

    clearCart: (state) => {
      if (Object.keys(state.cartItems).length === 0) {
        toast.warning("Giỏ hàng trống!", { autoClose: 1500 });
        return;
      }

      state.cartItems = {};
      saveCartToStorage({});
      
      toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng!", { autoClose: 1500 });
    },
  },
});

export const { 
  addToCart, 
  updateQuantity, 
  removeFromCart, 
  removeSelectedItems, 
  clearCart 
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.cartItems;

export const selectCartCount = (state) => {
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
  let totalAmount = 0;
  const cartItems = state.cart.cartItems;
  const products = state.shop.products;
  
  for (const items in cartItems) {
    let itemInfo = products.find((product) => product._id === items);
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
  return totalAmount;
};

export default cartSlice.reducer;