"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";

type DealProduct = {
    id: number;
    name: string;
    price: number;
    oldPrice?: number;
    image: string;
    discount?: number;
};

export default function DealCard({ product }: { product: DealProduct }) {
    return (
        <div className="group border rounded-xl overflow-hidden bg-background hover:shadow-lg transition">

            {/* IMAGE */}
            <div className="relative h-44 bg-muted">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                />

                {/* Discount */}
                {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                        -{product.discount}%
                    </Badge>
                )}

                {/* Wishlist */}
                <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white">
                    <Heart size={16} />
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-3 space-y-2">

                <h3 className="text-sm font-medium line-clamp-1">
                    {product.name}
                </h3>

                {/* PRICE */}
                <div className="flex items-center gap-2">
                    <p className="font-bold text-primary">${product.price}</p>
                    {product.oldPrice && (
                        <p className="text-xs line-through text-muted-foreground">
                            ${product.oldPrice}
                        </p>
                    )}
                </div>

                {/* BUTTON */}
                <Button className="w-full mt-2" size="sm">
                    <ShoppingCart size={14} className="mr-2" />
                    Add to Cart
                </Button>
            </div>
        </div>
    );
}