"use client";

import { useEffect, useState } from "react";
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

import { Package, Upload } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Types
interface Category {
    id: number;
    name: string;
}

interface Condition {
    id: number;
    name: string;
}

interface FormDataType {
    category_id: string;
    condition: string;
    name: string;
    description: string;
    price: string;
    old_price: string;
    discount: string;
    rating: number;
    image: File | null;
    is_new: boolean;
    tax_rate: number;
    tax_amount: number;
    status: number;
}

const CreateProductPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const { token } = useAuthStore();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [loading, setloading] = useState<boolean>(false);
    const [conditions, setConditions] = useState<Condition[]>([]);

    const router = useRouter();

    const [formData, setFormData] = useState<FormDataType>({
        category_id: "",
        condition: "",
        name: "",
        description: "",
        price: "",
        old_price: "",
        discount: "",
        rating: 0,
        image: null,
        is_new: true,
        tax_rate: 0.02,
        tax_amount: 0,
        status: 1,
    });

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

    useEffect(() => {
        getCategories();
        getConditions();
    }, []);

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            setloading(true);

            const price = Number(formData.price);
            const taxRate = Number(formData.tax_rate);
            const taxAmount = price * taxRate; // Recalculate to ensure accuracy

            const productData = new FormData();

            productData.append("category_id", formData.category_id);
            productData.append("condition", formData.condition);
            productData.append("name", formData.name);
            productData.append("description", formData.description);
            productData.append("price", String(price));
            productData.append("old_price", formData.old_price);
            productData.append("discount", formData.discount);
            productData.append("rating", String(formData.rating));
            productData.append("tax_rate", String(taxRate));

            // ✅ Send tax_amount as NUMBER (not string)
            productData.append("tax_amount", String(taxAmount));

            productData.append("status", String(formData.status));
            productData.append("is_new", formData.is_new ? "1" : "0");

            if (formData.image) {
                productData.append("image", formData.image);
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/create-product`,
                productData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            toast.success(
                response.data?.message || "Product created successfully",
            );

            router.push("/dashboard/products/product-detials");

            setFormData({
                category_id: "",
                condition: "",
                name: "",
                description: "",
                price: "",
                old_price: "",
                discount: "",
                rating: 0,
                image: null,
                is_new: false,
                tax_rate: 0,
                tax_amount: 0,
                status: 1,
            });

            setPreviewImage(null);
        } catch (error: any) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                "Failed to create product",
            );
        } finally {
            setloading(false);
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <Package className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle className="text-2xl">Create Product</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Add a new product to your store
                                </p>
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
                                    <Label>Tax Rate</Label>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        name="tax_rate"
                                        value={formData.tax_rate}
                                        onChange={handleChange}
                                        placeholder="Enter tax rate"
                                    />
                                </div>

                                {/* Tax Amount (Auto-calculated, Read-only) */}
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
                                    required
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
                                            <Image
                                                src={previewImage}
                                                alt="Preview"
                                                width={200}
                                                height={200}
                                                className="w-40 h-40 object-cover rounded-xl border"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="w-32 h-32 border rounded-xl flex items-center justify-center">
                                                <Upload className="w-8 h-8" />
                                            </div>
                                        )}

                                        <p className="text-center font-medium">
                                            Click to upload image
                                        </p>
                                    </label>

                                    <Input
                                        id="imageUpload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleImageChange}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Creating..." : "Create Product"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default CreateProductPage;