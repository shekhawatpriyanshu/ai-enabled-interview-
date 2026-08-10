import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import { getTest, submitTest } from "../../services/TestService";

import {
  FaClock,
  FaArrowLeft,
  FaArrowRight,
  FaCheckCircle,
  FaThLarge,
  FaExclamationCircle,
} from "react-icons/fa";

const optionLabels = ["A", "B", "C", "D", "E", "F"];

const TestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    loadTest();
  }, []);

  useEffect(() => {
    if (!timeLeft) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && test) {
      handleSubmit();
    }
  }, [timeLeft]);

  const loadTest = async () => {
    try {
      setLoading(true);
      const res = await getTest(id);
      setTest(res.test);
      setTimeLeft(res.test.duration * 60);
    } catch (error) {
      toast.error("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const question = test?.questions[currentQuestion];

  const handleAnswer = (value) => {
    setAnswers({
      ...answers,
      [question._id]: value,
    });
  };

  const nextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const formattedAnswers = Object.keys(answers).map((id) => ({
        question: id,
        answer: answers[id],
      }));

      await submitTest({
        testId: id,
        answers: formattedAnswers,
      });

      toast.success("Test Submitted Successfully!");
      navigate("/tests/submissions");
    } catch (error) {
      toast.error("Submission failed");
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const totalQuestionsCount = test?.questions?.length || 1;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestionsCount) * 100);

  if (loading) {
    return (
      <MainLayout showNavbar={false}>
        <div className="flex flex-col justify-center items-center min-h-[75vh] gap-4">
          <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-bold text-base">Loading Test Environment...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar={false}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Top Header Row */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500" />

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-ping"></span>
              Assessment in Progress
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {test.title}
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold mt-1">
              Question <strong className="text-indigo-600">{currentQuestion + 1}</strong> of <strong className="text-slate-800">{totalQuestionsCount}</strong>
            </p>
          </div>

          {/* Timer Pill */}
          <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-700 px-5 py-2.5 rounded-2xl shadow-sm self-start md:self-auto shrink-0">
            <FaClock className="text-lg animate-pulse" />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block leading-none text-rose-500">Remaining Time</span>
              <span className="text-xl font-black font-mono leading-tight">{formatTime()}</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Question Card Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 transition-all relative overflow-hidden">
              {/* Question Text Box */}
              <div className="mb-6">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="px-3.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold uppercase">
                    Question #{currentQuestion + 1}
                  </span>
                  {answers[question._id] ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      ✓ Answer Saved
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      Unanswered
                    </span>
                  )}
                </div>

                <div className="bg-slate-50/80 border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-inner">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 leading-relaxed">
                    {question.question}
                  </h2>
                </div>
              </div>

              {/* Options Grid */}
              <div className="space-y-3.5 mt-6">
                {question.options.map((option, index) => {
                  const isSelected = answers[question._id] === option;
                  const labelBadge = optionLabels[index] || `${index + 1}`;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleAnswer(option)}
                      className={`w-full group/opt text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-indigo-50/90 via-white to-purple-50/40 border-2 border-indigo-600 shadow-md shadow-indigo-500/10 scale-[1.005]"
                          : "bg-slate-50/60 border-slate-200/90 hover:border-indigo-300 hover:bg-white hover:-translate-y-0.5"
                      }`}
                    >
                      {/* Option Letter Badge */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-extrabold text-sm transition-all ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                            : "bg-slate-200/80 text-slate-600 group-hover/opt:bg-indigo-100 group-hover/opt:text-indigo-700"
                        }`}
                      >
                        {labelBadge}
                      </span>

                      {/* Option Text */}
                      <span
                        className={`text-sm sm:text-base font-semibold leading-relaxed flex-1 ${
                          isSelected ? "text-indigo-950 font-extrabold" : "text-slate-700 group-hover/opt:text-slate-900"
                        }`}
                      >
                        {option}
                      </span>

                      {/* Selection check icon */}
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Bottom Action Navigation Bar */}
              <div className="flex justify-between items-center mt-10 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={previousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-5 py-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm flex items-center gap-2"
                >
                  <FaArrowLeft />
                  Previous
                </button>

                {currentQuestion === test.questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-7 py-3 rounded-2xl font-extrabold text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <FaCheckCircle />
                    Submit Test
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-7 py-3 rounded-2xl font-extrabold text-sm shadow-md hover:scale-105 transition-all cursor-pointer flex items-center gap-2"
                  >
                    Next Question
                    <FaArrowRight />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Question Palette Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                  <FaThLarge className="text-indigo-600" />
                  Question Palette
                </h3>
                <span className="text-xs font-bold text-slate-500">
                  {answeredCount}/{totalQuestionsCount}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 mb-5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-emerald-500"></span> Answered
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-indigo-600"></span> Current
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-md bg-slate-200"></span> Unanswered
                </div>
              </div>

              {/* Question Numbers Grid */}
              <div className="grid grid-cols-5 gap-2 max-h-64 overflow-y-auto pr-1">
                {test.questions.map((q, index) => {
                  const isCurrent = currentQuestion === index;
                  const isAnswered = Boolean(answers[q._id]);

                  return (
                    <button
                      key={q._id || index}
                      type="button"
                      onClick={() => setCurrentQuestion(index)}
                      className={`h-10 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? "bg-indigo-600 text-white ring-4 ring-indigo-200 scale-105 shadow-md"
                          : isAnswered
                          ? "bg-emerald-500 text-white shadow-sm hover:bg-emerald-600"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80"
                      }`}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>

              {/* Final Finish Test Button */}
              <button
                type="button"
                onClick={handleSubmit}
                className="mt-6 w-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm"
              >
                <FaExclamationCircle />
                Finish & Submit Test
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TestDetails;