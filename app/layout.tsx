import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppButton from "@/components/home/WhatsappButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dalabzone - Somalia’s #1 Online Marketplace",
  description:
    "Dalabzone is a modern e-commerce platform offering electronics, fashion, furniture, vehicles, and more across Somalia with secure payments and fast delivery.",

  keywords: [
    "Dalabzone",
    "Dalabzone Somalia",
    "online shopping Somalia",
    "ecommerce Somalia",
    "buy online Somalia",
    "shopping website Somalia",
    "Somalia online store",
    "electronics Somalia",
    "phones Somalia",
    "laptops Somalia",
    "fashion Somalia",
    "clothing Somalia",
    "jewelry Somalia",
    "furniture Somalia",
    "home appliances Somalia",
    "vehicles Somalia",
    "cars for sale Somalia",
    "accessories Somalia",
    "cheap products Somalia",
    "affordable electronics Somalia",
    "shop online Mogadishu",
    "buy phone Mogadishu",
    "online store Mogadishu",
    "fast delivery Somalia",
    "secure payment Somalia",
    "cash on delivery Somalia",
    "trusted online shop Somalia",
    "Somalia ecommerce platform",
    "East Africa online shopping",
  ],

  // icons: {
  //   icon: "/logoPNG.png",
  //   shortcut: "/logoPNG.png",
  //   apple: "/logoPNG.png",
  // },

  openGraph: {
    title: "Dalabzone - Online Shopping in Somalia",
    description:
      "Shop electronics, fashion, furniture, and more with Dalabzone. Fast delivery and secure payments across Somalia.",
    url: "https://dalabzone.com",
    siteName: "Dalabzone",
    images: [
      {
        url: "https://dalabzone.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dalabzone Online Market",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Dalabzone - Somalia’s Online Marketplace",
    description: "Discover electronics, fashion, and more at Dalabzone.",
    images: ["https://dalabzone.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="font-inter">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <div className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/5 transition-colors relative overflow-hidden ">
              {children}

            </div>
          </TooltipProvider>
        </ThemeProvider>

        <Toaster position="top-right" />
      </body>
    </html>
  );
}
