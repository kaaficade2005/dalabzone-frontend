"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

const AddressComponent = ({ onClose }: { onClose?: () => void }) => {
    const { user, token } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        country: "",
        city: "",
        address_line: "",
        postal_code: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.country.trim()) newErrors.country = "Country is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.address_line.trim()) newErrors.address_line = "Address is required";
        if (!formData.postal_code.trim()) newErrors.postal_code = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };







    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/users/addresses`,
                {
                    user_id: user?.id,
                    ...formData,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(res)

            toast.success("Address added successfully!");
            setFormData({
                country: "",
                city: "",
                address_line: "",
                postal_code: "",
            });
            onClose?.();

        } catch (error) {
            console.log(error);
            toast.error("Failed to add address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto   relative overflow-hidden ">
            {/* <div>
                <CardTitle>Add New Address</CardTitle>
                <CardDescription>
                    Enter your shipping address details below
                </CardDescription>
            </div> */}
            <div >
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                name="country"
                                placeholder="Enter country"
                                value={formData.country}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.country ? "border-red-500" : ""}
                            />
                            {errors.country && (
                                <p className="text-sm text-red-500">{errors.country}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input
                                id="city"
                                name="city"
                                placeholder="Enter city"
                                value={formData.city}
                                onChange={handleChange}
                                disabled={loading}
                                className={errors.city ? "border-red-500" : ""}
                            />
                            {errors.city && (
                                <p className="text-sm text-red-500">{errors.city}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address_line">Address</Label>
                        <Textarea
                            id="address_line"
                            name="address_line"
                            placeholder="Enter your full address (street, building, apartment, etc.)"
                            className={`min-h-[100px] resize-y ${errors.address_line ? "border-red-500" : ""
                                }`}
                            value={formData.address_line}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        {errors.address_line && (
                            <p className="text-sm text-red-500">{errors.address_line}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Input
                            id="postal_code"
                            name="postal_code"
                            placeholder="Enter postal code"
                            value={formData.postal_code}
                            onChange={handleChange}
                            disabled={loading}
                            className={errors.postal_code ? "border-red-500" : ""}
                        />
                        {errors.postal_code && (
                            <p className="text-sm text-red-500">{errors.postal_code}</p>
                        )}
                    </div>

                    <div className="px-0 pb-0 flex gap-3">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="min-w-[120px]"
                        >
                            {loading ? "Saving..." : "Save Address"}
                        </Button>

                        {onClose && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressComponent;