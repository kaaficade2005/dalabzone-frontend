"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { useAuthStore } from "@/store/auth-store";

/* =========================
   TYPES
========================= */

type OrderStatus =
    | "pending"
    | "processing"
    | "delivered"
    | "completed"
    | "cancelled"
    | "paid";

type Order = {
    id: string | number;
    customer_name?: string;
    total: number | string;
    status?: OrderStatus | string;
};

const AdminOrdersPage = () => {
    const { token } = useAuthStore();

    const [orders, setOrders] = useState<Order[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    /* =========================
       GET ALL ORDERS
    ========================= */

    const getOrders = async () => {
        try {
            setLoading(true);

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

    /* =========================
       UPDATE STATUS
    ========================= */

    const updateStatus = async (orderId: string | number, status: OrderStatus) => {
        try {
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/update-status/${orderId}`,
                { status },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            getOrders();
        } catch (err) {
            console.log(err);
        }
    };

    /* =========================
       BACKEND SEARCH (DEBOUNCED)
    ========================= */

    useEffect(() => {
        const delay = setTimeout(async () => {
            try {
                if (!search.trim()) {
                    getOrders();
                    return;
                }

                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/search?q=${search}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                setOrders(res.data.orders || []);
            } catch (err) {
                console.log(err);
            }
        }, 400);

        return () => clearTimeout(delay);
    }, [search, token]);

    /* =========================
       UI
    ========================= */

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Orders</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* SEARCH */}
                    <div className="mb-4">
                        <Input
                            placeholder="Search orders (ID, customer, email, status)..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* TABLE */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>#{order.id}</TableCell>

                                        <TableCell>{order.customer_name}</TableCell>

                                        <TableCell>${order.total}</TableCell>

                                        <TableCell>{order.status}</TableCell>

                                        <TableCell>
                                            <Select
                                                onValueChange={(value: OrderStatus) =>
                                                    updateStatus(order.id, value)
                                                }
                                                defaultValue={order.status}
                                            >
                                                <SelectTrigger className="w-[160px]">
                                                    <SelectValue placeholder="Change status" />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="completed">Completed</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                    <SelectItem value="paid">Paid</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-6">
                                        No orders found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminOrdersPage;