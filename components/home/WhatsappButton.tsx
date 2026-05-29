
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppButton = () => {
    const phone = "252619936001";

    const message = encodeURIComponent(
        "Asc, walal waxaa u baahanay caawinaad"
    );

    return (
        <div className="fixed bottom-5 right-5 z-50">

            {/* Animated Circle */}
            <span className="absolute inset-0 animate-ping rounded-full bg-green-400 opacity-75" />

            {/* Button */}
            <Link
                href={`https://wa.me/${phone}?text=${message}`}
                target="_blank"
                className="
                    relative
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    bg-green-500
                    text-white
                    shadow-lg
                    transition-transform
                    duration-300
                    hover:scale-110
                    ">
                <FaWhatsapp size={32} />
            </Link>
        </div>
    );
};

export default WhatsAppButton;

