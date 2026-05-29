"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Search, Package, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface ProductDetails {
    description: string;
    brand: string;
    weight: string;
    dimensions: string;
    color: string;
    warranty: string;
    specifications?: string | Record<string, unknown>;
}

interface Specification {
    key: string;
    value: string;
}

interface FormDataType {
    description: string;
    brand: string;
    weight: string;
    dimensions: string;
    color: string;
    warranty: string;
}

const UpdateProductDetails = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [fetchingDetails, setFetchingDetails] = useState<boolean>(false);

    const router = useRouter();
    const params = useParams();
    const productId = params.id;

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

    // Get Products for search
    const getProducts = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/get-products`,
            );
            const data = response.data.products || [];
            setProducts(data);
        } catch (error) {
            console.log(error);
        }
    };

    // Fetch existing product details
    const fetchProductDetails = async (id: number) => {
        try {
            setFetchingDetails(true);
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-details/${id}`,
            );

            const details = response.data.details || response.data.data || {};

            setFormData({
                description: details.description || "",
                brand: details.brand || "",
                weight: details.weight || "",
                dimensions: details.dimensions || "",
                color: details.color || "",
                warranty: details.warranty || "",
            });

            // Parse specifications if they exist
            if (details.specifications) {
                let parsedSpecs = details.specifications;
                if (typeof details.specifications === 'string') {
                    try {
                        parsedSpecs = JSON.parse(details.specifications);
                    } catch (e) {
                        parsedSpecs = {};
                    }
                }

                const specsArray: Specification[] = Object.entries(parsedSpecs).map(([key, value]) => ({
                    key: key,
                    value: String(value),
                }));

                if (specsArray.length > 0) {
                    setSpecifications(specsArray);
                }
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch product details");
        } finally {
            setFetchingDetails(false);
        }
    };

    // Get product by ID when component loads with ID param
    const getProductById = async (id: string | string[] | number) => {
        try {
            // Convert id to string if it's an array (take first element)
            const productIdValue = Array.isArray(id) ? id[0] : id;

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productIdValue}`,
            );
            const product = response.data.product || response.data.data;

            if (product) {
                setSelectedProduct(product);
                setSearchTerm(product.name);
                // Fetch details after selecting product
                await fetchProductDetails(Number(productIdValue));
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch product");
        }
    };

    useEffect(() => {
        getProducts();

        // If productId is provided in URL, fetch that product
        if (productId) {
            getProductById(productId);
        }
    }, [productId]);

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
        }, 400);

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

    // Submit Update
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
                Object.fromEntries(validSpecifications.map((s) => [s.key, s.value]))
            ),
        };

        try {
            setLoading(true);
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/update-details/${selectedProduct.id}`,
                payload,
            );

            toast.success(res.data.message || "Product details updated successfully");

            // Optional: Redirect back to product list or details page
            router.push("/dashboard/products/all-products");

        } catch (err) {
            console.log(err);
            toast.error("Error updating product details");
        } finally {
            setLoading(false);
        }
    };

    if (fetchingDetails) {
        return (
            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
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
            <div className="max-w-5xl mx-auto space-y-6">
                {/* ================= SEARCH CARD ================= */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard/products">
                                    <Button variant="outline" size="icon" className="rounded-xl">
                                        <ArrowLeft className="w-5 h-5" />
                                    </Button>
                                </Link>
                                <div className="p-2 border rounded-xl">
                                    <Search className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle>Search Product</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Find product to update details
                                    </p>
                                </div>
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
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                                            onClick={async () => {
                                                setSelectedProduct(product);
                                                setSearchTerm(product.name);
                                                setFilteredProducts([]);
                                                await fetchProductDetails(product.id);
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
                                <CardTitle>Update Product Details</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Edit product information
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
                                        placeholder="Enter weight (e.g., 1.5kg)"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Dimensions</Label>
                                    <Input
                                        name="dimensions"
                                        value={formData.dimensions}
                                        onChange={handleChange}
                                        placeholder="Enter dimensions (e.g., 10x20x30 cm)"
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
                                        placeholder="Enter warranty (e.g., 1 year)"
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
                                            className="grid grid-cols-1 md:grid-cols-5 gap-3 items-start"
                                        >
                                            <Input
                                                placeholder="Specification Name"
                                                value={spec.key}
                                                onChange={(e) =>
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
                                                onChange={(e) =>
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
                                    {loading ? "Updating..." : "Update Product Details"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UpdateProductDetails;