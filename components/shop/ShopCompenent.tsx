"use client";

import ProductCard from "@/components/products/ProductCard";
import axios from "axios";
import React, { useEffect, useState } from "react";

const ShopComponent = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState("All");

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);

    // 🔥 GET PRODUCTS
    const getAllProducts = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`,
            );

            const data = response.data.products || [];

            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    // 🔥 GET CATEGORIES (FROM DB)
    const getCategories = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/category/all-categories`,
            );

            setCategories(response.data.categories || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([getAllProducts(), getCategories()]);
            setLoading(false);
        };

        loadData();
    }, []);

    // 🔍 FILTER FUNCTION
    const applyFilters = (text = search, category = activeCategory) => {
        setSearching(true);

        setTimeout(() => {
            let result = [...products];

            // category filter
            if (category !== "All") {
                result = result.filter((p: any) => p.category_name === category);
            }

            // search filter
            if (text.trim()) {
                result = result.filter((p: any) =>
                    p.name.toLowerCase().includes(text.toLowerCase()),
                );
            }

            setFilteredProducts(result);
            setSearching(false);
        }, 300);
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* 🔥 TITLE */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">🛍️ Shop Products</h1>
                <p className="text-gray-500">
                    Find amazing deals and trending products
                </p>
            </div>

            {/* 🔍 SEARCH */}
            <div className="flex gap-2 max-w-md">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearch(value);
                        applyFilters(value, activeCategory);
                    }}
                    className="w-full border rounded px-3 py-2 outline-none"
                />
            </div>

            {/* 📂 CATEGORIES (FROM DB) */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => {
                        setActiveCategory("All");
                        applyFilters(search, "All");
                    }}
                    className={`px-3 py-1 rounded-full border text-sm transition ${activeCategory === "All"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                        }`}
                >
                    All
                </button>

                {categories.map((cat: any) => (
                    <button
                        key={cat.id}
                        onClick={() => {
                            setActiveCategory(cat.name);
                            applyFilters(search, cat.name);
                        }}
                        className={`px-3 py-1 rounded-full border text-sm transition ${activeCategory === cat.name
                            ? "bg-black text-white"
                            : "bg-white text-black"
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 🔥 LOADING */}
            {loading || searching ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="mt-3">Loading products...</p>
                </div>
            ) : null}

            {/* ⚠️ EMPTY SEARCH MESSAGE */}
            {!loading && !searching && filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    😢 No products found for{" "}
                    <span className="font-semibold">"{search || activeCategory}"</span>
                </div>
            )}

            {/* 🔥 PRODUCTS GRID (UNCHANGED) */}
            {!loading && !searching && filteredProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopComponent;
