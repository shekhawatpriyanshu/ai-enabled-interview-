import { useState } from "react";
import { FaCode, FaCheck, FaPlus, FaTrash, FaClock, FaMemory, FaTerminal, FaFileCode, FaLaptopCode, FaCheckCircle, FaBookOpen, FaExclamationTriangle } from "react-icons/fa";

const defaultExample = {
  input: "",
  output: "",
  explanation: "",
  isHidden: false,
};

const CodingForm = ({ initialValues = {}, onSubmit, loading, onLanguageChange }) => {
  const [formData, setFormData] = useState({
    title: initialValues.title || "",
    description: initialValues.description || "",
    difficulty: initialValues.difficulty || "Easy",
    topic: initialValues.topic || "",
    tags: initialValues.tags || [],
    constraints: initialValues.constraints || [""],
    examples: initialValues.examples || [defaultExample],
    starterCode: initialValues.starterCode || {
      javascript: "",
      java: "",
      python: "",
      cpp: "",
      c: "",
    },
    supportedLanguages: initialValues.supportedLanguages || ["javascript"],
    solution: initialValues.solution || "",
    timeLimit: initialValues.timeLimit || 1,
    memoryLimit: initialValues.memoryLimit || 256,
  });

  const [activeStarterLang, setActiveStarterLang] = useState("javascript");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStarterCodeChange = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: value,
      },
    }));
  };

  const handleLanguage = (language) => {
    const exists = formData.supportedLanguages.includes(language);
    let updated;
    if (exists) {
      updated = formData.supportedLanguages.filter((l) => l !== language);
    } else {
      updated = [...formData.supportedLanguages, language];
    }

    setFormData({
      ...formData,
      supportedLanguages: updated,
    });

    if (onLanguageChange) {
      onLanguageChange(updated);
    }
  };

  const handleConstraint = (index, value) => {
    const list = [...formData.constraints];
    list[index] = value;
    setFormData({
      ...formData,
      constraints: list,
    });
  };

  const addConstraint = () => {
    setFormData({
      ...formData,
      constraints: [...formData.constraints, ""],
    });
  };

  const removeConstraint = (index) => {
    const list = [...formData.constraints];
    list.splice(index, 1);
    setFormData({
      ...formData,
      constraints: list,
    });
  };

  const handleExample = (index, field, value) => {
    const list = [...formData.examples];
    list[index] = {
      ...list[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      examples: list,
    });
  };

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [...formData.examples, { ...defaultExample }],
    });
  };

  const removeExample = (index) => {
    const list = [...formData.examples];
    list.splice(index, 1);
    setFormData({
      ...formData,
      examples: list,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler} className="space-y-8">
      {/* 1. Basic Information Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />
        <div className="bg-slate-50/60 border-b border-slate-100 px-6 sm:px-8 py-5 mt-2">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
            <FaFileCode className="text-indigo-600" /> Basic Problem Overview
          </h3>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Problem Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm shadow-xs"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Two Sum, Valid Anagram"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Detailed Description
            </label>
            <textarea
              rows="7"
              name="description"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-y shadow-xs"
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide problem specification, input/output requirements, and edge cases..."
              required
            />
          </div>

          {/* Difficulty, Topic, Tags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Difficulty Level
              </label>
              <select
                name="difficulty"
                className="w-full px-4 py-3 bg-white border border-slate-200 hover:border-purple-300 rounded-2xl text-slate-800 font-normal focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-xs sm:text-sm cursor-pointer shadow-sm"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option className="bg-white font-normal text-slate-800 py-1">Easy 🌱</option>
                <option className="bg-white font-normal text-slate-800 py-1">Medium ⚡</option>
                <option className="bg-white font-normal text-slate-800 py-1">Hard 🔥</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Topic Domain
              </label>
              <input
                name="topic"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm shadow-xs"
                value={formData.topic}
                onChange={handleChange}
                placeholder="e.g. Arrays, Two Pointers"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Tags (comma separated)
              </label>
              <input
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm shadow-xs"
                value={formData.tags.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tags: e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean),
                  })
                }
                placeholder="e.g. hash-table, two-pointers"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Supported Languages */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-cyan-500" />
        <div className="bg-slate-50/60 border-b border-slate-100 px-6 sm:px-8 py-5 mt-2">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
            <FaTerminal className="text-purple-600" /> Supported Languages
          </h3>
        </div>

        <div className="p-6 sm:p-8 flex flex-wrap gap-3">
          {["javascript", "java", "python", "cpp", "c"].map((language) => {
            const isSelected = formData.supportedLanguages.includes(language);
            return (
              <label
                key={language}
                className={`flex items-center gap-2.5 text-xs font-black uppercase tracking-wider cursor-pointer px-5 py-3 rounded-2xl transition-all duration-300 border shadow-sm hover:scale-105 active:scale-95 ${
                  isSelected
                    ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white border-transparent shadow-lg shadow-indigo-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300 hover:bg-white"
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isSelected}
                  onChange={() => handleLanguage(language)}
                />
                {isSelected && <FaCheck className="text-white text-xs" />}
                {language}
              </label>
            );
          })}
        </div>
      </div>

      {/* 3. Starter Code Templates Editor (Interactive Tabs) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600" />
        <div className="bg-slate-50/60 border-b border-slate-100 px-6 sm:px-8 py-5 mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
            <FaLaptopCode className="text-cyan-600" /> Candidate Starter Code Templates
          </h3>

          {/* Language Tabs */}
          <div className="flex bg-slate-200/70 p-1 rounded-2xl gap-1">
            {["javascript", "java", "python", "cpp", "c"].map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveStarterLang(lang)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeStarterLang === lang
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-3">
          <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-2">
            Starter Function Signature for <span className="text-cyan-600 font-black uppercase">{activeStarterLang}</span>
          </label>
          <textarea
            rows="7"
            className="w-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-cyan-300 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all resize-y shadow-inner"
            placeholder={`// Write initial starter code template for ${activeStarterLang}...\ne.g. function twoSum(nums, target) {\n  // Your code here\n}`}
            value={formData.starterCode[activeStarterLang] || ""}
            onChange={(e) => handleStarterCodeChange(activeStarterLang, e.target.value)}
          />
        </div>
      </div>

      {/* 4. Constraints */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 to-orange-500" />
        <div className="bg-slate-50/60 border-b border-slate-100 px-6 sm:px-8 py-5 mt-2 flex justify-between items-center">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
            <FaExclamationTriangle className="text-amber-500" /> Problem Constraints
          </h3>
          <button
            type="button"
            className="px-4 py-2 text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            onClick={addConstraint}
          >
            <FaPlus /> Add Constraint
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-3">
          {formData.constraints.map((item, index) => (
            <div key={index} className="flex gap-2.5 items-center">
              <input
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 hover:border-amber-300 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-xs"
                value={item}
                onChange={(e) => handleConstraint(index, e.target.value)}
                placeholder={`Constraint #${index + 1}`}
              />
              <button
                type="button"
                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition-all hover:scale-110 active:scale-95 cursor-pointer shrink-0"
                onClick={() => removeConstraint(index)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Examples & Test Cases */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
        <div className="bg-slate-50/60 border-b border-slate-100 px-6 sm:px-8 py-5 mt-2 flex justify-between items-center">
          <h3 className="font-black text-slate-900 text-lg flex items-center gap-2.5">
            <FaBookOpen className="text-emerald-600" /> Examples & Test Cases
          </h3>
          <button
            type="button"
            className="px-4 py-2 text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
            onClick={addExample}
          >
            <FaPlus /> Add Example
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {formData.examples.map((example, index) => (
            <div
              key={index}
              className="border border-slate-200/90 rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-white space-y-4 hover:shadow-md transition-all duration-300"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h4 className="font-black text-xs uppercase tracking-wider text-emerald-600">
                  Example #{index + 1}
                </h4>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs transition-all hover:scale-110 active:scale-95 cursor-pointer"
                  onClick={() => removeExample(index)}
                >
                  <FaTrash />
                </button>
              </div>

              <input
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Sample Input"
                value={example.input}
                onChange={(e) => handleExample(index, "input", e.target.value)}
              />

              <input
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Sample Output"
                value={example.output}
                onChange={(e) => handleExample(index, "output", e.target.value)}
              />

              <textarea
                rows="3"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-y"
                placeholder="Explanation (Optional)"
                value={example.explanation}
                onChange={(e) =>
                  handleExample(index, "explanation", e.target.value)
                }
              />

              <label className="flex items-center gap-2 text-xs text-slate-600 font-extrabold cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                  checked={example.isHidden}
                  onChange={(e) =>
                    handleExample(index, "isHidden", e.target.checked)
                  }
                />
                Hidden Test Case
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaClock className="text-amber-500" /> Time Limit (seconds)
          </label>
          <input
            type="number"
            name="timeLimit"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            value={formData.timeLimit}
            onChange={handleChange}
          />
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xl space-y-2">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <FaMemory className="text-indigo-600" /> Memory Limit (MB)
          </label>
          <input
            type="number"
            name="memoryLimit"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-black focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
            value={formData.memoryLimit}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 7. Solution Code */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <label className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-2">
          <FaCheckCircle className="text-emerald-500" /> Official Solution Code
        </label>
        <textarea
          rows="8"
          name="solution"
          className="w-full px-4 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-emerald-400 font-mono text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-y shadow-inner"
          placeholder="// Paste official code solution here..."
          value={formData.solution}
          onChange={handleChange}
        />
      </div>

      {/* 8. Submit Action Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs uppercase tracking-wider whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving Problem..." : "Save Problem"}
        </button>
      </div>
    </form>
  );
};

export default CodingForm;