import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { Link } from "react-router-dom";
const Orders = () => {
  const { products, currency, cartItems } = useContext(ShopContext);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    const tempData = [];
    const now = new Date().toISOString();

    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        if (cartItems[itemId][size] > 0) {
          tempData.push({
            _id: itemId,
            size: size,
            quantity: cartItems[itemId][size],
            createdAt: now,
          });
        }
      }
    }
    setOrdersData(tempData);
  }, [cartItems]);

  return (
    <div className="border-t pt-16">
      <div className="text-2xl ">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div className="">
        {ordersData.length > 0 ? (
          ordersData.map((item, index) => {
            const productData = products.find(
              (product) => product._id === item._id
            );

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <Link to={`/product/${productData._id}`} className="flex items-start gap-6 text-sm">
                  <img
                    src={productData?.image[0]}
                    className="w-16 sm:w-20"
                    alt=""
                  />
                  <div>
                    <p className="sm:text-base font-medium">
                      {productData?.name}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                      <p className="text-lg">
                        {currency} {productData?.price}
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    {/* <p className="mt-2">
                      Date:{" "}
                      <span className="text-gray-400">25, July, 2025</span>
                    </p> */}
                    <p className="mt-2">
                      Date:{" "}
                      <span className="text-gray-400">
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                </Link>
                <div className="md:w-1/2 flex justify-between">
                  <div className="flex items-center gap-2">
                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                    <p className="text-sm md:text-base">Ready to ship</p>
                  </div>
                  <button className="border px-4 py-2 text-sm font-medium rounded-sm">
                    Track Order
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Bạn chưa có đơn hàng nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
