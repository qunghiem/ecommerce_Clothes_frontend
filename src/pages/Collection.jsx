// src/pages/Collection.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";
import { selectProducts } from '../store/slices/shopSlice';
import { 
    selectSearch, 
    selectShowSearch, 
    selectShowFilter,
    selectFilters,
    setShowFilter,
    toggleCategory,
    toggleSubCategory,
    setSortType
} from '../store/slices/uiSlice';

const Collection = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const search = useSelector(selectSearch);
    const showSearch = useSelector(selectShowSearch);
    const showFilter = useSelector(selectShowFilter);
    const filters = useSelector(selectFilters);

    const [filterProducts, setFilterProducts] = useState([]);

    const handleToggleFilter = () => {
        dispatch(setShowFilter(!showFilter));
    };

    const handleCategoryChange = (e) => {
        dispatch(toggleCategory(e.target.value));
    };

    const handleSubCategoryChange = (e) => {
        dispatch(toggleSubCategory(e.target.value));
    };

    const handleSortChange = (e) => {
        dispatch(setSortType(e.target.value));
    };

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (search) {
            productsCopy = productsCopy.filter(item => 
                item.name.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        if (filters.category.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                filters.category.includes(item.category)
            );
        }
        
        if (filters.subCategory.length > 0) {
            productsCopy = productsCopy.filter((item) =>
                filters.subCategory.includes(item.subCategory)
            );
        }
        
        setFilterProducts(productsCopy);
    };

    const sortProduct = () => {
        let productsCopy = filterProducts.slice();

        switch(filters.sortType) {
            case 'low-high':
                setFilterProducts(productsCopy.sort((a, b) => (a.price - b.price)));
                break;
            case 'high-low':
                setFilterProducts(productsCopy.sort((a, b) => (b.price - a.price)));
                break;
            default: 
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        sortProduct();
    }, [filters.sortType]);

    useEffect(() => {
        applyFilter();
    }, [filters.category, filters.subCategory, search, showSearch, products]);

    return (
        <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
            {/* Filter */}
            <div className="min-w-60">
                <p
                    onClick={handleToggleFilter}
                    className="my-2 text-xl flex items-center gap-2 cursor-pointer"
                >
                    FILTERS
                    <img
                        src={assets.dropdown_icon}
                        className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                        alt=""
                    />
                </p>

                {/* CATEGORY FILTER */}
                <div className={`border border-gray-300 pl-5 mt-6 py-3 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">CATEGORIES</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                onChange={handleCategoryChange}
                                value={"Men"}
                                checked={filters.category.includes("Men")}
                            />
                            Men
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                onChange={handleCategoryChange}
                                value={"Women"}
                                checked={filters.category.includes("Women")}
                            />
                            Women
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                onChange={handleCategoryChange}
                                value={"Kids"}
                                checked={filters.category.includes("Kids")}
                            />
                            Kids
                        </p>
                    </div>
                </div>

                {/* Type - SubCategory Filter */}
                <div className={`border border-gray-300 pl-5 my-5 py-3 ${showFilter ? "" : "hidden"} sm:block`}>
                    <p className="mb-3 text-sm font-medium">TYPE</p>
                    <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={"Topwear"}
                                onChange={handleSubCategoryChange}
                                checked={filters.subCategory.includes("Topwear")}
                            />
                            Topwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={"Bottomwear"}
                                onChange={handleSubCategoryChange}
                                checked={filters.subCategory.includes("Bottomwear")}
                            />
                            Bottomwear
                        </p>
                        <p className="flex gap-2">
                            <input
                                type="checkbox"
                                className="w-3"
                                value={"Winterwear"}
                                onChange={handleSubCategoryChange}
                                checked={filters.subCategory.includes("Winterwear")}
                            />
                            Winterwear
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex-1">
                <div className="flex justify-between text-base sm:text-2xl mb-4">
                    <Title text1={"ALL"} text2={"COLLECTIONS"} />

                    {/* Sort Product */}
                    <select 
                        onChange={handleSortChange} 
                        value={filters.sortType}
                        className="border-2 border-gray-300 text-sm px-2"
                    >
                        <option value="relavent">Sort by: Relavent</option>
                        <option value="low-high">Sort by: Low to High</option>
                        <option value="high-low">Sort by: High to Low</option>
                    </select>
                </div>

                {/* Map Products */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
                    {filterProducts.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            image={item.image}
                            name={item.name}
                            price={item.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Collection;