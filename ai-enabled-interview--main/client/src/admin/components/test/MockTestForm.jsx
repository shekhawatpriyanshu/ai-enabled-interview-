import { useEffect, useState } from "react";
import QuestionSelector from "./QuestionSelector";
import { motion } from "framer-motion";
import { FileText, AlignLeft, Clock, BarChart, CheckCircle, Save, X, Loader2, Target, Award } from "lucide-react";

const MockTestForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: 30,
    difficulty: "Easy",
    isActive: true,
    questions: [],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        duration: initialData.duration || 30,
        difficulty: initialData.difficulty || "Easy",
        isActive: initialData.isActive !== undefined ? initialData.isActive : true,
        questions:
          initialData.questions?.map((q) =>
            typeof q === "object" ? q._id : q
          ) || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "duration" ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleQuestionChange = (selectedQuestions) => {
    setFormData((prev) => ({ ...prev, questions: selectedQuestions }));
    setErrors((prev) => ({ ...prev, questions: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required.";
    if (!formData.duration) newErrors.duration = "Duration is required.";
    if (formData.duration <= 0) newErrors.duration = "Duration must be greater than 0.";
    if (formData.questions.length === 0) newErrors.questions = "Select at least one question.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    onSubmit({
      ...formData,
      totalMarks: formData.questions.length,
    });
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FileText size={15} className="text-indigo-600" /> Test Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full bg-slate-50 border ${errors.title ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 hover:border-purple-300 focus:ring-purple-500/20 focus:border-purple-500'} rounded-2xl px-4 py-3 outline-none focus:ring-2 transition-all text-slate-800 font-semibold text-sm shadow-xs`}
            placeholder="e.g. Advanced React & Frontend Architecture Assessment"
          />
          {errors.title && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-rose-600 text-xs font-semibold mt-1 ml-1">
              {errors.title}
            </motion.p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <AlignLeft size={15} className="text-purple-600" /> Assessment Overview & Instructions
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 font-medium text-sm resize-none shadow-xs"
            placeholder="Provide guidelines, pass requirements, and instructions for candidates taking this test..."
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Clock size={15} className="text-amber-500" /> Test Duration (Minutes)
          </label>
          <div className="relative">
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full bg-slate-50 border ${errors.duration ? 'border-rose-400 focus:ring-rose-500/20' : 'border-slate-200 hover:border-purple-300 focus:ring-purple-500/20 focus:border-purple-500'} rounded-2xl pl-4 pr-14 py-3 outline-none focus:ring-2 transition-all text-slate-800 font-semibold text-sm shadow-xs`}
            />
            <span className="absolute right-4 top-3 text-slate-400 text-xs font-bold uppercase">mins</span>
          </div>
          {errors.duration && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-rose-600 text-xs font-semibold mt-1 ml-1">
              {errors.duration}
            </motion.p>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <BarChart size={15} className="text-emerald-500" /> Target Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-white border border-slate-200 hover:border-purple-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-slate-800 font-normal text-sm cursor-pointer shadow-xs"
          >
            <option value="Easy" className="bg-white font-normal text-slate-800 py-1">Easy Level</option>
            <option value="Medium" className="bg-white font-normal text-slate-800 py-1">Medium Level</option>
            <option value="Hard" className="bg-white font-normal text-slate-800 py-1">Hard Level</option>
          </select>
        </div>

        {/* Test Active / Inactive Status */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <CheckCircle size={15} className="text-indigo-600" /> Test Publication Status
          </label>
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
            <span className="text-sm font-bold text-slate-800">
              {formData.isActive ? (
                <span className="text-emerald-700 font-bold">Active (Visible to Students)</span>
              ) : (
                <span className="text-slate-500 font-bold">Inactive (Hidden from Students)</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Question Selector Section */}
      <div className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Target size={18} className="text-purple-600" /> Select Assessment Questions
        </h3>
        
        <div className="bg-slate-50/50 rounded-2xl border border-slate-200/80 p-5 shadow-xs">
          <QuestionSelector
            selectedQuestions={formData.questions}
            onChange={handleQuestionChange}
          />
        </div>
        
        {errors.questions && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-semibold text-rose-600 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 flex items-center gap-2">
            <X size={16} /> {errors.questions}
          </motion.p>
        )}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-6 border-t border-slate-100">
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-blue-50/40 p-5 group transition-all hover:shadow-md hover:border-indigo-300">
          <div className="flex items-center gap-3 text-indigo-600 mb-2 relative z-10">
            <Target size={18} />
            <p className="font-bold text-xs uppercase tracking-wider">Total Questions</p>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent relative z-10">
            {formData.questions.length}
          </h3>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 p-5 group transition-all hover:shadow-md hover:border-emerald-300">
          <div className="flex items-center gap-3 text-emerald-600 mb-2 relative z-10">
            <Award size={18} />
            <p className="font-bold text-xs uppercase tracking-wider">Total Assessment Marks</p>
          </div>
          <h3 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent relative z-10">
            {formData.questions.length}
          </h3>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300 cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/25 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={16} /> Processing...</>
          ) : initialData?._id ? (
            <><CheckCircle size={16} /> Update Mock Test</>
          ) : (
            <><Save size={16} /> Create Mock Test</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default MockTestForm;