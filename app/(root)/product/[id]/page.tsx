"use client";

import { useCartStore } from "@/store/cart-store";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
    ChevronRight,
    Heart,
    Minus,
    Plus,
    Share2,
    Shield,
    ShoppingCart,
    Star,
    Truck
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function ProductDetailsPage() {
    const { id } = useParams();

    const [product, setProduct] = useState<any>(null);
    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addingId, setAddingId] = useState<number | null>(null);

    const { addToCart } = useCartStore();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`,
                );

                // console.log(res.data);

                if (res.data.status) {
                    setProduct(res.data.product);
                    setImages(res.data.images || []);
                }
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = (product: any) => {
        setAddingId(product.id);

        addToCart({
            ...product,
            quantity,
        });

        setTimeout(() => setAddingId(null), 300);
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!product)
        return <div className="p-10 text-center">Product not found</div>;

    const rating = Number(product.rating || 0);
    const showOldPrice = Number(product.old_price) > 0;
    const showDiscount = Number(product.discount) > 0;

    const mainImage = images?.[selectedImage]?.image_url || "/placeholder.png";

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: `${window.location.origin}/products/${product.id}`,
        };


        try {
            // mobile + supported browsers
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // fallback copy link
                await navigator.clipboard.writeText(shareData.url);
                alert("Product link copied!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="min-h-screen ">
            {/* Breadcrumb */}
            <div className="border-b bg-muted/90">
                <div className="max-w-6xl mx-auto px-4 py-3 text-sm flex items-center gap-2">
                    <Link href="/">Home</Link>
                    <ChevronRight size={14} />
                    <Link href="/shop">Shop</Link>
                    <ChevronRight size={14} />
                    <span className="text-muted-foreground">{product.name}</span>
                </div>
            </div>

            {/* MAIN */}
            <div className="max-w-6xl mx-auto px-4 py-10 grid lg:grid-cols-2 gap-10 ">
                {/* IMAGES */}
                <div className="space-y-4">
                    <div className="relative aspect-square rounded-2xl overflow-hidden border bg-muted">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </div>

                    {/* THUMBNAILS */}
                    {images.length > 0 && (
                        <div className="flex gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedImage(i)}
                                    className={cn(
                                        "relative w-20 h-20 rounded-lg overflow-hidden border",
                                        selectedImage === i && "ring-2 ring-primary",
                                    )}
                                >
                                    <Image
                                        src={img.image_url}
                                        alt="thumb"
                                        fill
                                        unoptimized // ← ADD THIS LINE
                                        loading="eager" // ← Add this (loads immediately)
                                        fetchPriority="high"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="space-y-6 lg:sticky lg:top-24">
                    <h1 className="text-3xl font-bold">{product.name}</h1>

                    {/* CONDITION */}
                    {product.condition && (
                        <div className="flex justify-between p-4">
                            <span className="font-medium">Condition</span>

                            <Badge
                                className={`px-2 py-1 text-xs font-medium rounded-full border`}
                            >
                                {product.productCondition || "Unknown"}
                            </Badge>
                        </div>
                    )}
                    {/* rating */}
                    <div className="flex items-center gap-2 text-yellow-500">
                        <Star size={16} />
                        <span className="text-sm">{rating}</span>
                    </div>

                    {/* price */}
                    <div className="flex items-center gap-3">
                        <p className="text-3xl font-bold text-primary">${product.total}</p>

                        {showOldPrice && (
                            <p className="line-through text-muted-foreground">
                                ${product.old_price}
                            </p>
                        )}

                        {showDiscount && (
                            <Badge className="bg-red-500">Save {product.discount_percentage}%</Badge>
                        )}
                    </div>

                    {/* COLOR */}
                    {product.color && (
                        <div className="flex items-center justify-between">
                            <Label>Color</Label>
                            <div className="flex gap-2 mt-2">
                                <Badge
                                    className={cn(
                                        "px-3 py-1 border rounded-md text-sm mt-1",
                                    )}
                                >
                                    {product.color}
                                </Badge>
                            </div>
                        </div>
                    )}

                    {/* quantity */}
                    <div className="flex items-center gap-3">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                            <Minus size={16} />
                        </Button>

                        <span className="w-8 text-center">{quantity}</span>

                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setQuantity((q) => q + 1)}
                        >
                            <Plus size={16} />
                        </Button>
                    </div>

                    {/* actions */}
                    <div className="flex gap-3">
                        <Button
                            className="flex-1 h-12"
                            onClick={() => handleAddToCart(product)}
                            disabled={addingId === product.id}
                        >
                            <ShoppingCart className="mr-2" size={16} />
                            {addingId === product.id ? "Adding..." : "Add to Cart"}
                        </Button>

                        <Button variant="outline" size="icon" className="h-12 w-12">
                            <Heart />
                        </Button>

                        <Button onClick={handleShare} variant="outline" size="icon" className="h-12 w-12">
                            <Share2 />
                        </Button>
                    </div>

                    {/* features */}
                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground border-t pt-5">
                        <div className="flex items-center gap-2">
                            <Truck size={14} /> Free
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={14} /> Secure Payment
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield size={14} /> Safe
                        </div>
                    </div>
                </div>
            </div>

            {/* DESCRIPTION */}
            {/* DESCRIPTION + DETAILS */}
            <div className="max-w-6xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-10">
                {/* DESCRIPTION */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Description</h2>

                    <p className="text-muted-foreground leading-relaxed">
                        {product.description}
                    </p>
                </div>

                {/* PRODUCT DETAILS */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Product Details</h2>

                    <div className="border rounded-2xl overflow-hidden">
                        <div className="divide-y">
                            {/* BRAND */}
                            {product.brand && (
                                <div className="flex justify-between p-4">
                                    <span className="font-medium">Brand</span>
                                    <span className="text-muted-foreground">{product.brand}</span>
                                </div>
                            )}

                            {/* WEIGHT */}
                            {product.weight && (
                                <div className="flex justify-between p-4">
                                    <span className="font-medium">Weight</span>
                                    <span className="text-muted-foreground">
                                        {product.weight}
                                    </span>
                                </div>
                            )}

                            {/* DIMENSIONS */}
                            {product.dimensions && (
                                <div className="flex justify-between p-4">
                                    <span className="font-medium">Dimensions</span>
                                    <span className="text-muted-foreground">
                                        {product.dimensions}
                                    </span>
                                </div>
                            )}

                            {/* COLOR */}
                            {product.color && (
                                <div className="flex justify-between p-4">
                                    <span className="font-medium">Color</span>
                                    <span className="text-muted-foreground">{product.color}</span>
                                </div>
                            )}

                            {/* WARRANTY */}
                            {product.warranty && (
                                <div className="flex justify-between p-4">
                                    <span className="font-medium">Warranty</span>
                                    <span className="text-muted-foreground">
                                        {product.warranty}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SPECIFICATIONS */}
                    {product.specifications && (
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Specifications</h3>

                            <div className="border rounded-2xl overflow-hidden">
                                <div className="divide-y">
                                    {Object.entries(
                                        typeof product.specifications === "string"
                                            ? JSON.parse(product.specifications)
                                            : product.specifications,
                                    ).map(([key, value]: any) => (
                                        <div key={key} className="flex justify-between p-4 gap-4">
                                            <span className="font-medium capitalize">
                                                {key.replace(/_/g, " ")}
                                            </span>

                                            <span className="text-muted-foreground text-right">
                                                {Array.isArray(value) ? value.join(", ") : value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
