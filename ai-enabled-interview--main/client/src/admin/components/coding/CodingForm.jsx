import { useState } from "react";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    <form onSubmit={submitHandler} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h5 className="font-semibold text-slate-800 text-base">Basic Information</h5>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Problem Title
            </label>
            <input
              type="text"
              name="title"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Description
            </label>
            <textarea
              rows="8"
              name="description"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-y"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Difficulty
              </label>
              <select
                name="difficulty"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                value={formData.difficulty}
                onChange={handleChange}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Topic
              </label>
              <input
                name="topic"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                value={formData.topic}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700">
                Tags (comma separated)
              </label>
              <input
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Constraints */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h5 className="font-semibold text-slate-800 text-base">Constraints</h5>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
            onClick={addConstraint}
          >
            + Add Constraint
          </button>
        </div>

        <div className="p-6 space-y-4">
          {formData.constraints.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                value={item}
                onChange={(e) => handleConstraint(index, e.target.value)}
              />
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent rounded-xl transition cursor-pointer"
                onClick={() => removeConstraint(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Examples */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h5 className="font-semibold text-slate-800 text-base">Examples</h5>
          <button
            type="button"
            className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
            onClick={addExample}
          >
            + Add Example
          </button>
        </div>

        <div className="p-6 space-y-6">
          {formData.examples.map((example, index) => (
            <div
              key={index}
              className="border border-slate-100 rounded-xl p-5 bg-slate-50/50 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h6 className="font-semibold text-slate-700 text-sm">Example {index + 1}</h6>
                <button
                  type="button"
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
                  onClick={() => removeExample(index)}
                >
                  Delete Example
                </button>
              </div>

              <input
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="Input"
                value={example.input}
                onChange={(e) => handleExample(index, "input", e.target.value)}
              />

              <input
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="Output"
                value={example.output}
                onChange={(e) => handleExample(index, "output", e.target.value)}
              />

              <textarea
                rows="3"
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition resize-y"
                placeholder="Explanation"
                value={example.explanation}
                onChange={(e) =>
                  handleExample(index, "explanation", e.target.value)
                }
              />

              <label className="flex items-center gap-2 text-sm text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
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

      {/* Supported Languages */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h5 className="font-semibold text-slate-800 text-base">Supported Languages</h5>
        </div>

        <div className="p-6 flex flex-wrap gap-6">
          {["javascript", "java", "python", "cpp", "c"].map((language) => (
            <label
              key={language}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 uppercase tracking-wide cursor-pointer"
            >
              <input
                type="checkbox"
                className="h-4.5 w-4.5 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500 cursor-pointer"
                checked={formData.supportedLanguages.includes(language)}
                onChange={() => handleLanguage(language)}
              />
              {language}
            </label>
          ))}
        </div>
      </div>

      {/* Limits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Time Limit (sec)</label>
          <input
            type="number"
            name="timeLimit"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={formData.timeLimit}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">Memory Limit (MB)</label>
          <input
            type="number"
            name="memoryLimit"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            value={formData.memoryLimit}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Solution */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">Official Solution</label>
        <textarea
          rows="10"
          name="solution"
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 font-mono text-sm transition resize-y"
          value={formData.solution}
          onChange={handleChange}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {loading ? "Saving..." : "Save Problem"}
        </button>
      </div>
    </form>
  );
};

export default CodingForm;