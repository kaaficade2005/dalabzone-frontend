"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Card } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "@/components/ui/badge";

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
    role: string,
    is_verified: number,
    phone: string,
    status: string
}

export default function CustomerPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuthStore()

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/customers/allcustomers`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
                );

                setCustomers(data.customers || data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, [token]);

    return (
        <div className="p-6 md:p-10 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    Customers
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage all registered customers
                </p>
            </div>

            {/* Table Card */}
            <Card className="p-4">
                {loading ? (
                    <p className="text-muted-foreground p-6">
                        Loading customers...
                    </p>
                ) : (
                    <div className="rounded-md border">
                        <Table >
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center">ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Email Status</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {customers.map((customer) => (
                                    <TableRow key={customer.id}>
                                        <TableCell className="text-center">{customer.id}</TableCell>

                                        <TableCell className="font-medium">
                                            {customer.first_name} {customer.last_name}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {customer.email}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {customer.is_verified === 1 ? (
                                                <Badge className="bg-green-700 dark:text-white">Verified</Badge>
                                            ) : (
                                                <Badge className="bg-red-700 dark:text-white">No Verified</Badge>

                                            )}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {customer.phone}
                                        </TableCell>

                                        <TableCell className="text-muted-foreground">
                                            {new Date(
                                                customer.created_at
                                            ).toLocaleDateString()}
                                        </TableCell>

                                        <TableCell >
                                            <Badge className="px-3 py-1 text-xs rounded-full">
                                                {customer.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {customers.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center text-muted-foreground py-6"
                                        >
                                            No customers found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Card>
        </div>
    );
}