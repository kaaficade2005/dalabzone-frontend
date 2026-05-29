"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";

export function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);



  const { login, token, isAuthenticated } = useAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (token || isAuthenticated) {
      router.push("/");
    }
  }, [token, isAuthenticated, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const HandleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ basic validation
      // if (!user.email || !user.password) {
      //   toast.error("Email and password are required");
      //   return;
      // }

      // ✅ send data to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/register-user`,
        user,
      );

      console.log(response);

      // ✅ success feedback
      toast.success(response.data.msg);

      // ✅ optional: reset form
      setUser({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        password: "",
      });

      // ✅ optional: redirect
      router.push(`/verify?email=${user.email}`);
    } catch (error: unknown) {
      // ✅ better error handling
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.msg || "Something went wrong";
        toast.error(message);
      } else {
        toast.error("Internal server error");
      }

      console.log(error);
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };

  return (
    <form
      onSubmit={HandleRegisterUser}
      className={cn("flex flex-col gap-8", className)}
      {...props}
    >
      {/* Logo (mobile) */}
      <div className="md:hidden mx-auto">
        <Image src="/logoPNG.png" alt="Dalabzone" width={250} height={250} />
      </div>

      {/* Back link */}
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
      >
        ← Back to home
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Create your account
        </h1>

        <p className="text-muted-foreground">
          Join Dalabzone and start shopping today
        </p>

        <p className="text-sm text-muted-foreground mt-1">
          Create your account to manage orders, track deliveries, and enjoy a
          seamless shopping experience.
        </p>
      </div>

      {/* Form fields */}
      <div className="flex flex-col gap-5">
        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              FIRST NAME
            </label>
            <Input
              name="first_name"
              value={user.first_name}
              onChange={handleChange}
              type="text"
              placeholder="Abdi"
              className="h-12 border-gray-200 focus:border-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              LAST NAME
            </label>
            <Input
              name="last_name"
              value={user.last_name}
              onChange={handleChange}
              type="text"
              placeholder="Mohamed"
              className="h-12 border-gray-200 focus:border-gray-400"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            PHONE NUMBER
          </label>
          <Input
            name="phone"
            value={user.phone}
            onChange={handleChange}
            type="tel"
            placeholder="+252 61 0000000"
            className="h-12 border-gray-200 focus:border-gray-400"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-muted-foreground">
            PASSWORD
          </label>
          <Input
            name="password"
            value={user.password}
            onChange={handleChange}
            type="password"
            placeholder="Enter your password"
            className="h-12 border-gray-200 focus:border-gray-400"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={loading}
          className="h-12 mt-2 bg-brand-primary cursor-pointer hover:bg-brand-primary/90 text-white rounded-md"
        >
          {loading ? (
            <>
              <Spinner />
              Creating...
            </>
          ) : (
            "Create account →"
          )}
        </Button>

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </form>
  );
}
