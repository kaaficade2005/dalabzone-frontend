"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Search, Package } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface FormDataType {
    description: string;
    brand: string;
    weight: string;
    dimensions: string;
    color: string;
    warranty: string;
}

interface Specification {
    key: string;
    value: string;
}

const AddProductDetails = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const [formData, setFormData] = useState<FormDataType>({
        description: "",
        brand: "",
        weight: "",
        dimensions: "",
        color: "",
        warranty: "",
    });

    const [specifications, setSpecifications] = useState<Specification[]>([
        {
            key: "",
            value: "",
        },
    ]);

    // Get Products
    const getProducts = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`,
            );

            const data: Product[] = response.data.products || [];

            setProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProducts();
    }, []);

    // Search Products
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
                        },
                    );

                    setFilteredProducts(res.data.products || []);
                } catch (err) {
                    console.log(err);
                }
            };

            fetchSearch();
        }, 400); // debounce

        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    // Form Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Specifications
    const addSpecification = () => {
        setSpecifications([
            ...specifications,
            {
                key: "",
                value: "",
            },
        ]);
    };

    const removeSpecification = (index: number) => {
        const updated = [...specifications];
        updated.splice(index, 1);
        setSpecifications(updated);
    };

    const handleSpecificationChange = (index: number, field: keyof Specification, value: string) => {
        const updated = [...specifications];
        updated[index][field] = value;
        setSpecifications(updated);
    };

    // Submit
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedProduct) {
            toast.error("Please select a product");
            return;
        }

        // Filter out empty specifications
        const validSpecifications = specifications.filter(
            (spec) => spec.key.trim() !== "" && spec.value.trim() !== ""
        );

        const payload = {
            product_id: selectedProduct.id,
            description: formData.description,
            brand: formData.brand,
            weight: formData.weight,
            dimensions: formData.dimensions,
            color: formData.color,
            warranty: formData.warranty,
            specifications: JSON.stringify(
                Object.fromEntries(validSpecifications.map((s) => [s.key, s.value])),
            ),
        };

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/add-details`,
                payload,
            );

            toast.success(res.data.message || "Product details saved");

            // redirect to product images page
            router.push(`/dashboard/products/product-images`);
        } catch (err) {
            console.log(err);
            toast.error("Error saving product details");
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* ================= SEARCH CARD ================= */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <Search className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle>Search Product</CardTitle>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Find product to add details
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {/* Search Product */}
                        <div className="space-y-2">
                            <Label>Search Product</Label>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />

                                <Input
                                    placeholder="Search product..."
                                    value={searchTerm}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Search Results */}
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
                                            className="w-full text-left px-4 py-3 border-b last:border-b-0 hover:bg-muted transition"
                                        >
                                            <div className="font-medium">{product.name}</div>

                                            <div className="text-sm text-muted-foreground">
                                                ${product.price}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* ================= DETAILS CARD ================= */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <Package className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle>Add Product Details</CardTitle>

                                <p className="text-sm text-muted-foreground mt-1">
                                    Fill product information
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Selected Product */}
                            {selectedProduct && (
                                <div className="border rounded-xl p-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={selectedProduct.image}
                                            alt={selectedProduct.name}
                                            className="w-20 h-20 rounded-xl object-cover border"
                                        />

                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {selectedProduct.name}
                                            </h3>

                                            <p className="text-sm text-muted-foreground">
                                                ${selectedProduct.price}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Details Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Brand</Label>
                                    <Input
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="Enter brand"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Weight</Label>
                                    <Input
                                        name="weight"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        placeholder="Enter weight"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Dimensions</Label>
                                    <Input
                                        name="dimensions"
                                        value={formData.dimensions}
                                        onChange={handleChange}
                                        placeholder="Enter dimensions"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Color</Label>
                                    <Input
                                        name="color"
                                        value={formData.color}
                                        onChange={handleChange}
                                        placeholder="Enter color"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Warranty</Label>
                                    <Input
                                        name="warranty"
                                        value={formData.warranty}
                                        onChange={handleChange}
                                        placeholder="Enter warranty"
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
                                    className="min-h-[120px]"
                                />
                            </div>

                            {/* Specifications */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label>Specifications</Label>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addSpecification}
                                    >
                                        Add Specification
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {specifications.map((spec, index) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-1 md:grid-cols-5 gap-3"
                                        >
                                            <Input
                                                placeholder="Specification Name"
                                                value={spec.key}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleSpecificationChange(
                                                        index,
                                                        "key",
                                                        e.target.value,
                                                    )
                                                }
                                                className="md:col-span-2"
                                            />

                                            <Input
                                                placeholder="Specification Value"
                                                value={spec.value}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    handleSpecificationChange(
                                                        index,
                                                        "value",
                                                        e.target.value,
                                                    )
                                                }
                                                className="md:col-span-2"
                                            />

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => removeSpecification(index)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                {specifications.length === 0 && (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        No specifications added. Click "Add Specification" to add product specs.
                                    </p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="flex justify-end">
                                <Button type="submit">Save Product Details</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AddProductDetails;