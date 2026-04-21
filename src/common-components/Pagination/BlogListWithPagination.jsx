"use client";
import React, { useState } from "react";
import Pagination from "./Pagination";
import { motion } from "framer-motion";
import Card from "../card/Card";
import { getAllBlogs } from "@/services/blog/blogServices";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

function BlogListWithPagination({ initialBlogs, totalBlogs, limit }) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const handlePageChange = async (page) => {
    if (page === currentPage) return;
    setLoading(true);
    try {
      const res = await getAllBlogs(page, limit);
      const data = await res.json();
      const newBlogs = Array.isArray(data?.blogs) ? data.blogs : [];
      setBlogs(newBlogs);
      setCurrentPage(page);
    } catch (error) {
      console.error("Failed to load blogs page:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="relative w-full" aria-busy={loading}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        )}

        <div className={`${loading ? "pointer-events-none select-none" : ""} `}>
          <div>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 "
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={containerVariants}
            >
              {blogs?.map((val, i) => (
                <motion.div variants={itemVariants} key={i}>
                  <Card
                    imageUrl={
                      val?.featuredImage?.url ||
                      "https://pub-ec3822a2d8d6482db36eb9dadc028ea6.r2.dev/no-image/no-image.png"
                    }
                    altText={val?.featuredImage?.alt || "Blog Image"}
                    hrefLink={`blogs/${val?.uid}`}
                    title={val?.title}
                    createdAt={val?.createdAt?.split("T")[0]}
                    cardkey={val?._id}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalBlogs}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogListWithPagination;
