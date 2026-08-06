import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaCode, FaArrowLeft, FaLightbulb, FaCheckCircle, FaClock } from "react-icons/fa";
import toast from "react-hot-toast";
import CodingForm from "../../components/coding/CodingForm";

import {
  createProblem,
  generateProblem,
} from "../../services/codingApi";

const AddCoding = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState(["javascript"]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await createProblem(formData);
      toast.success(data.message || "Problem created successfully");
      navigate("/admin/coding");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create problem"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAIGenerate = async () => {
    try {
      if (!supportedLanguages || supportedLanguages.length === 0) {
        toast.error("Please select at least one supported language below first.");
        return;
      }

      setAiLoading(true);
      const topic = prompt("Enter Topic (e.g. Dynamic Programming, Two Pointers)");
      if (!topic) return;

      let difficultyInput = prompt("Difficulty (Easy / Medium / Hard)");
      if (!difficultyInput) return;
      let difficulty = difficultyInput.trim().toLowerCase();
      difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

      const language = supportedLanguages.join(", ");
      const company = prompt("Company (Optional)");

      const { data } = await generateProblem({
        topic,
        difficulty,
        language,
        company,
      });

      toast.success("AI Problem Generated Successfully");
      navigate(`/admin/coding/edit/${data.problem._id}`);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "AI Generation Failed"
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate("/admin/coding")}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Coding Problems
        </button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/30 animate-bounce">
              <FaCode />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Add Coding Problem
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Create a new coding challenge or generate complete problem specifications using AI.
          </p>
        </div>

        <button
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs whitespace-nowrap flex items-center justify-center gap-2.5 cursor-pointer shrink-0 group disabled:opacity-50"
          onClick={handleAIGenerate}
          disabled={aiLoading}
        >
          <FaWandMagicSparkles className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
          {aiLoading ? "Generating with AI..." : "Generate with AI"}
        </button>
      </div>

      {/* Form Container */}
      <CodingForm
        onSubmit={handleSubmit}
        loading={loading}
        onLanguageChange={setSupportedLanguages}
      />

      {/* Tips Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="rounded-3xl border border-indigo-200/90 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <h3 className="font-black text-sm text-indigo-600 flex items-center gap-2 mb-2">
            <FaLightbulb /> Starter Templates
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Provide clean starter function signatures for candidates in JavaScript, Python, Java, and C++.
          </p>
        </div>

        <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/80 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <h3 className="font-black text-sm text-emerald-600 flex items-center gap-2 mb-2">
            <FaCheckCircle /> Hidden Test Cases
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Include hidden test cases to validate edge cases during submission evaluation.
          </p>
        </div>

        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300">
          <h3 className="font-black text-sm text-amber-600 flex items-center gap-2 mb-2">
            <FaClock /> Optimal Time Limits
          </h3>
          <p className="text-xs text-slate-600 font-medium leading-relaxed">
            Configure realistic time and memory limits based on language performance profiles.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddCoding;