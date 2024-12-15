import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination:
          "https://hova-labs-nextjs-firebase-demo.firebaseapp.com/__/auth/:path*",
      },
    ];
  },
};

export default nextConfig;
