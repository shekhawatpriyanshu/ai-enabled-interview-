import { Link } from "react-router-dom";
import { FaEye, FaTrash, FaCommentDots, FaUser } from "react-icons/fa";

const CommentTable = ({ comments = [], loading = false, onDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Comments...
        </p>
      </div>
    );
  }

  if (!comments.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 animate-pulse">
          <FaCommentDots />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Comments Found</h3>
        <p className="text-slate-500 text-xs font-semibold">
          Try refining your search keyword to find matching comments.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[850px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              User
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Discussion
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Comment Text
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Date
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[130px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {comments.map((comment) => (
            <tr
              key={comment._id}
              className="hover:bg-gradient-to-r hover:from-purple-50/60 hover:via-fuchsia-50/30 hover:to-indigo-50/40 transition-all duration-300 group"
            >
              {/* User Column */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-sm text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                      {comment.user?.name || "Anonymous User"}
                    </p>
                    <p className="text-xs text-slate-500 font-semibold truncate">
                      {comment.user?.email || "-"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Discussion Column */}
              <td className="px-6 py-4 text-left">
                <p className="font-extrabold text-sm text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                  {comment.discussion?.title || "Untitled Discussion"}
                </p>
              </td>

              {/* Comment Text */}
              <td className="px-6 py-4 text-left">
                <div className="bg-slate-50/80 group-hover:bg-white p-3 rounded-xl border border-slate-100 group-hover:border-purple-200 transition-all">
                  <p className="text-xs text-slate-700 font-medium leading-relaxed line-clamp-2 max-w-md">
                    {comment.text}
                  </p>
                </div>
              </td>

              {/* Date */}
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(comment.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/community/discussion/${comment.discussion?._id}`}
                    className="w-8.5 h-8.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="View Parent Discussion"
                  >
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => onDelete(comment)}
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Delete Comment"
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

export default CommentTable;