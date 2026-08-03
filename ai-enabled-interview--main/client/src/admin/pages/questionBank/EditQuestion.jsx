import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";

import QuestionForm from "../../components/questionBank/QuesionForm";
import useQuestion from "../../hooks/useQuestion";

const EditQuestion = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    fetchQuestion,
    editQuestion,
  } = useQuestion();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, []);

  const loadQuestion = async () => {
    try {
      setLoading(true);
      const data = await fetchQuestion(id);
      setQuestion(data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load question."
      );
      navigate("/admin/questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);
      await editQuestion(id, formData);
      toast.success("Question updated successfully.");
      navigate("/admin/questions");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update question."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-500 mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Loading question details...</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Header section */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/questions")}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <BookOpen className="text-blue-500" size={28} />
            Edit Question
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Update problem specifications, references, constraints, and hints.
          </p>
        </div>
      </div>

      <QuestionForm
        initialData={question}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </motion.div>
  );
};

export default EditQuestion;