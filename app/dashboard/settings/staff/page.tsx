"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth-store";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

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
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Mail,
    Phone,
    Shield,
    Users,
} from "lucide-react";

const UsersPage = () => {

    const { token } = useAuthStore();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setsearching] = useState("");

    const fetchUsers = async () => {
        try {

            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users/staff`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        search
                    }
                }
            );



            setUsers(res.data.users);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token, search]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <p className="text-muted-foreground">
                    Loading users...
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-3 md:p-6">

            {/* HEADER */}
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                        Users
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground">
                        Manage all registered users
                    </p>
                </div>

                <Card className="w-full sm:w-72 lg:w-48">
                    <CardContent className="p-4 flex items-center gap-4">

                        <div className="p-3 rounded-full bg-blue-100">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total Users
                            </p>

                            <h2 className="text-2xl font-bold">
                                {users.length}
                            </h2>
                        </div>

                    </CardContent>
                </Card>

            </div>

            {/* USERS TABLE */}
            <Card>

                <CardHeader>

                    <CardTitle className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                        <span className="text-lg">
                            Users List
                        </span>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">

                            <Label
                                htmlFor="searching"
                                className="whitespace-nowrap"
                            >
                                Searching
                            </Label>

                            <Input
                                type="text"
                                id="searching"
                                value={search}
                                onChange={(e) => setsearching(e.target.value)}
                                className="w-full sm:w-72"
                                placeholder="email or username"
                            />

                        </div>

                    </CardTitle>

                </CardHeader>

                <CardContent>

                    {/* RESPONSIVE TABLE */}
                    <div className="w-full overflow-x-auto">

                        <Table className="min-w-[700px]">

                            <TableHeader>

                                <TableRow>

                                    <TableHead>
                                        User
                                    </TableHead>

                                    <TableHead>
                                        Email
                                    </TableHead>

                                    <TableHead>
                                        Phone
                                    </TableHead>

                                    <TableHead>
                                        Role
                                    </TableHead>

                                    <TableHead>
                                        Joined
                                    </TableHead>

                                </TableRow>

                            </TableHeader>

                            <TableBody>

                                {users.length > 0 ? (
                                    users.map((user: any) => (

                                        <TableRow key={user.id}>

                                            {/* USER */}
                                            <TableCell>

                                                <div className="flex items-center gap-3">

                                                    <Avatar>
                                                        <AvatarFallback>
                                                            {user.first_name?.charAt(0)}
                                                        </AvatarFallback>
                                                    </Avatar>

                                                    <div>
                                                        <p className="font-medium whitespace-nowrap">
                                                            {user.first_name} {user.last_name}
                                                        </p>

                                                        <p className="text-sm text-muted-foreground">
                                                            ID: {user.id}
                                                        </p>
                                                    </div>

                                                </div>

                                            </TableCell>

                                            {/* EMAIL */}
                                            <TableCell>

                                                <div className="flex items-center gap-2 min-w-[220px]">

                                                    <Mail className="w-4 h-4 text-muted-foreground" />

                                                    <span className="truncate">
                                                        {user.email}
                                                    </span>

                                                </div>

                                            </TableCell>

                                            {/* PHONE */}
                                            <TableCell>

                                                <div className="flex items-center gap-2 whitespace-nowrap">

                                                    <Phone className="w-4 h-4 text-muted-foreground" />

                                                    {user.phone || "N/A"}

                                                </div>

                                            </TableCell>

                                            {/* ROLE */}
                                            <TableCell>

                                                <Badge
                                                    variant={
                                                        user.role === "admin"
                                                            ? "destructive"
                                                            : "secondary"
                                                    }
                                                    className="capitalize whitespace-nowrap"
                                                >
                                                    <Shield className="w-3 h-3 mr-1" />

                                                    {user.role}

                                                </Badge>

                                            </TableCell>

                                            {/* DATE */}
                                            <TableCell className="whitespace-nowrap">

                                                {new Date(
                                                    user.created_at
                                                ).toLocaleDateString()}

                                            </TableCell>

                                        </TableRow>

                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-10 text-muted-foreground"
                                        >
                                            No users found
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>

                        </Table>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
};

export default UsersPage;