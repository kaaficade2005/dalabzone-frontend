import { Suspense } from "react";
import LeftSideAuth from "@/components/auth/LeftSideAuth";
import ResetPassword from "../_components/ResetPassword";

export const metadata = {
    title: "Reset-password - Dalabzone",
    description:
        "Access your Dalabzone account to manage orders, track deliveries, update your profile, and enjoy a seamless shopping experience.",
};

export default function ResetPassPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2 bg-background">

            <LeftSideAuth />

            <div className="flex flex-col justify-center items-center p-6 md:p-10">
                <div className="w-full max-w-md rounded-2xl p-4 md:p-8 space-y-6">

                    <Suspense fallback={<div>Loading...</div>}>
                        <ResetPassword />
                    </Suspense>

                </div>
            </div>
        </div>
    );
}