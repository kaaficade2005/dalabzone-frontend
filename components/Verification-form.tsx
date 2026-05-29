"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import { useAuthStore } from "@/store/auth-store";

export default function VerificationCodeForm() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingResentcode, setLoadingResentCode] = useState(false);

    const { login, token, isAuthenticated } = useAuthStore();

    const router = useRouter();

    useEffect(() => {
        if (token || isAuthenticated) {
            router.push("/");
        }
    }, [token, isAuthenticated, router]);

    const handleChange = (value: string) => {
        // only allow numbers and max 6 digits
        const numericValue = value.replace(/\D/g, "").slice(0, 6);
        setCode(numericValue);
    };
    const email = useSearchParams().get("email");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/verify-email`,
                {
                    code,
                    email,
                },
            );

            setCode("");
            toast.success(response.data.msg);
            router.push("/login");
        } catch (error) {
            // ✅ better error handling
            if (axios.isAxiosError(error)) {
                const message = error.response?.data?.msg || "Something went wrong";
                toast.error(message);
            } else {
                toast.error("Internal server error");
            }

            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const handleResentCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setLoadingResentCode(true);

        const resendPromise = axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/users/resend-code`,
            { email },
        );

        toast.promise(resendPromise, {
            loading: "Sending code...",
            success: (res) => res.data.msg || "Code sent successfully",
            error: (err) => err?.response?.data?.msg || "Failed to send code",
        });

        try {
            await resendPromise;
        } finally {
            setLoadingResentCode(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-md flex flex-col gap-6"
        >
            {/* Header */}
            <div className="text-center flex flex-col gap-4">
                <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors  items-center gap-1"
                >
                    ← Back to home
                </Link>
                <h1 className="text-3xl font-bold">Verify your account</h1>
                <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code sent to your email or phone
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center">
                <Input
                    value={code}
                    onChange={(e) => handleChange(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="h-12 text-center tracking-widest text-xl"
                    maxLength={6}
                />
            </div>

            {/* Submit */}
            <Button
                type="submit"
                disabled={code.length !== 6 || loading}
                className={cn(
                    "h-12",
                    code.length === 6
                        ? "bg-brand-primary text-white"
                        : "bg-brand-primary/90 cursor-not-allowed",
                )}
            >
                {loading ? (
                    <>
                        <Spinner />
                        Verifying...
                    </>
                ) : (
                    "Verify Code"
                )}
            </Button>

            {/* Resend */}
            <p className="text-center text-sm text-muted-foreground">
                Didn’t receive the code?{" "}
                <button
                    disabled={loadingResentcode}
                    onClick={handleResentCode}
                    type="button"
                    className="text-foreground font-medium hover:underline disabled:opacity-50"
                >
                    {loadingResentcode ? "Sending..." : "Resend"}
                </button>
            </p>
        </form>
    );
}
