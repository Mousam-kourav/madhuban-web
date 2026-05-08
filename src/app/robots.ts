import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/book/*/payment", "/book/confirmation"] },
    sitemap: [
      "https://www.madhubanecoretreat.com/sitemap.xml",
      "https://www.madhubanecoretreat.com/sitemap-images.xml",
    ],
  };
}
