import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaCode, FaClock, FaMemory, FaTerminal, FaEdit, FaCheckCircle } from "react-icons/fa";

import { getProblem } from "../../services/codingApi";

const CodingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProblem = async () => {
    try {
      const { data } = await getProblem(id);
      setProblem(data.problem);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load problem."
      );
      navigate("/admin/coding");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblem();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-cyan-500/30 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Problem Details...
        </p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-10 text-center text-slate-500 font-bold">
        Coding problem not found.
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate("/admin/coding")}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-indigo-600 mb-3 transition-colors cursor-pointer group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Coding Problems
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 animate-bounce">
              <FaCode />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {problem.title}
            </span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span
              className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider border shadow-sm ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : problem.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-rose-50 text-rose-700 border-rose-200"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-xs font-bold text-slate-500">
              Topic: <span className="text-indigo-600 font-black">{problem.topic}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/coding/edit/${problem._id}`}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <FaEdit /> Edit Problem
          </Link>
        </div>
      </div>

      {/* 2. GRID DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 sm:p-8 space-y-3">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />
            <h3 className="font-black text-slate-900 text-lg">Problem Description</h3>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed bg-slate-50 p-5 rounded-2xl border border-slate-100 whitespace-pre-wrap">
              {problem.description}
            </p>
          </div>

          {/* Test Cases */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 sm:p-8 space-y-6">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            <h3 className="font-black text-slate-900 text-lg">📚 Test Case Examples</h3>

            <div className="space-y-4">
              {problem.examples.map((example, index) => (
                <div key={index} className="border border-slate-200/90 rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-emerald-600">
                      Example #{index + 1}
                    </h4>
                    {example.isHidden && (
                      <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Hidden Case
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono">
                      <span className="text-slate-400 font-sans font-black">Input: </span>
                      <span className="text-slate-800">{example.input}</span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 font-mono">
                      <span className="text-slate-400 font-sans font-black">Output: </span>
                      <span className="text-slate-800">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div className="bg-white border border-slate-200 rounded-xl p-3 text-slate-700 font-medium">
                        <span className="text-slate-400 font-black">Explanation: </span>
                        {example.explanation}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Solution Code */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 sm:p-8 space-y-3">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-600" />
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <FaCheckCircle className="text-emerald-500" /> Official Solution Code
            </h3>
            <pre className="bg-slate-900 text-emerald-400 p-5 rounded-2xl font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
              <code>{problem.solution || "// No official solution uploaded yet."}</code>
            </pre>
          </div>
        </div>

        {/* Right 1 Col */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 space-y-4">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500" />
            <h3 className="font-black text-slate-900 text-base">Execution Parameters</h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <FaClock className="text-amber-500 text-xs" /> Time Limit
                </span>
                <span className="font-black text-slate-800">{problem.timeLimit} s</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <FaMemory className="text-indigo-600 text-xs" /> Memory Limit
                </span>
                <span className="font-black text-slate-800">{problem.memoryLimit} MB</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold flex items-center gap-1.5">
                  <FaTerminal className="text-cyan-600 text-xs" /> Status
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                  problem.status
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}>
                  {problem.status ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold">Languages</span>
                <span className="font-black text-purple-600 uppercase text-[11px]">
                  {problem.supportedLanguages.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 space-y-4">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 to-blue-600" />
            <h3 className="font-black text-slate-900 text-base">Tags & Keywords</h3>

            <div className="flex flex-wrap gap-2">
              {problem.tags?.length ? (
                problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-black rounded-xl shadow-xs"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 font-bold">No tags assigned</p>
              )}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative p-6 space-y-4">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
            <h3 className="font-black text-slate-900 text-base">Constraints</h3>

            <ul className="space-y-2">
              {problem.constraints.map((item, index) => (
                <li key={index} className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingDetails;