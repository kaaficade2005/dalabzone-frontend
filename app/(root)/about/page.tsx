"use client";




import {
    ArrowRight,
    Car,
    Eye,
    Heart,
    Lightbulb,
    Shield,
    Smartphone,
    Sofa,
    Sparkles,
    Target
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { easeOut, motion } from "framer-motion";

/* ---------------- ANIMATION VARIANTS ---------------- */

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: easeOut },
    },
};

/* ---------------- PAGE ---------------- */

export default function AboutPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen "
        >
            {/* HERO */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-24 border-b border-gray-100 dark:border-gray-800"
            >
                <div className="container mx-auto px-4">

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-full px-4 py-1.5 mb-8"
                    >
                        <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Welcome to Dalabzone
                        </span>
                    </motion.div>

                    <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                        <span className="text-blue-600 dark:text-blue-400">DALAB</span>
                        <span className="text-orange-500 dark:text-orange-400">ZONE</span>
                    </h1>

                    <p className="text-xl mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                        Your One-Stop Online Marketplace
                    </p>

                    <p className="max-w-2xl mx-auto mt-6 text-gray-500 dark:text-gray-400 leading-relaxed">
                        A modern e-commerce platform connecting customers with quality products
                        across Somalia and East Africa.
                    </p>
                </div>
            </motion.section>

            {/* OVERVIEW */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="container mx-auto px-4 py-20"
            >
                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    <motion.div variants={item}>
                        <h2 className="text-3xl font-bold tracking-tight mb-4">
                            Company Overview
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                            Dalabzone is an e-commerce platform offering electronics, fashion,
                            furniture, vehicles, and more.
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            We focus on accessibility, trust, and innovation.
                        </p>
                    </motion.div>

                    <motion.div variants={container} className="grid grid-cols-2 gap-4">
                        {stats.map((s, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                className="border border-gray-100 dark:border-gray-800 rounded-2xl p-6 text-center"
                            >
                                <div className={`text-3xl font-bold ${s.color}`}>
                                    {s.value}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {s.label}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                </div>
            </motion.section>

            {/* VISION / MISSION */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="border-y border-gray-100 dark:border-gray-800 py-20"
            >
                <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8">

                    {visionMission.map((v, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            whileHover={{ y: -6 }}
                            className="p-8 border border-gray-100 dark:border-gray-800 rounded-2xl"
                        >
                            <div className="mb-4 text-blue-600 dark:text-blue-400">
                                {v.icon}
                            </div>
                            <h3 className="font-semibold text-xl mb-2">{v.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                {v.desc}
                            </p>
                        </motion.div>
                    ))}

                </div>
            </motion.section>

            {/* CORE VALUES */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="container mx-auto px-4 py-20"
            >
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-3">
                        Core Values
                    </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coreValues.map((v, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="p-6 border border-gray-100 dark:border-gray-800 rounded-2xl"
                        >
                            <div className="mb-4">{v.icon}</div>
                            <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {v.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* PRODUCTS */}
            <motion.section
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="border-t border-gray-100 dark:border-gray-800 py-20"
            >
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <h2 className="text-3xl font-bold tracking-tight mb-3">
                            Products & Services
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {products.map((p, i) => (
                            <motion.div
                                key={i}
                                variants={item}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl border"
                            >
                                {p.icon}
                                <span className="text-sm font-medium">
                                    {p.name}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* CTA */}
            <motion.section className="border-t border-gray-100 dark:border-gray-800 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-3xl font-bold mb-3">
                        Start Shopping Today
                    </h3>

                    <p className="text-gray-500 mb-8">
                        Join thousands of customers
                    </p>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button className="rounded-full px-8 gap-2">
                            Shop Now <ArrowRight className="h-4 w-4" />
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.section>
        </motion.div>
    );
}

/* ---------------- DATA ---------------- */

const stats = [
    { value: "10+", label: "Products", color: "text-blue-600" },
    // { value: "1", label: "Customers", color: "text-orange-500" },
    { value: "24/7", label: "Support", color: "text-green-600" },
    { value: "100%", label: "Secure", color: "text-purple-600" },
];

const visionMission = [
    {
        title: "Vision",
        desc: "Become leading e-commerce in East Africa.",
        icon: <Eye className="h-8 w-8" />,
    },
    {
        title: "Mission",
        desc: "Build secure and trusted marketplace.",
        icon: <Target className="h-8 w-8" />,
    },
];

const coreValues = [
    { title: "Customer First", desc: "We prioritize customers.", icon: <Heart /> },
    { title: "Integrity", desc: "We are transparent.", icon: <Shield /> },
    { title: "Innovation", desc: "We improve constantly.", icon: <Lightbulb /> },
];

const products = [
    { name: "Electronics", icon: <Smartphone size={18} /> },
    { name: "Furniture", icon: <Sofa size={18} /> },
    { name: "Vehicles", icon: <Car size={18} /> },
];