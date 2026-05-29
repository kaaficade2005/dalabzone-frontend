"use client";

import { Input } from "@/components/ui/input";
import axios from "axios";
import { Car, Laptop, Shirt, Smartphone, Sofa, Watch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Loader from "../main/loader";
import { motion } from "framer-motion";

// icon mapping
const iconMap: Record<string, any> = {
    laptop: Laptop,
    shirt: Shirt,
    sofa: Sofa,
    car: Car,
    smartphone: Smartphone,
    watch: Watch,
};

interface Category {
    id: number;
    name: string;
    icon: string;
    slug?: string;
    count?: number;
}

// 🔥 container (stagger animation)
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.2,
        },
    },
};

// 🔥 item animation
const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1],
        },
    },
};

export default function CategoriesPage() {
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const hasFetched = useRef(false);

    const getCategories = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/category/all-categories`,
            );

            setCategories(response.data.categories);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        getCategories();
    }, []);

    const filtered = categories.filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">

            {/* HERO */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
            >
                <h1 className="text-4xl font-bold tracking-tight">
                    Categories
                </h1>
                <p className="text-muted-foreground mt-2">
                    Browse all available categories
                </p>
            </motion.div>

            {/* SEARCH */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex justify-center mb-10"
            >
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search categories..."
                    className="max-w-md h-12"
                />
            </motion.div>

            {/* LOADING */}
            {loading && <Loader />}

            {/* GRID */}
            {!loading && (
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
                >
                    {filtered.map((cat) => {
                        const Icon = iconMap[cat.icon] || Laptop;

                        return (
                            <motion.div
                                key={cat.id}
                                variants={item}
                                whileHover={{
                                    y: -6,
                                    scale: 1.03,
                                }}
                                whileTap={{ scale: 0.97 }}
                                className="group border rounded-xl p-5 flex flex-col items-center justify-center gap-3
                                hover:shadow-lg bg-background transition-all cursor-pointer"
                            >
                                {/* ICON */}
                                <div className="p-3 rounded-full bg-muted text-foreground group-hover:bg-primary group-hover:text-white transition-colors">
                                    <Icon size={22} />
                                </div>

                                {/* NAME */}
                                <p className="text-sm font-medium text-center">
                                    {cat.name}
                                </p>

                                {/* COUNT */}
                                <p className="text-xs text-muted-foreground">
                                    {cat.count || 0} products
                                </p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* EMPTY */}
            {!loading && filtered.length === 0 && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-muted-foreground mt-10"
                >
                    No categories found
                </motion.p>
            )}
        </section>
    );
}