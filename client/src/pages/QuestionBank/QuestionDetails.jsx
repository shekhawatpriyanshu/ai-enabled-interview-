import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  BookOpen,
  Tag,
  Calendar,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { getQuestion } from "../../services/QuestionService";
import DifficultyBadge from "../../components/QuestionBank/DifficultyBadge";
import LoadingSkeleton from "../../components/QuestionBank/LoadingSkeleton";
import EmptyState from "../../components/QuestionBank/EmptyState";

const QuestionDetails = () => {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestion = async () => {
    try {
      setLoading(true);

      const res = await getQuestion(id);

      setQuestion(res.question);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="p-6">
        <EmptyState
          title="Question Not Found"
          description="The requested question does not exist."
        />
      </div>
    );
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">

        {/* Back Button */}
        <Link
          to="/question-bank/questions"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} />
          Back to Questions
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-md p-6">

          <div className="flex justify-between items-start flex-wrap gap-4">

            {/* Title & Info */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {question.title}
              </h1>

              <div className="flex flex-wrap gap-3 mt-4">
                <DifficultyBadge
                  difficulty={question.difficulty}
                />

                <span className="flex items-center gap-1 text-gray-600">
                  <BookOpen size={16} />
                  {question.topic?.name}
                </span>

                <span className="flex items-center gap-1 text-gray-600">
                  <Building2 size={16} />
                  {question.company?.name}
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Problem Description
          </h2>

          <p className="text-gray-700 leading-7">
            {question.description || "No description available."}
          </p>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Tags
          </h2>

          <div className="flex flex-wrap gap-2">
            {question.tags?.length > 0 ? (
              question.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  <Tag size={14} />
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-gray-500">
                No tags available.
              </p>
            )}
          </div>
        </div>

        {/* Answer */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Solution / Answer
          </h2>

          <div className="bg-gray-100 rounded-xl p-4 whitespace-pre-wrap leading-7">
            {question.answer}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-md p-6 flex items-center gap-2 text-gray-500">
          <Calendar size={18} />
          Created on {new Date(question.createdAt).toLocaleDateString()}
        </div>

      </div>
    </MainLayout>
  );
};

export default QuestionDetails;