// src/pages/PlaceOrder.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";

const PlaceOrder = () => {
    const [method, setMethod] = useState("cod");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        navigate('/orders');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
                {/* left */}
                <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                    <div className="text-xl sm:text-2xl my-3">
                        <Title text1={"DELIVERY"} text2={"INFORMATION"} />
                    </div>
                    <div className="flex gap-3">
                        <input required
                            type="text"
                            placeholder="First name"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input required
                            type="text"
                            placeholder="Last name"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <input required
                        type="email"
                        placeholder="Email address"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    <input required
                        type="text"
                        placeholder="Street"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                    <div className="flex gap-3">
                        <input required
                            type="text"
                            placeholder="City"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input required
                            type="text"
                            placeholder="State"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <div className="flex gap-3">
                        <input required
                            type="text"
                            placeholder="Zip code"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                        <input required
                            type="text"
                            placeholder="Country"
                            className="border border-gray-300 rounded py-1.5 px-3.5 w-1/2"
                        />
                    </div>
                    <input required
                        type="number"
                        placeholder="Phone"
                        className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                    />
                </div> 

                {/* right side */}
                <div className="mt-8">
                    <div className="mt-8 min-2-80">
                        <CartTotal />
                    </div>
                    <div className="mt-12">
                        <Title text1={"PAYMENT"} text2={"METHOD"}/>
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
                                <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full text-end mt-8">
                        <button type="submit" className="bg-black text-white px-16 py-3 text-sm">PLACE ORDER</button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;