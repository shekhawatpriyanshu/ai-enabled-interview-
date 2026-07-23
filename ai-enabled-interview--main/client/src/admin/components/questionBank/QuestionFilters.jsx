import { FaSearch, FaUndo } from "react-icons/fa";

const QuestionFilters = ({
  filters,
  topics,
  companies,
  onChange,
}) => {
  const resetFilters = () => {
    onChange("search", "");
    onChange("topic", "");
    onChange("company", "");
    onChange("difficulty", "");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* Search */}
        <div className="relative flex items-center">
          <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search Question..."
            value={filters.search}
            onChange={(e) => onChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
          />
        </div>

        {/* Topic */}
        <select
          value={filters.topic}
          onChange={(e) => onChange("topic", e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
        >
          <option value="">All Topics</option>
          {(topics || []).map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.name}
            </option>
          ))}
        </select>

        {/* Company */}
        <select
          value={filters.company}
          onChange={(e) => onChange("company", e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
        >
          <option value="">All Companies</option>
          {(companies || []).map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>

        {/* Difficulty */}
        <select
          value={filters.difficulty}
          onChange={(e) => onChange("difficulty", e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
        >
          <option value="">All Difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Reset */}
        <button
          onClick={resetFilters}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <FaUndo className="w-4 h-4" />
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default QuestionFilters;