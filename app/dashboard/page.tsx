"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  ShoppingCart,
  Users,
  DollarSign,
  Package,
  User,
  Folder,
  CalendarDays,
} from "lucide-react";

/* =========================
   TYPES FIX
========================= */

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string | number;
  total: number | string;
  status?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  items?: OrderItem[];
};

type Daily = {
  date: string;
  orders: number;
  revenue: number;
};

type DashboardStats = {
  stats: {
    orders: number;
    users: number;
    revenue: number;
    products: number;
    customers: number;
    categories: number;
  };
  daily?: Daily[];
  recentOrders?: Order[];
};

const DashboardPage = () => {
  const { token } = useAuthStore();

  const [stats, setStats] = useState<DashboardStats | null>(null);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) fetchStats();
  }, [token]);

  if (!stats) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  const s = stats.stats;

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
      <CardContent className="flex items-center justify-between p-4">
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

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-indigo-100 text-indigo-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Full system analytics overview
        </p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">

        <StatCard title="Orders" value={s.orders} icon={ShoppingCart} color="bg-blue-100 text-blue-700" />
        <StatCard title="Users" value={s.users} icon={Users} color="bg-purple-100 text-purple-700" />
        <StatCard title="Revenue" value={`$${s.revenue}`} icon={DollarSign} color="bg-green-100 text-green-700" />
        <StatCard title="Products" value={s.products} icon={Package} color="bg-indigo-100 text-indigo-700" />
        <StatCard title="Customers" value={s.customers} icon={User} color="bg-orange-100 text-orange-700" />
        <StatCard title="Categories" value={s.categories} icon={Folder} color="bg-pink-100 text-pink-700" />

      </div>

      {/* DAILY ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Activity</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stats.daily?.map((day: Daily, i: number) => (
                <TableRow key={i}>
                  <TableCell className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                    {day.date}
                  </TableCell>

                  <TableCell>
                    <Badge>{day.orders}</Badge>
                  </TableCell>

                  <TableCell>
                    ${day.revenue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* RECENT ORDERS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Products</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stats.recentOrders?.map((order: Order) => (
                <TableRow key={order.id}>

                  <TableCell>#{order.id}</TableCell>

                  <TableCell>{order.user?.name}</TableCell>

                  <TableCell>
                    <div className="text-sm">
                      <p>{order.user?.email}</p>
                      <p className="text-muted-foreground">{order.user?.phone}</p>
                    </div>
                  </TableCell>

                  <TableCell>${order.total}</TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="text-xs space-y-1">
                      {order.items?.slice(0, 2).map((item: OrderItem, i: number) => (
                        <p key={i}>
                          {item.name} x{item.quantity}
                        </p>
                      ))}
                      {order.items && order.items.length > 2 && (
                        <p className="text-muted-foreground">
                          +{order.items.length - 2} more
                        </p>
                      )}
                    </div>
                  </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardPage;