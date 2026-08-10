import { useEffect, useState } from "react";
import { FaComments, FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import DiscussionTable from "../../components/community/DiscussionTable";
import DeleteModal from "../../components/community/DeleteModal";
import EditDiscussionModal from "../../components/community/EditDiscussionModal";

const DiscussionList = () => {
  const { loading, getDiscussions, updateDiscussion, deleteDiscussion } = useAdminCommunity();

  const [discussions, setDiscussions] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");

  const [selectedDiscussion, setSelectedDiscussion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [page, search, sort]);

  const loadDiscussions = async () => {
    const response = await getDiscussions({
      page,
      limit: 10,
      search,
      sort,
    });

    if (response?.success) {
      setDiscussions(response.discussions);
      setPages(response.pages);
      setTotal(response.total || 0);
    }
  };

  const openEditModal = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowEditModal(true);
  };

  const openDeleteModal = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowDelete(true);
  };

  const handleUpdate = async (id, updatedData) => {
    const response = await updateDiscussion(id, updatedData);
    if (response?.success) {
      toast.success("Discussion updated successfully!");
      setShowEditModal(false);
      setSelectedDiscussion(null);
      loadDiscussions();
    }
  };

  const handleDelete = async () => {
    if (!selectedDiscussion) return;

    const response = await deleteDiscussion(selectedDiscussion._id);

    if (response?.success) {
      toast.success("Discussion deleted successfully!");
      setShowDelete(false);
      setSelectedDiscussion(null);
      loadDiscussions();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 animate-bounce">
              <FaComments />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Discussion Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Curate, monitor, edit, and manage community discussion threads and topics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSearch("");
              setSort("-createdAt");
              setPage(1);
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-2 text-xs shadow-lg shadow-indigo-500/25 active:scale-95 transition-all duration-300 cursor-pointer whitespace-nowrap"
            title="Click to reset filters"
          >
            <FaComments /> Total Discussions: {total}
          </button>
        </div>
      </div>

      {/* 2. SEARCH & SORT BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Live Search */}
          <div className="relative flex items-center md:col-span-2">
            <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Type to search discussions by title or content..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm"
            />
          </div>

          {/* Sort Selector */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm cursor-pointer"
          >
            <option value="-createdAt">✨ Newest First</option>
            <option value="createdAt">⏳ Oldest First</option>
            <option value="likes">🔥 Most Likes</option>
            <option value="comments">💬 Most Comments</option>
          </select>
        </div>
      </div>

      {/* 3. DISCUSSION TABLE */}
      <div>
        <DiscussionTable
          loading={loading}
          discussions={discussions}
          onEdit={openEditModal}
          onDelete={openDeleteModal}
        />
      </div>

      {/* 4. PAGINATION */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-xs flex items-center gap-2 hover:bg-slate-100 disabled:opacity-40 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <FaChevronLeft /> Previous
          </button>

          <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-black text-xs border border-slate-200 shadow-inner">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold text-xs flex items-center gap-2 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-40 transition shadow-md shadow-indigo-500/20 active:scale-95 cursor-pointer"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* 5. EDIT MODAL */}
      <EditDiscussionModal
        open={showEditModal}
        discussion={selectedDiscussion}
        onClose={() => {
          setShowEditModal(false);
          setSelectedDiscussion(null);
        }}
        onSave={handleUpdate}
      />

      {/* 6. DELETE MODAL */}
      <DeleteModal
        open={showDelete}
        title="Delete Discussion"
        message="Are you sure you want to permanently delete this discussion thread?"
        onClose={() => {
          setShowDelete(false);
          setSelectedDiscussion(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default DiscussionList;