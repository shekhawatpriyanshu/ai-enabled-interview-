import { Filter, RotateCcw } from "lucide-react";

const FilterBar = ({
  filters,
  setFilters,
  topics = [],
  companies = [],
}) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: "",
      topic: "",
      company: "",
    });
  };

  const hasActiveFilters = filters.difficulty || filters.topic || filters.company;

  return (
    <div className="bg-white/90 border border-slate-200/90 p-4 sm:p-5 rounded-3xl shadow-sm flex flex-wrap gap-4 items-center">
      {/* Filter Label */}
      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider pr-2">
        <Filter size={16} className="text-indigo-600" />
        <span>Filters</span>
      </div>

      {/* Difficulty Select */}
      <div className="relative">
        <select
          value={filters.difficulty}
          onChange={(e) => handleChange("difficulty", e.target.value)}
          className={`bg-slate-50 text-sm border rounded-2xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer pr-10 font-semibold ${
            filters.difficulty
              ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
              : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <option value="" className="bg-white text-slate-700">All Difficulties</option>
          <option value="Easy" className="bg-white text-emerald-700 font-bold">🟢 Easy</option>
          <option value="Medium" className="bg-white text-amber-700 font-bold">🟡 Medium</option>
          <option value="Hard" className="bg-white text-rose-700 font-bold">🔴 Hard</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Topic Select */}
      <div className="relative">
        <select
          value={filters.topic}
          onChange={(e) => handleChange("topic", e.target.value)}
          className={`bg-slate-50 text-sm border rounded-2xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer pr-10 font-semibold ${
            filters.topic
              ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
              : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <option value="" className="bg-white text-slate-700">All Topics</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id} className="bg-white text-slate-700">
              {t.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Company Select */}
      <div className="relative">
        <select
          value={filters.company}
          onChange={(e) => handleChange("company", e.target.value)}
          className={`bg-slate-50 text-sm border rounded-2xl px-4 py-2.5 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer pr-10 font-semibold ${
            filters.company
              ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
              : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          <option value="" className="bg-white text-slate-700">All Companies</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id} className="bg-white text-slate-700">
              🏢 {c.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {/* Clear Button */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="sm:ml-auto inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all border border-slate-200 cursor-pointer"
        >
          <RotateCcw size={14} />
          Reset Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;