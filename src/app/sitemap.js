import { getAllBlogs } from "@/services/blog/blogServices";
import { headers } from "next/headers";

const sitemapUrls = [
  { url: "/", priority: 1.0 },

  { url: "/about-us", priority: 0.8 },
  { url: "/stay", priority: 0.8 },
  { url: "/experiences", priority: 0.8 },
  { url: "/dining", priority: 0.8 },
  { url: "/nearby-attractions", priority: 0.8 },
  { url: "/gallery", priority: 0.8 },
  { url: "/contact-us", priority: 0.8 },
  { url: "/booking", priority: 0.8 },

  {
    url: "/experiences/forest-walks-and-nature-trails",
    priority: 0.8,
  },
  {
    url: "/experiences/bird-watching-and-wilderness",
    priority: 0.8,
  },
  {
    url: "/experiences/recreational-facilities",
    priority: 0.8,
  },

  { url: "/blogs", priority: 0.8 },
  { url: "/privacy-policy", priority: 0.8 },
  { url: "/terms-and-condition", priority: 0.8 },
  { url: "/cookies-and-consent-policy", priority: 0.8 },
  { url: "/disclaimer", priority: 0.8 },
  { url: "/stay/safari-tent", priority: 0.64 },
  { url: "/stay/mud-villa", priority: 0.64 },
  { url: "/stay/pool-side-room", priority: 0.64 },
  { url: "/stay/glamping-tents", priority: 0.64 },
  { url: "/stay/camping-tent", priority: 0.64 },
];

export default async function sitemap() {
  const baseUrl = "https://www.madhubanecoretreat.com";

  const lastmod = new Date().toISOString().replace("Z", "+00:00");

  let blogs = [];
  try {
    const blogResponse = await getAllBlogs();
    const data = blogResponse?.blogs;

    if (Array.isArray(data)) {
      data.forEach((item) => {
        blogs.push({
          url: `/blogs/${item.uid}`,
          priority: 0.64,
        });
      });
    }
  } catch (error) {
    console.log("Error fetching blogs:", error);
  }

  const allUrls = sitemapUrls.concat(blogs);

  return allUrls.map((item) => ({
    url: `${baseUrl}${item.url}`,
    lastModified: lastmod,
    priority: item.priority,
    changeFrequency: "weekly",
  }));
}
