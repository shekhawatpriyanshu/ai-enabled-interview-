import { useEffect, useState } from "react";
import {
  FaAward,
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaSave,
  FaSearch,
  FaThLarge,
  FaList,
  FaMagic,
  FaMedal,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
} from "react-icons/fa";
import useBadge from "../../hooks/useBadge";

// Multi-Color Card Palette Cycles
const CARD_THEMES = [
  {
    bg: "bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white hover:from-emerald-100/90 hover:to-teal-50",
    border: "border-emerald-200/90 hover:border-emerald-400",
    iconBg: "bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-emerald-500/30",
    titleColor: "group-hover:text-emerald-600",
  },
  {
    bg: "bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white hover:from-purple-100/90 hover:to-fuchsia-50",
    border: "border-purple-200/90 hover:border-purple-400",
    iconBg: "bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white shadow-purple-500/30",
    titleColor: "group-hover:text-purple-600",
  },
  {
    bg: "bg-gradient-to-br from-rose-50/90 via-pink-50/40 to-white hover:from-rose-100/90 hover:to-pink-50",
    border: "border-rose-200/90 hover:border-rose-400",
    iconBg: "bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-500 text-white shadow-rose-500/30",
    titleColor: "group-hover:text-rose-600",
  },
  {
    bg: "bg-gradient-to-br from-cyan-50/90 via-blue-50/40 to-white hover:from-cyan-100/90 hover:to-blue-50",
    border: "border-cyan-200/90 hover:border-cyan-400",
    iconBg: "bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/30",
    titleColor: "group-hover:text-cyan-600",
  },
  {
    bg: "bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white hover:from-amber-100/90 hover:to-orange-50",
    border: "border-amber-200/90 hover:border-amber-400",
    iconBg: "bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white shadow-amber-500/30",
    titleColor: "group-hover:text-amber-600",
  },
  {
    bg: "bg-gradient-to-br from-violet-50/90 via-indigo-50/40 to-white hover:from-violet-100/90 hover:to-indigo-50",
    border: "border-violet-200/90 hover:border-violet-400",
    iconBg: "bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-600 text-white shadow-violet-500/30",
    titleColor: "group-hover:text-violet-600",
  },
];

const BadgeManagement = () => {
  const { loading, badges, getBadges, createBadge, updateBadge, deleteBadge } = useBadge();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [deleteModalId, setDeleteModalId] = useState(null);

  useEffect(() => {
    getBadges();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleEdit = (badge) => {
    setEditingId(badge._id);
    setFormData({
      title: badge.title,
      description: badge.description,
      icon: badge.icon || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    let success;
    if (editingId) {
      success = await updateBadge(editingId, formData);
    } else {
      success = await createBadge(formData);
    }

    if (success) {
      handleCancel();
      getBadges();
    }
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    const success = await deleteBadge(deleteModalId);
    if (success) {
      setDeleteModalId(null);
      getBadges();
    }
  };

  const filteredBadges = badges.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30 animate-bounce">
              <FaCrown />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Badge Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Design, curate, and issue multi-tiered gamification badges to motivate learners.
          </p>
        </div>

        {/* Search Bar & View Mode Switcher */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15 transition-all shadow-sm"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Grid View"
            >
              <FaThLarge />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-2.5 rounded-lg text-sm transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              title="Table View"
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>

      {/* 2. TOTAL BADGES SUMMARY BAR */}
      <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-white border border-amber-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-between group max-w-sm">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-amber-700/80">
            Total Badges
          </p>
          <h3 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
            {badges.length}
          </h3>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
          <FaMedal />
        </div>
      </div>

      {/* 3. MAIN CONTENT: FORM + BADGES SHOWCASE */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 p-5 text-white flex items-center justify-between shadow-md">
              <h2 className="text-lg font-black flex items-center gap-2.5 tracking-wide">
                {editingId ? <FaEdit className="animate-spin" /> : <FaPlus />}
                {editingId ? "Edit Badge Details" : "Create New Badge"}
              </h2>
              {editingId && (
                <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-extrabold uppercase tracking-wider backdrop-blur-md">
                  Editing Mode
                </span>
              )}
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Badge Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. MERN Stack Master"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain how users can earn this badge..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all resize-none shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                  Icon URL (Optional)
                </label>
                <input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="https://example.com/icon.png"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/15 transition-all shadow-sm"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold flex items-center gap-2">
                  <FaExclamationTriangle className="shrink-0 text-sm" />
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2.5 pt-2">
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-extrabold hover:bg-slate-100 transition text-xs whitespace-nowrap flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                  >
                    <FaTimes /> Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-md shadow-indigo-500/20 active:scale-95 disabled:opacity-50 text-xs whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {editingId ? (
                    <>
                      <FaSave /> Update Badge
                    </>
                  ) : (
                    <>
                      <FaPlus /> Create Badge
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Badges Directory (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              Badges Directory
              <span className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                {filteredBadges.length}
              </span>
            </h2>
            <span className="text-xs font-bold text-slate-400">
              Showing {filteredBadges.length} of {badges.length}
            </span>
          </div>

          {loading && badges.length === 0 ? (
            <div className="flex justify-center items-center py-24">
              <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <FaAward className="text-4xl text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold text-base">No Badges Found</p>
              <p className="text-slate-400 text-xs mt-1 font-medium">
                Try refining your search query or create a new badge.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* MULTI-COLOR GRID SHOWCASE */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredBadges.map((badge, idx) => {
                const theme = CARD_THEMES[idx % CARD_THEMES.length];
                return (
                  <div
                    key={badge._id}
                    className={`rounded-2xl border ${theme.border} ${theme.bg} p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex flex-col justify-between gap-3`}
                  >
                    {/* Header Row: Badge Icon on Left, Edit/Delete Actions on Right */}
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${theme.iconBg} p-0.5 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                        <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
                          {badge.icon ? (
                            <img
                              src={badge.icon}
                              alt={badge.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaAward className="text-xl drop-shadow-sm text-slate-800" />
                          )}
                        </div>
                      </div>

                      {/* Quick Action Overlay Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleEdit(badge)}
                          className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                          title="Edit Badge"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => setDeleteModalId(badge._id)}
                          className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow active:scale-95 cursor-pointer"
                          title="Delete Badge"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {/* Card Content: Full Title and Full Description */}
                    <div className="space-y-1.5">
                      <h3 className={`font-black text-base text-slate-900 ${theme.titleColor} transition-colors break-words leading-snug`}>
                        {badge.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed break-words">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MULTI-COLOR TABLE VIEW */
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500">
                      Badge
                    </th>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500">
                      Description
                    </th>
                    <th className="px-5 py-3.5 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[110px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBadges.map((badge, idx) => {
                    const theme = CARD_THEMES[idx % CARD_THEMES.length];
                    return (
                      <tr
                        key={badge._id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl ${theme.iconBg} flex items-center justify-center text-white font-bold shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                              {badge.icon ? (
                                <img
                                  src={badge.icon}
                                  alt={badge.title}
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              ) : (
                                <FaAward className="text-lg" />
                              )}
                            </div>
                            <span className={`font-black text-sm text-slate-900 ${theme.titleColor} transition-colors`}>
                              {badge.title}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-slate-600 line-clamp-2 max-w-xs font-semibold">
                            {badge.description}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleEdit(badge)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs transition-all shadow-sm cursor-pointer"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => setDeleteModalId(badge._id)}
                              className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition-all shadow-sm cursor-pointer"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto shadow-inner">
              <FaTrash />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Delete Badge?</h3>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Are you sure you want to permanently delete this badge? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition text-sm shadow-lg shadow-rose-600/25 cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeManagement;
