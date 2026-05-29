"use client";

import ProductCard from "../products/ProductCard";
import DealCard from "./DealCard";

const deals = [
    {
        id: 1,
        name: "iPhone 15 Pro Max",
        price: 1099,
        oldPrice: 1299,
        image:
            "https://images.unsplash.com/photo-1696446702381-6b1c0c8b0d0f?auto=format&fit=crop&w=800&q=80",
        discount: 15,
    },
    {
        id: 2,
        name: "Samsung Galaxy S24 Ultra",
        price: 999,
        oldPrice: 1199,
        image:
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
        discount: 18,
    },
    {
        id: 3,
        name: "MacBook Pro M3",
        price: 1999,
        oldPrice: 2299,
        image:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
        discount: 12,
    },
    {
        id: 4,
        name: "AirPods Pro 2",
        price: 219,
        oldPrice: 279,
        image:
            "https://images.unsplash.com/photo-1600294037681-c80b4cb5b3f1?auto=format&fit=crop&w=800&q=80",
        discount: 20,
    },
];

export default function DealsSection() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">

            {/* HEADER */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">🔥 Hot Deals</h2>
                    <p className="text-muted-foreground text-sm">
                        Limited time offers — don’t miss out
                    </p>
                </div>

                <button className="text-sm text-primary hover:underline">
                    View All
                </button>
            </div>

            {/* GRID */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {deals.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}