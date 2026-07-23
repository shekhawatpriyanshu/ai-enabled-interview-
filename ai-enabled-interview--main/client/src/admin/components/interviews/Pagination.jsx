import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Pagination = ({ page, pages, setPage }) => {
  if (!pages || pages <= 1) return null;

  const pageNumbers = [];

  let start = Math.max(1, page - 2);
  let end = Math.min(pages, page + 2);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">

      {/* First */}
      <button
        onClick={() => setPage(1)}
        disabled={page === 1}
        className={`p-2 rounded-lg border transition ${
          page === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-cyan-600 hover:text-white"
        }`}
      >
        <FaAngleDoubleLeft />
      </button>

      {/* Previous */}
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className={`p-2 rounded-lg border transition ${
          page === 1
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-cyan-600 hover:text-white"
        }`}
      >
        <FaAngleLeft />
      </button>

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => setPage(number)}
          className={`h-10 w-10 rounded-lg transition ${
            page === number
              ? "bg-cyan-600 text-white"
              : "border hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === pages}
        className={`p-2 rounded-lg border transition ${
          page === pages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-cyan-600 hover:text-white"
        }`}
      >
        <FaAngleRight />
      </button>

      {/* Last */}
      <button
        onClick={() => setPage(pages)}
        disabled={page === pages}
        className={`p-2 rounded-lg border transition ${
          page === pages
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-cyan-600 hover:text-white"
        }`}
      >
        <FaAngleDoubleRight />
      </button>
    </div>
  );
};

export default Pagination;