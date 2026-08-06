import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaCode } from "react-icons/fa";

import {
  getProblems,
  deleteProblem,
  toggleStatus,
} from "../../services/codingApi";
import CodingFilters from "../../components/coding/CodingFilter";
import CodingTable from "../../components/coding/CodingTable";
import Pagination from "../../components/coding/Pagination";
import DeleteCodingModal from "../../components/coding/DeleteCodingModal";

const CodingList = () => {
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");

  const loadProblems = async () => {
    try {
      setLoading(true);
      const { data } = await getProblems({
        page,
        search,
        difficulty,
        status,
      });
      setProblems(data.problems);
      setPages(data.pages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, [page, search, difficulty, status]);

  const openDeleteModal = (problem) => {
    setSelectedProblem(problem);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteProblem(selectedProblem._id);
      loadProblems();
      setShowDeleteModal(false);
      setSelectedProblem(null);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatus = async (id) => {
    try {
      await toggleStatus(id);
      loadProblems();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 animate-bounce">
              <FaCode />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Coding Problems
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Manage, configure, and curate technical coding challenges, test cases, and starter code.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/coding/add")}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 group"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" /> Add Coding Problem
        </button>
      </div>

      {/* 2. FILTERS */}
      <CodingFilters
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        status={status}
        setStatus={setStatus}
      />

      {/* 3. TABLE */}
      <CodingTable
        problems={problems}
        currentPage={page}
        pageSize={10}
        loading={loading}
        onDelete={openDeleteModal}
        onToggleStatus={handleStatus}
      />

      {/* 4. PAGINATION */}
      <Pagination
        currentPage={page}
        totalPages={pages}
        onPageChange={setPage}
      />

      {/* 5. DELETE MODAL */}
      <DeleteCodingModal
        show={showDeleteModal}
        loading={deleteLoading}
        problemTitle={selectedProblem?.title}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProblem(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default CodingList;