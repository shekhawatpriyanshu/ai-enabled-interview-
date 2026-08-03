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
        questions:
          initialData.questions?.map((q) =>
            typeof q === "object" ? q._id : q
          ) || [],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
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
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText size={16} className="text-blue-500" /> Test Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.title ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
            placeholder="e.g. Advanced React Assessment"
          />
          {errors.title && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1">
              {errors.title}
            </motion.p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <AlignLeft size={16} className="text-indigo-500" /> Description
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all dark:text-white resize-none"
            placeholder="Provide context and instructions for the candidates..."
          />
        </div>

        {/* Duration */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" /> Duration (Minutes)
          </label>
          <div className="relative">
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.duration ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-amber-500/50 focus:border-amber-500'} rounded-xl pl-4 pr-12 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
            />
            <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">min</span>
          </div>
          {errors.duration && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1">
              {errors.duration}
            </motion.p>
          )}
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <BarChart size={16} className="text-emerald-500" /> Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      {/* Question Selector */}
      <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <Target size={20} className="text-purple-500" /> Assessment Questions
        </h3>
        
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-1 overflow-hidden shadow-sm">
          <QuestionSelector
            selectedQuestions={formData.questions}
            onChange={handleQuestionChange}
          />
        </div>
        
        {errors.questions && (
          <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-800 flex items-center gap-2">
            <X size={16} /> {errors.questions}
          </motion.p>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        <div className="relative overflow-hidden rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-900/10 p-5 group transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 text-blue-600 mb-2 relative z-10">
            <Target size={20} />
            <p className="font-semibold text-sm uppercase tracking-wider">Total Questions</p>
          </div>
          <h3 className="text-4xl font-extrabold text-blue-700 dark:text-blue-400 relative z-10">
            {formData.questions.length}
          </h3>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-emerald-100 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 p-5 group transition-all hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-3 text-emerald-600 mb-2 relative z-10">
            <Award size={20} />
            <p className="font-semibold text-sm uppercase tracking-wider">Total Marks</p>
          </div>
          <h3 className="text-4xl font-extrabold text-emerald-700 dark:text-emerald-400 relative z-10">
            {formData.questions.length}
          </h3>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-3 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <><Loader2 className="animate-spin" size={20} /> Processing...</>
          ) : initialData?._id ? (
            <><CheckCircle size={20} /> Update Mock Test</>
          ) : (
            <><Save size={20} /> Create Mock Test</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default MockTestForm;