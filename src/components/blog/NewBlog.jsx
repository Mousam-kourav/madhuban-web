export const dynamic = "force-dynamic";
import React from "react";
import BlogListWithPagination from "@/common-components/Pagination/BlogListWithPagination";
import BlogBanner from "./BlogBanner";
import NaturesStory from "./NaturesStory";
import DecorativeHeading from "@/common-components/heading/DecorativeHeading";

const LIMIT = 8;

const NewBlogPage = ({ blogs, posts }) => {
  return (
    <div>
      <BlogBanner />
      <NaturesStory />
      <div className="custom-container py-4 md:py-8">
        <DecorativeHeading text={"Blogs"} as="h2" textClasses={"w-50"} />

        <div className="mt-4 md:mt-10 flex items-center justify-center gap-5">
          {!blogs.length ? (
            <div className="text-center">
              <p className="text-primary-gray2 text-lg md:text-xl">
                {" "}
                No blogs available at the moment.{" "}
              </p>
              <p className="text-primary-gray2 text-sm">
                Stay tuned—we’ll be sharing insights, stories, and experiences
                very soon.
              </p>
            </div>
          ) : (
            <BlogListWithPagination
              initialBlogs={blogs}
              totalBlogs={posts.totalpages}
              limit={LIMIT}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default NewBlogPage;
