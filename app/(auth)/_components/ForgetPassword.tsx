"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error("Please enter your email");
            return;
        }

        try {
            setLoading(true);

            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/forgot-password`,
                { email },
            );

            toast.success(res.data.msg || "Reset code sent to email");
            // 👉 go to code verification page
            // router.push(`/reset-password/verify?email=${email}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.msg || "Failed to send email");
            } else {
                toast.error("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md  flex flex-col gap-6">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-foreground "
                    >
                        ← Back to login
                    </Link>
                </div>

                <h1 className="text-3xl font-bold">Forgot Password</h1>

                <p className="text-sm text-muted-foreground">
                    Enter your email and we’ll send you a reset code
                </p>
            </div>

            {/* Email Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12"
                />

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-primary text-white h-12"
                >
                    {loading ? "Sending..." : "Send Reset Code"}
                </Button>
            </form>
        </div>
    );
}
