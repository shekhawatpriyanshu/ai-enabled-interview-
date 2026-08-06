import { useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClock,
  FaSignal,
  FaQuestionCircle,
  FaStar,
  FaUser,
  FaCalendarAlt,
  FaCheckCircle,
  FaTag,
  FaBuilding,
  FaBookmark,
} from "react-icons/fa";

import useMockTest from "../../../admin/hooks/useMockTest";

const MockTestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading,
    test,
    loadMockTest,
  } = useMockTest();

  useEffect(() => {
    if (id) {
      loadMockTest(id);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Mock Test Details...
        </p>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <h2 className="text-xl font-extrabold text-rose-600">
          Mock Test Not Found
        </h2>
        <Link
          to="/admin/mock-tests"
          className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Back to Mock Tests
        </Link>
      </div>
    );
  }

  const statCards = [
    {
      title: "Duration",
      value: `${test.duration} min`,
      icon: <FaClock />,
      gradient: "from-indigo-600 to-blue-600",
      cardBg: "bg-gradient-to-br from-indigo-50/90 via-white to-blue-50/40 border-indigo-200/90",
      topAccent: "bg-gradient-to-r from-indigo-500 to-blue-600",
      iconBg: "bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-indigo-500/30",
    },
    {
      title: "Difficulty",
      value: test.difficulty,
      icon: <FaSignal />,
      gradient: "from-emerald-600 to-teal-600",
      cardBg: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-200/90",
      topAccent: "bg-gradient-to-r from-emerald-500 to-teal-600",
      iconBg: "bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-emerald-500/30",
    },
    {
      title: "Questions",
      value: test.questions?.length || 0,
      icon: <FaQuestionCircle />,
      gradient: "from-purple-600 to-fuchsia-600",
      cardBg: "bg-gradient-to-br from-purple-50/90 via-white to-fuchsia-50/40 border-purple-200/90",
      topAccent: "bg-gradient-to-r from-purple-500 to-fuchsia-600",
      iconBg: "bg-gradient-to-tr from-purple-600 to-fuchsia-600 text-white shadow-purple-500/30",
    },
    {
      title: "Total Marks",
      value: test.totalMarks || test.questions?.length || 0,
      icon: <FaStar />,
      gradient: "from-amber-600 to-orange-600",
      cardBg: "bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-200/90",
      topAccent: "bg-gradient-to-r from-amber-500 to-orange-500",
      iconBg: "bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-amber-500/30",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* Back Button & Header */}
      <div className="space-y-3 border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate("/admin/mock-tests")}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Mock Tests List
        </button>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
          {test.title}
        </h1>

        <p className="text-sm font-semibold text-slate-500 max-w-3xl">
          {test.description || "No description provided for this mock test."}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`group ${card.cardBg} rounded-3xl border p-5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
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

      {/* Test Information */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />
        
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3">
          Assessment Metadata Information
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 transition-all duration-300 border border-slate-100 hover:border-indigo-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <FaUser className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Created By Admin
                </h4>
                <p className="text-slate-800 font-bold text-sm mt-0.5">{test.createdBy?.name || "System Admin"}</p>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-cyan-50/50 transition-all duration-300 border border-slate-100 hover:border-cyan-200 hover:-translate-y-1 hover:shadow-md">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform shrink-0">
                <FaCalendarAlt className="text-base" />
              </div>
              <div>
                <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                  Created Date
                </h4>
                <p className="text-slate-800 font-bold text-sm mt-0.5">
                  {new Date(test.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
              Overview Guidelines
            </h4>
            <p className="text-slate-700 font-medium text-xs leading-relaxed">
              {test.description || "No overview guidelines specified for this assessment test."}
            </p>
          </div>
        </div>
      </div>

      {/* Assessment Questions */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
          <span>Assessment Questions Repository</span>
          <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full">
            {test.questions?.length || 0} Questions
          </span>
        </h2>

        {!test.questions || test.questions.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-medium">
            No questions assigned to this mock test session.
          </div>
        ) : (
          <div className="space-y-6">
            {test.questions.map((question, index) => (
              <div
                key={question._id || index}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:border-purple-300 space-y-4 group"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-md group-hover:scale-110 transition-transform">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {question.title}
                      </h3>
                      {question.question && (
                        <p className="mt-1 text-xs text-slate-600 font-normal leading-relaxed">
                          {question.question}
                        </p>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shrink-0 ${
                      question.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : question.difficulty === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {question.difficulty}
                  </span>
                </div>

                {/* Topic & Company Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {question.topic?.name && (
                    <span className="bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                      <FaBookmark size={8} /> Topic: {question.topic.name}
                    </span>
                  )}
                  {question.company?.name && (
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-0.5 rounded-lg text-[10px] font-semibold flex items-center gap-1">
                      <FaBuilding size={8} /> Company: {question.company.name}
                    </span>
                  )}
                </div>

                {/* Options List */}
                {question.options && question.options.length > 0 && (
                  <div className="space-y-2.5 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Answer Choices
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = option === question.correctAnswer;
                        return (
                          <div
                            key={optionIndex}
                            className={`p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                              isCorrect
                                ? "border-emerald-300 bg-emerald-50/70 text-emerald-800 shadow-xs font-bold"
                                : "border-slate-200/80 bg-slate-50/60 text-slate-700"
                            }`}
                          >
                            <span>
                              <strong className="mr-1.5 text-slate-400">
                                {String.fromCharCode(65 + optionIndex)}.
                              </strong>
                              {option}
                            </span>

                            {isCorrect && (
                              <span className="text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                                <FaCheckCircle size={10} /> Correct Answer
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Direct Answer */}
                {!question.options?.length && (question.answer || question.correctAnswer) && (
                  <div className="pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Correct Answer
                    </h4>
                    <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-3.5 text-emerald-800 text-xs font-semibold">
                      {question.answer || question.correctAnswer}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {question.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                    {question.tags.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-md text-[10px] font-medium flex items-center gap-1 border border-slate-200/60"
                      >
                        <FaTag className="text-[8px] text-slate-400" /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-4">
        <Link
          to="/admin/mock-tests"
          className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer"
        >
          Back to Mock Tests List
        </Link>
      </div>
    </div>
  );
};

export default MockTestDetails;