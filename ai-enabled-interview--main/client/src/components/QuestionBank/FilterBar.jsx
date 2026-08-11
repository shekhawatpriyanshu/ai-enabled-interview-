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
    <div className="flex items-center gap-3 w-full flex-nowrap overflow-x-auto scrollbar-hide">



      {/* Difficulty */}
      < select
        value={filters.difficulty}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            difficulty: e.target.value,
          }))
        }
        className={`h-[46px] w-[165px] shrink-0 bg-slate-50 text-sm border rounded-xl px-3 appearance-none
      focus:outline-none focus:ring-2 focus:ring-indigo-500/30
      transition-all cursor-pointer font-semibold
      ${filters.difficulty
            ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
            : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>

        {
          topics.map((difficulty, index) => {
            const value =
              typeof difficulty === "object"
                ? difficulty.name
                : difficulty;

            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })
        }
      </select >

      {/* Topic */}
      < select
        value={filters.topic}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            topic: e.target.value,
          }))
        }
        className={`h-[46px] w-[165px] shrink-0 bg-slate-50 text-sm border rounded-xl px-3
      focus:outline-none focus:ring-2 focus:ring-indigo-500/30
      transition-all cursor-pointer font-semibold
      ${filters.topic
            ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
            : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
      >
        <option value="">All Topics</option>

        {
          topics.map((topic, index) => {
            const value =
              typeof topic === "object"
                ? topic.name
                : topic;

            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })
        }
      </select >

      {/* Company */}
      < select
        value={filters.company}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            company: e.target.value,
          }))
        }
        className={`h-[46px] w-[165px] shrink-0 bg-slate-50 text-sm border rounded-xl px-3
      focus:outline-none focus:ring-2 focus:ring-indigo-500/30
      transition-all cursor-pointer font-semibold
      ${filters.company
            ? "border-indigo-500 text-indigo-700 bg-indigo-50/50"
            : "border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
      >
        <option value="">All Companies</option>

        {
          companies.map((company, index) => {
            const value =
              typeof company === "object"
                ? company.name
                : company;

            return (
              <option key={index} value={value}>
                {value}
              </option>
            );
          })
        }
      </select >

    </div >
  );
};

export default FilterBar;