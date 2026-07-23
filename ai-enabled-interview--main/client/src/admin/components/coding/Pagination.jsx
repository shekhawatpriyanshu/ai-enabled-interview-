import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
      {/* Info */}
      <div className="text-sm font-semibold text-slate-600">
        Page <span className="text-slate-900 font-bold">{currentPage}</span> of{" "}
        <span className="text-slate-900 font-bold">{totalPages}</span>
      </div>

      {/* Buttons */}
      <nav className="flex items-center gap-1.5 flex-wrap">
        {/* First */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer"
        >
          First
        </button>

        {/* Previous */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer"
        >
          Previous
        </button>

        {/* Page Numbers */}
        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition active:scale-95 cursor-pointer ${
              currentPage === page
                ? "bg-cyan-600 text-white border-cyan-600 shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer"
        >
          Next
        </button>

        {/* Last */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="px-3 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer"
        >
          Last
        </button>
      </nav>
    </div>
  );
};

export default Pagination;