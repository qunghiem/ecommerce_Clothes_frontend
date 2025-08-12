// src/pages/PlaceOrder.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { selectCartItems, selectCartAmount, clearCart } from '../store/slices/cartSlice';
import { selectDeliveryFee } from '../store/slices/shopSlice';
import { selectUser } from '../store/slices/authSlice';
import { addOrder } from '../store/slices/ordersSlice';

const PlaceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const cartItems = useSelector(selectCartItems);
    const cartAmount = useSelector(selectCartAmount);
    const deliveryFee = useSelector(selectDeliveryFee);
    
    const [method, setMethod] = useState("cod");
    const [deliveryInfo, setDeliveryInfo] = useState({
        firstName: '',
        lastName: '',
        email: user?.email || '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        phone: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDeliveryInfo(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Convert cart items to order format
        const orderItems = [];
        for (const itemId in cartItems) {
            for (const size in cartItems[itemId]) {
                if (cartItems[itemId][size] > 0) {
                    orderItems.push({
                        _id: itemId,
                        size: size,
                        quantity: cartItems[itemId][size],
                    });
                }
            }
        }

        // Create order
        const orderData = {
            paymentMethod: method,
            totalAmount: cartAmount + deliveryFee,
        };

        dispatch(addOrder({
            orderData,
            cartItems: orderItems,
            deliveryInfo
        }));

        // Clear cart after successful order (using existing clearCart action)
        dispatch(clearCart());
        
        // Navigate to orders page
        navigate('/orders');
    };

    // Check if cart is empty
    if (Object.keys(cartItems).length === 0) {
        return (
            <div className="border-t pt-14 py-20">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Giỏ hàng trống</h2>
                    <p className="text-gray-600 mb-6">Vui lòng thêm sản phẩm vào giỏ hàng trước khi đặt hàng</p>
                    <button 
                        onClick={() => navigate('/collection')}
                        className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800"
                    >
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
                {/* left */}
                <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                    <div className="text-xl sm:text-2xl my-3">
                        <Title text1={"THÔNG TIN"} text2={"GIAO HÀNG"} />
                    </div>
                    <div className="flex gap-3">
                        <input 
                            required
                            type="text"
                            name="firstName"
                            value={deliveryInfo.firstName}
                            onChange={handleInputChange}
                            placeholder="Họ"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input 
                            required
                            type="text"
                            name="lastName"
                            value={deliveryInfo.lastName}
                            onChange={handleInputChange}
                            placeholder="Tên"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <input 
                        required
                        type="email"
                        name="email"
                        value={deliveryInfo.email}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ email"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    <input 
                        required
                        type="text"
                        name="street"
                        value={deliveryInfo.street}
                        onChange={handleInputChange}
                        placeholder="Địa chỉ đường"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    <div className="flex gap-3">
                        <input 
                            required
                            type="text"
                            name="city"
                            value={deliveryInfo.city}
                            onChange={handleInputChange}
                            placeholder="Thành phố"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input 
                            required
                            type="text"
                            name="state"
                            value={deliveryInfo.state}
                            onChange={handleInputChange}
                            placeholder="Tỉnh/Thành"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <div className="flex gap-3">
                        <input 
                            required
                            type="text"
                            name="zipCode"
                            value={deliveryInfo.zipCode}
                            onChange={handleInputChange}
                            placeholder="Mã bưu điện"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input 
                            required
                            type="text"
                            name="country"
                            value={deliveryInfo.country}
                            onChange={handleInputChange}
                            placeholder="Quốc gia"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <input 
                        required
                        type="tel"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                        placeholder="Số điện thoại"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                </div> 

                {/* right side */}
                <div className="mt-8">
                    <div className="mt-8 min-2-80">
                        <CartTotal />
                    </div>
                    <div className="mt-12">
                        <Title text1={"PHƯƠNG THỨC"} text2={"THANH TOÁN"}/>
                        <div className="flex flex-col lg:flex-row gap-3">
                            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? "bg-green-500" : ""}`}></p>
                                <img src={assets.stripe_logo} className="h-5 mx-4" alt="" />
                            </div>
                            <div onClick={() => setMethod("razorpay")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'razorpay' ? "bg-green-500" : ""}`}></p>
                                <img src={assets.razorpay_logo} className="h-5 mx-4" alt="" />
                            </div>
                            <div onClick={() => setMethod("cod")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                                <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? "bg-green-500" : ""}`}></p>
                                <p className="text-gray-500 text-sm font-medium mx-4">THANH TOÁN KHI NHẬN HÀNG</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm hover:bg-gray-800 transition-colors">
                            ĐẶT HÀNG
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;