import { FaSearch, FaUndo } from "react-icons/fa";

const CodingFilters = ({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  status,
  setStatus,
}) => {
  const resetFilters = () => {
    setSearch("");
    setDifficulty("");
    setStatus("");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Problem
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Difficulty */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Difficulty
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {/* Status */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Status
          </label>
          <select
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {/* Reset */}
        <div>
          <button
            onClick={resetFilters}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
          >
            <FaUndo className="w-4 h-4" />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodingFilters;