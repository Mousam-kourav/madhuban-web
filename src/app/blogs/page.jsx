import React from "react";
import NewBlogPage from "@/components/blog/NewBlog";
import SEO from "@/components/seo/Seo";
import { getAllBlogs } from "@/services/blog/blogServices";

const buildBlogsSchema = (blogs) => {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.madhubanecoretreat.com/blogs",
    name: "Madhuban Eco Retreat Blogs",
    description:
      "Nature stories, eco-travel guides, wildlife insights and sustainable living tips from Madhuban Eco Retreat, Ratapani.",
    url: "https://www.madhubanecoretreat.com/blogs",
    publisher: {
      "@type": "Organization",
      name: "Madhuban Eco Retreat",
      logo: {
        "@type": "ImageObject",
        url: "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/logo/madhuban-eco-retreat-bhopal-logo.png",
      },
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((blog, idx) => {
        return {
          "@type": "ListItem",
          position: idx + 1,
          url: `https://www.madhubanecoretreat.com/blogs/${blog.uid}`,
        };
      }),
    },
  };
};

const LIMIT = 8;

const BlogPage = async () => {
  const page = 1;
  const res = await getAllBlogs(page, LIMIT);
  const posts = res;
  const blogs = Array.isArray(posts?.blogs) ? posts.blogs : [];
  const blogSchema = buildBlogsSchema(blogs);

  return (
    <>
      <SEO schemas={[blogSchema]} />
      <NewBlogPage blogs={blogs} posts={posts} />
    </>
  );
};

export default BlogPage;

export const metadata = {
  title: "Madhuban Blog | Nature, Travel & Eco-Living Stories",

  description:
    "Read nature stories, travel guides, wildlife insights, and eco-living tips from Madhuban Eco Retreat. Explore Ratapani and sustainable travel through our blog.",

  keywords: [
    "madhuban blog",
    "ratapani travel blog",
    "eco travel mp",
    "sustainable travel madhya pradesh",
    "nature blog bhopal",
    "ratapani guides",
  ],

  alternates: {
    canonical: "https://www.madhubanecoretreat.com/blogs",
  },

  robots: {
    index: true,
    follow: true,
  },
};
