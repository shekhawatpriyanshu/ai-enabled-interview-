import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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

      toast.success(
        "Question updated successfully."
      );

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
      <div className="p-8 text-center">
        Loading question...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Edit Question
        </h1>

        <p className="text-gray-500 mt-2">
          Update the interview question.
        </p>

      </div>

      <QuestionForm
        initialData={question}
        onSubmit={handleSubmit}
        loading={saving}
      />

    </div>
  );
};

export default EditQuestion;