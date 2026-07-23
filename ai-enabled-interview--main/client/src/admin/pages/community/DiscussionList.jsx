import { useEffect, useState } from "react";
import { FaComments, FaPlus } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import DiscussionTable from "../../components/community/DiscussionTable";
import SearchBar from "../../components/community/SearchBar";
import FilterBar from "../../components/community/FilterBar";
import DeleteModal from "../../components/community/DeleteModal";

const DiscussionList = () => {
  const {
    loading,
    getDiscussions,
    deleteDiscussion,
  } = useAdminCommunity();

  const [discussions, setDiscussions] = useState([]);

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");

  const [sort, setSort] = useState("-createdAt");

  const [selectedDiscussion, setSelectedDiscussion] =
    useState(null);

  const [showDelete, setShowDelete] =
    useState(false);

  useEffect(() => {
    loadDiscussions();
  }, [page, search, sort]);

  const loadDiscussions = async () => {
    const response =
      await getDiscussions({
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

  const openDeleteModal = (discussion) => {
    setSelectedDiscussion(discussion);
    setShowDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedDiscussion) return;

    const response =
      await deleteDiscussion(
        selectedDiscussion._id
      );

    if (response?.success) {
      setShowDelete(false);
      setSelectedDiscussion(null);
      loadDiscussions();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">

        <div className="flex items-center gap-3">

          <FaComments className="text-3xl text-blue-600" />

          <div>

            <h1 className="text-3xl font-bold">
              Discussion Management
            </h1>

            <p className="text-gray-500">
              Manage all community discussions.
            </p>

          </div>

        </div>

        <button
          onClick={() => {
            setSearch("");
            setSort("-createdAt");
            setPage(1);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition"
          title="Click to reset filters"
        >
          <FaComments />
          Total Discussions: {total}
        </button>

      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          {/* Search */}
          <div className="relative flex items-center lg:col-span-2">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaComments className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search discussions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="likes">Most Likes</option>
            <option value="comments">Most Comments</option>
          </select>
        </div>
      </div>

      {/* Table */}

      <div className="mt-6">

        <DiscussionTable
          loading={loading}
          discussions={discussions}
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
        open={showDelete}
        title="Delete Discussion"
        message="Are you sure you want to delete this discussion?"
        onClose={() =>
          setShowDelete(false)
        }
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default DiscussionList;