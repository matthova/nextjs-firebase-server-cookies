import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/__/auth/:path*",
        destination: `https://${process.env.AUTH_DOMAIN_ORIGIN}/__/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
