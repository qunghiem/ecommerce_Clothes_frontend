// src/pages/Cart.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";
import { selectProducts, selectCurrency } from '../store/slices/shopSlice';
import { selectCartItems, selectCurrentUserId, updateQuantity, removeSelectedItems } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(selectProducts);
    const currency = useSelector(selectCurrency);
    const cartItems = useSelector(selectCartItems);
    const currentUserId = useSelector(selectCurrentUserId);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [cartData, setCartData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !currentUserId) {
            setCartData([]);
            return;
        }

        const tempData = [];
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                if (cartItems[items][size] > 0) {
                    tempData.push({
                        _id: items,
                        size: size,
                        quantity: cartItems[items][size],
                    });
                }
            }
        }
        setCartData(tempData);
    }, [cartItems, isAuthenticated, currentUserId]);

    // Handle select individual item
    const handleSelectItem = (itemId, size, isChecked) => {
        if (isChecked) {
            setSelectedItems(prev => [...prev, { itemId, size }]);
        } else {
            setSelectedItems(prev => prev.filter(item => 
                !(item.itemId === itemId && item.size === size)
            ));
        }
    };

    // Handle select all items
    const handleSelectAll = (isChecked) => {
        setSelectAll(isChecked);
        if (isChecked) {
            const allItems = cartData.map(item => ({
                itemId: item._id,
                size: item.size
            }));
            setSelectedItems(allItems);
        } else {
            setSelectedItems([]);
        }
    };

    // Check if item is selected
    const isItemSelected = (itemId, size) => {
        return selectedItems.some(item => item.itemId === itemId && item.size === size);
    };

    // Update selectAll state when selectedItems change
    useEffect(() => {
        if (cartData.length > 0) {
            const allSelected = cartData.every(item => 
                isItemSelected(item._id, item.size)
            );
            setSelectAll(allSelected);
        }
    }, [selectedItems, cartData]);

    const handleDeleteSelected = () => {
        const confirmed = window.confirm(
            `Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn không?`
        );
        if (confirmed) {
            dispatch(removeSelectedItems(selectedItems));
            setSelectedItems([]);
            setSelectAll(false);
        }
    };

    const handleUpdateQuantity = (itemId, size, quantity) => {
        if (quantity === 0) {
            const confirmed = window.confirm(
                "Bạn có chắc chắn muốn xóa sản phẩm này không?"
            );
            if (confirmed) {
                dispatch(updateQuantity({ itemId, size, quantity }));
            }
        } else {
            dispatch(updateQuantity({ itemId, size, quantity }));
        }
    };

    // Show login prompt if user is not authenticated
    if (!isAuthenticated) {
        return (
            <div className="border-t pt-14 py-20">
                <div className="text-2xl mb-3">
                    <Title text1={"YOUR"} text2={"CART"} />
                </div>
                <div className="text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Bạn cần đăng nhập</h3>
                        <p className="text-gray-500 mb-6">
                            Vui lòng đăng nhập để xem giỏ hàng và thực hiện mua sắm
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link 
                                to="/login" 
                                className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-700 transition-colors"
                            >
                                ĐĂNG NHẬP
                            </Link>
                            <Link 
                                to="/collection" 
                                className="bg-gray-200 text-gray-700 px-6 py-3 text-sm hover:bg-gray-300 transition-colors"
                            >
                                XEM SẢN PHẨM
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show empty cart if authenticated user has no items
    if (cartData.length === 0) {
        return (
            <div className="border-t pt-14 py-20">
                <div className="text-2xl mb-3">
                    <Title text1={"YOUR"} text2={"CART"} />
                </div>
                <div className="text-center">
                    <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Giỏ hàng trống</h3>
                        <p className="text-gray-500 mb-6">
                            Giỏ hàng của bạn đang trống. Hãy khám phá các sản phẩm tuyệt vời!
                        </p>
                        <Link 
                            to="/collection" 
                            className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-700 transition-colors"
                        >
                            TIẾP TỤC MUA SẮM
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border-t pt-14">
            <div className="text-2xl mb-3">
                <Title text1={"YOUR"} text2={"CART"} />
            </div>

            {/* Cart Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 p-4 bg-gray-50 rounded">
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={selectAll}
                            onChange={(e) => handleSelectAll(e.target.checked)}
                            className="w-4 h-4"
                        />
                        <span className="text-sm">Select All ({cartData.length} {cartData.length > 1 ? "Products" : "Product"})</span>
                    </label>
                    {selectedItems.length > 0 && (
                        <span className="text-sm text-blue-600">
                            Đã chọn {selectedItems.length} sản phẩm
                        </span>
                    )}
                </div>
                
                <div className="flex gap-2">
                    {selectedItems.length > 0 && (
                        <button 
                            onClick={handleDeleteSelected}
                            className="bg-red-500 text-white px-4 py-2 text-sm rounded hover:bg-red-600 transition-colors"
                        >
                            Xóa đã chọn ({selectedItems.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Cart Items */}
            <div className="">
                {cartData.map((item, index) => {
                    const productData = products.find(
                        (product) => product._id === item._id
                    );
                    const isSelected = isItemSelected(item._id, item.size);

                    return (
                        <div
                            key={index} 
                            className={`py-4 border-t border-b text-gray-700 grid grid-cols-[auto_4fr_0.5fr_0.5fr] sm:grid-cols-[auto_4fr_2fr_0.5fr] items-center gap-4 ${
                                isSelected ? 'bg-blue-50' : ''
                            }`}
                        >
                            <input 
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => handleSelectItem(item._id, item.size, e.target.checked)}
                                className="w-4 h-4 ml-2"
                            />

                            {/* Product Info */}
                            <Link to={`/product/${productData._id}`} className="flex items-start gap-6">
                                <img
                                    src={productData.image[0]}
                                    className="w-16 sm:w-20"
                                    alt=""
                                />
                                <div>
                                    <p className="text-xs sm:text-lg font-medium">
                                        {productData.name}
                                    </p>
                                    <div className="flex items-center gap-5 mt-2">
                                        <p>
                                            {currency}
                                            {productData.price}
                                        </p>
                                        <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">
                                            {item.size}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <input
                                key={`quantity_${index}`} 
                                onChange={(e) =>
                                    e.target.value === "" || e.target.value === "0"
                                        ? null
                                        : handleUpdateQuantity(
                                            item._id,
                                            item.size,
                                            Number(e.target.value)
                                        )
                                }
                                className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center"
                                type="number"
                                min={1}
                                value={item.quantity} 
                            />
                            
                            {/* DELETE */}
                            <img
                                onClick={() => handleUpdateQuantity(item._id, item.size, 0)}
                                src={assets.bin_icon}
                                className="w-4 mr-4 sm:w-5 cursor-pointer hover:opacity-70"
                                alt=""
                                title="Xóa sản phẩm"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Cart Total */}
            <div className="flex justify-end my-20">
                <div className="w-full sm:w-[450px]">
                    <CartTotal />
                    <div className="w-full text-end">
                        <button
                            onClick={() => navigate("/place-order")}
                            className="bg-black text-white text-sm my-8 px-8 py-3 hover:bg-gray-700 transition-colors"
                        >
                            PROCEED TO CHECKOUT
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;