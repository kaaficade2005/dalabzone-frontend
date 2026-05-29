"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import {
    Trash2,
    Plus,
    Minus,
    ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function CartPage() {
    const {
        cart,
        removeFromCart,
        increaseQty,
        decreaseQty,
    } = useCartStore();

    const { token } = useAuthStore();

    const router = useRouter();

    const [loading, setLoading] = useState(false);

    // =========================
    // CALCULATIONS
    // =========================

    // item.total already includes VAT/tax
    const subtotal = cart.reduce(
        (acc, item) => acc + item.total * item.quantity,
        0
    );

    const deliveryFee = 0;

    const total = subtotal + deliveryFee;

    // =========================
    // CHECKOUT
    // =========================

    const handleCheckout = () => {
        setLoading(true);

        setTimeout(() => {
            if (!token) {
                router.push("/login");
                return;
            }

            router.push("/checkout");
        }, 800);
    };

    return (
        <main className="min-h-screen max-w-7xl mx-auto px-4 py-10">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <ShoppingCart className="w-8 h-8" />
                    Your Cart
                </h1>

                <p className="text-muted-foreground mt-1">
                    Review your items before checkout
                </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* ================= LEFT SIDE ================= */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.length === 0 ? (
                        <div className="border rounded-2xl py-20 text-center">
                            <p className="text-muted-foreground">
                                Your cart is empty
                            </p>
                        </div>
                    ) : (
                        cart.map((item) => {
                            // total already includes tax
                            const itemTotal =
                                item.total * item.quantity;

                            return (
                                <div
                                    key={item.id}
                                    className="border rounded-2xl p-4 flex gap-4"
                                >
                                    {/* IMAGE */}
                                    <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                        <Image
                                            src={item.image as string}
                                            alt={item.name as string}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* INFO */}
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h2 className="font-semibold text-lg">
                                                {item.name}
                                            </h2>

                                            <button
                                                onClick={() =>
                                                    removeFromCart(
                                                        item.id
                                                    )
                                                }
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* PRICE */}
                                        <div className="mt-2 space-y-1 text-sm">
                                            <p className="text-muted-foreground">
                                                Price: $
                                                {item.total}
                                            </p>

                                            <p className="text-muted-foreground">
                                                Quantity:{" "}
                                                {item.quantity}
                                            </p>
                                        </div>

                                        {/* QUANTITY */}
                                        <div className="flex items-center gap-3 mt-4">
                                            <button
                                                onClick={() =>
                                                    decreaseQty(
                                                        item.id
                                                    )
                                                }
                                                className="border rounded-md p-2 hover:bg-muted transition"
                                            >
                                                <Minus size={14} />
                                            </button>

                                            <span className="font-medium">
                                                {item.quantity}
                                            </span>

                                            <button
                                                onClick={() =>
                                                    increaseQty(
                                                        item.id
                                                    )
                                                }
                                                className="border rounded-md p-2 hover:bg-muted transition"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* ITEM TOTAL */}
                                    <div className="font-bold text-primary text-lg">
                                        $
                                        {itemTotal.toFixed(2)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div>
                    <div className="border rounded-2xl p-6 bg-white dark:bg-gray-900 sticky top-20">
                        <h2 className="text-xl font-semibold mb-5">
                            Order Summary
                        </h2>

                        <div className="space-y-3">
                            {/* SUBTOTAL */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Subtotal
                                </span>

                                <span>
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>

                            {/* DELIVERY */}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Delivery
                                </span>

                                <span className="text-green-600">
                                    Free
                                </span>
                            </div>

                            <Separator />

                            {/* TOTAL */}
                            <div className="flex justify-between text-lg font-bold">
                                <span>Total</span>

                                <span className="text-primary">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* CHECKOUT BUTTON */}
                        <Button
                            className="w-full mt-6 h-12 text-base"
                            disabled={
                                cart.length === 0 || loading
                            }
                            onClick={handleCheckout}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                                    Redirecting...
                                </div>
                            ) : (
                                "Place Order"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
}