import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

/* ✅ correct brand icons */
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export default function Footer() {
    return (
        <footer className="border-t bg-white dark:bg-black/60 mt-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">

                {/* TOP SECTION */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* BRAND */}
                    <div>
                        <h2 className="text-xl font-bold">Dalabzone</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            Somalia’s modern online marketplace for electronics, fashion,
                            furniture, vehicles, and more.
                        </p>

                        {/* SOCIAL ICONS */}
                        <div className="flex gap-3 mt-4">
                            <FaFacebook className="w-5 h-5 cursor-pointer hover:text-blue-600 transition" />
                            <FaInstagram className="w-5 h-5 cursor-pointer hover:text-pink-500 transition" />
                            <FaX className="w-5 h-5 cursor-pointer text-white hover:text-gray-900 hover:scale-110 transition-all duration-200" />
                            <MdEmail className="w-5 h-5 cursor-pointer hover:text-red-500 transition" />
                        </div>
                    </div>

                    {/* QUICK LINKS */}
                    <div>
                        <h3 className="font-semibold mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/shop">Shop</Link></li>
                            <li><Link href="/categories">Categories</Link></li>
                            <li><Link href="/about">About</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                        </ul>
                    </div>

                    {/* SUPPORT */}
                    <div>
                        <h3 className="font-semibold mb-3">Support</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Help Center</li>
                            <li>Shipping Info</li>
                            <li>Returns</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                        </ul>
                    </div>

                    {/* NEWSLETTER */}
                    <div>
                        <h3 className="font-semibold mb-3">Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                            Get updates on new products and offers.
                        </p>

                        <div className="flex gap-2">
                            <Input placeholder="Enter email" />
                            <Button>Subscribe</Button>
                        </div>
                    </div>

                </div>

                {/* BOTTOM SECTION */}
                <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Dalabzone. All rights reserved.
                    </p>

                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <Link href="/">Privacy</Link>
                        <Link href="/">Terms</Link>
                        <Link href="/">Cookies</Link>
                    </div>

                </div>

            </div>
        </footer>
    );
}