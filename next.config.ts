import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // ✅ YOUR LIVE DOMAIN (add this)
      {
        protocol: "https",
        hostname: "api.dalabzone.com",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;