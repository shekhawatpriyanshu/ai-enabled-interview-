import { useEffect, useState } from "react";

import QuestionSelector from "./QuestionSelector";

const MockTestForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
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
      [name]:
        name === "duration"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleQuestionChange = (
    selectedQuestions
  ) => {
    setFormData((prev) => ({
      ...prev,
      questions: selectedQuestions,
    }));

    setErrors((prev) => ({
      ...prev,
      questions: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title =
        "Title is required.";
    }

    if (!formData.duration) {
      newErrors.duration =
        "Duration is required.";
    }

    if (formData.duration <= 0) {
      newErrors.duration =
        "Duration must be greater than 0.";
    }

    if (
      formData.questions.length === 0
    ) {
      newErrors.questions =
        "Select at least one question.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...formData,
      totalMarks:
        formData.questions.length,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Title */}

      <div>
        <label className="block mb-2 font-medium">
          Test Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Enter mock test title"
        />

        {errors.title && (
          <p className="text-red-500 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}

      <div>
        <label className="block mb-2 font-medium">
          Description
        </label>

        <textarea
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          placeholder="Enter description"
        />
      </div>

      {/* Duration */}

      <div>
        <label className="block mb-2 font-medium">
          Duration (Minutes)
        </label>

        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        />

        {errors.duration && (
          <p className="text-red-500 text-sm mt-1">
            {errors.duration}
          </p>
        )}
      </div>

      {/* Difficulty */}

      <div>
        <label className="block mb-2 font-medium">
          Difficulty
        </label>

        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="Easy">
            Easy
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Hard">
            Hard
          </option>
        </select>
      </div>
            {/* Question Selector */}

      <div>
        <QuestionSelector
          selectedQuestions={formData.questions}
          onChange={handleQuestionChange}
         
        />

        {errors.questions && (
          <p className="mt-2 text-sm text-red-500">
            {errors.questions}
          </p>
        )}
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Total Questions
          </p>

          <h3 className="mt-1 text-2xl font-bold text-blue-600">
            {formData.questions.length}
          </h3>
        </div>

        <div className="rounded-lg border bg-gray-50 p-4">
          <p className="text-sm text-gray-500">
            Total Marks
          </p>

          <h3 className="mt-1 text-2xl font-bold text-green-600">
            {formData.questions.length}
          </h3>
        </div>
      </div>

      {/* Footer */}

      <div className="flex justify-end gap-4 border-t pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-lg border border-gray-300 px-5 py-2 font-medium transition hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData?._id
            ? "Update Mock Test"
            : "Create Mock Test"}
        </button>
      </div>
    </form>
  );
};

export default MockTestForm;