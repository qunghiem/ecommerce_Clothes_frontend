// src/pages/Orders.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
import Title from "../components/Title";
import { selectProducts, selectCurrency } from '../store/slices/shopSlice';
import { selectUser } from '../store/slices/authSlice';
import { selectCurrentUserOrders, initializeOrders, updateOrderStatus } from '../store/slices/ordersSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const currency = useSelector(selectCurrency);
  const user = useSelector(selectUser);
  const orders = useSelector(selectCurrentUserOrders);

  // Initialize orders when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(initializeOrders(user.id));
    }
  }, [user?.id, dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'delivered':
        return 'bg-green-600';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Đã xác nhận';
      case 'processing':
        return 'Đang xử lý';
      case 'shipped':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Đang xử lý';
    }
  };

  if (!user) {
    return (
      <div className="border-t pt-16">
        <div className="text-center py-20">
          <p className="text-gray-500">Vui lòng đăng nhập để xem đơn hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl mb-6">
        <Title text1={"ĐỠN HÀNG"} text2={"CỦA TÔI"} />
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 bg-white shadow-sm">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b">
                <div>
                  <h3 className="font-semibold text-lg">Đơn hàng #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    Đặt ngày: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                  <p className="text-sm text-gray-500">
                    Dự kiến giao: {new Date(order.estimatedDelivery).toLocaleDateString('vi-VN')}
                  </p>
                </div>
                <div className="flex items-center gap-3 mt-2 sm:mt-0">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                    <span className="text-sm font-medium">{getStatusText(order.status)}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      {currency}{order.totalAmount}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {order.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : order.paymentMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                {order.items.map((orderItem, index) => {
                  const productData = products.find(product => product._id === orderItem._id);
                  
                  return (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                      <Link to={`/product/${productData?._id}`}>
                        <img
                          src={productData?.image[0]}
                          className="w-16 h-16 object-cover rounded"
                          alt={productData?.name}
                        />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/product/${productData?._id}`}>
                          <h4 className="font-medium hover:text-blue-600">
                            {productData?.name}
                          </h4>
                        </Link>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                          <span>Size: {orderItem.size}</span>
                          <span>Số lượng: {orderItem.quantity}</span>
                          <span className="font-medium">
                            {currency}{productData?.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Info */}
              {order.deliveryInfo && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Thông tin giao hàng:</h4>
                  <div className="text-sm text-gray-600">
                    <p>{order.deliveryInfo.firstName} {order.deliveryInfo.lastName}</p>
                    <p>{order.deliveryInfo.email}</p>
                    <p>{order.deliveryInfo.phone}</p>
                    <p>{order.deliveryInfo.street}, {order.deliveryInfo.city}, {order.deliveryInfo.state}</p>
                    <p>{order.deliveryInfo.country} {order.deliveryInfo.zipCode}</p>
                  </div>
                </div>
              )}

              {/* Order Actions */}
              <div className="mt-4 pt-4 border-t flex gap-3">
                <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                  Theo dõi đơn hàng
                </button>
                {order.status === 'confirmed' && (
                  <button 
                    onClick={() => dispatch(updateOrderStatus({ orderId: order.id, status: 'cancelled' }))}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded text-sm hover:bg-red-50"
                  >
                    Hủy đơn hàng
                  </button>
                )}
                {order.status === 'delivered' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                    Mua lại
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
              <p className="text-gray-500 mb-6">
                Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm và đặt hàng ngay!
              </p>
              <Link 
                to="/collection" 
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Khám phá sản phẩm
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;