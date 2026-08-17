import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { FaSearch, FaFilter, FaClipboardList, FaCheckCircle, FaExclamationTriangle, FaBolt, FaCrown } from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";

import { getTests } from "../../services/TestService";

import TestCard from "../../components/tests/TestCard";
import LoadingSkeleton from "../../components/tests/LoadingSkeleton";
import EmptyState from "../../components/tests/EmptyState";

const TestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, difficulty]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await getTests();
      setTests(res.tests || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load tests."
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchSearch =
        test.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        test.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchDifficulty =
        difficulty === "All"
          ? true
          : test.difficulty === difficulty;

      return matchSearch && matchDifficulty;
    });
  }, [tests, search, difficulty]);

  const ITEMS_PER_PAGE = 15;

  const paginatedTests = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTests, currentPage]);

  const totalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE);

  const stats = {
    total: tests.length,
    easy: tests.filter((t) => t.difficulty === "Easy").length,
    medium: tests.filter((t) => t.difficulty === "Medium").length,
    hard: tests.filter((t) => t.difficulty === "Hard").length,
  };

  const statCards = [
    {
      title: "Total Mock Tests",
      value: stats.total,
      icon: <FaClipboardList />,
      gradient: "from-indigo-600 to-blue-600",
      cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 border-indigo-200/90",
      topAccent: "bg-gradient-to-r from-indigo-500 to-blue-600",
      iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/30",
    },
    {
      title: "Easy Level Tests",
      value: stats.easy,
      icon: <FaCheckCircle />,
      gradient: "from-emerald-600 to-teal-600",
      cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-200/90",
      topAccent: "bg-gradient-to-r from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30",
    },
    {
      title: "Medium Level Tests",
      value: stats.medium,
      icon: <FaExclamationTriangle />,
      gradient: "from-amber-600 to-orange-600",
      cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-200/90",
      topAccent: "bg-gradient-to-r from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30",
    },
    {
      title: "Hard Level Tests",
      value: stats.hard,
      icon: <FaBolt />,
      gradient: "from-rose-600 to-pink-600",
      cardBg: "bg-gradient-to-br from-rose-50/90 via-white to-pink-50/40 border-rose-200/90",
      topAccent: "bg-gradient-to-r from-rose-500 to-pink-600",
      iconBg: "bg-gradient-to-tr from-rose-600 to-pink-600 text-white shadow-rose-500/30",
    },
  ];

  return (
    <MainLayout showNavbar={false}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
        {/* Header Hero Card */}
        <div className="relative overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 md:p-12 shadow-xl hover:shadow-2xl hover:border-purple-300 transition-all duration-500 group">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-extrabold uppercase tracking-widest shadow-xs">
                <FaCrown className="text-purple-600 text-sm animate-pulse" />
                <span>Mock Assessments & Testing Studio</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Mock Test <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Assessment Hub</span>
              </h1>

              <p className="text-slate-600 text-sm md:text-base font-semibold max-w-2xl leading-relaxed">
                Practice comprehensive interview assessments and sharpen your technical problem-solving skills with timed mock tests.
              </p>
            </div>

            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-3xl shadow-xl shadow-purple-500/25 shrink-0 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-purple-300/30">
              <FaCrown />
            </div>
          </div>
        </div>

        {/* 3D Stat Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((card) => (
            <div
              key={card.title}
              className={`group ${card.cardBg} rounded-3xl border p-5 shadow-sm hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${card.topAccent}`} />

              <div className="mb-3 pt-1">
                <div
                  className={`w-11 h-11 rounded-2xl ${card.iconBg} flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 shrink-0`}
                >
                  {card.icon}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 leading-snug">
                  {card.title}
                </p>
                <h2 className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}>
                  {card.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="relative flex items-center md:col-span-2">
              <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                <FaSearch className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search mock tests by title or topic description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm"
              />
            </div>

            <div className="relative flex items-center">
              <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
                <FaFilter className="w-3.5 h-3.5 text-indigo-600" />
              </div>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-purple-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-xs sm:text-sm cursor-pointer"
              >
                <option value="All" className="bg-white font-normal text-slate-800 py-1">
                  All Difficulty
                </option>
                <option value="Easy" className="bg-white font-normal text-slate-800 py-1">
                  Easy Level
                </option>
                <option value="Medium" className="bg-white font-normal text-slate-800 py-1">
                  Medium Level
                </option>
                <option value="Hard" className="bg-white font-normal text-slate-800 py-1">
                  Hard Level
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <LoadingSkeleton />
        ) : paginatedTests.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedTests.map((test) => (
                <TestCard
                  key={test._id}
                  test={test}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl shadow-md border border-slate-200/90">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">
                  Page <strong className="text-indigo-600 font-extrabold">{currentPage}</strong> of <strong className="text-slate-800 font-extrabold">{totalPages}</strong>
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-indigo-50 hover:text-indigo-600 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default TestsPage;