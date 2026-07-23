import { useEffect, useState } from "react";
import { FaCommentDots } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import CommentTable from "../../components/community/CommentTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";

const CommentList = () => {
  const {
    loading,
    getComments,
    deleteComment,
  } = useAdminCommunity();

  const [comments, setComments] = useState([]);

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedComment, setSelectedComment] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

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

  const openDeleteModal = (comment) => {
    setSelectedComment(comment);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedComment) return;

    const response = await deleteComment(
      selectedComment._id
    );

    if (response?.success) {
      setShowDeleteModal(false);
      setSelectedComment(null);
      loadComments();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-3">

          <FaCommentDots className="text-3xl text-green-600" />

          <div>

            <h1 className="text-3xl font-bold">
              Comment Management
            </h1>

            <p className="text-gray-500">
              Moderate all discussion comments.
            </p>

          </div>

        </div>

      </div>

      {/* Search */}

      <SearchBar
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search comments..."
      />

      {/* Table */}

      <div className="mt-6">

        <CommentTable
          comments={comments}
          loading={loading}
          onDelete={openDeleteModal}
        />

      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-8">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-4 py-2 font-semibold">
          {page} / {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

      {/* Delete Modal */}

      <DeleteModal
        open={showDeleteModal}
        title="Delete Comment"
        message="Are you sure you want to delete this comment?"
        onClose={() =>
          setShowDeleteModal(false)
        }
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default CommentList;