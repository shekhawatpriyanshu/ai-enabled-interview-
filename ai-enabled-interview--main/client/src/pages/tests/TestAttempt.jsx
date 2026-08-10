import React, { useEffect, useState } from "react";
import ProgressBar from "../../components/tests/ProgressBar";
import LoadingSkeleton from "../../components/tests/LoadingSkeleton";
import { FaClock, FaArrowLeft, FaArrowRight, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const optionLabels = ["A", "B", "C", "D", "E", "F"];

const TestAttempt = ({
  questions = [],
  loading = false,
  onSubmit,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60 * 30); // 30 min default

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOptionSelect = (option) => {
    if (!currentQuestion) return;
    setAnswers({
      ...answers,
      [currentQuestion._id]: option,
    });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(answers);
    }
  };

  const answeredCount = Object.keys(answers).length;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
            Mock Test Assessment
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Assessment Attempt
          </h1>
        </div>

        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-2.5 rounded-2xl shadow-sm self-start md:self-auto shrink-0">
          <FaClock className="text-lg animate-pulse" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider block leading-none text-rose-500">Timer</span>
            <span className="text-xl font-black font-mono leading-tight">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Question Section */}
        <div className="md:col-span-3 bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8">
          {currentQuestion ? (
            <>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="px-3.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold uppercase">
                  Question #{currentIndex + 1}
                </span>
                {answers[currentQuestion._id] ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    ✓ Saved
                  </span>
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    Unanswered
                  </span>
                )}
              </div>

              <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 mb-6">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options?.map((opt, i) => {
                  const isSelected = answers[currentQuestion._id] === opt;
                  const badge = optionLabels[i] || `${i + 1}`;
                  return (
                    <div
                      key={i}
                      onClick={() => handleOptionSelect(opt)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/40 border-2 border-indigo-600 shadow-md shadow-indigo-500/10 scale-[1.005]"
                          : "bg-slate-50/60 border-slate-200/90 hover:border-indigo-300 hover:bg-white"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                            : "bg-slate-200/80 text-slate-600"
                        }`}
                      >
                        {badge}
                      </span>
                      <span className={`text-sm font-semibold flex-1 ${isSelected ? "text-indigo-950 font-extrabold" : "text-slate-700"}`}>
                        {opt}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <p className="text-slate-500">No questions available</p>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
            >
              <FaArrowLeft />
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-7 py-3 rounded-2xl font-extrabold text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                <FaCheckCircle />
                Submit Test
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3 rounded-2xl font-extrabold text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
              >
                Next
                <FaArrowRight />
              </button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 self-start">
          <h3 className="font-extrabold text-slate-800 mb-3 text-base">Question Navigator</h3>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, i) => (
              <button
                key={q._id || i}
                onClick={() => setCurrentIndex(i)}
                className={`h-10 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  currentIndex === i
                    ? "bg-indigo-600 text-white ring-4 ring-indigo-200 shadow-md scale-105"
                    : answers[q._id]
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold py-3.5 rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <FaExclamationCircle />
            Finish & Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestAttempt;