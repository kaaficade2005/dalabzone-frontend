"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { ImagePlus, Upload, X, Pencil } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useParams } from "next/navigation";
import { toast } from "sonner";

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    image?: string;
}

interface ProductImage {
    id: number;
    image_url: string;
    is_main: number;
}

const UpdateProductImages = () => {
    const { token } = useAuthStore();
    const params = useParams();
    const productId = params.id;

    const [product, setProduct] = useState<Product | null>(null);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [updatingImageId, setUpdatingImageId] = useState<number | null>(null);

    // FETCH PRODUCT AND EXISTING IMAGES
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setFetching(true);

                // Fetch product details
                const productRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
                );
                const productData = productRes.data.product || productRes.data.data;
                setProduct(productData);

                // Fetch existing images
                const imagesRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-images/${productId}`
                );
                setExistingImages(imagesRes.data.images || []);

            } catch (error) {
                console.log(error);
                toast.error("Failed to fetch product data");
            } finally {
                setFetching(false);
            }
        };

        if (productId) {
            fetchProductData();
        }
    }, [productId]);

    // HANDLE NEW IMAGES
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setNewImages((prev) => [...prev, ...files]);
    };

    const removeNewImage = (index: number) => {
        const updated = [...newImages];
        updated.splice(index, 1);
        setNewImages(updated);
    };

    // DELETE EXISTING IMAGE
    const removeExistingImage = async (imageId: number) => {
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/delete-image/${imageId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExistingImages(prev => prev.filter(img => img.id !== imageId));
            toast.success("Image deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete image");
        }
    };

    // UPDATE SINGLE IMAGE (replace)
    const updateSingleImage = async (imageId: number, file: File) => {
        try {
            setUpdatingImageId(imageId);

            const formData = new FormData();
            formData.append("image", file);
            formData.append("_method", "PUT");

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/update-images/${imageId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            // Update the image URL in the existing images list
            setExistingImages(prev => prev.map(img =>
                img.id === imageId
                    ? { ...img, image_url: URL.createObjectURL(file) }
                    : img
            ));

            toast.success("Image updated successfully");

            // Refresh images to get the actual URL from server
            setTimeout(async () => {
                const imagesRes = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-images/${productId}`
                );
                setExistingImages(imagesRes.data.images || []);
            }, 1000);

        } catch (error) {
            console.log(error);
            toast.error("Failed to update image");
        } finally {
            setUpdatingImageId(null);
        }
    };

    const handleImageUpdateClick = (imageId: number) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                updateSingleImage(imageId, file);
            }
        };
        fileInput.click();
    };

    // ADD NEW IMAGES TO EXISTING (append)
    const handleAddNewImages = async () => {
        if (!product) {
            return toast.error("Product not found");
        }

        if (newImages.length === 0) {
            return toast.error("Please select images to add");
        }

        try {
            setLoading(true);

            const formData = new FormData();
            newImages.forEach((image) => {
                formData.append("images", image);
            });

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/add-images/${product.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(res.data.message || "Images added successfully");

            // Refresh existing images
            const imagesRes = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-images/${product.id}`
            );
            setExistingImages(imagesRes.data.images || []);

            // Clear new images
            setNewImages([]);

        } catch (error) {
            console.log(error);
            toast.error("Failed to add images");
        } finally {
            setLoading(false);
        }
    };

    // REPLACE ALL IMAGES (old behavior)
    const handleReplaceAllImages = async () => {
        if (!product) {
            return toast.error("Product not found");
        }

        if (newImages.length === 0) {
            return toast.error("Please select images to replace");
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("_method", "PUT");

            newImages.forEach((image) => {
                formData.append("images", image);
            });

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/update-images/${product.id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success(res.data.message || "Images replaced successfully");

            // Refresh existing images
            const imagesRes = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-images/${product.id}`
            );
            setExistingImages(imagesRes.data.images || []);

            // Clear new images
            setNewImages([]);

        } catch (error) {
            console.log(error);
            toast.error("Failed to replace images");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <Card>
                        <CardContent className="py-12">
                            <div className="flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                                    <p className="mt-4 text-muted-foreground">Loading product images...</p>
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

                {/* PRODUCT INFO CARD */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 border rounded-xl">
                                <ImagePlus className="w-5 h-5" />
                            </div>

                            <div>
                                <CardTitle>Manage Product Images</CardTitle>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Manage images for: {product?.name}
                                </p>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form className="space-y-6">

                            {/* EXISTING IMAGES */}
                            {existingImages.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Current Images ({existingImages.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {existingImages.map((img) => (
                                            <div key={img.id} className="relative group">
                                                <img
                                                    src={img.image_url}
                                                    alt="Product"
                                                    className="w-full h-40 object-cover rounded-xl border"
                                                />
                                                {img.is_main === 1 && (
                                                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                        Main
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageUpdateClick(img.id)}
                                                        disabled={updatingImageId === img.id}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition"
                                                    >
                                                        {updatingImageId === img.id ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            <Pencil size={16} />
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeExistingImage(img.id)}
                                                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        * Hover over image to edit or delete
                                    </p>
                                </div>
                            )}

                            {/* UPLOAD INPUT FOR NEW IMAGES */}
                            <div className="space-y-3">
                                <Label>Add New Images</Label>
                                <label className="border rounded-xl border-dashed min-h-[180px] flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition">
                                    <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                                    <p>Click to upload new images</p>
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

                            {/* PREVIEW OF NEW IMAGES */}
                            {newImages.length > 0 && (
                                <div className="space-y-3">
                                    <Label>New Images to Add ({newImages.length})</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {newImages.map((img, i) => (
                                            <div key={i} className="relative">
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    className="w-full h-40 object-cover rounded-xl"
                                                    alt={`Preview ${i + 1}`}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewImage(i)}
                                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full transition"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ACTION BUTTONS */}
                            <div className="flex justify-end gap-3">
                                {newImages.length > 0 && (
                                    <>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleAddNewImages}
                                            disabled={loading}
                                        >
                                            {loading ? "Adding..." : "Add More Images"}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="default"
                                            onClick={handleReplaceAllImages}
                                            disabled={loading}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {loading ? "Replacing..." : "Replace All Images"}
                                        </Button>
                                    </>
                                )}

                                {newImages.length === 0 && existingImages.length === 0 && (
                                    <Button
                                        type="button"
                                        onClick={handleAddNewImages}
                                        disabled={loading}
                                    >
                                        {loading ? "Uploading..." : "Upload Images"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UpdateProductImages;