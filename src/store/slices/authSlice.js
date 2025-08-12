// src/store/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    return null;
  }
};

// Save user to localStorage
const saveUserToStorage = (user) => {
  try {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error saving user to localStorage:', error);
  }
};

// Mock users database (in real app, this would be in backend)
const loadUsersFromStorage = () => {
  try {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  } catch (error) {
    console.error('Error loading users from localStorage:', error);
    return [];
  }
};

const saveUsersToStorage = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to localStorage:', error);
  }
};

const initialState = {
  user: loadUserFromStorage(),
  isAuthenticated: !!loadUserFromStorage(),
  isLoading: false,
  error: null,
  users: loadUsersFromStorage(), // Mock database
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      saveUserToStorage(action.payload);
      toast.success(`Chào mừng ${action.payload.name}!`, { autoClose: 2000 });
    },
    
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
      toast.error(action.payload, { autoClose: 3000 });
    },
    
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    registerSuccess: (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      // Add new user to mock database
      state.users.push(action.payload.newUser);
      saveUserToStorage(action.payload.user);
      saveUsersToStorage(state.users);
      toast.success('Đăng ký thành công!', { autoClose: 2000 });
    },
    
    registerFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      toast.error(action.payload, { autoClose: 3000 });
    },
    
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      saveUserToStorage(null);
      toast.success('Đăng xuất thành công!', { autoClose: 2000 });
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateProfile: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveUserToStorage(state.user);
        
        // Update user in mock database
        const userIndex = state.users.findIndex(u => u.id === state.user.id);
        if (userIndex !== -1) {
          state.users[userIndex] = { ...state.users[userIndex], ...action.payload };
          saveUsersToStorage(state.users);
        }
        
        toast.success('Cập nhật thông tin thành công!', { autoClose: 2000 });
      }
    },
  },
});

// Async action creators (thunks)
export const loginUser = (credentials) => (dispatch, getState) => {
  dispatch(loginStart());
  
  // Simulate API call delay
  setTimeout(() => {
    const { users } = getState().auth;
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      dispatch(loginSuccess(userWithoutPassword));
      
      // Initialize cart and orders for this user
      dispatch({ type: 'cart/initializeCart', payload: user.id });
      dispatch({ type: 'orders/initializeOrders', payload: user.id });
    } else {
      dispatch(loginFailure('Email hoặc mật khẩu không đúng'));
    }
  }, 1000);
};

export const registerUser = (userData) => (dispatch, getState) => {
  dispatch(registerStart());
  
  // Simulate API call delay
  setTimeout(() => {
    const { users } = getState().auth;
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      dispatch(registerFailure('Email đã được sử dụng'));
      return;
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=000&color=fff`,
    };
    
    const { password, ...userWithoutPassword } = newUser;
    
    dispatch(registerSuccess({
      user: userWithoutPassword,
      newUser: newUser,
    }));
    
    // Initialize cart and orders for this new user (they will be empty initially)
    dispatch({ type: 'cart/initializeCart', payload: newUser.id });
    dispatch({ type: 'orders/initializeOrders', payload: newUser.id });
  }, 1000);
};

// Initialize user data on app startup
export const initializeApp = () => (dispatch, getState) => {
  const { user, isAuthenticated } = getState().auth;
  
  if (isAuthenticated && user?.id) {
    // Initialize cart and orders for existing logged-in user
    dispatch({ type: 'cart/initializeCart', payload: user.id });
    dispatch({ type: 'orders/initializeOrders', payload: user.id });
  } else {
    // If no user is logged in, ensure cart is empty
    dispatch({ type: 'cart/clearCartOnLogout' });
    dispatch({ type: 'orders/clearOrdersOnLogout' });
  }
};

// Custom logout action that also clears cart
export const logoutUser = () => (dispatch) => {
  // Clear cart and orders before logout
  dispatch({ type: 'cart/clearCartOnLogout' });
  dispatch({ type: 'orders/clearOrdersOnLogout' });
  
  // Then logout
  dispatch(logout());
};

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure,
  registerStart,
  registerSuccess, 
  registerFailure,
  logout, 
  clearError,
  updateProfile
} = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;