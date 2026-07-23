import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import useQuestion from "../../hooks/useQuestion";

const QuestionTable = ({ questions, loading }) => {
  const { removeQuestion } = useQuestion();

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this question?"
    );

    if (!confirmDelete) return;

    try {
      await removeQuestion(id);
    } catch (error) {
      console.log(error);
      alert("Failed to delete question.");
    }
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Hard":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        Loading questions...
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-10 text-center">
        <h2 className="text-xl font-semibold">
          No Questions Found
        </h2>

        <p className="text-gray-500 mt-2">
          Create your first interview question.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Title</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Topic</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Company</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Difficulty</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Views</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Created By</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {questions.map((question) => (
            <tr key={question._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 font-semibold text-sm text-slate-900 text-left">{question.title}</td>
              <td className="px-6 py-4 text-sm text-slate-600 text-left">{question.topic?.name}</td>
              <td className="px-6 py-4 text-sm text-slate-600 text-left">{question.company?.name}</td>
              <td className="px-6 py-4 text-left">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${getDifficultyClass(question.difficulty)}`}>
                  {question.difficulty}
                </span>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{question.views}</td>
              <td className="px-6 py-4 text-sm text-slate-600 text-left">{question.createdBy?.name || "-"}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/questions/view/${question._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/questions/edit/${question._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="Edit"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(question._id)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionTable;