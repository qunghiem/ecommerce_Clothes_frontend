import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import { 
  loginUser, 
  registerUser, 
  clearError,
  selectIsLoading,
  selectError,
  selectIsAuthenticated 
} from '../store/slices/authSlice';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Clear error when component unmounts or state changes
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearError());
  }, [currentState, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (currentState === 'Login') {
      if (!formData.email || !formData.password) {
        return;
      }
      dispatch(loginUser({
        email: formData.email,
        password: formData.password
      }));
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        return;
      }
      dispatch(registerUser(formData));
    }
  };

  const toggleState = () => {
    setCurrentState(prev => prev === 'Login' ? 'Sign Up' : 'Login');
    setFormData({ name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800">
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {/* Error Message */}
      {error && (
        <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Name Field - Only show for Sign Up */}
      {currentState === 'Sign Up' && (
        <input 
          type="text" 
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required 
          className="w-full px-3 py-2 border border-gray-800" 
          placeholder="Full Name"
          disabled={isLoading}
        />
      )}

      {/* Email Field */}
      <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required 
        className="w-full px-3 py-2 border border-gray-800" 
        placeholder="Email"
        disabled={isLoading}
      />

      {/* Password Field */}
      <input 
        type="password" 
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        required 
        className="w-full px-3 py-2 border border-gray-800" 
        placeholder="Password"
        disabled={isLoading}
        minLength={6}
      />
      
      <div className="flex w-full justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">
          {currentState === "Login" ? "Forgot password?" : ""}
        </p>
        <p onClick={toggleState} className="cursor-pointer hover:text-blue-600">
          {currentState === "Login" ? "Create account" : "Login"}
        </p>
      </div>

      <button 
        type="submit"
        disabled={isLoading}
        className={`w-full font-light px-8 py-2 mt-4 text-white transition-colors ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-black hover:bg-gray-800'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            {currentState === 'Login' ? 'Logging in...' : 'Signing up...'}
          </div>
        ) : (
          currentState === 'Login' ? 'Login' : 'Sign Up'
        )}
      </button>
    </form>
  );
};

export default Login;
