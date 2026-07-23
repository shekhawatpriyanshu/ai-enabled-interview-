import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Coding Problems</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and configure all user coding challenges and test cases.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/coding/add")}
          className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition duration-200 active:scale-95 cursor-pointer text-sm"
        >
          <FaPlus className="text-xs" />
          Add Problem
        </button>
      </div>

      <CodingFilters
        search={search}
        setSearch={setSearch}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        status={status}
        setStatus={setStatus}
      />

      <CodingTable
        problems={problems}
        currentPage={page}
        pageSize={10}
        loading={loading}
        onDelete={openDeleteModal}
        onToggleStatus={handleStatus}
      />

      <Pagination
        currentPage={page}
        totalPages={pages}
        onPageChange={setPage}
      />

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