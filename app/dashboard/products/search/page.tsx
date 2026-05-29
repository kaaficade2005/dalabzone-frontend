"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";

import { Package, Search } from "lucide-react";

import ProductCard from "@/components/products/ProductCard";

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    category_id?: number;
    in_stock?: number;
}

const SearchProductPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    // Get Products
    const getProducts = async () => {
        setLoading(true);

        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`,
            );

            const data: Product[] = response.data.products || [];

            setProducts(data);
            setFilteredProducts(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Search
    useEffect(() => {
        if (searchTerm.trim() === "") {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );

            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold">Search Products</h1>

                    <p className="text-sm text-muted-foreground mt-1">
                        Search and view all products
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

                    <Input
                        placeholder="Search product..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Products */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div key={product.id}>
                                    <ProductCard product={product} />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full flex flex-col items-center justify-center py-20">
                                <Package className="w-14 h-14 text-muted-foreground" />

                                <h3 className="mt-4 font-medium">No Products Found</h3>

                                <p className="text-sm text-muted-foreground">
                                    Try another keyword
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchProductPage;