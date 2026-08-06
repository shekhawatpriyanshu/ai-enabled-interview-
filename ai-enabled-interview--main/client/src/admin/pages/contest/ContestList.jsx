import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch, FaTrophy } from "react-icons/fa";

import useContest from "../../hooks/useContest";

import ContestStats from "../../components/contest/ContestStats";
import ContestTable from "../../components/contest/ContestTable";
import DeleteContestModal from "../../components/contest/DeleteContestModal";

const ContestList = () => {
  const { contests, loading, loadContests, removeContest } = useContest();

  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);

  useEffect(() => {
    loadContests();
  }, []);

  const filteredContests = useMemo(() => {
    return contests.filter((contest) => {
      const keyword = search.toLowerCase();
      return (
        contest.title?.toLowerCase().includes(keyword) ||
        contest.description?.toLowerCase().includes(keyword)
      );
    });
  }, [contests, search]);

  const handleDeleteClick = (contest) => {
    setSelectedContest(contest);
    setDeleteModal(true);
  };

  const handleDelete = async (id) => {
    await removeContest(id);
    setDeleteModal(false);
    setSelectedContest(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
              <FaTrophy />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Contest Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Create, schedule, organize, and monitor competitive coding contests.
          </p>
        </div>

        <Link
          to="/admin/contests/add"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 active:scale-95 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <FaPlus /> Add New Contest
        </Link>
      </div>

      {/* 2. STATS BAR */}
      <ContestStats contests={contests} />

      {/* 3. SEARCH CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Type to search contests by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-sm"
          />
        </div>
      </div>

      {/* 4. CONTEST TABLE */}
      <div>
        <ContestTable
          contests={filteredContests}
          loading={loading}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* 5. DELETE MODAL */}
      <DeleteContestModal
        isOpen={deleteModal}
        contest={selectedContest}
        loading={loading}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ContestList;