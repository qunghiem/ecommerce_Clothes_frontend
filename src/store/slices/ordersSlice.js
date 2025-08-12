import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load orders from localStorage for specific user
const loadOrdersFromStorage = (userId = null) => {
  try {
    if (!userId) return [];
    const ordersKey = `orders_${userId}`;
    const storedOrders = localStorage.getItem(ordersKey);
    return storedOrders ? JSON.parse(storedOrders) : [];
  } catch (error) {
    console.error('Error loading orders from localStorage:', error);
    return [];
  }
};

// Save orders to localStorage for specific user
const saveOrdersToStorage = (orders, userId = null) => {
  try {
    if (!userId) return;
    const ordersKey = `orders_${userId}`;
    localStorage.setItem(ordersKey, JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders to localStorage:', error);
  }
};

const initialState = {
  orders: [],
  currentUserId: null,
  isLoading: false,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    // Initialize orders when user logs in
    initializeOrders: (state, action) => {
      const userId = action.payload;
      state.currentUserId = userId;
      state.orders = loadOrdersFromStorage(userId);
    },

    // Clear orders when user logs out
    clearOrdersOnLogout: (state) => {
      state.orders = [];
      state.currentUserId = null;
    },

    // Add new order
    addOrder: (state, action) => {
      if (!state.currentUserId) return;

      const { orderData, cartItems, deliveryInfo } = action.payload;
      
      const newOrder = {
        id: Date.now().toString(),
        userId: state.currentUserId,
        items: cartItems,
        deliveryInfo: deliveryInfo,
        paymentMethod: orderData.paymentMethod || 'cod',
        totalAmount: orderData.totalAmount,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      };

      state.orders.unshift(newOrder); // Add to beginning of array
      saveOrdersToStorage(state.orders, state.currentUserId);
      
      toast.success('Đặt hàng thành công!', { autoClose: 2000 });
    },

    // Update order status
    updateOrderStatus: (state, action) => {
      if (!state.currentUserId) return;

      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
        saveOrdersToStorage(state.orders, state.currentUserId);
        
        toast.success('Cập nhật trạng thái đơn hàng thành công!', { autoClose: 2000 });
      }
    },

    // Cancel order
    cancelOrder: (state, action) => {
      if (!state.currentUserId) return;

      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = 'cancelled';
        saveOrdersToStorage(state.orders, state.currentUserId);
        
        toast.success('Hủy đơn hàng thành công!', { autoClose: 2000 });
      }
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  initializeOrders,
  clearOrdersOnLogout,
  addOrder,
  updateOrderStatus,
  cancelOrder,
  setLoading,
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectCurrentUserOrders = (state) => state.orders.orders;
export const selectOrdersLoading = (state) => state.orders.isLoading;

// Get orders by status
export const selectOrdersByStatus = (status) => (state) =>
  state.orders.orders.filter(order => order.status === status);

export default ordersSlice.reducer;