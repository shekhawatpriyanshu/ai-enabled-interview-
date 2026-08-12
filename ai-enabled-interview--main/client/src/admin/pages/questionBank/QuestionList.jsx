import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
  FaQuestionCircle,
  FaThLarge,
  FaList,
  FaCheckCircle,
  FaExclamationCircle,
  FaLayerGroup,
} from "react-icons/fa";

import useQuestion from "../../hooks/useQuestion";
import questionService from "../../services/questionService";
import QuestionTable from "../../components/questionBank/QuestionTable";
import QuestionCard from "../../components/questionBank/QuestionCard";
import QuestionFilters from "../../components/questionBank/QuestionFilters";

const QuestionList = () => {
  const {
    questions,
    topics,
    companies,
    loading,
    fetchQuestions,
    fetchTopics,
    fetchCompanies,
    removeQuestion,
  } = useQuestion();

  const [filters, setFilters] = useState({
    search: "",
    topic: "",
    company: "",
    difficulty: "",
    page: 1,
  });

  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"
  const [totalPages, setTotalPages] = useState(1);
  const [questionStats, setQuestionStats] = useState({
    total: 0,
    easy: 0,
    medium: 0,
    hard: 0,
  });

  const loadQuestions = async (currentFilters) => {
    const res = await fetchQuestions(currentFilters);
    if (res) {
      setTotalPages(res.totalPages || 1);
    }
  };

  const loadStats = async () => {
    try {
      const [allRes, easyRes, mediumRes, hardRes] = await Promise.all([
        questionService.getQuestions({ limit: 1 }),
        questionService.getQuestions({ limit: 1, difficulty: "Easy" }),
        questionService.getQuestions({ limit: 1, difficulty: "Medium" }),
        questionService.getQuestions({ limit: 1, difficulty: "Hard" }),
      ]);
      setQuestionStats({
        total: allRes.data.totalQuestions || 0,
        easy: easyRes.data.totalQuestions || 0,
        medium: mediumRes.data.totalQuestions || 0,
        hard: hardRes.data.totalQuestions || 0,
      });
    } catch (error) {
      console.log("Failed to load question stats:", error);
    }
  };

  useEffect(() => {
    loadInitialData();
    loadStats();
  }, []);

  useEffect(() => {
    loadQuestions(filters);
  }, [filters]);

  const loadInitialData = async () => {
    await Promise.all([fetchTopics(), fetchCompanies()]);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: name === "page" ? value : 1,
    }));
  };

  const handleDeleteQuestion = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    try {
      await removeQuestion(id);
      loadQuestions(filters);
    } catch (error) {
      console.log(error);
      alert("Failed to delete question.");
    }
  };

  // Stats from API (not just current page)
  const stats = questionStats;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <FaQuestionCircle />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Question Bank
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Organize, search, and manage all interview questions & specs.
          </p>
        </div>

        <Link
          to="/admin/questions/add"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          <FaPlus className="text-xs" />
          Add New Question
        </Link>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="group bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 rounded-3xl border border-indigo-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
          <div className="flex items-center justify-between mb-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Questions
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaLayerGroup />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {stats.total}
          </h2>
        </div>

        <div className="group bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 rounded-3xl border border-emerald-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />
          <div className="flex items-center justify-between mb-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Easy Level
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaCheckCircle />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            {stats.easy}
          </h2>
        </div>

        <div className="group bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 rounded-3xl border border-amber-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400" />
          <div className="flex items-center justify-between mb-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Medium Level
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-md shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaExclamationCircle />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
            {stats.medium}
          </h2>
        </div>

        <div className="group bg-gradient-to-br from-rose-50/90 via-white to-pink-50/40 rounded-3xl border border-rose-200/80 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-pink-500 to-red-400" />
          <div className="flex items-center justify-between mb-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Hard Level
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-600 text-white flex items-center justify-center text-lg shadow-md shadow-rose-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaQuestionCircle />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            {stats.hard}
          </h2>
        </div>
      </div>

      {/* Filter controls & View Switcher Bar Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Search & Filter Controls
          </span>

          {/* Grid / Table View Switcher */}
          <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Card Grid View"
            >
              <FaThLarge className="text-xs" /> Grid
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Table View"
            >
              <FaList className="text-xs" /> Table
            </button>
          </div>
        </div>

        <QuestionFilters
          filters={filters}
          topics={topics}
          companies={companies}
          onChange={handleFilterChange}
        />
      </div>

      {/* Main Questions View Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-sm">
          <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-sm font-semibold text-slate-500">
            Loading questions...
          </p>
        </div>
      ) : questions.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 border border-slate-200/90 shadow-sm text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
            <FaQuestionCircle />
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            No Questions Found
          </h3>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            Try changing your filter settings or create your first interview question.
          </p>
          <Link
            to="/admin/questions/add"
            className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all active:scale-95"
          >
            <FaPlus className="text-xs" />
            Add New Question
          </Link>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {questions.map((question) => (
            <QuestionCard
              key={question._id}
              question={question}
              onDelete={handleDeleteQuestion}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <QuestionTable loading={loading} questions={questions} />
        </div>
      )}

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-white p-5 border border-slate-200/90 shadow-sm">
          <span className="text-xs font-semibold text-slate-500">
            Page <span className="text-slate-800 font-bold">{filters.page}</span> of{" "}
            <span className="text-slate-800 font-bold">{totalPages}</span>
          </span>

          <div className="flex gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => handleFilterChange("page", filters.page - 1)}
              className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-slate-700 shadow-sm"
              title="Previous Page"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              disabled={filters.page === totalPages}
              onClick={() => handleFilterChange("page", filters.page + 1)}
              className="p-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none cursor-pointer text-slate-700 shadow-sm"
              title="Next Page"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;