"use client";

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
    Package,
    DollarSign,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
} from "lucide-react";

/* =========================
   TYPES (FIXED)
========================= */

type Order = {
    id: string | number;
    customer_name?: string;
    total: number | string;
    status?: string;
};

const Page = () => {
    const { token } = useAuthStore();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getOrders = async () => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/all-orders`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setOrders(res.data.orders || []);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) getOrders();
    }, [token]);

    // ---------------- STATS ----------------
    const stats = useMemo(() => {
        const totalOrders = orders.length;

        const totalRevenue = orders.reduce(
            (acc, o) => acc + Number(o.total || 0),
            0
        );

        const countByStatus = (status: string) =>
            orders.filter((o) => o.status === status).length;

        return {
            totalOrders,
            totalRevenue,
            pending: countByStatus("pending"),
            processing: countByStatus("processing"),
            delivered: countByStatus("delivered"),
            completed: countByStatus("completed"),
            cancelled: countByStatus("cancelled"),
        };
    }, [orders]);

    const StatCard = ({
        title,
        value,
        icon: Icon,
        color,
    }: {
        title: string;
        value: string | number;
        icon: any;
        color: string;
    }) => (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h2 className="text-xl font-bold">{value}</h2>
                </div>

                <div className={`p-2 rounded-md ${color}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return <div className="p-6">Loading analytics...</div>;
    }

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold">Orders Analytics</h1>
                <p className="text-muted-foreground">
                    Overview of all orders performance
                </p>
            </div>

            {/* STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon={Package}
                    color="bg-blue-100 text-blue-700"
                />

                <StatCard
                    title="Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    icon={DollarSign}
                    color="bg-green-100 text-green-700"
                />

                <StatCard
                    title="Pending"
                    value={stats.pending}
                    icon={Clock}
                    color="bg-yellow-100 text-yellow-700"
                />

                <StatCard
                    title="Processing"
                    value={stats.processing}
                    icon={Truck}
                    color="bg-blue-100 text-blue-700"
                />

                <StatCard
                    title="Delivered"
                    value={stats.delivered}
                    icon={Package}
                    color="bg-indigo-100 text-indigo-700"
                />

                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="bg-green-100 text-green-700"
                />

                <StatCard
                    title="Cancelled"
                    value={stats.cancelled}
                    icon={XCircle}
                    color="bg-red-100 text-red-700"
                />
            </div>

            {/* RECENT ORDERS */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="space-y-3">
                        {orders.slice(0, 5).map((order) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between border p-3 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium">
                                        #{order.id} - {order.customer_name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        ${order.total}
                                    </p>
                                </div>

                                <Badge>{order.status}</Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
};

export default Page;