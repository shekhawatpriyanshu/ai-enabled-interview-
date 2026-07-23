import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

import useContest from "../../hooks/useContest";

import ContestStats from "../../components/contest/ContestStats";
import ContestTable from "../../components/contest/ContestTable";
import DeleteContestModal from "../../components/contest/DeleteContestModal";

const ContestList = () => {
  const {
    contests,
    loading,
    loadContests,
    removeContest,
  } = useContest();

  const [search, setSearch] = useState("");

  const [deleteModal, setDeleteModal] =
    useState(false);

  const [selectedContest, setSelectedContest] =
    useState(null);

  useEffect(() => {
    loadContests();
  }, []);

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const keyword =
        search.toLowerCase();

      return (
        contest.title
          ?.toLowerCase()
          .includes(keyword) ||
        contest.description
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [contests, search]);

  const handleDeleteClick = (
    contest
  ) => {
    setSelectedContest(contest);
    setDeleteModal(true);
  };

  const handleDelete = async (
    id
  ) => {
    await removeContest(id);

    setDeleteModal(false);

    setSelectedContest(null);
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Contest Management
          </h1>

          <p className="text-gray-500 mt-1">
            Create, edit and manage coding contests.
          </p>

        </div>

        <Link
          to="/admin/contests/add"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <FaPlus />

          Add Contest
        </Link>

      </div>

      {/* Statistics */}

      <ContestStats
        contests={contests}
      />

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Contests
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Table */}

      <div className="bg-white rounded-lg shadow">

        <ContestTable
          contests={
            filteredContests
          }
          loading={loading}
          onDelete={
            handleDeleteClick
          }
        />

      </div>

      {/* Delete Modal */}

      <DeleteContestModal
        isOpen={deleteModal}
        contest={selectedContest}
        loading={loading}
        onClose={() =>
          setDeleteModal(false)
        }
        onConfirm={
          handleDelete
        }
      />

    </div>
  );
};

export default ContestList;