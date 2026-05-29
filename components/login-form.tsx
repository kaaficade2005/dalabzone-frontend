"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [loading, setLoading] = useState(false);
  const { login, token, isAuthenticated } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (token || isAuthenticated) {
      router.push("/");
    }
  }, [token, isAuthenticated, router]);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (!user.email || !user.password) {
        toast.error("Email and password are required");
        return;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/login`,
        user,
      );

      // login to zustand store (if backend returns token + user)
      login(response.data.user, response.data.token);


      toast.success(response.data.msg || "Login successful", {
        position: "bottom-right"
      });

      router.push("/");



    } catch (error) {

      if (axios.isAxiosError(error)) {

        // user not verified
        if (error.response?.data?.status === "verify") {

          toast.error(error.response.data.msg);

          router.push(`/verify?email=${user.email}`);

          return;
        }

        toast.error(
          error.response?.data?.msg || "Something went wrong"
        );

      } else {
        toast.error("Internal server error");
      }

      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      {/* Back to home link */}

      <div className="md:hidden mx-auto">
        <Image src="/logoPNG.png" alt="Preview" width={250} height={250} />
      </div>

      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        ← Back to home
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">Sign in to your account</p>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your credentials below to access your dashboard.
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        {/* Email field */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            EMAIL ADDRESS
          </label>
          <Input
            name="email"
            value={user.email}
            onChange={handleChange}
            type="email"
            placeholder="example@gmail.com"
            className="h-12 border-gray-200 focus:border-gray-400"
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-muted-foreground">
              PASSWORD
            </label>
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Input
            name="password"
            value={user.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password"
            className="h-12 border-gray-200 focus:border-gray-400"
          />
        </div>

        {/* Sign in button */}
        <Button
          type="submit"
          disabled={loading}
          className="h-12 mt-2 bg-brand-primary cursor-pointer hover:bg-brand-primary/90 dark:bg-brand-primary dark:text-white text-white rounded-md"
        >
          {loading ? "Signing in..." : "Sign in →"}
        </Button>

        {/* Sign up link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-foreground font-medium hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </form>
  );
}
