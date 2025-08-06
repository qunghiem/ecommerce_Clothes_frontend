import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import { Link } from "react-router-dom";

const Cart = () => {
  const { 
    products, 
    currency, 
    cartItems, 
    updateQuantity,
    removeSelectedItems,
    navigate , 
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);//item duoc tick
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
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
  }, [cartItems]);

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
    removeSelectedItems(selectedItems);
    setSelectedItems([]);
    setSelectAll(false);
  };

  if (cartData.length === 0) {
    return (
      <div className="border-t pt-14 py-20">
        <div className="text-2xl mb-3">
          <Title text1={"YOUR"} text2={"CART"} />
        </div>
        <div className="text-gray-500 text-center">
          <p className="text-lg mb-4">Giỏ hàng của bạn đang trống</p>
          <Link 
            to="/collection" 
            className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-700 transition-colors"
          >
            TIẾP TỤC MUA SẮM
          </Link>
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
            <span className="text-sm">Sellect All ({cartData.length} {cartData.length>1 ? "Products" : "Product"})</span>
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
                    : updateQuantity(
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
              {/* XÓA  */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0, true)}
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