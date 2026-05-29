"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import axios from "axios";
import { Smartphone, Truck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CheckoutPage() {
    const { cart, clearCart } = useCartStore();
    const { token, user } = useAuthStore();
    const router = useRouter();

    const [hydrated, setHydrated] = useState(false);

    const [paymentType, setPaymentType] =
        useState<"local" | "online">("local");

    const [paymentMethod, setPaymentMethod] =
        useState("evc");



    const [Loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        fullName: `${user?.name}`,
        email: user?.email,
        address: "",
        city: "",
        phone: "",
    });



    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (hydrated && !token) {
            router.push("/login");
        }
    }, [hydrated, token, router]);

    if (!hydrated) return null;

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >,
    ) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // =========================
    // CALCULATIONS
    // =========================

    // total already includes VAT/tax
    const subtotal = cart.reduce(
        (acc, item) =>
            acc +
            Number(item.total) * item.quantity,
        0,
    );

    const tax = 0;

    const grandTotal = subtotal;

    // =========================
    // PLACE ORDER
    // =========================

    const handlePlaceOrder = async () => {

        try {

            if (!token) {

                toast.error("Please login first");

                router.push("/login");

                return;
            }

            // CHECK EMPTY FIELDS
            if (
                !formData.fullName.trim() ||
                !formData.email?.trim() ||
                !formData.address.trim() ||
                !formData.city.trim() ||
                !formData.phone.trim()
            ) {

                toast.error("Please fill all fields");

                return;
            }

            // CHECK PHONE LENGTH
            if (formData.phone.length < 9) {

                toast.error("Enter valid phone number");

                return;
            }

            // CHECK EMPTY CART
            if (cart.length === 0) {
                toast.error("Your cart is empty");
                return;
            }

            // ONLINE PAYMENT
            if (paymentType === "online") {

                router.push("/checkout/stripe");

                return;
            }

            const payload = {
                cart,
                formData,
                paymentType,
                paymentMethod,
                subtotal,
                tax,
                grandTotal,
                userId: 1,
            };

            setLoading(true);

            toast.promise(

                axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/orders/create-order`,
                    payload,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                ),

                {
                    loading: "Placing your order...",

                    success: (res) => {

                        if (res.data?.success) {

                            clearCart();

                            router.push(`/order/${res.data.orderId}`);
                        }

                        return res.data.message;
                    },

                    error: (err) => {

                        return (
                            err?.response?.data?.message ||
                            "Failed to place order"
                        );
                    },
                }
            );

        } catch (error) {

            console.log(error);

            toast.error("Something went wrong");

        } finally {

            setLoading(false);
        }
    };

    const isEmptyCart = cart.length === 0;

    if (isEmptyCart) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-3">
                    <h2 className="text-2xl font-bold">
                        Your cart is empty
                    </h2>

                    <p className="text-muted-foreground">
                        Add some products before checkout
                    </p>

                    <Button
                        onClick={() => router.push("/")}
                    >
                        Go Shopping
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12">
                {/* HEADER */}
                <div className="mb-6 sm:mb-8 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Checkout
                    </h1>

                    <p className="text-muted-foreground text-sm sm:text-base mt-1 sm:mt-2">
                        Complete your purchase securely
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* ORDER SUMMARY */}
                        <div className="rounded-2xl border p-4 sm:p-6">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    Order Summary
                                </h2>

                                <Badge
                                    variant="outline"
                                    className="text-xs sm:text-sm"
                                >
                                    {cart.length} Items
                                </Badge>
                            </div>

                            <div className="space-y-4 sm:space-y-6">
                                {cart.map((item, index) => (
                                    <div key={item.id}>
                                        <div className="flex sm:flex-row gap-3 sm:gap-4">
                                            {/* IMAGE */}
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                                                <Image
                                                    src={
                                                        item.image as string
                                                    }
                                                    alt={
                                                        item.name as string
                                                    }
                                                    fill
                                                    unoptimized
                                                    loading="eager"
                                                    fetchPriority="high"
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* INFO */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                    <div>
                                                        <h3 className="font-semibold text-base sm:text-lg">
                                                            {
                                                                item.name
                                                            }
                                                        </h3>

                                                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                                                            Quantity:{" "}
                                                            {
                                                                item.quantity
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="text-left sm:text-right">
                                                        <p className="font-bold text-primary text-lg sm:text-xl">
                                                            $
                                                            {(
                                                                Number(
                                                                    item.total,
                                                                ) *
                                                                item.quantity
                                                            ).toLocaleString()}
                                                        </p>

                                                        <p className="text-xs text-muted-foreground">
                                                            $
                                                            {Number(
                                                                item.total,
                                                            ).toFixed(
                                                                2,
                                                            )}{" "}
                                                            each
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {index <
                                            cart.length -
                                            1 && (
                                                <Separator className="my-4 sm:my-6" />
                                            )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DELIVERY */}
                        <div className="rounded-2xl border p-4 sm:p-6">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <Truck
                                    className="text-primary"
                                    size={20}
                                />

                                <h2 className="text-lg sm:text-xl font-semibold">
                                    Delivery Information
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="sm:col-span-2">
                                    <Label>
                                        Full Name
                                    </Label>

                                    <Input
                                        name="fullName"
                                        onChange={
                                            handleInputChange
                                        }
                                        readOnly
                                        className="mt-1.5 h-12"
                                        value={`${user?.first_name + ' ' + user?.last_name}`}
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <Label>
                                        Email Address
                                    </Label>

                                    <Input
                                        name="email"
                                        onChange={
                                            handleInputChange
                                        }
                                        readOnly
                                        className="mt-1.5 h-12"
                                        required
                                        value={
                                            user?.email
                                        }
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <Label>
                                        Address
                                    </Label>

                                    <Input
                                        type="text"
                                        name="address"
                                        onChange={
                                            handleInputChange
                                        }
                                        className="mt-1.5 h-12"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>
                                        City
                                    </Label>

                                    <Input
                                        name="city"
                                        onChange={
                                            handleInputChange
                                        }
                                        className="mt-1.5 h-12"
                                        required
                                    />
                                </div>

                                <div>
                                    <Label>
                                        Phone
                                    </Label>

                                    <Input
                                        name="phone"
                                        onChange={
                                            handleInputChange
                                        }
                                        className="mt-1.5 h-12"

                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="space-y-6">
                        {/* PAYMENT */}
                        <div className="rounded-2xl border p-4 sm:p-6">
                            <h2 className="font-semibold mb-4">
                                Payment Method
                            </h2>

                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={() =>
                                        setPaymentType(
                                            "local",
                                        )
                                    }
                                    className={cn(
                                        "flex-1 py-2 border rounded-lg",
                                        paymentType ===
                                        "local" &&
                                        "bg-brand-primary text-white",
                                    )}
                                >
                                    Local
                                </button>

                                {/* <button
                                    disabled={true}
                                    // onClick={() =>
                                    //     setPaymentType(
                                    //         "online",
                                    //     )
                                    // }
                                    onClick={() => {
                                        toast.warning("we Working on it")
                                    }}
                                    className={cn(
                                        "flex-1 py-2 border rounded-lg",
                                        paymentType ===
                                        "online" &&
                                        "bg-brand-primary text-white",
                                    )}
                                >
                                    Online
                                </button> */}

                                <button
                                    onClick={() => {
                                        toast.info("Online payment is not available yet");
                                    }}
                                    className={cn(
                                        "flex-1 py-2 border rounded-lg",
                                        paymentType === "online" &&
                                        "bg-brand-primary text-white",
                                    )}
                                >
                                    Online
                                </button>
                            </div>

                            {paymentType ===
                                "local" && (
                                    <div className="space-y-2.5">
                                        <PaymentOption
                                            label="EVC Plus"
                                            value="evc"
                                            selected={
                                                paymentMethod
                                            }
                                            onSelect={
                                                setPaymentMethod
                                            }
                                            icon={
                                                <Smartphone
                                                    size={
                                                        18
                                                    }
                                                />
                                            }
                                            description="Pay using EVC"
                                        />

                                        {/* <PaymentOption
                                            label="ZAAD"
                                            value="zaad"
                                            selected={
                                                paymentMethod
                                            }
                                            onSelect={
                                                setPaymentMethod
                                            }
                                            icon={
                                                <Smartphone
                                                    size={
                                                        18
                                                    }
                                                />
                                            }
                                            description="Pay using ZAAD"
                                        />

                                        <PaymentOption
                                            label="SAHAL"
                                            value="sahal"
                                            selected={
                                                paymentMethod
                                            }
                                            onSelect={
                                                setPaymentMethod
                                            }
                                            icon={
                                                <Smartphone
                                                    size={
                                                        18
                                                    }
                                                />
                                            }
                                            description="Pay using SAHAL"
                                        /> */}

                                        {/* <PaymentOption
                                            label="E-Dahab"
                                            value="edahab"
                                            selected={
                                                paymentMethod
                                            }
                                            onSelect={
                                                setPaymentMethod
                                            }
                                            icon={
                                                <Building2
                                                    size={
                                                        18
                                                    }
                                                />
                                            }
                                            description="Pay using E-Dahab"
                                        /> */}
                                    </div>
                                )}
                        </div>

                        {/* TOTAL */}
                        <div className="rounded-2xl border p-4 sm:p-6 space-y-4">
                            <div className="flex justify-between">
                                <span>
                                    Subtotal
                                </span>

                                <span>
                                    $
                                    {grandTotal.toFixed(
                                        2,
                                    )}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span>
                                    Delivery
                                </span>

                                <span className="text-green-600">
                                    Free
                                </span>
                            </div>

                            <Separator />

                            <div className="flex justify-between font-bold text-lg">
                                <span>Total</span>

                                <span>
                                    $
                                    {grandTotal.toFixed(
                                        2,
                                    )}
                                </span>
                            </div>

                            <Button
                                onClick={
                                    handlePlaceOrder
                                }
                                disabled={Loading}
                                className="w-full mt-5 h-12"
                            >
                                {Loading
                                    ? "Processing..."
                                    : "Place Order"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

function PaymentOption({
    icon,
    label,
    value,
    description,
    selected,
    onSelect,
}: any) {
    return (
        <button
            onClick={() => onSelect(value)}
            className={cn(
                "w-full flex items-center gap-3 p-3 border rounded-lg",
                selected === value &&
                "border-primary bg-primary/5",
            )}
        >
            {icon}

            <div className="text-left">
                <p className="font-medium">
                    {label}
                </p>

                <p className="text-xs text-muted-foreground">
                    {description}
                </p>
            </div>
        </button>
    );
}