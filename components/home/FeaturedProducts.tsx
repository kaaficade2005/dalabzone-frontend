"use client";

import ProductCard from "../products/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function FeaturedProducts() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeFilter, setActiveFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);



    // 🔥 GET FEATURED PRODUCTS ONLY
    const getFeaturedProducts = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/featured-products`,
            );

            setProducts(res.data.products || []);
        } catch (err) {
            console.log(err);
        }
    };

    // 🔥 GET CATEGORIES
    const getCategories = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/category/all-categories`,
            );

            setCategories(res.data.categories || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([getFeaturedProducts(), getCategories()]);
            setLoading(false);
        };

        loadData();
    }, []);

    // 🔍 FILTER LOGIC (NO is_new anymore)
    const filteredProducts = products
        .filter((p: any) =>
            activeFilter === "all" ? true : p.category_name === activeFilter,
        )
        .filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={20} />
                        <span className="text-sm font-semibold uppercase tracking-wide">
                            Featured
                        </span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>

                    <p className="text-muted-foreground max-w-md">
                        Handpicked products from our store
                    </p>
                </div>

                <Link href="/shop">
                    <Button variant="ghost" className="group">
                        View All
                        <ChevronRight size={16} className="ml-1" />
                    </Button>
                </Link>
            </div>

            {/* 🔍 SEARCH */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search featured products..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full md:w-1/3 border px-3 py-2 rounded outline-none"
                />
            </div>

            {/* 📂 CATEGORIES */}
            <div className="flex flex-wrap gap-2 mb-8">
                <Button
                    size="sm"
                    variant={activeFilter === "all" ? "default" : "outline"}
                    onClick={() => setActiveFilter("all")}
                >
                    All
                </Button>

                {categories.map((cat: any) => (
                    <Button
                        key={cat.id}
                        size="sm"
                        variant={activeFilter === cat.name ? "default" : "outline"}
                        onClick={() => setActiveFilter(cat.name)}
                    >
                        {cat.name}
                    </Button>
                ))}
            </div>

            {/* 🔥 LOADING */}
            {loading && (
                <div className="flex flex-col items-center py-20 text-gray-500">
                    <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    <p className="mt-3">Loading featured products...</p>
                </div>
            )}

            {/* 🛍️ PRODUCTS GRID */}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredProducts.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* EMPTY STATE */}
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    No featured products found 😢
                </div>
            )}

            {/* SALE BANNER */}
            {/* <div className="mt-16 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-2xl p-6 md:p-8 border">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
                            Limited Time Offer
                        </p>
                        <h3 className="text-2xl md:text-3xl font-bold mt-1">
                            Get Up to 40% Off
                        </h3>
                        <p className="text-muted-foreground mt-2">
                            Use code:{" "}
                            <span className="font-mono font-bold text-primary">SAVE40</span>
                        </p>
                    </div>

                    <Link href="/shop">
                        <Button size="lg" className="rounded-full px-8">
                            Shop Now
                        </Button>
                    </Link>
                </div>
            </div> */}
        </section>
    );
}
