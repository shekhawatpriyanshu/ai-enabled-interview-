import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import {
  Sparkles,
  Code2,
  BrainCircuit,
  Building2,
  Cpu,
  Search,
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-indigo-50 py-10 px-4">
        {/* Hero */}
        <div className="max-w-5xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-cyan-100 text-cyan-700 px-5 py-2 rounded-full mb-5 font-semibold text-sm">
            <Sparkles size={16} />
            AI Powered Coding Platform (LeetChef)
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Practice Coding Challenges
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your coding skills by solving cataloged challenges or generating customizable AI problems.
          </p>
        </div>

        {/* Tab Toggle Control */}
        <div className="max-w-4xl mx-auto flex justify-center mb-8">
          <div className="bg-gray-100/80 backdrop-blur p-1.5 rounded-2xl flex gap-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTab("explore")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === "explore"
                  ? "bg-white text-cyan-700 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <BookOpen size={16} />
              Explore Problems
            </button>
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                activeTab === "generate"
                  ? "bg-white text-cyan-700 shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles size={16} />
              Generate with AI
            </button>
          </div>
        </div>

        {activeTab === "explore" ? (
          /* TAB 1: EXPLORE CATALOGED PROBLEMS */
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 p-6 md:p-8 space-y-6">
            {/* Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
              <div className="sm:col-span-6 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Search Problem</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>

              <div className="sm:col-span-3 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Difficulty</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
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

              <div className="sm:col-span-3 flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-700">Topic</label>
                <select
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-sm"
                  value={filterTopic}
                  onChange={(e) => {
                    setFilterTopic(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">All Topics</option>
                  {topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* List / Table */}
            {exploreLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-sm font-medium text-gray-500">Loading cataloged problems...</p>
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500 font-medium">No problems found. Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto border border-gray-100 rounded-2xl shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-[75px]">#</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Problem Title</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Topic</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-[130px]">Difficulty</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 w-[120px] text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {problems.map((prob, idx) => (
                      <tr key={prob._id} className="hover:bg-gray-50/50 transition">
                        <td className="px-6 py-4 text-sm text-gray-500">{(page - 1) * 10 + idx + 1}</td>
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{prob.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{prob.topic}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              prob.difficulty === "Easy"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : prob.difficulty === "Medium"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/coding/${prob._id}`)}
                            className="inline-flex items-center gap-1 text-sm font-bold text-cyan-600 hover:text-cyan-700 transition cursor-pointer"
                          >
                            Solve <ArrowRight size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {pages > 1 && (
              <div className="flex justify-between items-center gap-4 pt-4">
                <span className="text-sm font-semibold text-gray-600">
                  Page <span className="text-gray-900 font-bold">{page}</span> of{" "}
                  <span className="text-gray-900 font-bold">{pages}</span>
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* TAB 2: AI GENERATOR FORM */
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-200 p-8 md:p-10">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Topic */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <Code2 size={18} />
                  Topic
                </label>
                <select
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm bg-white"
                >
                  {topics.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <BrainCircuit size={18} />
                  Difficulty
                </label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm bg-white"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <Cpu size={18} />
                  Programming Language
                </label>
                <select
                  value={genLanguage}
                  onChange={(e) => setGenLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm bg-white"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="cpp">C++</option>
                </select>
              </div>

              {/* Company */}
              <div>
                <label className="flex items-center gap-2 font-semibold mb-3">
                  <Building2 size={18} />
                  Company
                </label>
                <select
                  value={genCompany}
                  onChange={(e) => setGenCompany(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none text-sm bg-white"
                >
                  {companies.map((item) => (
                    <option key={item} value={item}>
                      {item || "General"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={genLoading}
              className="mt-10 w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-2xl text-lg font-bold shadow-lg hover:scale-[1.02] hover:shadow-cyan-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {genLoading ? (
                <div className="flex justify-center items-center gap-3">
                  <div className="h-6 w-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating AI Problem...
                </div>
              ) : (
                <div className="flex justify-center items-center gap-3">
                  <Sparkles size={22} />
                  Generate AI Coding Problem
                </div>
              )}
            </button>
          </div>
        )}

        {/* Bottom Features */}
        <div className="max-w-6xl mx-auto mt-14 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Code2 className="mx-auto text-cyan-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">AI Generated Problems</h3>
            <p className="text-gray-500 mt-2">Fresh interview questions every time.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <BrainCircuit className="mx-auto text-indigo-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">Company Specific</h3>
            <p className="text-gray-500 mt-2">Practice questions inspired by top tech companies.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Cpu className="mx-auto text-green-600 mb-4" size={35} />
            <h3 className="font-bold text-lg">Multi Language</h3>
            <p className="text-gray-500 mt-2">Solve problems in Java, JavaScript, Python, or C++.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CodingProblems;