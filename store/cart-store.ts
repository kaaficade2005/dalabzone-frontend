import { create } from "zustand";
import { persist } from "zustand/middleware";

/* =========================
   1. TYPES
========================= */

export type CartItem = {
    id: string | number;
    name?: string;
    price: number;
    quantity: number;
    image?: string;
    total: number
};

type CartStore = {
    cart: CartItem[];

    addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
    removeFromCart: (id: string | number) => void;
    clearCart: () => void;
    increaseQty: (id: string | number) => void;
    decreaseQty: (id: string | number) => void;

    getTotalPrice: () => number;
    getCartCount: () => number;
};

/* =========================
   2. STORE
========================= */

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: [],

            // ➕ Add to cart
            addToCart: (item) => {
                const existing = get().cart.find((p) => p.id === item.id);
                const qtyToAdd = item.quantity ?? 1;

                if (existing) {
                    set({
                        cart: get().cart.map((p) =>
                            p.id === item.id
                                ? { ...p, quantity: p.quantity + qtyToAdd }
                                : p
                        ),
                    });
                } else {
                    set({
                        cart: [
                            ...get().cart,
                            { ...item, quantity: qtyToAdd },
                        ],
                    });
                }
            },

            // ❌ Remove item
            removeFromCart: (id) => {
                set({
                    cart: get().cart.filter((item) => item.id !== id),
                });
            },

            // 🧹 Clear cart
            clearCart: () => set({ cart: [] }),

            // ⬆️ Increase quantity
            increaseQty: (id) => {
                set({
                    cart: get().cart.map((item) =>
                        item.id === id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                });
            },

            // ⬇️ Decrease quantity
            decreaseQty: (id) => {
                set({
                    cart: get()
                        .cart.map((item) =>
                            item.id === id
                                ? { ...item, quantity: item.quantity - 1 }
                                : item
                        )
                        .filter((item) => item.quantity > 0),
                });
            },

            // 🧮 TOTAL PRICE
            getTotalPrice: () => {
                return get().cart.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            },

            // 🔢 CART COUNT
            getCartCount: () => {
                return get().cart.reduce(
                    (count, item) => count + item.quantity,
                    0
                );
            },
        }),
        {
            name: "cart-storage",
        }
    )
);