"use client";

import Navbar from "@/components/main/Navbar";

import {
    Home,
    ArrowLeft,
    Search,
    AlertCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function NotFound() {

    const router = useRouter();

    const handleBack = () => {
        router.push("/");
    };

    return (
        <>
            {/* Navbar */}
            <Navbar />

            {/* Page */}
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">

                <div className="max-w-2xl mx-auto text-center">

                    {/* 404 */}
                    <div className="relative mb-8">

                        <div className="text-[120px] md:text-[180px] font-bold leading-none tracking-tighter">

                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                4
                            </span>

                            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mx-2">
                                0
                            </span>

                            <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                4
                            </span>

                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-10">

                            <AlertCircle className="w-40 h-40 text-gray-900" />

                        </div>

                    </div>

                    {/* Message */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Page Not Found
                    </h1>

                    <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">

                        <button
                            onClick={handleBack}
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >

                            <ArrowLeft className="w-5 h-5 mr-2" />

                            Go Back

                        </button>

                        <button
                            onClick={() => router.push("/")}
                            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
                        >

                            <Home className="w-5 h-5 mr-2" />

                            Back to Home

                        </button>

                    </div>

                    {/* Helpful Links */}
                    <div className="border-t border-gray-200 pt-8">

                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            You might be looking for:
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                            <button
                                onClick={() => router.push("/shop")}
                                className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Shop
                            </button>

                            <button
                                onClick={() => router.push("/myOrder")}
                                className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                My Orders
                            </button>

                            <button
                                onClick={() => router.push("/contact")}
                                className="px-4 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Support
                            </button>

                        </div>

                    </div>

                    {/* Support */}
                    <div className="mt-8 p-4 bg-blue-50 rounded-lg">

                        <div className="flex items-center justify-center gap-2 text-sm text-blue-800">

                            <Search className="w-4 h-4" />

                            <span>
                                Need help finding something?
                            </span>

                            <button
                                onClick={() => router.push("/contact")}
                                className="font-semibold underline"
                            >
                                Contact Support
                            </button>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}