import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaPlusCircle,
  FaCode,
  FaLightbulb,
  FaBookOpen,
  FaLayerGroup,
  FaQuestionCircle,
  FaMagic,
  FaCheckCircle,
} from "react-icons/fa";

import QuestionForm from "../../components/questionBank/QuesionForm";
import useQuestion from "../../hooks/useQuestion";

const AddQuestion = () => {
  const navigate = useNavigate();
  const { addQuestion } = useQuestion();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await addQuestion(formData);
      toast.success("Question created successfully.");
      navigate("/admin/questions");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Failed to create question."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Back Navigation Button */}
      <div>
        <button
          onClick={() => navigate("/admin/questions")}
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-x-1 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-indigo-500" />
          <span>Back to Question Bank</span>
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 p-8 sm:p-10 text-white shadow-2xl border border-indigo-900/50 hover:shadow-indigo-500/20 transition-all duration-500">
        {/* Animated Glow Elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl group-hover:scale-125 group-hover:bg-cyan-500/30 transition-all duration-700 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl group-hover:scale-125 group-hover:bg-purple-500/30 transition-all duration-700 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-3xl">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-indigo-200 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-inner group-hover:bg-white/15 transition-all">
              <FaPlusCircle className="text-cyan-400 animate-pulse" />
              <span>Question Builder Studio</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Create New{" "}
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
                Interview Question
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
              Publish rich coding challenges, interview specs, reference solutions, test case examples, hints, and topic domains for your interview bank.
            </p>
          </div>

          {/* Right Floating Icon Badge */}
          <div className="hidden lg:flex items-center justify-center w-36 h-36 rounded-3xl bg-white/5 border border-white/15 backdrop-blur-md text-cyan-400 text-6xl shadow-2xl shadow-cyan-500/20 group-hover:scale-110 group-hover:rotate-6 group-hover:border-cyan-400/40 transition-all duration-500 shrink-0">
            <FaCode />
          </div>
        </div>
      </div>

      {/* Main Question Form Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {/* Card Header */}
        <div className="border-b border-slate-100 px-6 sm:px-8 py-5 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-white flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/25 group-hover:scale-110 transition-transform">
              <FaQuestionCircle />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Question Configuration
              </h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Fill in specification parameters, problem tags, and reference code.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-sm">
            <FaMagic className="text-amber-500" /> Dynamic Form Builder
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <QuestionForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>

      {/* Interactive Pro Tip Cards with Colors & Hover Animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Best Practice */}
        <div className="group bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 rounded-3xl p-6 border border-indigo-100/90 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 hover:border-indigo-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 group-hover:h-2 transition-all duration-300" />
          <div>
            <div className="flex items-center gap-3 mb-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FaLightbulb />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                Clear & Concise Titles
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Keep the question title descriptive so admins and candidates can quickly search, filter, and identify problem topics.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-indigo-100/60 flex items-center gap-1.5 text-[11px] font-bold text-indigo-600">
            <FaCheckCircle className="text-xs" /> High Searchability
          </div>
        </div>

        {/* Card 2: Examples */}
        <div className="group bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 rounded-3xl p-6 border border-emerald-100/90 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 hover:border-emerald-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 group-hover:h-2 transition-all duration-300" />
          <div>
            <div className="flex items-center gap-3 mb-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FaBookOpen />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                Comprehensive Examples
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Add clear input/output sample test cases with step-by-step explanations to provide explicit guidance to candidates.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-100/60 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <FaCheckCircle className="text-xs" /> Better Candidate Context
          </div>
        </div>

        {/* Card 3: Categorization */}
        <div className="group bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 rounded-3xl p-6 border border-amber-100/90 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1.5 hover:border-amber-300 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 group-hover:h-2 transition-all duration-300" />
          <div>
            <div className="flex items-center gap-3 mb-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <FaLayerGroup />
              </div>
              <h3 className="font-extrabold text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                Target & Difficulty Tagging
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-600 leading-relaxed">
              Assign exact difficulty levels (Easy, Medium, Hard), topic categories, and target company tags for smart indexing.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-amber-100/60 flex items-center gap-1.5 text-[11px] font-bold text-amber-600">
            <FaCheckCircle className="text-xs" /> Accurate Indexing
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestion;