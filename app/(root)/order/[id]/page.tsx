"use client";

import { useAuthStore } from "@/store/auth-store";

import axios from "axios";

import {
    ArrowLeft,
    CheckCircle,
    Clock,
    Download,
    MapPin,
    Package,
    Truck,
    XCircle,
} from "lucide-react";

import { useRouter, useParams } from "next/navigation";

import { useEffect, useState } from "react";

export default function OrderReceiptPage() {
    const [order, setOrder] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    const { token } = useAuthStore();

    const router = useRouter();

    const params = useParams();

    useEffect(() => {
        if (!token || !params.id) return;

        const getOrder = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${params.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (res.data.success) {
                    setOrder(res.data.order);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        getOrder();
    }, [token, params.id]);

    type OrderStatus =
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "completed"
        | "paid";

    const getOrderStatus = (status: string) => {
        const configs: Record<
            OrderStatus,
            {
                color: string;
                icon: any;
            }
        > = {
            pending: {
                color: "bg-yellow-100 text-yellow-700",
                icon: Clock,
            },
            processing: {
                color: "bg-blue-100 text-blue-700",
                icon: Package,
            },
            shipped: {
                color: "bg-purple-100 text-purple-700",
                icon: Truck,
            },
            delivered: {
                color: "bg-green-100 text-green-700",
                icon: CheckCircle,
            },
            cancelled: {
                color: "bg-red-100 text-red-700",
                icon: XCircle,
            },
            completed: {
                color: "bg-green-100 text-green-700",
                icon: CheckCircle,
            },
            paid: {
                color: "bg-emerald-100 text-emerald-700",
                icon: CheckCircle,
            },
        };

        const key = status?.toLowerCase();

        if (!key || !(key in configs)) {
            return configs.pending;
        }

        return configs[key as OrderStatus];
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Order Not Found</h2>

                    <p className="text-muted-foreground mt-2">
                        The order you are looking for does not exist.
                    </p>
                </div>
            </div>
        );
    }

    const OrderStatus = getOrderStatus(order.status);

    const subtotal = order.items?.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity,
        0,
    );


    const tax = Number(order.tax);

    const total = Number(order.total);

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Top Actions */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => router.push("/myOrder")}
                        className="inline-flex items-center gap-2 text-sm hover:opacity-70"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-2 border px-4 py-2 rounded-xl text-sm hover:bg-muted transition"
                    >
                        <Download className="w-4 h-4" />
                        Download Receipt
                    </button>
                </div>

                {/* Receipt */}
                <div className="border rounded-3xl overflow-hidden bg-background">
                    {/* Header */}
                    <div className="border-b p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h1 className="text-3xl font-bold">Order Receipt</h1>

                            <p className="text-muted-foreground mt-2">
                                Thank you for your purchase
                            </p>
                        </div>

                        <div className="text-left md:text-right">
                            <p className="text-sm text-muted-foreground">Receipt Number</p>

                            <h2 className="text-xl font-semibold mt-1">#{order.id}</h2>

                            <p className="text-sm text-muted-foreground mt-2">
                                {new Date(
                                    order.created_at || order.createdAt,
                                ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="border-b p-8">
                        <div className="flex items-start gap-4">
                            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">
                                    Order Successfully Placed
                                </h2>

                                <p className="text-muted-foreground mt-2">
                                    Your order has been confirmed and is currently{" "}
                                    <span className="font-medium">{order.status}</span>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 border-b">
                        <div>
                            <h3 className="font-semibold mb-4">Customer Information</h3>

                            <div className="space-y-3 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Full Name</p>

                                    <p className="font-medium">{order.full_name || "Customer"}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Phone Number</p>

                                    <p className="font-medium">{order.phone || "N/A"}</p>
                                </div>

                                <div>
                                    <p className="text-muted-foreground">Payment Method</p>

                                    <p className="font-medium capitalize">
                                        {order.payment_method}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-4">Delivery Address</h3>

                            <div className="flex gap-3">
                                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />

                                <div>
                                    <p className="font-medium">{order.address || "No address"}</p>

                                    <p className="text-sm text-muted-foreground mt-1">Somalia</p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${OrderStatus.color}`}
                                >
                                    <OrderStatus.icon className="w-4 h-4" />

                                    {order.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="p-8 border-b">
                        <h2 className="text-xl font-semibold mb-6">Order Items</h2>

                        <div className="space-y-4">
                            {order.items?.map((item: any) => (
                                <div
                                    key={item.id}
                                    className="border rounded-2xl p-4 flex items-center gap-4"
                                >
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-20 rounded-xl object-cover border"
                                        />
                                    )}

                                    <div className="flex-1">
                                        <h3 className="font-semibold">{item.name}</h3>

                                        <p className="text-sm text-muted-foreground mt-1">
                                            Quantity: {item.quantity}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            Price: ${item.price}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-lg font-semibold">
                                            ${(item.quantity * item.price).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Totals */}
                    <div className="p-8 border-b">
                        <div className="max-w-sm ml-auto space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Subtotal</span>

                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Delivery</span>

                                <span className="font-medium">Free</span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Tax</span>

                                <span className="font-medium">${tax}</span>
                            </div>

                            <div className="border-t pt-4 flex items-center justify-between text-xl font-semibold">
                                <span>Total</span>

                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            Thank you for shopping with us.
                        </p>

                        <p className="text-sm text-muted-foreground mt-2">
                            If you have any questions about your order, please contact
                            support.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
