import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">Loading problem details...</p>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm text-center px-4">
        <p className="text-slate-500 font-medium">Problem not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{problem.title}</h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                problem.difficulty === "Easy"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : problem.difficulty === "Medium"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-rose-50 text-rose-700 border border-rose-200"
              }`}
            >
              {problem.difficulty}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Topic: <span className="font-semibold text-slate-700">{problem.topic}</span></p>
        </div>

        <button
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition active:scale-95 cursor-pointer"
          onClick={() => navigate("/admin/coding")}
        >
          Back
        </button>
      </div>

      {/* Grid of basic Info and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Description and specs */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Description */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Description</h5>
            </div>
            <div className="p-6 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
              {problem.description}
            </div>
          </div>

          {/* Examples */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Examples & Test Cases</h5>
            </div>
            <div className="p-6 space-y-6">
              {problem.examples.map((example, index) => (
                <div key={index} className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h6 className="font-semibold text-slate-800 text-sm">Example {index + 1}</h6>
                    {example.isHidden && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        Hidden Case
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="font-mono text-xs bg-white border border-slate-200 rounded-lg p-2">
                      <strong className="text-slate-500 font-sans">Input: </strong> {example.input}
                    </p>
                    <p className="font-mono text-xs bg-white border border-slate-200 rounded-lg p-2">
                      <strong className="text-slate-500 font-sans">Output: </strong> {example.output}
                    </p>
                    {example.explanation && (
                      <p className="text-slate-600 pl-1 mt-1 text-xs">
                        <strong className="text-slate-500">Explanation: </strong> {example.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Official Solution */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Official Solution</h5>
            </div>
            <div className="p-6">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto font-mono text-xs leading-relaxed">
                <code>{problem.solution}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Metadata and Tags */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Additional Info</h5>
            </div>
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Time Limit</span>
                <span className="font-semibold text-slate-800">{problem.timeLimit} sec</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Memory Limit</span>
                <span className="font-semibold text-slate-800">{problem.memoryLimit} MB</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Status</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                  problem.status
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-600"
                }`}>
                  {problem.status ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Supported Languages</span>
                <span className="font-semibold text-slate-800 uppercase text-xs tracking-wide">
                  {problem.supportedLanguages.join(", ")}
                </span>
              </div>
              <div className="flex flex-col gap-1 py-1">
                <span className="text-xs text-slate-400">Created: {new Date(problem.createdAt).toLocaleString()}</span>
                <span className="text-xs text-slate-400">Updated: {new Date(problem.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Tags</h5>
            </div>
            <div className="p-6 flex flex-wrap gap-2">
              {problem.tags?.length ? (
                problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2.5 py-1 bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-semibold rounded-lg"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400 font-medium">No tags assigned</p>
              )}
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
              <h5 className="font-semibold text-slate-800 text-sm">Constraints</h5>
            </div>
            <div className="p-6">
              <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 pl-1">
                {problem.constraints.map((item, index) => (
                  <li key={index} className="leading-relaxed">{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingDetails;