import { FaSearch, FaFilter, FaToggleOn } from "react-icons/fa";

const CodingFilters = ({
  search,
  setSearch,
  difficulty,
  setDifficulty,
  status,
  setStatus,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Search */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm"
            placeholder="Type to search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Difficulty Selector */}
        <div className="relative flex items-center">

          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="" className="bg-white font-normal text-slate-800 py-1">
              ⚡ All Difficulties
            </option>
            <option value="Easy" className="bg-white font-normal text-slate-800 py-1">
              🌱 Easy
            </option>
            <option value="Medium" className="bg-white font-normal text-slate-800 py-1">
              ⚡ Medium
            </option>
            <option value="Hard" className="bg-white font-normal text-slate-800 py-1">
              🔥 Hard
            </option>
          </select>
        </div>

        {/* Status Selector */}
        <div className="relative flex items-center">

          <select
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" className="bg-white font-normal text-slate-800 py-1">
              🎯 All Status
            </option>
            <option value="true" className="bg-white font-normal text-slate-800 py-1">
              ✅ Active
            </option>
            <option value="false" className="bg-white font-normal text-slate-800 py-1">
              ❌ Inactive
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CodingFilters;