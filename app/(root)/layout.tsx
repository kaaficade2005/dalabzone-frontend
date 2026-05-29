import WhatsAppButton from "@/components/home/WhatsappButton";
import Footer from "@/components/main/Footer";
import Navbar from "@/components/main/Navbar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <WhatsAppButton />
            <Footer />
        </div>
    );
};

export default layout;
