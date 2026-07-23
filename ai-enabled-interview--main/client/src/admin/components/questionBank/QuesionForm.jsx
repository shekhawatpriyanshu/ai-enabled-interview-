import { useEffect, useState } from "react";
import useQuestion from "../../hooks/useQuestion";
import TagInput from "./TagInput";
import ExampleInput from "./ExampleInput";
import ConstraintInput from "./ConstraintInput";
import HintInput from "./HintInput";
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
const setTags = (tags) => {
  setFormData((prev) => ({
    ...prev,
    tags,
  }));
};
const setConstraints = (constraints) => {
  setFormData((prev) => ({
    ...prev,
    constraints,
  }));
};

const setHints = (hints) => {
  setFormData((prev) => ({
    ...prev,
    hints,
  }));
};
const setExamples = (examples) => {
  setFormData((prev) => ({
    ...prev,
    examples,
  }));
};
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      return alert("Title is required");
    }

    if (!formData.answer.trim()) {
      return alert("Answer is required");
    }

    if (!formData.topic) {
      return alert("Select Topic");
    }

    if (!formData.company) {
      return alert("Select Company");
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={submitForm}
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Question Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Find First and Last Position of Element in Sorted Array"
          className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Problem Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Provide a general overview or context of the interview problem..."
          className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm"
        />
      </div>

      {/* Question */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Detailed Problem Specification
        </label>

        <textarea
          rows={6}
          name="question"
          value={formData.question}
          onChange={handleChange}
          placeholder="State the formal input parameters, expected return outputs, and examples..."
          className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm"
        />
      </div>

      {/* Answer */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Reference Answer / Solution Guide
        </label>

        <textarea
          rows={6}
          name="answer"
          value={formData.answer}
          onChange={handleChange}
          placeholder="Write the full reference code or detailed explanation..."
          className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm font-mono text-sm bg-slate-50"
        />
      </div>

      {/* Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Difficulty */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Difficulty Level
          </label>
          <div className="flex gap-2">
            {["Easy", "Medium", "Hard"].map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, difficulty: diff }))}
                className={`flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  formData.difficulty === diff
                    ? diff === "Easy"
                      ? "bg-green-500 border-green-500 text-white shadow-md shadow-green-500/20"
                      : diff === "Medium"
                      ? "bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-500/20"
                      : "bg-red-500 border-red-500 text-white shadow-md shadow-red-500/20"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Topic Domain
          </label>

          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm bg-white"
          >
            <option value="">
              Select Topic
            </option>

            {(topics || []).map((topic) => (
              <option
                key={topic._id}
                value={topic._id}
              >
                {topic.name}
              </option>
            ))}
          </select>
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Company Association
          </label>

          <select
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-200 outline-none shadow-sm bg-white"
          >
            <option value="">
              Select Company
            </option>

            {(companies || []).map((company) => (
              <option
                key={company._id}
                value={company._id}
              >
                {company.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Sections */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
        <TagInput
          tags={formData.tags}
          setTags={setTags}
        />

        <ExampleInput
          examples={formData.examples}
          setExamples={setExamples}
        />

        <ConstraintInput
          constraints={formData.constraints}
          setConstraints={setConstraints}
        />

        <HintInput
          hints={formData.hints}
          setHints={setHints}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-4">
        <button
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-10 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading
            ? "Saving..."
            : "Save Question"}
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;