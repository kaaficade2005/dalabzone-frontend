"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }) {
    const [liked, setLiked] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [added, setAdded] = useState(false);

    const { addToCart } = useCartStore();

    const handleAddToCart = () => {
        addToCart(product);

        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    // ✅ FIX: use backend field name
    const oldPrice = product.old_price || 0;
    const price = product.price;

    const discountPercent =
        oldPrice > 0 ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

    const savedAmount = oldPrice > 0 ? oldPrice - price : 0;

    const renderStars = (rating = 0) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className={cn(
                            "fill-current",
                            i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300",
                        )}
                    />
                ))}
            </div>
        );
    };

    return (
        <Card
            className="group overflow-hidden hover:shadow-lg transition"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* IMAGE */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
                <Link href={`/product/${product.id}`}>
                    <Image
                        src={product.image} // This will be http://localhost:5000/uploads/...
                        alt={product.name}
                        fill
                        unoptimized // ← ADD THIS LINE
                        loading="eager" // ← Add this (loads immediately)
                        fetchPriority="high" // ← Add this (prioritizes loading)
                        className={cn(
                            "object-cover transition-transform duration-300",
                            isHovered ? "scale-110" : "scale-100",
                        )}
                    />
                </Link>

                {/* Wishlist */}
                {/* <button
                    onClick={() => setLiked(!liked)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow"
                >
                    <Heart
                        size={16}
                        className={cn(
                            liked ? "fill-red-500 text-red-500" : "text-gray-500",
                        )}
                    />
                </button> */}

                {/* Discount badge */}
                {discountPercent > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        -{discountPercent}%
                    </div>
                )}
            </div>

            {/* CONTENT */}
            <CardContent className="pt-4 space-y-2">
                {/* CATEGORY */}
                {product.category_name && (
                    <p className="text-xs uppercase text-muted-foreground">
                        {product.category_name}
                    </p>
                )}

                {/* NAME */}
                <Link href={`/product/${product.id}`}>
                    <h3 className="font-semibold line-clamp-2 hover:text-primary">
                        {product.name}
                    </h3>
                </Link>

                {/* STARS */}
                {renderStars(product.rating)}

                {/* PRICES */}
                <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-lg font-bold text-primary">${product.total}</p>

                    {oldPrice > 0 && (
                        <p className="text-sm line-through text-muted-foreground">
                            ${oldPrice}
                        </p>
                    )}
                </div>

                {/* SAVINGS */}
                {savedAmount > 0 && (
                    <div className="text-xs text-green-600 font-medium">
                        You save ${savedAmount.toFixed(2)} ({discountPercent}% off)
                    </div>
                )}
            </CardContent>

            {/* FOOTER */}
            <CardFooter>
                <Button
                    className={cn(
                        "w-full transition-all",
                        added && "bg-green-600 hover:bg-green-600",
                    )}
                    onClick={handleAddToCart}
                    disabled={added}
                >
                    {added ? (
                        "✓ Added"
                    ) : (
                        <>
                            <ShoppingCart size={16} className="mr-2" />
                            Add to Cart
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
}
