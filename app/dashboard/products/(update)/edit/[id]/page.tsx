"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Upload, Package, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Types
interface Category {
    id: number;
    name: string;
}

interface Condition {
    id: number;
    name: string;
}

interface Product {
    category_id: number;
    condition: number;
    name: string;
    description: string;
    price: number;
    old_price?: string;
    discount?: string;
    tax_rate: number;
    tax_amount: number;
    rating: number;
    image: string;
    is_new: boolean;
    status: number | string;
}

interface FormDataType {
    category_id: string;
    condition: string;
    name: string;
    description: string;
    price: string;
    old_price: string;
    discount: string;
    tax_rate: string;
    tax_amount: number;
    rating: string;
    image: File | null;
    existing_image: string;
    is_new: boolean;
    status: string | number;
}

const UpdateProductPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { token } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [fetchingProduct, setFetchingProduct] = useState<boolean>(true);

    const router = useRouter();
    const params = useParams();
    const productId = params.id;

    const [formData, setFormData] = useState<FormDataType>({
        category_id: "",
        condition: "",
        name: "",
        description: "",
        price: "",
        old_price: "",
        discount: "",
        tax_rate: "",
        tax_amount: 0,
        rating: "0",
        image: null,
        existing_image: "",
        is_new: false,
        status: 1,
    });

    // Get Categories
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

    // Get Conditions
    const getConditions = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/conditions`,
            );
            setConditions(response.data.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    // Get Product Details
    const getProductDetails = async () => {
        try {
            setFetchingProduct(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`,
            );

            const product: Product = response.data.product || response.data.data || response.data;

            setFormData({
                category_id: String(product.category_id || ""),
                condition: String(product.condition || ""),
                name: product.name || "",
                description: product.description || "",
                price: String(product.price || ""),
                old_price: product.old_price || "",
                discount: product.discount || "",
                tax_rate: String(product.tax_rate || 0),
                tax_amount: product.tax_amount || 0,
                rating: String(product.rating || 0),
                image: null,
                existing_image: product.image || "",
                is_new: product.is_new || false,
                status: product.status || 1,
            });

            if (product.image) {
                setPreviewImage(product.image);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch product details");
            router.push("/dashboard/products");
        } finally {
            setFetchingProduct(false);
        }
    };

    useEffect(() => {
        getCategories();
        getConditions();
        if (productId) {
            getProductDetails();
        }
    }, [productId]);

    // Handle Input Change with auto tax calculation
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const newFormData = {
                ...prev,
                [name]: value,
            };

            // Auto-calculate tax_amount when price or tax_rate changes
            if (name === 'price' || name === 'tax_rate') {
                const price = name === 'price' ? Number(value) : Number(prev.price);
                const taxRate = name === 'tax_rate' ? Number(value) : Number(prev.tax_rate);
                const taxAmount = price * taxRate;
                newFormData.tax_amount = isNaN(taxAmount) ? 0 : taxAmount;
            }

            return newFormData;
        });
    };

    // Handle Image Change
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData({
                ...formData,
                image: file,
            });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    // Submit Update
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Recalculate to ensure accuracy
            const price = Number(formData.price);
            const taxRate = Number(formData.tax_rate);
            const taxAmount = price * taxRate;

            const productData = new FormData();

            productData.append("category_id", formData.category_id);
            productData.append("condition", formData.condition);
            productData.append("name", formData.name);
            productData.append("description", formData.description);
            productData.append("price", String(price));
            productData.append("old_price", formData.old_price);
            productData.append("discount", formData.discount);
            productData.append("tax_rate", String(taxRate));
            productData.append("tax_amount", String(taxAmount)); // Send as string
            productData.append("rating", formData.rating);
            productData.append("status", String(formData.status));
            productData.append("is_new", formData.is_new ? "1" : "0");
            productData.append("_method", "PUT"); // For form spoofing

            if (formData.image) {
                productData.append("image", formData.image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/update-product/${productId}`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            toast.success(response.data?.message || "Product updated successfully");
            router.push("/dashboard/products/product-detials");

        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.msg || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingProduct) {
        return (
            <div className="p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    <Card>
                        <CardContent className="py-12">
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-4 text-muted-foreground">Loading product details...</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/products/all-products">
                                    <Button variant="outline" size="icon" className="rounded-xl">
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <div className="p-2 border rounded-xl">
                                    <Package className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl">Update Product</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Edit product information
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Product Name */}
                                <div className="space-y-2">
                                    <Label>Product Name</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        required
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <Label>Category</Label>
                                    <Select
                                        value={formData.category_id}
                                        onValueChange={(value: string) =>
                                            setFormData({
                                                ...formData,
                                                category_id: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={String(category.id)}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Condition */}
                                <div className="space-y-2">
                                    <Label>Condition</Label>
                                    <Select
                                        value={formData.condition}
                                        onValueChange={(value: string) =>
                                            setFormData({
                                                ...formData,
                                                condition: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select condition" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {conditions.map((condition) => (
                                                <SelectItem
                                                    key={condition.id}
                                                    value={String(condition.id)}
                                                >
                                                    {condition.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Price */}
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="Enter price"
                                        required
                                    />
                                </div>

                                {/* Old Price */}
                                <div className="space-y-2">
                                    <Label>Old Price</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="old_price"
                                        value={formData.old_price}
                                        onChange={handleChange}
                                        placeholder="Enter old price"
                                    />
                                </div>

                                {/* Discount */}
                                <div className="space-y-2">
                                    <Label>Discount %</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="discount"
                                        value={formData.discount}
                                        onChange={handleChange}
                                        placeholder="Enter discount"
                                    />
                                </div>

                                {/* Tax Rate */}
                                <div className="space-y-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="tax_rate"
                                        value={formData.tax_rate}
                                        onChange={handleChange}
                                        placeholder="Enter tax rate"
                                    />
                                </div>

                                {/* Tax Amount (Auto-calculated) */}
                                <div className="space-y-2">
                                    <Label>Tax Amount</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="tax_amount"
                                        value={formData.tax_amount}
                                        disabled
                                        className="bg-muted"
                                        placeholder="Auto-calculated"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Automatically calculated as Price × Tax Rate
                                    </p>
                                </div>

                                {/* Rating */}
                                <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <Input
                                        type="number"
                                        step="0.1"
                                        name="rating"
                                        value={formData.rating}
                                        onChange={handleChange}
                                        placeholder="Enter rating"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <Label>Status</Label>
                                    <Select
                                        value={String(formData.status)}
                                        onValueChange={(value: string) =>
                                            setFormData({
                                                ...formData,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Is New Product Switch */}
                                <div className="space-y-2">
                                    <Label>New Product</Label>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch
                                            checked={formData.is_new}
                                            onCheckedChange={(checked: boolean) =>
                                                setFormData({
                                                    ...formData,
                                                    is_new: checked,
                                                })
                                            }
                                        />
                                        <Label>Mark as new product</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Write product description..."
                                    className="min-h-[150px]"
                                />
                            </div>

                            {/* Image */}
                            <div className="space-y-3">
                                <Label>Product Image</Label>
                                <div className="border rounded-xl p-6">
                                    <label
                                        htmlFor="imageUpload"
                                        className="flex flex-col items-center justify-center gap-3 cursor-pointer"
                                    >
                                        {previewImage ? (
                                            <div className="relative">
                                                <Image
                                                    src={previewImage}
                                                    alt="Preview"
                                                    width={200}
                                                    height={200}
                                                    unoptimized
                                                    className="w-40 h-40 object-cover rounded-xl border"
                                                />
                                                <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-1">
                                                    <Upload className="w-4 h-4" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 border rounded-xl flex items-center justify-center">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                        )}
                                        <p className="text-center font-medium">
                                            Click to upload new image
                                        </p>
                                        {formData.existing_image && !previewImage?.startsWith('blob:') && (
                                            <p className="text-xs text-muted-foreground">
                                                Current image will be replaced
                                            </p>
                                        )}
                                    </label>
                                    <Input
                                        id="imageUpload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Update Product"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UpdateProductPage;