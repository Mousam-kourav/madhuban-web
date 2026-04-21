"use client";

import React from "react";

function getPageNumbers(currentPage, totalPages) {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  pages.push(1);

  if (currentPage > 3) {
    pages.push("left-ellipsis");
  }

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < totalPages - 2) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);

  return pages;
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const handlePrev = () => {
    if (hasPrev) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (hasNext) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page) => {
    if (typeof page !== "number" || page === currentPage) return;
    onPageChange(page);
  };

  return (
    <nav
      className="mt-10 flex justify-center"
      aria-label="Pagination Navigation"
    >
      <ul className="inline-flex items-center gap-1 bg-white/80 border border-slate-200 rounded-full px-2 py-1 shadow-sm backdrop-blur">
        <li>
          <button
            type="button"
            onClick={handlePrev}
            disabled={!hasPrev}
            className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs font-medium cursor-pointer
              ${hasPrev
                ? "border-slate-200 text-slate-700 hover:bg-slate-100"
                : "border-transparent text-slate-300 cursor-not-allowed"
              }`}
            aria-label="Previous page"
          >
            ‹
          </button>
        </li>

        {pages.map((page, index) => {
          if (page === "left-ellipsis" || page === "right-ellipsis") {
            return (
              <li key={page + index}>
                <span className="px-2 text-xs text-slate-400 select-none">
                  ...
                </span>
              </li>
            );
          }

          const isActive = page === currentPage;

          return (
            <li key={page}>
              <button
                type="button"
                onClick={() => handlePageClick(page)}
                className={`min-w-[2rem] h-8 px-2 rounded-full text-xs font-medium transition-colors cursor-pointer
                  ${isActive
                    ? "bg-primary-gray2 text-white shadow-sm"
                    : "text-slate-700 hover:bg-slate-100"
                  }`}
                aria-current={isActive ? "page" : undefined}
              >
                {page}
              </button>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={handleNext}
            disabled={!hasNext}
            className={`w-8 h-8 flex items-center justify-center rounded-full border text-xs font-medium cursor-pointer
              ${hasNext
                ? "border-slate-200 text-slate-700 hover:bg-slate-100"
                : "border-transparent text-slate-300 cursor-not-allowed"
              }`}
            aria-label="Next page"
          >
            ›
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;