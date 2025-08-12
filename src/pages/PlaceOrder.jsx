// src/pages/PlaceOrder.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { selectCartItems, removeSelectedItems } from '../store/slices/cartSlice';
import { selectDeliveryFee, selectCurrency } from '../store/slices/shopSlice';
import { selectUser } from '../store/slices/authSlice';
import { addOrder } from '../store/slices/ordersSlice';

const PlaceOrder = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector(selectUser);
    const cartItems = useSelector(selectCartItems);
    const deliveryFee = useSelector(selectDeliveryFee);
    const currency = useSelector(selectCurrency);
    
    // Get selected items from navigation state
    const selectedItems = location.state?.selectedItems || [];
    const selectedTotals = location.state?.selectedTotals || { subtotal: 0, total: 0 };
    
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
        
        // Check if we have selected items
        if (!selectedItems || selectedItems.length === 0) {
            alert("Không có sản phẩm nào được chọn để đặt hàng!");
            navigate('/cart');
            return;
        }

        // Use selected items for order
        const orderItems = selectedItems.map(item => ({
            _id: item._id,
            size: item.size,
            quantity: item.quantity,
        }));

        // Create order with selected items total
        const orderData = {
            paymentMethod: method,
            totalAmount: selectedTotals.total,
        };

        dispatch(addOrder({
            orderData,
            cartItems: orderItems,
            deliveryInfo
        }));

        // Remove only the selected items from cart
        const selectedItemsForRemoval = selectedItems.map(item => ({
            itemId: item._id,
            size: item.size
        }));
        
        dispatch(removeSelectedItems(selectedItemsForRemoval));
        
        // Navigate to orders page
        navigate('/orders');
    };

    // Check if no items are selected (redirect to cart)
    if (!selectedItems || selectedItems.length === 0) {
        return (
            <div className="border-t pt-14 py-20">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Không có sản phẩm được chọn</h2>
                    <p className="text-gray-600 mb-6">Vui lòng quay lại giỏ hàng và chọn sản phẩm để đặt hàng</p>
                    <button 
                        onClick={() => navigate('/cart')}
                        className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800"
                    >
                        Quay lại giỏ hàng
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
                    {/* Selected Items Summary */}
                    <div className="mb-8">
                        <div className="text-xl mb-4">
                            <Title text1={"ĐƠN HÀNG"} text2={"CỦA BẠN"} />
                        </div>
                        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                            <div className="space-y-3">
                                {selectedItems.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-3">
                                            {item.image && (
                                                <img 
                                                    src={item.image[0]} 
                                                    className="w-12 h-12 object-cover rounded"
                                                    alt={item.name}
                                                />
                                            )}
                                            <div>
                                                <span className="font-medium">{item.name || `Product ${item._id}`}</span>
                                                <div className="text-xs text-gray-500">
                                                    Size: {item.size} | Qty: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="font-medium">
                                            {currency}{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Totals */}
                    <div className="mt-8 min-w-80">
                        <div className="w-full">
                            <div className="text-2xl">
                                <Title text1={"ORDER"} text2={"TOTALS"}/>
                            </div>
                            <div className="flex flex-col gap-2 mt-2 text-sm">
                                <div className="flex justify-between">
                                    <p>SubTotal ({selectedItems.length} items)</p>
                                    <p>{currency} {selectedTotals.subtotal}.00</p>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <p>Shipping Fee</p>
                                    <p>{currency} {selectedTotals.subtotal === 0 ? 0 : deliveryFee}.00</p>
                                </div>
                                <hr />
                                <div className="flex justify-between">
                                    <b>Total</b>
                                    <b>{currency} {selectedTotals.total}.00</b>
                                </div>
                                <hr />
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
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
                            ĐẶT HÀNG ({selectedItems.length} sản phẩm)
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;