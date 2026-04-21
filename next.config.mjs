/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev",
      },
    ],
    minimumCacheTTL: 31536000,
  },
  async redirects() {
    return [
      {
        source: "/about/:path*",
        destination: "/about-us",
        permanent: true,
      },
      { source: "/about/story", destination: "/about-us", permanent: true },
      {
        source: "/about/eco-philosophy",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/hotels/madhuban-resort",
        destination: "/",
        permanent: true,
      },

      {
        source: "/about/Vision-&-Mission",
        destination: "/about-us",
        permanent: true,
      },

      { source: "/rooms", destination: "/stay", permanent: true },
      { source: "/tag/charter", destination: "/experiences", permanent: true },
      { source: "/pricing-tables", destination: "/booking", permanent: true },
      { source: "/home-5", destination: "/", permanent: true },
      { source: "/tag/golf", destination: "/experiences", permanent: true },

      {
        source: "/activities/gym-fitness",
        destination: "/experiences",
        permanent: true,
      },
      {
        source: "/activities/massage-spa",
        destination: "/experiences",
        permanent: true,
      },

      {
        source: "/portfolio/luxury-suite",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/category/yacht-charter",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/rooms/swiss-cottages",
        destination: "/stay",
        permanent: true,
      },

      { source: "/tag/madhuban-main-menu", destination: "/", permanent: true },
      {
        source: "/madhuban-bamboo-cafe-8",
        destination: "/stay",
        permanent: true,
      },

      {
        source: "/whatsapp-image-2021-03-15-at-1-46-05-am-21",
        destination: "/booking",
        permanent: true,
      },

      { source: "/hotels", destination: "/about-us", permanent: true },
      { source: "/dsc_8879", destination: "/", permanent: true },
      { source: "/tag/island", destination: "/", permanent: true },
      { source: "/icon-boxes", destination: "/", permanent: true },

      { source: "/hotel-account", destination: "/booking", permanent: true },
      { source: "/help/contact", destination: "/contact-us", permanent: true },
      { source: "/hotel-search", destination: "/contact-us", permanent: true },

      { source: "/tabs-spa", destination: "/stay", permanent: true },
      { source: "/siver-logo", destination: "/gallery", permanent: true },
      {
        source: "/hotel/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/rooms/camping-tents",
        destination: "/stay/camping-tent",
        permanent: true,
      },
      {
        source: "/madhuban-camp-site",
        destination: "/stay/camping-tent",
        permanent: true,
      },

      {
        source: "/rooms/mud-house",
        destination: "/stay/mud-villa",
        permanent: true,
      },

      {
        source: "/skydiving-in-dubai",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/portfolio/miami-beach",
        destination: "/nearby-attractions",
        permanent: true,
      },

      {
        source: "/about-section5-2",
        destination: "/about-us",
        permanent: true,
      },

      {
        source: "/gallery-restaurant-1",
        destination: "/gallery",
        permanent: true,
      },
      { source: "/forest/home-5", destination: "/gallery", permanent: true },

      {
        source: "/thailand-exclusive-holidays",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/tag/australia",
        destination: "/nearby-attractions",
        permanent: true,
      },
      {
        source: "/safari/home-5",
        destination: "/experiences",
        permanent: true,
      },

      {
        source: "/gallery-restaurant-5",
        destination: "/gallery",
        permanent: true,
      },

      {
        source: "/hotel-term-condition",
        destination: "/terms-and-condition",
        permanent: true,
      },

      { source: "/quisque-velit-nisi", destination: "/", permanent: true },

      {
        source: "/maldives-resort-and-spa",
        destination: "/stay",
        permanent: true,
      },

      { source: "/hotel-includes/wi-fi", destination: "/", permanent: true },

      {
        source: "/our-services/ipsum-dolor-sit",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/our-services/lorem-ipsum-dolor-sit-amet",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/our-services/etiam-sit-amet-lectus-quis-est-congue-mollis",
        destination: "/about-us",
        permanent: true,
      },
      {
        source: "/madhuban-bamboo-cafe-8",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/pexels-pok-rie-144681",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/madhuban-camp-site-4",
        destination: "/stay",
        permanent: true,
      },
      {
        source: "/cropped-madhuban-logo-e1726477323214-png",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/cropped-madhuban-logo-e1726477323214-1-png",
        destination: "/gallery",
        permanent: true,
      },
      {
        source: "/cropped-cropped-madhuban-logo-e1726477323214-1-png",
        destination: "/gallery",
        permanent: true,
      },

      {
        source: "/faqs",
        destination: "/",
        permanent: true,
      },
      {
        source: "/our-services/phasellus-congue-lacus-eget",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/image/:path*",
        destination: "https://res.cloudinary.com/dx3aj7a40/image/upload/:path*",
      },
      {
        source: "/video/:path*",
        destination: "https://res.cloudinary.com/dx3aj7a40/video/upload/:path*",
      },
    ];
  },
  async headers() {
    return [
      // Static assets - 1 year
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Images - 1 year
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      // Event pages - 24 hours
      {
        source: "/events/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
      // Gallery - 1 week
      {
        source: "/gallery/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=604800, stale-while-revalidate=2592000",
          },
        ],
      },
      // Homepage - 12 hours
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=43200, stale-while-revalidate=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
