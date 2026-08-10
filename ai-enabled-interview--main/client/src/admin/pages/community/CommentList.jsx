import { useEffect, useState } from "react";
import { FaCommentDots, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import CommentTable from "../../components/community/CommentTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";
import ViewCommentModal from "../../components/community/ViewCommentModal";
import EditCommentModal from "../../components/community/EditCommentModal";

const CommentList = () => {
  const { loading, getComments, updateComment, deleteComment } = useAdminCommunity();

  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedComment, setSelectedComment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    loadComments();
  }, [page, search]);

  const loadComments = async () => {
    const response = await getComments({
      page,
      limit: 10,
      search,
    });

    if (response?.success) {
      setComments(response.comments);
      setPages(response.pages);
    }
  };

  const openViewModal = (comment) => {
    setSelectedComment(comment);
    setShowViewModal(true);
  };

  const openEditModal = (comment) => {
    setSelectedComment(comment);
    setShowEditModal(true);
  };

  const openDeleteModal = (comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const handleUpdate = async (id, updatedText) => {
    const response = await updateComment(id, { text: updatedText });
    if (response?.success) {
      toast.success("Comment updated successfully!");
      setShowEditModal(false);
      setSelectedComment(null);
      loadComments();
    }
  };

  const handleDelete = async () => {
    if (!selectedComment) return;

    const response = await deleteComment(selectedComment._id);

    if (response?.success) {
      toast.success("Comment deleted successfully!");
      setShowDeleteModal(false);
      setSelectedComment(null);
      loadComments();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-bounce">
              <FaCommentDots />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Comment Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Moderate, view, edit, and curate all discussion comments posted across the community.
          </p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Type to search comments by user or keyword..."
        />
      </div>

      {/* 3. COMMENT TABLE */}
      <div>
        <CommentTable
          comments={comments}
          loading={loading}
          onView={openViewModal}
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
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center gap-2 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-40 transition shadow-md shadow-purple-500/20 active:scale-95 cursor-pointer"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* 5. VIEW MODAL */}
      <ViewCommentModal
        open={showViewModal}
        comment={selectedComment}
        onClose={() => {
          setShowViewModal(false);
          setSelectedComment(null);
        }}
      />

      {/* 6. EDIT MODAL */}
      <EditCommentModal
        open={showEditModal}
        comment={selectedComment}
        onClose={() => {
          setShowEditModal(false);
          setSelectedComment(null);
        }}
        onSave={handleUpdate}
      />

      {/* 7. DELETE MODAL */}
      <DeleteModal
        open={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to permanently remove this comment? This action cannot be undone."
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedComment(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default CommentList;