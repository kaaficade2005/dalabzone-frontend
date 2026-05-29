"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Search,
    Package,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// Types
interface Product {
    id: number;
    name: string;
    image: string | null;
    total: number;
    in_stock: number;
    category_name: string | null;
    created_at: string;
}

const Page = () => {

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);

    const itemsPerPage: number = 8;

    const getAllProducts = async () => {

        setLoading(true);

        try {

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`
            );

            const data: Product[] = response.data.products || [];

            setProducts(data);
            setFilteredProducts(data);

            setCurrentPage(1);

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    // Search Filter
    useEffect(() => {

        if (searchTerm.trim() === "") {

            setFilteredProducts(products);

        } else {

            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category_name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );

            setFilteredProducts(filtered);
        }

        setCurrentPage(1);

    }, [searchTerm, products]);

    // Pagination
    const totalPages: number = Math.ceil(filteredProducts.length / itemsPerPage);

    const startIndex: number = (currentPage - 1) * itemsPerPage;

    const paginatedProducts: Product[] = filteredProducts.slice(
        startIndex,
        startIndex + itemsPerPage
    );

    const goToPage = (page: number) => {

        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }

    };

    const router = useRouter();

    return (
        <div className="p-4 md:p-8">

            <div className="space-y-6">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    <div className="flex items-center gap-3">
                        <div className="p-2 border rounded-xl">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>

                            <h1 className="text-2xl font-semibold tracking-tight">
                                Product Inventory
                            </h1>

                            <p className="text-sm">
                                Manage and view all your products
                            </p>

                        </div>

                    </div>

                    <Button
                        onClick={getAllProducts}
                        variant="outline"
                        className="gap-2"
                        disabled={loading}
                    >
                        <RefreshCw
                            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                        />

                        Refresh
                    </Button>

                </div>

                {/* Search */}
                <div className="relative max-w-md">

                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                    <Input
                        placeholder="Search by product or category..."
                        value={searchTerm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />

                </div>

                {/* Table */}
                <Card>

                    <CardHeader>

                        <div className="flex items-center justify-between">

                            <CardTitle>
                                All Products
                            </CardTitle>

                            <div className="text-sm border px-2.5 py-0.5 rounded-full">
                                {filteredProducts.length} items
                            </div>

                        </div>

                    </CardHeader>

                    <CardContent className="p-0">

                        {loading ? (

                            <div className="flex justify-center items-center py-20">

                                <div className="flex flex-col items-center gap-3">

                                    <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" />

                                    <p className="text-sm">
                                        Loading products...
                                    </p>

                                </div>

                            </div>

                        ) : (

                            <>
                                <div className="overflow-x-auto">

                                    <Table>

                                        <TableHeader>

                                            <TableRow>

                                                <TableHead className="w-[80px] text-center">
                                                    ID
                                                </TableHead>

                                                <TableHead className="w-[100px]">
                                                    Image
                                                </TableHead>

                                                <TableHead>
                                                    Name
                                                </TableHead>

                                                <TableHead className="w-[120px]">
                                                    Price
                                                </TableHead>

                                                <TableHead className="w-[120px]">
                                                    Stock
                                                </TableHead>

                                                <TableHead className="w-[150px]">
                                                    Category
                                                </TableHead>

                                                <TableHead className="w-[150px]">
                                                    Created At
                                                </TableHead>
                                                <TableHead className="w-[150px]">
                                                    Edit Product
                                                </TableHead>
                                                <TableHead className="w-[150px]">
                                                    Edit Product Details
                                                </TableHead>
                                                <TableHead className="w-[150px]">
                                                    Edit Product Image
                                                </TableHead>

                                            </TableRow>

                                        </TableHeader>

                                        <TableBody>

                                            {paginatedProducts.length > 0 ? (

                                                paginatedProducts.map((product) => (

                                                    <TableRow
                                                        key={product.id}
                                                        className="cursor-pointer"
                                                    >

                                                        <TableCell className="text-center">
                                                            {product.id}
                                                        </TableCell>

                                                        <TableCell>

                                                            <Link href={`/product/${product.id}`}>

                                                                {product.image ? (
                                                                    <Image
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        unoptimized
                                                                        width={40}
                                                                        height={40}
                                                                        className="w-10 h-10 rounded-md object-cover border"
                                                                    />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-md border flex items-center justify-center">
                                                                        <Package className="w-4 h-4" />
                                                                    </div>
                                                                )}
                                                            </Link>

                                                        </TableCell>

                                                        <TableCell className="font-medium">

                                                            <Link href={`/product/${product.id}`}>
                                                                {product.name}
                                                            </Link>

                                                        </TableCell>

                                                        <TableCell>
                                                            ${Number(product.total).toFixed(2)}
                                                        </TableCell>

                                                        <TableCell>

                                                            {product.in_stock > 0
                                                                ? `${product.in_stock} in stock`
                                                                : "Out of stock"}

                                                        </TableCell>

                                                        <TableCell>
                                                            <Badge className="bg-brand-primary dark:text-white">
                                                                {product.category_name || "Uncategorized"}
                                                            </Badge>
                                                        </TableCell>

                                                        <TableCell>

                                                            {new Date(
                                                                product.created_at
                                                            ).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            })}

                                                        </TableCell>

                                                        <TableCell>
                                                            <Button type="button" variant={'outline'} onClick={() => router.push(`/dashboard/products/edit/${product.id}`)}>Edit</Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button type="button" variant={'outline'} onClick={() => router.push(`/dashboard/products/edit-details/${product.id}`)}>Edit</Button>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button type="button" variant={'outline'} onClick={() => router.push(`/dashboard/products/edit-product-images/${product.id}`)}>Edit</Button>
                                                        </TableCell>

                                                    </TableRow>

                                                ))

                                            ) : (

                                                <TableRow>

                                                    <TableCell
                                                        colSpan={10}
                                                        className="text-center py-12"
                                                    >

                                                        <div className="flex flex-col items-center gap-2">

                                                            <Package className="w-12 h-12" />

                                                            <p className="text-sm font-medium">
                                                                No products found
                                                            </p>

                                                            <p className="text-xs">
                                                                Try adjusting your search
                                                            </p>

                                                        </div>

                                                    </TableCell>

                                                </TableRow>

                                            )}

                                        </TableBody>

                                    </Table>

                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (

                                    <div className="flex items-center justify-between px-6 py-4 border-t">

                                        <div className="text-sm">

                                            Showing{" "}

                                            <span className="font-medium">
                                                {startIndex + 1}
                                            </span>

                                            {" "}to{" "}

                                            <span className="font-medium">
                                                {Math.min(
                                                    startIndex + itemsPerPage,
                                                    filteredProducts.length
                                                )}
                                            </span>

                                            {" "}of{" "}

                                            <span className="font-medium">
                                                {filteredProducts.length}
                                            </span>

                                            {" "}results

                                        </div>

                                        <div className="flex items-center gap-1">

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => goToPage(currentPage - 1)}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </Button>

                                            <div className="flex items-center gap-1">

                                                {Array.from(
                                                    { length: Math.min(5, totalPages) },
                                                    (_, i) => {

                                                        let pageNum: number;

                                                        if (totalPages <= 5) {

                                                            pageNum = i + 1;

                                                        } else if (currentPage <= 3) {

                                                            pageNum = i + 1;

                                                        } else if (currentPage >= totalPages - 2) {

                                                            pageNum = totalPages - 4 + i;

                                                        } else {

                                                            pageNum = currentPage - 2 + i;
                                                        }

                                                        return (
                                                            <Button
                                                                key={pageNum}
                                                                variant={
                                                                    currentPage === pageNum
                                                                        ? "default"
                                                                        : "ghost"
                                                                }
                                                                size="icon"
                                                                onClick={() => goToPage(pageNum)}
                                                            >
                                                                {pageNum}
                                                            </Button>
                                                        );
                                                    }
                                                )}

                                            </div>

                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => goToPage(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </Button>

                                        </div>

                                    </div>

                                )}

                            </>

                        )}

                    </CardContent>

                </Card>

            </div>

        </div>
    );
};

export default Page;