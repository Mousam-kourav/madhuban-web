import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // SEO-preserving 301 redirects — populated at launch per CLAUDE.md §7.6
      // { source: '/stay/pool-side-room', destination: '/stay/pool-side-villa', permanent: true },
    ];
  },
};

export default nextConfig;
