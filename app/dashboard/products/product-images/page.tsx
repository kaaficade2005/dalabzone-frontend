"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Search, ImagePlus, Upload, X } from "lucide-react";

import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

const AddProductImages = () => {
    const { token } = useAuthStore();

    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [images, setImages] = useState<File[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // SEARCH PRODUCTS
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchTerm.trim() === "") {
                setFilteredProducts([]);
                return;
            }

            const fetchSearch = async () => {
                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/products/search`,
                        {
                            params: { q: searchTerm },
                        }
                    );

                    setFilteredProducts(res.data.products || []);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchSearch();
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // HANDLE IMAGES
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages((prev) => [...prev, ...files]);
    };

    const removeImage = (index: number) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    // SUBMIT UPLOAD
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedProduct) {
            return toast.error("Please select a product");
        }

        if (images.length === 0) {
            return toast.error("Please upload images");
        }

        try {
            setLoading(true);

            const formData = new FormData();

            formData.append("product_id", String(selectedProduct.id));

            images.forEach((image) => {
                formData.append("images", image);
            });

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/upload-images`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(res.data.message || "Images uploaded successfully");

            // reset
            setImages([]);
            setSelectedProduct(null);
            setSearchTerm("");
            setFilteredProducts([]);
        } catch (error) {
            console.log(error);
            toast.error("Failed to upload images");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">

                {/* SEARCH */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <Search className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle>Search Product</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Find product to add images
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                            <Input
                                placeholder="Search product..."
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>

                        {filteredProducts.length > 0 && (
                            <div className="border rounded-xl mt-2 max-h-60 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <button
                                        key={product.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProduct(product);
                                            setSearchTerm(product.name);
                                            setFilteredProducts([]);
                                        }}
                                        className="w-full text-left px-4 py-3 border-b hover:bg-muted"
                                    >
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">
                                            ${product.price}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* UPLOAD */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <ImagePlus className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle>Add Product Images</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Upload product gallery images
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* SELECTED PRODUCT */}
                            {selectedProduct && (
                                <div className="border rounded-xl p-4 flex justify-between items-center">
                                    <div className="flex gap-4">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="w-16 h-16 rounded-xl object-cover"
                                        />

                                        <div>
                                            <h3 className="font-semibold">
                                                {selectedProduct.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                ${selectedProduct.price}
                                            </p>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => setSelectedProduct(null)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}

                            {/* UPLOAD INPUT */}
                            <div className="space-y-3">
                                <Label>Upload Images</Label>
                                <label className="border rounded-xl border-dashed min-h-[180px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                                    <p>Click to upload images</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        You can upload multiple images
                                    </p>

                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>

                            {/* PREVIEW */}
                            {images.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Image Preview ({images.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {images.map((img, i) => (
                                            <div key={i} className="relative">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt={`Preview ${i + 1}`}
                                                    className="w-full h-40 object-cover rounded-xl"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* SUBMIT */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Uploading..." : "Save Product Images"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProductImages;