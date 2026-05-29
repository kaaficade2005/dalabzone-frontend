"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import {
    Calendar,
    Edit,
    Home,
    Mail,
    MapPin,
    Phone,
    Plus,
    User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddressComponent from "../_components/AddressComponent";

export default function ProfilePage() {
    const { token, user: storeUser, hasHydrated } = useAuthStore();

    const [user, setUser] = useState<any>(null);
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, Setopen] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {

        if (!hasHydrated) return; // wait for zustand restore

        if (!token) {
            router.push("/");
            return;
        }

    }, [hasHydrated, token, router]);

    useEffect(() => {
        if (!token) return;

        const getProfile = async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                // console.log(res.data)

                if (res.data.success) {
                    setUser(res.data.user);
                    setAddresses(res.data.addresses || []);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.log("Profile error:", err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getProfile();
    }, [token]);

    // useEffect(() => {
    //     // still loading auth state
    //     if (token === undefined) return;

    //     // no user → redirect
    //     if (!token || !storeUser) {
    //         router.push("/");
    //         return;
    //     }

    //     setCheckingAuth(false);
    // }, [token, storeUser, router]);

    if (loading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-100 rounded-full p-4 mx-auto mb-4">
                        <User className="w-12 h-12 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        User Not Found
                    </h2>
                    <p className="text-gray-600">Unable to load profile information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold ">My Profile</h1>
                    <p className=" mt-2">
                        Manage your personal information and addresses
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Info Card - Takes 2/3 of the space */}
                    <div className="lg:col-span-2">
                        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-0">
                                <div className="bg-brand-primary rounded-t-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-white/20 rounded-full p-3 backdrop-blur-sm">
                                                <User className="w-8 h-8 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-white">
                                                    {user.first_name} {user.last_name}
                                                </h2>
                                                <div className="space-x-4">
                                                    <Badge className="mt-1 bg-white/20 text-white hover:bg-white/30 border-0">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        Member since{" "}
                                                        {new Date(user.created_at).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                month: "long",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </Badge>
                                                    <Badge className="mt-1 bg-white/20 text-white hover:bg-white/30 border-0">
                                                        <User className="w-3 h-3 mr-1" />
                                                        Role: {user.role}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-white/80 hover:text-white transition-colors">
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                    Email
                                                </p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider">
                                                    Phone
                                                </p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {user.phone || "Not provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Stats Card - Takes 1/3 of the space */}
                    <div>
                        <Card className="border-0 shadow-sm h-full">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-primary rounded-full mb-4">
                                        <MapPin className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold ">{addresses.length}</h3>
                                    <p className="text-sm">Saved Addresses</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Addresses Section - Full width */}
                    <div className="lg:col-span-3">
                        <Card className="border-0 shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="w-5 h-5 " />
                                        <h2 className="text-xl font-semibold ">Saved Addresses</h2>
                                    </div>
                                    <button
                                        onClick={() => Setopen(true)}
                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Plus className="w-4 h-4 mr-1" />
                                        Add New Address
                                    </button>
                                </div>

                                {open ? (
                                    <AddressComponent />
                                ) : addresses.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="bg-gray-100 rounded-full p-4 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                                            <Home className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 mb-2">No addresses added yet</p>
                                        <p className="text-sm text-gray-400">
                                            Add your first address to make checkout faster
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address: any) => (
                                            <div
                                                key={address.id}
                                                className="border rounded-xl dark:bg-accent-foreground p-4 shadow-sm"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MapPin className="w-4 h-4 text-gray-500" />
                                                    <p className="font-semibold text-gray-900">
                                                        {address.country}, {address.city}
                                                    </p>
                                                </div>

                                                <p className="text-sm text-gray-600">
                                                    {address.address_line}
                                                </p>

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {address.postal_code}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
