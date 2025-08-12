// src/components/ProductItem.jsx
import React from "react";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrency } from '../store/slices/shopSlice';

const ProductItem = ({ id, image, name, price }) => {
    const currency = useSelector(selectCurrency);
    
    return (
        <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
            <div className="overflow-hidden">
                <img className="hover:scale-110 transition ease-in-out" src={image[0]} alt="" />
            </div>
            <p className="pt-3 pb-1 text-sm">{name}</p>
            <p className="text-sm font-medium">{currency}{price}</p>
        </Link>
    );
};

export default ProductItem;