"use client";

import React, { useState } from "react";
import Image from "next/image";
import CustomLinkBtn from "@/common-component/CustomLinkBtn/CustomLinBtn";
import { BASE_URL_API } from "@/lib/common";
import Pagination from "./Pagination";

function NewsListPagination({ initialBlogs, totalBlogs, limit }) {
  const [blogs, setBlogs] = useState(initialBlogs || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  

  const handlePageChange = async (page) => {
    if (page === currentPage || loading) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL_API}blogs/all/ed_tech?type=news&status=Published&page=${page}&limit=${limit}`,
        { cache: "no-store" }
      );
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
      <div className="relative" aria-busy={loading}>
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="h-10 w-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
          </div>
        )}
        <div className={loading ? "pointer-events-none select-none" : ""}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 i">
            {blogs.map((val) => (
              <div
                key={val?._id}
                className="rounded-[10px] overflow-hidden 
              shadow-md transition-all duration-300 ease-in-out bg-[#E5FBFF]
              hover:scale-105 hover:shadow focus:scale-105 focus:shadow active:scale-105 active:shadow cursor-pointer"
              >
                <div className="relative w-full h-[180px] rounded-tl-[20px] rounded-tr-[0px] rounded-br-[20px] rounded-bl-[0px] overflow-hidden">
                  <Image
                    src={val?.featuredImage?.url || "/placeholder.jpg"}
                    fill
                    quality={90}
                    alt={val?.featuredImage?.alt || "News Image"}
                    className="object-cover transition-transform duration-300
                  group-hover:scale-110 group-focus:scale-110 group-active:scale-110"
                  />
                </div>
                <div className="p-3">
                  <p className="text-slate-500 text-[13px]">
                    {val?.createdAt?.split("T")[0]}
                  </p>
                  <h3 className="line-clamp-2 mt-3 mb-4 h-[50px]">
                    {val.title}
                  </h3>
                  <CustomLinkBtn
                    color="red"
                    height="30px"
                    href={`educational-news/${val?.uid}`}
                  >
                    Read More +
                  </CustomLinkBtn>
                </div>

              </div>

            ))}

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

export default NewsListPagination;