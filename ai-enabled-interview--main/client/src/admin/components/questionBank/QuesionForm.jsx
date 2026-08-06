import { useEffect, useState } from "react";
import useQuestion from "../../hooks/useQuestion";
import TagInput from "./TagInput";
import ExampleInput from "./ExampleInput";
import ConstraintInput from "./ConstraintInput";
import HintInput from "./HintInput";
import { motion, AnimatePresence } from "framer-motion";
import { FileCode, AlignLeft, Code, FileText, CheckCircle, Save, Loader2, Target, Building, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const QuestionForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const {
    topics,
    companies,
    fetchTopics,
    fetchCompanies,
  } = useQuestion();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    question: "",
    answer: "",
    difficulty: "Easy",
    topic: "",
    company: "",
    tags: [],
    examples: [],
    constraints: [],
    hints: [],
    options: [],
    correctAnswer: "",
  });

  const [errors, setErrors] = useState({});

  const setTags = (tags) => setFormData((prev) => ({ ...prev, tags }));
  const setConstraints = (constraints) => setFormData((prev) => ({ ...prev, constraints }));
  const setHints = (hints) => setFormData((prev) => ({ ...prev, hints }));
  const setExamples = (examples) => setFormData((prev) => ({ ...prev, examples }));

  useEffect(() => {
    fetchTopics();
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        question: initialData.question || "",
        answer: initialData.answer || "",
        difficulty: initialData.difficulty || "Easy",
        topic: initialData.topic?._id || initialData.topic || "",
        company: initialData.company?._id || initialData.company || "",
        tags: initialData.tags || [],
        examples: initialData.examples || [],
        constraints: initialData.constraints || [],
        hints: initialData.hints || [],
        options: initialData.options || [],
        correctAnswer: initialData.correctAnswer || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.answer.trim()) newErrors.answer = "Reference answer is required";
    if (!formData.topic) newErrors.topic = "Topic must be selected";
    if (!formData.company) newErrors.company = "Company must be selected";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill in all required fields");
      return false;
    }
    return true;
  };

  const submitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={submitForm}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

      {/* Main Details */}
      <div className="grid grid-cols-1 gap-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileCode size={16} className="text-blue-500" /> Question Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Find First and Last Position of Element in Sorted Array"
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.title ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
          />
          {errors.title && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.title}
            </motion.p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <AlignLeft size={16} className="text-indigo-500" /> Problem Description (Overview)
          </label>
          <textarea
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a general overview or context of the interview problem..."
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white resize-none"
          />
        </div>

        {/* Question Spec */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Code size={16} className="text-purple-500" /> Detailed Specification
          </label>
          <textarea
            rows={6}
            name="question"
            value={formData.question}
            onChange={handleChange}
            placeholder="State the formal input parameters, expected return outputs, etc..."
            className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-purple-500/50 focus:border-purple-500 rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white resize-none font-mono text-sm"
          />
        </div>

        {/* Answer */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText size={16} className="text-emerald-500" /> Reference Answer / Solution
          </label>
          <textarea
            rows={8}
            name="answer"
            value={formData.answer}
            onChange={handleChange}
            placeholder="Write the full reference code or detailed explanation..."
            className={`w-full bg-slate-900 text-green-400 border ${errors.answer ? 'border-red-400 focus:ring-red-500/50' : 'border-slate-800 focus:ring-emerald-500/50 focus:border-emerald-500'} rounded-xl px-4 py-4 outline-none focus:ring-2 transition-all resize-none font-mono text-sm shadow-inner`}
          />
          {errors.answer && (
            <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
              <AlertCircle size={12} /> {errors.answer}
            </motion.p>
          )}
        </div>
      </div>

      {/* Categorization */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            Difficulty Level
          </label>
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl shadow-inner">
            {["Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, difficulty: diff }))}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${formData.difficulty === diff
                    ? diff === "Easy"
                      ? "bg-green-500 text-white shadow-md"
                      : diff === "Medium"
                        ? "bg-amber-500 text-white shadow-md"
                        : "bg-red-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Target size={16} className="text-indigo-500" /> Topic Domain
          </label>
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.topic ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-indigo-500/50 focus:border-indigo-500'} rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all dark:text-white cursor-pointer`}
          >
            <option value="">Select Topic</option>
            {(topics || []).map((topic) => (
              <option key={topic._id} value={topic._id}>{topic.name}</option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Building size={16} className="text-blue-500" /> Company Target
          </label>
          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.company ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-2.5 outline-none focus:ring-2 transition-all dark:text-white cursor-pointer`}
          >
            <option value="">Select Company</option>
            {(companies || []).map((company) => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Arrays (Tags, Examples, etc) */}
      <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-8 shadow-inner">
        <TagInput tags={formData.tags} setTags={setTags} />
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <ExampleInput examples={formData.examples} setExamples={setExamples} />
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <ConstraintInput constraints={formData.constraints} setConstraints={setConstraints} />
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <HintInput hints={formData.hints} setHints={setHints} />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-6 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={loading}
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
            <><CheckCircle size={20} /> Update Question</>
          ) : (
            <><Save size={20} /> Save Question</>
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default QuestionForm;