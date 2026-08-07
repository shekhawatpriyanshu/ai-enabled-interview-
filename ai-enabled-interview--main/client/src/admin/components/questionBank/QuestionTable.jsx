import { Link } from "react-router-dom";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaQuestionCircle,
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
        return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
      case "Hard":
        return "bg-rose-500/10 text-rose-600 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 border border-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading questions...
        </p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-12 border border-slate-200/90 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4">
          <FaQuestionCircle />
        </div>
        <h3 className="text-xl font-bold text-slate-800">
          No Questions Found
        </h3>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          We couldn't find any questions matching your filter parameters. Try adjusting your query or create a new question.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-sm">
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
            <tr
              key={question._id}
              className="hover:bg-indigo-50/40 transition-colors duration-200 group"
            >
              <td className="px-6 py-4 font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors text-left max-w-xs truncate">
                {question.title}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-600 text-left">
                {question.topic?.name || "-"}
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-slate-600 text-left">
                {question.company?.name || "-"}
              </td>
              <td className="px-6 py-4 text-left">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getDifficultyClass(
                    question.difficulty
                  )}`}
                >
                  {question.difficulty || "Easy"}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                  <FaEye className="text-indigo-500 text-xs" />
                  {question.views || 0}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-slate-600 text-left">
                {question.createdBy?.name || "Admin"}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/questions/view/${question._id}`}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-indigo-500/20 active:scale-95"
                    title="View Details"
                  >
                    <FaEye className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/admin/questions/edit/${question._id}`}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-amber-500 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-amber-500/20 active:scale-95"
                    title="Edit Question"
                  >
                    <FaEdit className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => handleDelete(question._id)}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-rose-600 text-slate-600 hover:text-white flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-rose-500/20 active:scale-95 cursor-pointer"
                    title="Delete Question"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
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