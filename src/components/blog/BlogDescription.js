"use client";
import StickyContactForm from "@/common-components/stickyContactForm/StickyContactForm";
import React, { useEffect, useState } from "react";

const BlogDescription = ({ blog }) => {
  const [headings, setHeadings] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState("");

  let data = blog?.description?.replace(
    /(<iframe\b[^>]*?)\s*sandbox=(["']?)?[^"'\s>]*?(["']?)?([^>]*>)/gi,
    "$1 $4"
  );

  data = data?.replace(
    /<table([^>]*)>([\s\S]*?)<\/table>/gi,
    '<div class="table-wrapper"><table$1>$2</table></div>'
  );

  useEffect(() => {
    const content = document.querySelector(".discriptionContent");
    if (!content) return;

    const elements = content.querySelectorAll("h2, h3");

    const newHeadings = Array.from(elements).map((el, index) => {
      const id = `heading-${index}`;
      el.id = id;
      return {
        id,
        text: el.innerText,
        level: el.tagName,
      };
    });

    setHeadings(newHeadings);
  }, [blog]);

  //  heading highlight
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <div className="bg-[#b4a681d8] pt-10">
      <div className="max-w-[1400px] mx-auto px-4">

        {/* ========== MOBILE / TABLET: TOC Dropdown ========== */}
        <div className="xl:hidden w-full mb-6">
          <div className="bg-white rounded-lg shadow-md">
            <button onClick={() => setOpen(!open)} className="w-full text-left px-5 py-4 font-semibold flex justify-between items-center text-gray-800" >
              📑 Table of Contents
              <span className="text-xl font-bold">{open ? "−" : "+"}</span>
            </button>

            {open && (
              <ul className="px-5 pb-4 space-y-2 text-sm">
                {headings.map((item) => (
                  <li  key={item.id} className={`${ item.level === "H3" ? "ml-4" : "" }`} >
                    <a href={`#${item.id}`} onClick={() => setOpen(false)}
                      className={`block py-1 transition-colors ${
                        activeId === item.id ? "text-green-700 font-semibold"  : "text-gray-600 hover:text-green-700"  }`} >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* MAIN LAYOUT  */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Table of Contents  */}
          <aside className="hidden xl:block xl:w-[22%]">
            <div className="sticky top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              {headings.length > 0 && (
                <div className="bg-white p-5 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-3"> 📑 Table of Contents </h3>
                  <nav>
                    <ul className="space-y-1 text-sm">
                      {headings.map((item) => (
                        <li  key={item.id} className={`${ item.level === "H3" ? "ml-4" : "" }`} >
                          <a href={`#${item.id}`}
                            className={`block py-1.5 px-3 rounded-md transition-all duration-200 ${
                              activeId === item.id
                                ? "bg-green-50 text-green-700 font-semibold border-l-3 border-green-600"
                                : "text-gray-600 hover:text-green-700 hover:bg-gray-50" }`}>
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </aside>

          {/*  Blog Content */}
          <main className="w-full xl:w-[52%]">
            <div className="no-tailwind">
              <div className="discriptionContent prose max-w-none bg-white p-6 md:p-8 rounded-lg shadow-md"
                dangerouslySetInnerHTML={{ __html: data }} ></div>
            </div>
          </main>

          {/* Contact Form / Modal  */}
          <aside className="hidden xl:block xl:w-[26%]">
            <div className="sticky top-28 space-y-6 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-thin">
              <StickyContactForm />
            </div>
          </aside>
        </div>

        {/*  Contact Form Below Content  */}
        <div className="xl:hidden w-full  py-10">
          <StickyContactForm />
        </div>
      </div>

      
    </div>
  );
};

export default BlogDescription;