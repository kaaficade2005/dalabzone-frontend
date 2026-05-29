"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    ChevronRight,
    Heart,
    Info,
    LayoutDashboard,
    LogOut,
    Menu,
    ShoppingBag,
    ShoppingCart,
    User,
    User2,
} from "lucide-react";

import { ModeToggle } from "./ToggleMode";

/* ---------------- ICON MAP ---------------- */
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { Grid3X3, Home, Phone } from "lucide-react";
import axios from "axios";

const ICONS = {
    Home,
    Grid3X3,
    ShoppingBag,
    Heart,
    Phone,
    Info,
};

/* ---------------- NAV JSON ---------------- */
const NAV_ITEMS = [
    { label: "Home", href: "/", icon: "Home" },
    { label: "Shop", href: "/shop", icon: "Grid3X3" },
    { label: "Categories", href: "/categories", icon: "ShoppingBag" },
    { label: "About", href: "/about", icon: "Info" },
    { label: "Contact", href: "/contact", icon: "Phone" },
];

export default function Navbar() {
    const { getCartCount } = useCartStore();
    // const [cartCount] = useState(getCartCount);
    const [searchQuery, setSearchQuery] = useState("");
    const [liked, setLiked] = useState(false);

    const { user, token, logout } = useAuthStore();

    const [wishlistCount, setWishlistCount] = useState(0);

    const toggleWishlist = async () => {
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/heart`);

            setLiked(true);

            // update count from database
            setWishlistCount(data.total);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchHearts = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/heart`);

                setWishlistCount(data.total);
            } catch (error) {
                console.log(error);
            }
        };

        fetchHearts();
    }, []);


    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Search:", searchQuery);
    };

    return (
        <header className="sticky top-0 z-50 border-b bg-white/80 dark:bg-black/60 backdrop-blur">
            {/* // <header className="sticky top-0 z-50 border-b bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 relative overflow-hidden  backdrop-blur"> */}
            <div className="flex h-16 items-center justify-between px-4 md:px-8">
                {/* LEFT - MOBILE + LOGO */}
                <div className="flex items-center gap-2">
                    {/* MOBILE MENU */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu size={20} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent
                            side="left"
                            className="w-[85vw] max-w-sm p-0 flex flex-col"
                        >
                            <SheetTitle className="sr-only">Menu</SheetTitle>

                            {/* HEADER */}
                            <div className="flex items-center justify-between border-b px-4 py-4">
                                <Image
                                    src="/logoPNG.png"
                                    width={100}
                                    height={30}
                                    alt="logo"
                                    className="h-6 w-auto"
                                />
                            </div>

                            {/* NAV ITEMS */}
                            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                                {NAV_ITEMS.map((item) => {
                                    const Icon = ICONS[item.icon as keyof typeof ICONS];

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-muted transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                {Icon && (
                                                    <Icon size={18} className="text-muted-foreground" />
                                                )}
                                                <span className="text-sm font-medium">
                                                    {item.label}
                                                </span>
                                            </div>

                                            {/* <ChevronRight
                                                size={16}
                                                className="text-muted-foreground"
                                            /> */}
                                        </Link>
                                    );
                                })}
                            </div>

                            {/* FOOTER (CTA) */}
                            {!user && (
                                <div className="border-t p-4">
                                    <Link href="/login" className="w-full">
                                        <Button className="w-full h-10 rounded-xl bg-brand-primary text-white">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>

                    {/* LOGO */}
                    <Link href="/">
                        <Image
                            src="/logoPNG.png"
                            width={120}
                            height={40}
                            priority
                            alt="logo"
                            className="h-8 hidden md:flex w-auto"
                        />
                    </Link>
                </div>

                {/* CENTER NAV (LOOP) */}
                <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8">
                    {NAV_ITEMS.map((item) => {
                        const Icon = ICONS[item.icon as keyof typeof ICONS];

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-1 text-sm font-medium hover:opacity-70"
                            >
                                {Icon && <Icon size={16} />}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* RIGHT ACTIONS */}
                <div className="flex items-center gap-2">
                    {/* SEARCH */}
                    {/* <form onSubmit={handleSearch} className="hidden md:flex">
                        <div className="relative">
                            <Input
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-64 pr-10"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-0 top-0 h-full"
                            >
                                <Search size={18} />
                            </Button>
                        </div>
                    </form> */}

                    {/* THEME */}
                    <ModeToggle />

                    {/* CART */}
                    <Button
                        variant="ghost"
                        size="icon"
                        disabled={liked}
                        onClick={toggleWishlist}
                        className="relative hover:bg-transparent"
                    >
                        <Heart
                            size={20}
                            className={`transition-colors duration-200 ${liked ? "fill-red-500 text-red-500" : "text-muted-foreground"
                                }`}
                        />

                        {/* Badge */}
                        {wishlistCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </Button>

                    <Link href={"/cart"}>
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingCart size={18} />

                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 text-xs bg-brand-primary text-white rounded-full w-4 h-4 flex items-center justify-center">
                                    {getCartCount()}
                                </span>
                            )}
                        </Button>
                    </Link>

                    {/* PROFILE DROPDOWN */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <User size={18} />
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-64 p-3">
                                {/* HEADER */}
                                <div className="border-b pb-2 mb-2">
                                    <p className="text-sm font-semibold">{user.first_name}</p>
                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                </div>

                                {user.role === "admin" ? (
                                    <Link href={"/dashboard"}>
                                        <DropdownMenuItem>
                                            <LayoutDashboard size={16} /> Dashboard
                                        </DropdownMenuItem>
                                    </Link>
                                ) : (
                                    <></>
                                )}

                                <Link href={"/myOrder"}>
                                    <DropdownMenuItem>
                                        <ShoppingBag size={16} /> Orders
                                    </DropdownMenuItem>
                                </Link>
                                {/* <Link href={"/myWishlist"}>
                                    <DropdownMenuItem>
                                        <Heart size={16} /> Wishlist
                                    </DropdownMenuItem>
                                </Link> */}
                                <Link href={"/profile"}>
                                    <DropdownMenuItem>
                                        <User2 size={16} /> Profile
                                    </DropdownMenuItem>
                                </Link>

                                <div className="border-t mt-2 pt-2">
                                    <DropdownMenuItem
                                        className="text-red-500"
                                        onClick={() => logout()}
                                    >
                                        <LogOut size={16} /> Logout
                                    </DropdownMenuItem>
                                </div>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className="hidden md:block">
                            <Button className="w-35 cursor-pointer bg-brand-primary text-white h-9 mx-2">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
