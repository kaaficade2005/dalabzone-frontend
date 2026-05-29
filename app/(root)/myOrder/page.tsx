"use client";

import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import {
    CheckCircle,
    ChevronRight,
    Clock,
    Clock1,
    Eye,
    Package,
    Truck,
    XCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const { token } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!token) return;

        const getOrders = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // console.log("ORDER RESPONSE:", res.data);

                if (res.data.success) {
                    setOrders(res.data.orders);
                } else {
                    setOrders([]);
                }

            } catch (err) {
                console.log("ORDER ERROR:", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        getOrders();
    }, [token]);

    type OrderStatus =
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "completed"
        | "paid";

    const getOrderStatusConfig = (status: string) => {
        const configs: Record<
            OrderStatus,
            {
                color: string;
                icon: any;
                label: string;
            }
        > = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                icon: Clock,
                label: "Pending",
            },
            processing: {
                color: "bg-blue-100 text-blue-800",
                icon: Clock1,
                label: "Processing",
            },
            shipped: {
                color: "bg-purple-100 text-purple-800",
                icon: Truck,
                label: "Shipped",
            },
            delivered: {
                color: "bg-green-100 text-green-800",
                icon: CheckCircle,
                label: "Delivered",
            },
            cancelled: {
                color: "bg-red-100 text-red-800",
                icon: XCircle,
                label: "Cancelled",
            },
            completed: {
                color: "bg-green-600 text-white",
                icon: CheckCircle,
                label: "Completed",
            },
            paid: {
                color: "bg-emerald-100 text-emerald-700",
                icon: CheckCircle,
                label: "Paid",
            },
        };

        const key = status?.toLowerCase();

        if (!key || !(key in configs)) {
            return configs.pending;
        }

        return configs[key as OrderStatus];
    };



    const getFilteredOrders = () => {
        if (filter === "all") return orders;
        if (filter === "paid") return orders.filter(o => o.status?.toLowerCase() === "paid");
        if (filter === "unpaid") return orders.filter(o => o.status?.toLowerCase() === "pending");
        if (filter === "delivered") return orders.filter(o => o.status?.toLowerCase() === "delivered");
        if (filter === "processing") return orders.filter(o => o.status?.toLowerCase() === "processing");
        if (filter === "completed") return orders.filter(o => o.status?.toLowerCase() === "completed");
        return orders;
    };

    const filteredOrders = getFilteredOrders();

    if (loading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold ">My Orders</h1>
                    <p className=" mt-2">Track and manage all your orders</p>
                </div>

                {/* Filters */}
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "all"
                                ? "bg-gray-900 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            All Orders
                        </button>
                        <button
                            onClick={() => setFilter("paid")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "paid"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Paid
                        </button>
                        <button
                            onClick={() => setFilter("unpaid")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "unpaid"
                                ? "bg-orange-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Unpaid
                        </button>
                        <button
                            onClick={() => setFilter("delivered")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "delivered"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Delivered
                        </button>
                        <button
                            onClick={() => setFilter("processing")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "processing"
                                ? "bg-blue-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Processing
                        </button>
                        <button
                            onClick={() => setFilter("completed")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === "completed"
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className=" rounded-xl bg-white shadow-sm border border-gray-200 p-12 text-center">
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 rounded-full p-4 mb-4">
                                <Package className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No orders found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {filter !== "all"
                                    ? `No ${filter} orders available`
                                    : "You haven't placed any orders yet"}
                            </p>
                            <button
                                onClick={() => router.push("/shop")}
                                className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders.map((order) => {
                            const OrderStatus = getOrderStatusConfig(order.status);


                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
                                >
                                    <div className="p-6">
                                        {/* Order Header */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b border-gray-100">
                                            <div>
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <Package className="w-5 h-5 text-gray-400" />
                                                    <p className="text-sm text-gray-500">
                                                        Order #{order.id}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {new Date(order.created_at || order.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 mt-3 sm:mt-0">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${OrderStatus.color}`}>
                                                    <OrderStatus.icon className="w-3 h-3 mr-1" />
                                                    {OrderStatus.label}
                                                </span>

                                            </div>
                                        </div>

                                        {/* Order Summary */}
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Total Amount</p>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    ${order.total}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Items</p>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {order.items?.length || 0} product(s)
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">Payment Method</p>
                                                <p className="text-sm font-medium text-gray-700 ">
                                                    {order.payment_method || "Not specified"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Order Items Preview */}
                                        {order.items && order.items.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Items:</p>
                                                <div className="space-y-2">
                                                    {order.items.slice(0, 2).map((item: any) => (
                                                        <div key={item.id} className="flex items-center gap-3 text-sm">
                                                            {item.image && (
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-10 h-10 object-cover rounded"
                                                                />
                                                            )}
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                                <p className="text-gray-500 text-xs">
                                                                    {item.quantity} × ${item.price}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold text-gray-900">
                                                                ${(item.quantity * item.price).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                    {order.items.length > 2 && (
                                                        <p className="text-xs text-gray-500 pl-13">
                                                            +{order.items.length - 2} more items
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="flex justify-end pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => router.push(`/order/${order.id}`)}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Full Details
                                                <ChevronRight className="w-4 h-4 ml-1" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}