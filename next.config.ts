import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
      },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "www.themealdb.com" },
      { protocol: "https", hostname: "cdn2.thedogapi.com" },
      { protocol: "https", hostname: "books.google.com" },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
};

export default nextConfig;
