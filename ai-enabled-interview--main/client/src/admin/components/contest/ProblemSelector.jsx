import { useEffect, useMemo, useState } from "react";
import { FaCode, FaSearch, FaFilter, FaCheckCircle, FaClock, FaMemory, FaTag } from "react-icons/fa";
import adminApi from "../../services/adminApi";

const ProblemSelector = ({ selectedProblems = [], onChange }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/coding?limit=1000");
      setProblems(res.data.problems || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "All" || problem.difficulty === difficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [problems, search, difficulty]);

  const toggleProblem = (id) => {
    if (selectedProblems.includes(id)) {
      onChange(selectedProblems.filter((item) => item !== id));
    } else {
      onChange([...selectedProblems, id]);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
          <FaCode className="text-teal-600" /> Select Coding Problems
        </h3>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black shadow-sm">
          <FaCheckCircle /> Selected: {selectedProblems.length}
        </span>
      </div>

      {/* Filters & Search */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Live Search */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Search problems by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-xs sm:text-sm"
          />
        </div>

        {/* Difficulty Filter Selector */}
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaFilter className="w-3.5 h-3.5" />
          </div>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition shadow-sm text-xs sm:text-sm cursor-pointer"
          >
            <option value="All" className="bg-white font-normal text-slate-800 py-1">
              🎯 All Difficulty Levels
            </option>
            <option value="Easy" className="bg-white font-normal text-slate-800 py-1">
              🌱 Easy Difficulty
            </option>
            <option value="Medium" className="bg-white font-normal text-slate-800 py-1">
              ⚡ Medium Difficulty
            </option>
            <option value="Hard" className="bg-white font-normal text-slate-800 py-1">
              🔥 Hard Difficulty
            </option>
          </select>
        </div>
      </div>

      {/* Problem Cards List Container */}
      <div className="max-h-[420px] overflow-y-auto rounded-2xl border border-slate-200/90 divide-y divide-slate-100 bg-white scrollbar-thin">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-8 w-8 border-4 border-teal-500/30 border-t-teal-600 rounded-full animate-spin"></div>
            <p className="mt-3 text-xs font-extrabold text-slate-400 uppercase tracking-wider">
              Loading Problems...
            </p>
          </div>
        )}

        {!loading && filteredProblems.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs font-bold">
            No coding problems match your search filter.
          </div>
        )}

        {!loading &&
          filteredProblems.map((problem) => {
            const isSelected = selectedProblems.includes(problem._id);

            return (
              <label
                key={problem._id}
                className={`flex cursor-pointer items-start gap-4 p-4 transition-all duration-300 group ${
                  isSelected
                    ? "bg-emerald-50/70 border-l-4 border-l-emerald-500"
                    : "hover:bg-gradient-to-r hover:from-emerald-50/50 hover:via-teal-50/20 hover:to-cyan-50/30"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleProblem(problem._id)}
                  className="mt-1.5 h-4.5 w-4.5 rounded accent-emerald-600 cursor-pointer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="font-black text-sm text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {problem.title}
                    </h4>

                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-black border uppercase tracking-wider shrink-0 ${
                        problem.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : problem.difficulty === "Medium"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500 font-semibold">
                    Topic: <span className="text-indigo-600 font-black">{problem.topic}</span>
                  </p>

                  {problem.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {problem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-purple-50 text-purple-700 border border-purple-100 px-2 py-0.5 text-[10px] font-extrabold flex items-center gap-1"
                        >
                          <FaTag className="text-[9px]" /> {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center gap-4 text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      <FaClock className="text-slate-400 text-[10px]" /> Time: {problem.timeLimit || 1}s
                    </span>
                    <span className="flex items-center gap-1">
                      <FaMemory className="text-slate-400 text-[10px]" /> Memory: {problem.memoryLimit || 256}MB
                    </span>
                  </div>
                </div>
              </label>
            );
          })}
      </div>
    </div>
  );
};

export default ProblemSelector;