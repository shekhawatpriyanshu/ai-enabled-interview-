import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaEdit,
  FaEye,
  FaBuilding,
  FaFolder,
  FaTags,
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCode,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaQuestionCircle,
} from "react-icons/fa";

import useQuestion from "../../hooks/useQuestion";

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { fetchQuestion } = useQuestion();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await fetchQuestion(id);
      setQuestion(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load question."
      );
      navigate("/admin/questions");
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return {
          badge: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          dot: "bg-emerald-500",
        };
      case "Medium":
        return {
          badge: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          dot: "bg-amber-500",
        };
      case "Hard":
        return {
          badge: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          dot: "bg-rose-500",
        };
      default:
        return {
          badge: "bg-slate-500/10 text-slate-600 border-slate-500/20",
          dot: "bg-slate-500",
        };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm my-6">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Loading Question Details...
        </p>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="rounded-3xl bg-white p-12 border border-slate-200 shadow-sm text-center my-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-3xl mx-auto mb-4">
          <FaExclamationTriangle />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          Question Not Found
        </h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          The requested question could not be located or may have been deleted.
        </p>
        <Link
          to="/admin/questions"
          className="inline-flex items-center gap-2 mt-6 rounded-2xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/30 transition-all active:scale-95"
        >
          <FaArrowLeft className="text-xs" />
          Back to Question Bank
        </Link>
      </div>
    );
  }

  const difficultyStyle = getDifficultyBadge(question.difficulty);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/30">
              <FaQuestionCircle />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Question Details
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            View specifications, solutions, examples, hints, and metadata.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/questions"
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md hover:-translate-x-1 transition-all duration-300 active:scale-95"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform text-indigo-500" />
            <span>Back</span>
          </Link>

          <Link
            to={`/admin/questions/edit/${question._id}`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/35 hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
          >
            <FaEdit className="text-xs" />
            <span>Edit Question</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Views */}
        <div className="group bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 rounded-3xl border border-indigo-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Total Views
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaEye />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
            {question.views || 0}
          </h2>
        </div>

        {/* Difficulty */}
        <div className="group bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/40 rounded-3xl border border-purple-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-400" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Difficulty
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white flex items-center justify-center text-lg shadow-md shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaCode />
            </div>
          </div>
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${difficultyStyle.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${difficultyStyle.dot}`} />
              {question.difficulty || "Easy"}
            </span>
          </div>
        </div>

        {/* Topic Domain */}
        <div className="group bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 rounded-3xl border border-emerald-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Topic Domain
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-lg shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaFolder />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 truncate">
            {question.topic?.name || "General"}
          </h2>
        </div>

        {/* Target Company */}
        <div className="group bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 rounded-3xl border border-amber-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:scale-[1.02] transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400" />
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Company Target
            </span>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shadow-md shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
              <FaBuilding />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-800 truncate">
            {question.company?.name || "All Companies"}
          </h2>
        </div>
      </div>

      {/* Main Basic Information Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 overflow-hidden hover:shadow-xl transition-shadow duration-300 space-y-6 p-6 sm:p-8">
        {/* Question Title Header */}
        <div className="border-b border-slate-100 pb-5">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
            Question Title
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {question.title}
          </h2>
        </div>

        {/* Description Overview */}
        <div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
            Problem Description (Overview)
          </span>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
            {question.description || "No general description provided."}
          </div>
        </div>

        {/* Detailed Specification */}
        {question.question && (
          <div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              Detailed Specification
            </span>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-mono">
              {question.question}
            </div>
          </div>
        )}

        {/* Reference Answer / Code Solution */}
        {question.answer && (
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
              Reference Solution / Explanation
            </span>
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-sm leading-relaxed whitespace-pre-wrap shadow-inner overflow-x-auto">
              {question.answer}
            </div>
          </div>
        )}
      </div>

      {/* Tags Section */}
      {question.tags?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaTags className="text-indigo-500" /> Associated Tags
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200/80 text-xs font-bold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 cursor-default"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Examples Grid */}
      {question.examples?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm shadow-inner">
              <FaCode />
            </div>
            Test Case Examples ({question.examples.length})
          </h2>

          <div className="space-y-6">
            {question.examples.map((example, index) => (
              <div
                key={index}
                className="group border border-slate-200 rounded-2xl p-6 bg-slate-50/80 hover:bg-white hover:shadow-md hover:border-indigo-200 transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-indigo-600 uppercase tracking-wider">
                    Example {index + 1}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Input */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Input
                    </label>
                    <pre className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap shadow-inner">
                      {example.input}
                    </pre>
                  </div>

                  {/* Output */}
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Output
                    </label>
                    <pre className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap shadow-inner">
                      {example.output}
                    </pre>
                  </div>
                </div>

                {/* Explanation */}
                {example.explanation && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Explanation
                    </label>
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {example.explanation}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {question.constraints?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500" /> Constraints
          </h2>
          <div className="space-y-2">
            {question.constraints.map((constraint, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-xs font-semibold text-slate-800 hover:bg-amber-50 transition-colors"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span>{constraint}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hints */}
      {question.hints?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FaLightbulb className="text-amber-500" /> Hints
          </h2>
          <div className="space-y-3">
            {question.hints.map((hint, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs font-medium text-slate-800 hover:bg-indigo-50 transition-colors flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  H{index + 1}
                </div>
                <p className="mt-0.5 leading-relaxed">{hint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MCQ Options */}
      {question.options?.length > 0 && (
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Multiple Choice Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option, index) => {
              const isCorrect = option === question.correctAnswer;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-300 shadow-sm text-emerald-900 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700 font-medium hover:bg-slate-100"
                  }`}
                >
                  <span className="text-xs">{option}</span>
                  {isCorrect && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-emerald-600 px-3 py-1 bg-white rounded-full border border-emerald-200 shadow-sm">
                      <FaCheckCircle className="text-emerald-500" /> Correct
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metadata Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/90 p-6 sm:p-8 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          <FaUser className="text-indigo-500" /> System Metadata
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
              <FaUser className="text-xs" /> Created By
            </span>
            <p className="text-sm font-extrabold text-slate-800">
              {question.createdBy?.name || "Admin"}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
              <FaCalendarAlt className="text-xs" /> Created At
            </span>
            <p className="text-sm font-extrabold text-slate-800">
              {new Date(question.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1 flex items-center gap-1">
              <FaClock className="text-xs" /> Last Updated
            </span>
            <p className="text-sm font-extrabold text-slate-800">
              {new Date(question.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDetails;