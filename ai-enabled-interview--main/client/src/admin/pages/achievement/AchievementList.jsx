import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaSearch,
  FaSyncAlt,
  FaTrophy,
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
  // Live Load Data on Search / Filter Change
  // ===================================
  useEffect(() => {
    const timer = setTimeout(() => {
      getAchievements({
        page,
        limit: pageSize,
        search,
        category,
        status,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, status, page]);

  const handleDelete = (achievement) => {
    setDeleteItem(achievement);
  };

  const confirmDelete = async () => {
    await deleteAchievement(deleteItem._id);
    setDeleteItem(null);
  };

  const handleToggleStatus = async (id) => {
    const success = await toggleStatus(id);
    if (success) {
      getAchievements({
        page,
        limit: pageSize,
        search,
        category,
        status,
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-bounce">
              <FaTrophy />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Achievement Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Configure automated milestone achievements, point rewards, and linked badges for learners.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/admin/achievement/add"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:via-rose-600 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-rose-500/25 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
          >
            <FaPlus /> Add Achievement
          </Link>
        </div>
      </div>

      {/* Live Search & Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search Input Box (Instant Search) */}
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Type to search achievement..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm cursor-pointer"
          >
            <option value="">📚  All Categories</option>
            <option value="coding">💻 Coding</option>
            <option value="questions">❓ Questions</option>
            <option value="tests">📝 Tests</option>
            <option value="contests">🏆 Contests</option>
            <option value="interviews">🎤 Interviews</option>
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm cursor-pointer"
          >
            <option value=""> 📋 All Status</option>
            <option value="true">🟢 Active</option>
            <option value="false">⚪ Inactive</option>
          </select>
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
    </div >
  );
};

export default AchievementList;
