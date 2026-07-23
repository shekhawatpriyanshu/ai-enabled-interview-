import { Link } from "react-router-dom";
import { FaEye, FaTrash } from "react-icons/fa";

const DiscussionTable = ({
  discussions = [],
  loading = false,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow border p-10 text-center">
        <p className="text-gray-500">
          Loading discussions...
        </p>
      </div>
    );
  }

  if (!discussions.length) {
    return (
      <div className="bg-white rounded-lg shadow border p-10 text-center">
        <h2 className="text-lg font-semibold">
          No Discussions Found
        </h2>

        <p className="text-gray-500 mt-2">
          Try changing your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Title</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Author</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Likes</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Comments</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Created</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[120px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {discussions.map((discussion) => (
            <tr key={discussion._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-left">
                <div>
                  <p className="font-semibold text-sm text-slate-900">{discussion.title}</p>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{discussion.content}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <div>
                  <p className="font-medium text-sm text-slate-900">{discussion.user?.name}</p>
                  <p className="text-xs text-slate-500">{discussion.user?.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{discussion.totalLikes}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{discussion.totalComments}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{new Date(discussion.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/community/discussion/${discussion._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="View"
                  >
                    <FaEye />
                  </Link>
                  <button
                    onClick={() => onDelete(discussion)}
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

export default DiscussionTable;