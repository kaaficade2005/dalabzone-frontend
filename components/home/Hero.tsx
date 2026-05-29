"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 30 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

export default function Hero() {
    return (
        <section className="relative overflow-hidden">
            {/* BACKGROUND GLOW */}
            {/* <div className="absolute inset-0 -z-10">
                <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-120px] right-[-80px] w-[400px] h-[400px] bg-purple-500/20 blur-[120px] rounded-full" />
            </div> */}

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-32 text-center"
            >
                {/* BADGE */}
                <motion.div
                    variants={item}
                    className="inline-flex items-center gap-2 px-4 py-1 rounded-full border bg-background text-sm mb-6"
                >
                    <ShoppingBag size={14} />
                    Somalia’s #1 Online Marketplace
                </motion.div>

                {/* TITLE */}
                <motion.h1
                    variants={item}
                    className="text-4xl md:text-6xl font-bold tracking-tight"
                >
                    Shop Everything You Need in{" "}
                    <span className="text-primary">Somalia</span>
                </motion.h1>

                {/* DESCRIPTION */}
                <motion.p
                    variants={item}
                    className="mt-4 text-muted-foreground max-w-2xl mx-auto"
                >
                    Electronics, fashion, furniture, vehicles, and more — all in one
                    trusted platform with fast delivery and secure payments.
                </motion.p>

                {/* SEARCH */}
                <motion.div
                    variants={item}
                    className="mt-8 flex flex-col md:flex-row items-center gap-3 max-w-2xl mx-auto"
                >
                    <div className="relative w-full">
                        <Input
                            placeholder="Search products, brands, categories..."
                            className="pr-10 h-12"
                        />
                        <Search
                            className="absolute right-3 top-3.5 text-muted-foreground"
                            size={18}
                        />
                    </div>

                    <Button className="h-12 w-full md:w-auto">Search</Button>
                </motion.div>

                {/* CTA */}
                <motion.div
                    variants={item}
                    className="mt-6 flex flex-col md:flex-row justify-center gap-3"
                >
                    <Link href="/shop">
                        <Button size="lg">Start Shopping</Button>
                    </Link>

                    <Link href="/categories">
                        <Button size="lg" variant="outline">
                            Browse Categories
                        </Button>
                    </Link>
                </motion.div>

                {/* STATS */}
                <motion.div
                    variants={item}
                    className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6 text-center"
                >
                    <div>
                        <p className="text-2xl font-bold">15+</p>
                        <p className="text-sm text-muted-foreground">Products</p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">6+</p>
                        <p className="text-sm text-muted-foreground">Categories</p>
                    </div>

                    <div>
                        <p className="text-2xl font-bold">24/7</p>
                        <p className="text-sm text-muted-foreground">Support</p>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
