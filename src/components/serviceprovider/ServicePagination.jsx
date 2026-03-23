"use client";

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

const ServicePagination = ({ meta, currentPage, onPageChange }) => {
  const { totalPage } = meta;

  // If there's only one page, don't show pagination at all
  if (totalPage <= 1) return null;

  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPage) onPageChange(currentPage + 1);
  };

  // Logic to show page numbers with ellipses (...)
  const getPageNumbers = () => {
    const pages = [];
    const showEllipses = totalPage > 5;

    if (!showEllipses) {
      for (let i = 1; i <= totalPage; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) pages.push("dots-prev");

      // Show current page and neighbors
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPage - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }

      if (currentPage < totalPage - 2) pages.push("dots-next");

      // Always show last page
      pages.push(totalPage);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 border-t border-slate-100 mt-8">
      {/* Result Info */}
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
        Page {currentPage} of {totalPage}
      </p>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-1">
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === "dots-prev" || page === "dots-next") {
              return (
                <div
                  key={`dots-${index}`}
                  className="w-10 h-10 flex items-center justify-center text-slate-300"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              );
            }

            const isActive = currentPage === page;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#115E59] text-white shadow-lg shadow-teal-900/20"
                    : "text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentPage === totalPage}
          className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  );
};

export default ServicePagination;
