import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLayerGroup, FaChevronLeft, FaChevronRight, FaArrowLeft } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import GroupTable from "../../components/community/GroupTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";

const GroupList = () => {
  const navigate = useNavigate();
  const { loading, getGroups, deleteGroup } = useAdminCommunity();

  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const loadGroups = async () => {
    const response = await getGroups({
      page,
      limit: 10,
      search,
    });

    if (response?.success) {
      setGroups(response.groups);
      setPages(response.pages);
    }
  };

  useEffect(() => {
    loadGroups();
  }, [page, search]);

  const openDeleteModal = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;

    const response = await deleteGroup(selectedGroup._id);

    if (response?.success) {
      setShowDeleteModal(false);
      setSelectedGroup(null);
      loadGroups();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* BACK BUTTON & HEADER SECTION */}
      <div className="space-y-4 border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer shadow-2xs"
        >
          <FaArrowLeft className="text-xs" />
          <span>Back</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 animate-bounce">
                <FaLayerGroup />
              </div>
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                Study Group Management
              </span>
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-2">
              Organize, monitor, and manage interactive community study groups.
            </p>
          </div>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study groups by name or description..."
        />
      </div>

      {/* 3. GROUP TABLE */}
      <div>
        <GroupTable
          groups={groups}
          loading={loading}
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
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs flex items-center gap-2 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 transition shadow-md shadow-emerald-500/20 active:scale-95 cursor-pointer"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* 5. DELETE MODAL */}
      <DeleteModal
        open={showDeleteModal}
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? All associated messages will also be permanently removed."
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default GroupList;