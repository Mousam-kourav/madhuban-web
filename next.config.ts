import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Include @fontsource woff files in Vercel serverless bundles for PDF routes.
  // Without this, path.join(process.cwd(), "node_modules/...") fails with ENOENT
  // because Vercel's file tracer doesn't pick up font files that are read at runtime.
  outputFileTracingIncludes: {
    "/api/admin/bookings/(.*)": [
      "./node_modules/@fontsource/noto-sans/files/*.woff",
    ],
    "/api/admin/invoices/(.*)": [
      "./node_modules/@fontsource/noto-sans/files/*.woff",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-988c0a6b938742458b908a7a49295f61.r2.dev",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Blog canonical — /blog/* → /blogs/*
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/:slug', permanent: true },
      // SEO-preserving 301s per CLAUDE.md §7.6
      { source: '/stay/pool-side-room', destination: '/stay/pool-side-villa', permanent: true },
      // /booking is now a conversion landing page — redirect removed (Phase 9c-2)
    ];
  },
};

export default nextConfig;
