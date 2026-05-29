"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import {
    Calendar,
    DollarSign,
    Eye,
    Package,
    RefreshCw,
    ShoppingBag,
    User
} from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

/* =========================
   TYPES (FIXED)
========================= */

type Order = {
    id: string | number;
    customer_name?: string;
    customer_email?: string;
    total: number | string;
    items?: any[];
    status?: string;
    created_at?: string;
};

const Page = () => {
    const { token } = useAuthStore();

    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

    const router = useRouter();

    const getOrders = async () => {
        setLoading(true);

        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/all-orders`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data: Order[] = res.data.orders || [];
            setOrders(data);
            setFilteredOrders(data);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) getOrders();
    }, [token]);

    // SEARCH
    useEffect(() => {
        const filtered = orders.filter((order) =>
            order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(order.id).includes(searchTerm) ||
            order.status?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setFilteredOrders(filtered);
    }, [searchTerm, orders]);

    // STATUS BADGE (FIXED TYPES)
    const getStatusBadge = (status?: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
            case "processing":
                return <Badge className="bg-blue-100 text-blue-700">Processing</Badge>;
            case "completed":
                return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
            case "delivered":
                return <Badge className="bg-emerald-100 text-emerald-700">Delivered</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
            default:
                return <Badge variant="secondary">{status ?? "unknown"}</Badge>;
        }
    };

    return (
        <div className="p-4 md:p-8">
            <div className="w-full space-y-6">

                {/* HEADER */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        <h1 className="text-xl font-semibold">All Orders</h1>
                    </div>

                    <Button onClick={getOrders} variant="outline" disabled={loading}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* SEARCH */}
                <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* TABLE */}
                <Card>
                    <CardHeader>
                        <CardTitle>Orders</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell>#{order.id}</TableCell>

                                                <TableCell className="flex items-center gap-2">
                                                    <User className="w-4 h-4" />
                                                    {order.customer_name}
                                                </TableCell>

                                                <TableCell>
                                                    {order.customer_email}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <DollarSign className="w-4 h-4" />
                                                        {Number(order.total).toFixed(2)}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Package className="w-4 h-4" />
                                                        {order.items?.length || 0}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    {getStatusBadge(order.status)}
                                                </TableCell>

                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {order.created_at
                                                            ? new Date(order.created_at).toLocaleDateString()
                                                            : "N/A"}
                                                    </div>
                                                </TableCell>

                                                <TableCell>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={() => router.push(`/order/${order.id}`)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10">
                                                No orders found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

            </div>
        </div>
    );
};

export default Page;