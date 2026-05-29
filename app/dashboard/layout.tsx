"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/main/ToggleMode";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";

import { useAuthStore } from "@/store/auth-store";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const pathname = usePathname();

    const {
        token,
        user,
        hasHydrated,
    } = useAuthStore();

    const ALLOWED_ROLES = ["admin", "Cashier", "Manager"];

    // =========================================
    // AUTH PROTECTION
    // =========================================
    type User = {
        role?: string;
    };
    useEffect(() => {

        if (!hasHydrated) return;

        if (!token) {
            router.replace("/login");
            return;
        }

        if (!user || !user.role || !ALLOWED_ROLES.includes(user.role)) {
            router.replace("/");
        }

    }, [hasHydrated, token, user, router]);

    // =========================================
    // HYDRATION LOADING
    // =========================================

    if (!hasHydrated) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // =========================================
    // PREVENT FLASHING BEFORE REDIRECT
    // =========================================

    if (
        !token ||
        !user ||
        !user.role ||
        !ALLOWED_ROLES.includes(user.role)
    ) {
        return null;
    }

    // =========================================
    // BREADCRUMB LOGIC
    // =========================================

    const segments = pathname
        .split("/")
        .filter(Boolean);

    const filteredSegments = segments.filter(
        (seg) => seg.toLowerCase() !== "dashboard"
    );

    const formatLabel = (text: string) =>
        text
            .replace(/-/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase());

    const buildHref = (index: number) =>
        "/" + filteredSegments.slice(0, index + 1).join("/");

    return (
        <SidebarProvider className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 relative overflow-hidden ">

            <AppSidebar />

            <SidebarInset>

                {/* HEADER */}
                <header className="flex border-b h-16 shrink-0 items-center justify-between gap-2 px-4 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 relative overflow-hidden ">

                    {/* LEFT */}
                    <div className="flex items-center gap-2">

                        <SidebarTrigger />

                        <Separator
                            orientation="vertical"
                            className="h-4"
                        />

                        <Breadcrumb>

                            <BreadcrumbList>

                                {/* DASHBOARD */}
                                <BreadcrumbItem>

                                    <BreadcrumbLink href="/dashboard">
                                        Dashboard
                                    </BreadcrumbLink>

                                </BreadcrumbItem>

                                {/* DYNAMIC SEGMENTS */}
                                {filteredSegments.map((segment, index) => {

                                    const isLast =
                                        index === filteredSegments.length - 1;

                                    return (
                                        <div
                                            key={index}
                                            className="flex items-center"
                                        >

                                            <BreadcrumbSeparator className="hidden md:block" />

                                            <BreadcrumbItem className="hidden md:block">

                                                {isLast ? (

                                                    <BreadcrumbPage>
                                                        {formatLabel(segment)}
                                                    </BreadcrumbPage>

                                                ) : (

                                                    <span className="text-muted-foreground">
                                                        {formatLabel(segment)}
                                                    </span>

                                                )}

                                            </BreadcrumbItem>

                                        </div>
                                    );
                                })}

                            </BreadcrumbList>

                        </Breadcrumb>

                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">

                        <ModeToggle />

                        <Button
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={() => router.push("/")}
                        >
                            Back
                        </Button>

                    </div>

                </header>

                {/* MAIN */}
                <main className="flex flex-1 flex-col gap-4 p-4 pt-2 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 relative overflow-hidden ">
                    {children}
                </main>

            </SidebarInset>

        </SidebarProvider>
    );
}