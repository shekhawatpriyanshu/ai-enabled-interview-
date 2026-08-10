import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import {
  Sparkles,
  Code2,
  Search,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Tag,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { generateProblem, getProblems } from "../../services/CodingService";

const topics = [
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Queue",
  "HashMap",
  "Tree",
  "Binary Search Tree",
  "Heap",
  "Graph",
  "Dynamic Programming",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Sorting",
  "Searching",
];

const companies = [
  "",
  "Google",
  "Amazon",
  "Microsoft",
  "Meta",
  "Adobe",
  "Flipkart",
  "Infosys",
  "TCS",
  "Wipro",
];

const CodingProblems = () => {
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState("explore"); // "explore" or "generate"

  // AI Generator State
  const [genTopic, setGenTopic] = useState("Arrays");
  const [genDifficulty, setGenDifficulty] = useState("Easy");
  const [genLanguage, setGenLanguage] = useState("javascript");
  const [genCompany, setGenCompany] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  // Problem Explorer State
  const [problems, setProblems] = useState([]);
  const [exploreLoading, setExploreLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterTopic, setFilterTopic] = useState("");

  // Load problems for the Explorer tab
  const fetchProblems = async () => {
    try {
      setExploreLoading(true);
      const data = await getProblems({
        page,
        search,
        difficulty: filterDifficulty,
        topic: filterTopic,
      });
      setProblems(data.problems || []);
      setPages(data.pages || 1);
    } catch (error) {
      toast.error("Failed to load coding problems.");
      console.error(error);
    } finally {
      setExploreLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "explore") {
      fetchProblems();
    }
  }, [activeTab, page, search, filterDifficulty, filterTopic]);

  const handleGenerate = async () => {
    try {
      setGenLoading(true);

      const res = await generateProblem({
        topic: genTopic,
        difficulty: genDifficulty,
        language: genLanguage,
        company: genCompany,
      });

      toast.success("Problem Generated Successfully!");
      navigate(`/coding/${res.problem._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to generate problem."
      );
    } finally {
      setGenLoading(false);
    }
  };

  const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          cardBg: "bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/40 border-emerald-200/90 hover:border-emerald-400 hover:shadow-emerald-500/10",
          badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          topLine: "from-emerald-400 to-teal-500",
          btnColor: "text-emerald-700 group-hover:text-emerald-800",
        };
      case "Medium":
        return {
          cardBg: "bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/40 border-amber-200/90 hover:border-amber-400 hover:shadow-amber-500/10",
          badgeBg: "bg-amber-100 text-amber-800 border-amber-300",
          topLine: "from-amber-400 to-orange-500",
          btnColor: "text-amber-700 group-hover:text-amber-800",
        };
      case "Hard":
        return {
          cardBg: "bg-gradient-to-br from-rose-50/80 via-white to-red-50/40 border-rose-200/90 hover:border-rose-400 hover:shadow-rose-500/10",
          badgeBg: "bg-rose-100 text-rose-800 border-rose-300",
          topLine: "from-rose-400 to-red-500",
          btnColor: "text-rose-700 group-hover:text-rose-800",
        };
      default:
        return {
          cardBg: "bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 border-indigo-200/90 hover:border-indigo-400 hover:shadow-indigo-500/10",
          badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-300",
          topLine: "from-indigo-400 to-purple-500",
          btnColor: "text-indigo-700 group-hover:text-indigo-800",
        };
    }
  };

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto space-y-8 pb-12 bg-slate-50 text-slate-800 relative">
        
        {/* Colorful Ambient Background Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-cyan-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-purple-500/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-fuchsia-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Hero Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-indigo-100/90 via-white to-purple-50/80 border border-indigo-200/90 rounded-3xl p-6 sm:p-8 shadow-lg shadow-indigo-500/10 relative overflow-hidden z-10"
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-indigo-600 via-purple-600 to-fuchsia-500" />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5 text-center sm:text-left">

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
                  Practice Coding Challenges
                </span>
              </h1>

              <p className="text-slate-600 text-sm font-semibold max-w-xl">
                Solve cataloged interview problems or generate custom AI problem challenges tailored to your preferred company and difficulty.
              </p>
            </div>

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-cyan-500/25 shrink-0">
              <Code2 size={32} />
            </div>
          </div>
        </motion.div>

        {/* Tab Toggle Control */}
        <div className="flex justify-center relative z-10">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex gap-1">
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "explore"
                  ? "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <BookOpen size={16} />
              <span>Explore Problems</span>
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === "generate"
                  ? "bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Sparkles size={16} />
              <span>Generate with AI</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Explore Problems */}
        {activeTab === "explore" ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 relative z-10">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end pb-4 border-b border-slate-100">
              <div className="sm:col-span-6 space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Search Title</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-semibold placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                    placeholder="Search by problem title..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Difficulty</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  value={filterDifficulty}
                  onChange={(e) => {
                    setFilterDifficulty(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Topic</label>
                <select
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                  value={filterTopic}
                  onChange={(e) => {
                    setFilterTopic(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Topics</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem List */}
            {exploreLoading ? (
              <div className="flex flex-col justify-center items-center py-16 gap-4">
                <div className="w-10 h-10 rounded-full border-4 border-indigo-500/20 border-t-indigo-600 animate-spin" />
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase animate-pulse">
                  Loading Problems...
                </p>
              </div>
            ) : problems.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <Code2 size={40} className="mx-auto text-slate-300 animate-bounce" />
                <h3 className="text-lg font-bold text-slate-800">No Problems Found</h3>
                <p className="text-slate-500 text-xs font-medium">
                  Try adjusting your search criteria or topic filter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {problems.map((problem, index) => {
                  const style = getDifficultyStyles(problem.difficulty);

                  return (
                    <motion.div
                      key={problem._id || index}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      whileHover={{ y: -5, scale: 1.015 }}
                      onClick={() => navigate(`/coding/${problem._id}`)}
                      className={`group rounded-3xl p-6 border shadow-sm transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between ${style.cardBg}`}
                    >
                      {/* Top Accent Line */}
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${style.topLine}`} />

                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-base font-black text-slate-900 group-hover:text-indigo-600 transition-colors whitespace-nowrap overflow-hidden">
                            {problem.title}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-md text-xs font-black uppercase tracking-wider border shrink-0 ${style.badgeBg}`}>
                            {problem.difficulty || "Easy"}
                          </span>
                        </div>


                        <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <Tag size={12} className="text-indigo-500" />
                          <span className="bg-white/80 px-2.5 py-0.5 rounded-md border border-slate-200/80 text-slate-700">
                            {problem.topic || "General"}
                          </span>
                        </div>

                        <p className="text-slate-600 text-xs leading-relaxed font-medium">
                          {problem.description || "Solve this coding problem using JavaScript, Python, C++, or Java."}
                        </p>

                      </div>

                      <div className={`mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-black transition-colors ${style.btnColor}`}>
                        <span>Solve Challenge</span>
                        <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {pages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>

                {[...Array(pages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`w-9 h-9 rounded-xl font-black text-xs transition-all duration-200 ${
                      page === index + 1
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-extrabold text-xs hover:bg-indigo-50 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: AI GENERATOR */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-white via-slate-50/80 to-purple-50/50 rounded-3xl border border-slate-200/90 shadow-xl p-8 space-y-6 relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500" />

            <div className="space-y-1 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="text-purple-600 text-lg animate-pulse" />
                <span>Generate Custom Problem with AI</span>
              </h2>
              <p className="text-slate-500 text-xs font-semibold">
                Select your preferred topic, target difficulty level, language, and target company to generate a fresh problem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Topic</label>
                <select
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                >
                  {topics.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Difficulty Level</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Target Language</label>
                <select
                  value={genLanguage}
                  onChange={(e) => setGenLanguage(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="c">C</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider">Target Company (Optional)</label>
                <select
                  value={genCompany}
                  onChange={(e) => setGenCompany(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-2xs"
                >
                  <option value="">General Practice</option>
                  {companies.filter(c => c !== "").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={genLoading}
              className="w-full mt-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white cursor-pointer py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
            >
              {genLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Generating AI Problem...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate Problem Now</span>
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default CodingProblems;