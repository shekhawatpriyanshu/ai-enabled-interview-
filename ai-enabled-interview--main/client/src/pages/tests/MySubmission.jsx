import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaTrophy,
  FaClipboardList,
  FaPlay,
  FaStar,
  FaPercentage,
  FaArrowRight,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getMySubmissions } from "../../services/TestService";

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Easy":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/90";
    case "Medium":
      return "bg-amber-50 text-amber-700 border-amber-200/90";
    case "Hard":
      return "bg-rose-50 text-rose-700 border-rose-200/90";
    default:
      return "bg-slate-100 text-slate-700 border-slate-200";
  }
};

const MySubmissions = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const res = await getMySubmissions();
      setSubmissions(res.submissions || []);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const avgScore = submissions.length
    ? Math.round(
        submissions.reduce((acc, curr) => acc + (curr.percentage || 0), 0) / submissions.length
      )
    : 0;

  const highestScore = submissions.length
    ? Math.max(...submissions.map((s) => s.percentage || 0))
    : 0;

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold text-base">Loading Submissions History...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8 min-h-screen space-y-8 animate-[fadeIn_0.4s_ease-out]">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Card */}
          <div className="relative bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/25 shrink-0">
                  <FaTrophy />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-1">
                    Performance Records
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                    My Test Submissions
                  </h1>
                  <p className="text-slate-500 text-sm font-semibold mt-1">
                    Review your completed assessment results, scores, and accuracy metrics.
                  </p>
                </div>
              </div>

              {/* Action Button to browse tests */}
              <Link
                to="/tests"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] transition-all duration-300 cursor-pointer self-start md:self-auto"
              >
                <FaPlay size={14} />
                <span>Take New Mock Test</span>
              </Link>
            </div>

            {/* Quick Stat Summary Row */}
            {submissions.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100">
                <div className="group bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 hover:-translate-y-1 hover:shadow-md rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <FaClipboardList />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">Completed Tests</p>
                    <h3 className="text-2xl font-extrabold text-slate-800">{submissions.length}</h3>
                  </div>
                </div>

                <div className="group bg-slate-50 border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 hover:-translate-y-1 hover:shadow-md rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <FaPercentage />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-emerald-600 transition-colors">Average Score</p>
                    <h3 className="text-2xl font-extrabold text-slate-800">{avgScore}%</h3>
                  </div>
                </div>

                <div className="group bg-slate-50 border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30 hover:-translate-y-1 hover:shadow-md rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 cursor-default">
                  <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <FaStar />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-amber-600 transition-colors">Highest Score</p>
                    <h3 className="text-2xl font-extrabold text-slate-800">{highestScore}%</h3>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submissions List / Empty State */}
          {submissions.length === 0 ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto space-y-4 hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl text-indigo-600 shadow-inner hover:scale-110 transition-transform duration-300">
                <FaClipboardList />
              </div>

              <h2 className="text-2xl font-extrabold text-slate-800">
                No Test Submissions Yet
              </h2>

              <p className="text-slate-500 text-sm font-semibold max-w-md mx-auto">
                You haven't completed any mock tests yet. Take your first practice assessment to track your progress and evaluate your skills.
              </p>

              <div className="pt-4">
                <Link
                  to="/tests"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-8 py-3.5 rounded-2xl font-extrabold shadow-md hover:scale-105 transition-all"
                >
                  Browse Available Tests
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {submissions.map((submission) => (
                <div
                  key={submission._id}
                  className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:-translate-y-1.5 transition-all duration-300 p-6 sm:p-7 relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 group-hover:h-2 transition-all" />

                  {/* Card Top */}
                  <div>
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {submission.test?.title || "Mock Test Assessment"}
                        </h2>
                        <p className="text-slate-500 text-xs font-semibold mt-1">
                          Completed Assessment Record
                        </p>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider border shrink-0 hover:scale-105 transition-transform cursor-default ${getDifficultyColor(
                          submission.test?.difficulty
                        )}`}
                      >
                        {submission.test?.difficulty || "Normal"}
                      </span>
                    </div>

                    {/* Stats Metric Cards Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <div className="bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-100/50 hover:scale-[1.02] rounded-2xl p-4 transition-all duration-200 cursor-default shadow-none hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Score</p>
                        <h3 className="text-2xl font-extrabold text-indigo-950 mt-1">
                          {submission.score}
                        </h3>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-100/50 hover:scale-[1.02] rounded-2xl p-4 transition-all duration-200 cursor-default shadow-none hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Percentage</p>
                        <h3 className="text-2xl font-extrabold text-emerald-950 mt-1">
                          {submission.percentage}%
                        </h3>
                      </div>

                      <div className="bg-amber-50/70 border border-amber-100 hover:border-amber-300 hover:bg-amber-100/50 hover:scale-[1.02] rounded-2xl p-4 transition-all duration-200 cursor-default shadow-none hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Questions</p>
                        <h3 className="text-2xl font-extrabold text-amber-950 mt-1">
                          {submission.totalQuestions} Items
                        </h3>
                      </div>

                      <div className="bg-purple-50/70 border border-purple-100 hover:border-purple-300 hover:bg-purple-100/50 hover:scale-[1.02] rounded-2xl p-4 transition-all duration-200 cursor-default shadow-none hover:shadow-sm">
                        <p className="text-xs font-bold uppercase tracking-wider text-purple-700">Date</p>
                        <h3 className="text-sm font-extrabold text-purple-950 mt-2 truncate">
                          {new Date(submission.createdAt).toLocaleDateString()}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Footer */}
                  <div className="flex justify-between items-center mt-6 pt-5 border-t border-slate-100 text-xs font-semibold text-slate-500">
                    <div className="flex items-center gap-2 hover:text-slate-700 transition-colors">
                      <FaCalendarAlt className="text-slate-400" />
                      <span>{new Date(submission.createdAt).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-600 font-extrabold bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 hover:scale-105 px-3 py-1 rounded-full transition-all cursor-default">
                      <FaCheckCircle className="text-sm" />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default MySubmissions;

