import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaThLarge, FaList, FaClipboardList, FaFilter } from "react-icons/fa";

import useMockTest from "../../../admin/hooks/useMockTest";

import MockTestTable from "../../../admin/components/test/MockTestTable";
import MockTestCard from "../../../admin/components/test/MockTestCard";
import DeleteMockTestModal from "../../../admin/components/test/DeleteMockTestModal";
import MockTestStats from "../../../admin/components/test/MockTestStats";

const ITEMS_PER_PAGE = 9;

const MockTestList = () => {
  const {
    tests,
    loading,
    loadMockTests,
    removeMockTest,
  } = useMockTest();

  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("ALL");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadMockTests();
  }, []);

  // Filter logic
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchesSearch =
        test.title?.toLowerCase().includes(search.toLowerCase()) ||
        test.description?.toLowerCase().includes(search.toLowerCase());

      const matchesDifficulty =
        difficultyFilter === "ALL" || test.difficulty === difficultyFilter;

      return matchesSearch && matchesDifficulty;
    });
  }, [tests, search, difficultyFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE) || 1;

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteClick = (test) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    await removeMockTest(id);
    setShowDeleteModal(false);
    setSelectedTest(null);
    loadMockTests();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <FaClipboardList />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Mock Test Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Create, view, edit, and organize all mock interview tests.
          </p>
        </div>

        <Link
          to="/admin/mock-tests/add"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 transition-all duration-200 active:scale-95"
        >
          <FaPlus className="text-xs" />
          Add New Mock Test
        </Link>
      </div>

      {/* Stats KPI Cards */}
      <MockTestStats tests={tests} />

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search mock tests by title or description..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-inner"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Filters & View Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* Difficulty Filter */}
          <div className="relative flex items-center">
            <FaFilter className="absolute left-3.5 text-slate-400 text-xs pointer-events-none" />
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition cursor-pointer appearance-none"
            >
              <option value="ALL">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Grid / Table Toggle */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card Grid View"
            >
              <FaThLarge className="text-xs" /> Grid
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <FaList className="text-xs" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading mock tests...
          </p>
        </div>
      ) : filteredTests.length === 0 ? (
        /* Empty State */
        <div className="rounded-3xl bg-white p-12 border border-slate-200/90 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
            <FaClipboardList />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            No Mock Tests Found
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            We couldn't find any mock tests matching your filter settings. Try adjusting your search query or create a new test.
          </p>
          <Link
            to="/admin/mock-tests/add"
            className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95"
          >
            <FaPlus className="text-xs" />
            Create Mock Test
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedTests.map((test) => (
            <MockTestCard
              key={test._id}
              test={test}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <MockTestTable
            tests={paginatedTests}
            loading={loading}
            onDelete={handleDeleteClick}
          />
        </div>
      )}

      {/* Pagination Footer */}
      {!loading && totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-5 border border-slate-200/90 shadow-sm">
          <p className="text-xs font-semibold text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredTests.length)}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-800">
              {filteredTests.length}
            </span>{" "}
            mock tests
          </p>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              Previous
            </button>

            <span className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteMockTestModal
        isOpen={showDeleteModal}
        test={selectedTest}
        loading={loading}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTest(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MockTestList;