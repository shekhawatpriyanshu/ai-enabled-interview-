import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const GroupTable = ({
  groups = [],
  loading = false,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <p className="text-gray-500">
          Loading study groups...
        </p>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <h2 className="text-lg font-semibold">
          No Study Groups Found
        </h2>

        <p className="text-gray-500 mt-2">
          No groups match your search.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Group</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Owner</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Members</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Created</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {groups.map((group) => (
            <tr key={group._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-left">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">{group.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">{group.description || "No description"}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <div>
                  <p className="font-medium text-sm text-slate-900">{group.owner?.name}</p>
                  <p className="text-xs text-slate-500">{group.owner?.email}</p>
                </div>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{group.membersCount}</td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">{new Date(group.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-2">
                  <Link
                    to={`/admin/community/group/${group._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="View Group"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/community/group/edit/${group._id}`}
                    className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95"
                    title="Edit Group"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => onDelete(group)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Delete Group"
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

export default GroupTable;