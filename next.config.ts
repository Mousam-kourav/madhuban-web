import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
      // ── Blog canonical ──────────────────────────────────────────────────────
      { source: '/blog', destination: '/blogs', permanent: true },
      { source: '/blog/:slug', destination: '/blogs/:slug', permanent: true },

      // ── Stay slug fixes ─────────────────────────────────────────────────────
      { source: '/stay/pool-side-room', destination: '/stay/pool-side-villa', permanent: true },
      { source: '/stay/mud-villa', destination: '/stay/mud-house-1', permanent: true },

      // ── Legacy WordPress → current site (docs/seo/301-redirections.csv) ────
      // Contact
      { source: '/help/contact', destination: '/contact-us', permanent: true },
      { source: '/hotel-search', destination: '/contact-us', permanent: true },

      // Stay / rooms
      { source: '/hotel-cat/hotel', destination: '/stay', permanent: true },
      { source: '/rooms', destination: '/stay', permanent: true },
      { source: '/rooms/swiss-cottages', destination: '/stay', permanent: true },
      { source: '/rooms/camping-tents', destination: '/stay/camping-tent', permanent: true },
      { source: '/rooms/mud-house', destination: '/stay/mud-house-1', permanent: true },
      { source: '/madhuban-bamboo-cafe-8', destination: '/stay', permanent: true },
      { source: '/madhuban-camp-site', destination: '/stay/camping-tent', permanent: true },
      { source: '/madhuban-camp-site-4', destination: '/stay/camping-tent', permanent: true },
      { source: '/portfolio/luxury-suite', destination: '/stay', permanent: true },
      { source: '/category/yacht-charter', destination: '/stay', permanent: true },
      { source: '/tabs-spa', destination: '/stay', permanent: true },
      { source: '/maldives-resort-and-spa', destination: '/stay', permanent: true },

      // Experiences
      { source: '/tag/charter', destination: '/experiences', permanent: true },
      { source: '/tag/golf', destination: '/experiences', permanent: true },
      { source: '/activities/gym-fitness', destination: '/experiences', permanent: true },
      { source: '/activities/massage-spa', destination: '/experiences', permanent: true },
      { source: '/safari/home-5', destination: '/experiences', permanent: true },

      // Booking
      { source: '/pricing-tables', destination: '/booking', permanent: true },
      { source: '/whatsapp-image-2021-03-15-at-1-46-05-am-21', destination: '/booking', permanent: true },
      { source: '/hotel-account', destination: '/booking', permanent: true },

      // About
      { source: '/hotels', destination: '/about-us', permanent: true },
      { source: '/about/Vision-&-Mission', destination: '/about-us', permanent: true },
      { source: '/about-section5-2', destination: '/about-us', permanent: true },
      { source: '/our-services/ipsum-dolor-sit', destination: '/about-us', permanent: true },
      { source: '/our-services/lorem-ipsum-dolor-sit-amet', destination: '/about-us', permanent: true },
      { source: '/our-services/etiam-sit-amet-lectus-quis-est-congue-mollis', destination: '/about-us', permanent: true },

      // Gallery
      { source: '/cropped-madhuban-logo-e1726477323214-png', destination: '/gallery', permanent: true },
      { source: '/cropped-madhuban-logo-e1726477323214-1-png', destination: '/gallery', permanent: true },
      { source: '/cropped-cropped-madhuban-logo-e1726477323214-1-png', destination: '/gallery', permanent: true },
      { source: '/siver-logo', destination: '/gallery', permanent: true },
      { source: '/gallery-restaurant-1', destination: '/gallery', permanent: true },
      { source: '/gallery-restaurant-5', destination: '/gallery', permanent: true },
      { source: '/forest/home-5', destination: '/gallery', permanent: true },

      // Nearby attractions
      { source: '/skydiving-in-dubai', destination: '/nearby-attractions', permanent: true },
      { source: '/tag/australia', destination: '/nearby-attractions', permanent: true },
      { source: '/portfolio/miami-beach', destination: '/nearby-attractions', permanent: true },
      { source: '/thailand-exclusive-holidays', destination: '/nearby-attractions', permanent: true },

      // Terms
      { source: '/hotel-term-condition', destination: '/terms-and-condition', permanent: true },

      // Home page
      { source: '/pexels-pok-rie-144681', destination: '/', permanent: true },
      { source: '/hotels/madhuban-resort', destination: '/', permanent: true },
      { source: '/faqs', destination: '/', permanent: true },
      { source: '/our-services/phasellus-congue-lacus-eget', destination: '/', permanent: true },
      { source: '/home-5', destination: '/', permanent: true },
      { source: '/tag/madhuban-main-menu', destination: '/', permanent: true },
      { source: '/dsc_8879', destination: '/', permanent: true },
      { source: '/tag/island', destination: '/', permanent: true },
      { source: '/icon-boxes', destination: '/', permanent: true },
      { source: '/quisque-velit-nisi', destination: '/', permanent: true },
      { source: '/hotel-includes/wi-fi', destination: '/', permanent: true },
    ];
  },
};

export default nextConfig;
