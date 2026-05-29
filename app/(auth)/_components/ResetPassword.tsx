"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    // 🔐 token from email link
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newPassword || !confirmPassword) {
            toast.error("Please fill all fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!token) {
            toast.error("Invalid reset link");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/reset-password`,
                {
                    token,
                    newPassword,
                }
            );

            toast.success(res.data.msg || "Password reset successful");

            // 👉 redirect to login
            router.push("/login");

        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.msg || "Reset failed");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md flex flex-col gap-6">

            {/* Header */}
            <div className="space-y-4">
                <Link
                    href="/login"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to login
                </Link>

                <h1 className="text-3xl font-bold">Reset Password</h1>

                <p className="text-sm text-muted-foreground">
                    Enter your new password below
                </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">

                <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12"
                />

                <Input
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12"
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary text-white h-12"
                >
                    {loading ? "Updating..." : "Reset Password"}
                </Button>
            </form>
        </div>
    );
}