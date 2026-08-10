import { useState } from "react";
import QuestionCard from "./QuestionCard";

const MCQRound = ({ interview, questions, setQuestions, onSubmit, submitting }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const handleAnswerChange = (index, value) => {
    const updated = [...questions];
    updated[index].answer = value;
    setQuestions(updated);
  };

  const totalPages = Math.ceil(questions.length / questionsPerPage) || 1;
  const startIndex = (currentPage - 1) * questionsPerPage;
  const endIndex = startIndex + questionsPerPage;
  const currentQuestions = questions.slice(startIndex, endIndex);

  // Calculate answered progress
  const answeredCount = questions.filter((q) => q.answer).length;
  const progressPercent = Math.round((answeredCount / (questions.length || 1)) * 100);

  return (
    <div className="relative min-h-screen bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 text-slate-100 overflow-hidden">
      {/* Background Ambient Orbs */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="backdrop-blur-2xl bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping"></span>
                Round 1 of 3 • {interview?.role || "Technical"} Assessment
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Technical Multiple Choice
              </h2>
              <p className="text-slate-400 text-sm mt-2 max-w-2xl">
                Test your core knowledge and problem-solving speed.
                <span className="text-amber-400 font-semibold block sm:inline mt-1 sm:mt-0 sm:ml-2">
                  ⚠️ Minimum 50% score required to unlock Round 2.
                </span>
              </p>
            </div>

            {/* Answered Progress Widget */}
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-4 min-w-[220px] shrink-0 text-center sm:text-right">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                <span>PROGRESS</span>
                <span className="text-cyan-400">{answeredCount} / {questions.length} Answered</span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="text-[11px] text-slate-500 mt-1.5 font-medium">
                {progressPercent}% Completed
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>
              Showing Questions <strong className="text-cyan-300">{startIndex + 1}</strong> - <strong className="text-cyan-300">{Math.min(endIndex, questions.length)}</strong> of <strong className="text-white">{questions.length}</strong>
            </span>
            <span>Page {currentPage} of {totalPages}</span>
          </div>
        </div>

        {/* Questions Cards List */}
        <div className="space-y-6">
          {currentQuestions.map((question, index) => (
            <QuestionCard
              key={startIndex + index}
              question={question}
              index={startIndex + index}
              onAnswerChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="backdrop-blur-xl bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-wrap justify-between items-center gap-4">
            <button
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              ← Previous
            </button>

            <div className="flex flex-wrap justify-center items-center gap-2">
              {[...Array(totalPages)].map((_, index) => {
                const isActive = currentPage === index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentPage(index + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`h-10 w-10 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105"
                        : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        )}

        {/* Submit Round 1 Button Section */}
        {currentPage === totalPages && (
          <div className="pt-6 pb-12 flex flex-col items-center">
            <button
              onClick={onSubmit}
              disabled={submitting}
              className="group relative overflow-hidden rounded-2xl p-[2px] font-bold text-lg cursor-pointer transition-all duration-300 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed w-full max-w-md"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl animate-gradient-x"></span>
              <div className="relative px-8 py-4 bg-slate-950 rounded-[14px] transition-all duration-300 group-hover:bg-opacity-80 flex items-center justify-center gap-3">
                {submitting ? (
                  <>
                    <svg className="animate-spin h-6 w-6 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-cyan-300 font-bold">Submitting Round 1...</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl group-hover:scale-125 transition-transform duration-300">⚡</span>
                    <span className="bg-gradient-to-r from-cyan-300 via-white to-purple-300 bg-clip-text text-transparent font-extrabold text-xl tracking-wide">
                      Submit & Evaluate Round 1
                    </span>
                  </>
                )}
              </div>
            </button>
            <p className="text-xs text-slate-400 mt-3 text-center">
              Make sure you have reviewed all your choices before submitting.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MCQRound;

