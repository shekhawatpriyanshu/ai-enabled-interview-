import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import DeleteModal from "../../../admin/components/achievement/DeleteModal";
import useAchievement from "../../../admin/hooks/useAchievement";

import AchievementTable from "../../../admin/components/achievement/AchievementTable";

const AchievementList = () => {
  const {
    loading,
    achievements,
    pagination,
    getAchievements,
    deleteAchievement,
    toggleStatus,
  } = useAchievement();

  const [search, setSearch] = useState("");

  const [category, setCategory] =
    useState("");
const [deleteItem, setDeleteItem] = useState(null);
  const [status, setStatus] =
    useState("");

  const [page, setPage] = useState(1);

  const pageSize = 10;

  // ===================================
  // Load Data
  // ===================================

  useEffect(() => {
    loadAchievements();
  }, [page, category, status]);

  const loadAchievements = () => {
    getAchievements({
      page,
      limit: pageSize,
      search,
      category,
      status,
    });
  };

  // ===================================
  // Search
  // ===================================
const handleDelete = (achievement)=>{
    setDeleteItem(achievement);
};
const confirmDelete = async()=>{

    await deleteAchievement(
        deleteItem._id
    );

    setDeleteItem(null);

    loadAchievements();
};
  const handleSearch = () => {
    setPage(1);

    loadAchievements();
  };
// ===================================
// Toggle Status
// ===================================

const handleToggleStatus =
  async (id) => {
    const success =
      await toggleStatus(id);

    if (success) {
      loadAchievements();
    }
  };
  return (
    <div className="space-y-6">
      {/* ===========================
            Header
      ============================ */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Achievement Management
          </h1>

          <p className="text-slate-500 mt-1">
            Manage achievements,
            rewards and badges.
          </p>
        </div>

        <div className="flex gap-3">

          <Link
            to="/admin/achievement/add"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <FaPlus />

            Add Achievement
          </Link>
        </div>
      </div>

      {/* ===========================
            Filters
      ============================ */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          {/* Search */}
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search achievement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="coding">Coding</option>
            <option value="questions">Questions</option>
            <option value="tests">Tests</option>
            <option value="contests">Contests</option>
            <option value="interviews">Interviews</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl px-4 py-2.5 font-semibold transition active:scale-95 shadow-sm"
          >
            Search
          </button>
        </div>
      </div>

      {/* ===========================
            Table
      ============================ */}

      <AchievementTable
        achievements={achievements}
        loading={loading}
        currentPage={page}
        pageSize={pageSize}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      {/* ===================================
            Pagination
      =================================== */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold">
            {achievements.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold">
            {pagination.total}
          </span>{" "}
          achievements
        </p>

        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage((prev) => prev - 1)
            }
            className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Previous
          </button>

          <span className="px-4 py-2 rounded-lg bg-slate-100 font-semibold">
            {page} / {pagination.totalPages || 1}
          </span>

          <button
            disabled={
              page >= pagination.totalPages
            }
            onClick={() =>
              setPage((prev) => prev + 1)
            }
            className="px-4 py-2 rounded-lg border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>
      <DeleteModal
        open={!!deleteItem}
        title="Delete Achievement"
        message={`Are you sure you want to delete "${deleteItem?.title}"?`}
        onCancel={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        loading={loading}
      />
    </div>
  );
};

export default AchievementList;
      