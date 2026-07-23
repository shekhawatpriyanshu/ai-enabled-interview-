import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
      toast.success(data.message);
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
      const topic = prompt("Enter Topic");
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Add Coding Problem</h1>
          <p className="text-sm text-slate-500 mt-1">
            Create a new coding challenge or generate one using AI.
          </p>
        </div>

        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition duration-200 active:scale-95 disabled:opacity-50 cursor-pointer text-sm"
          onClick={handleAIGenerate}
          disabled={aiLoading}
        >
          {aiLoading ? "Generating..." : "Generate with AI"}
        </button>
      </div>

      <CodingForm onSubmit={handleSubmit} loading={loading} onLanguageChange={setSupportedLanguages} />
    </div>
  );
};

export default AddCoding;