import { Link } from "react-router-dom";
import { FaEye, FaEdit, FaTrash, FaLayerGroup, FaUsers, FaUser } from "react-icons/fa";

const GroupTable = ({ groups = [], loading = false, onDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl">
        <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Study Groups...
        </p>
      </div>
    );
  }

  if (!groups.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center text-3xl shadow-lg shadow-emerald-500/30 animate-bounce">
          <FaLayerGroup />
        </div>
        <h3 className="text-lg font-black text-slate-900">No Study Groups Found</h3>
        <p className="text-slate-500 text-xs font-semibold">
          No groups match your current search query.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200/80">
          <tr>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Study Group
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
              Owner
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Members
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
              Created Date
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[160px]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {groups.map((group) => (
            <tr
              key={group._id}
              className="hover:bg-gradient-to-r hover:from-emerald-50/60 hover:via-teal-50/30 hover:to-cyan-50/40 transition-all duration-300 group"
            >
              {/* Group Name & Description */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                    <FaLayerGroup />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-emerald-600 transition-colors truncate">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                      {group.description || "No description provided"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Owner */}
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                    {group.owner?.name ? group.owner.name.charAt(0).toUpperCase() : <FaUser />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-extrabold text-xs text-slate-900 truncate">
                      {group.owner?.name || "Group Owner"}
                    </p>
                    <p className="text-[11px] text-slate-400 font-semibold truncate">
                      {group.owner?.email || "-"}
                    </p>
                  </div>
                </div>
              </td>

              {/* Members Count */}
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold shadow-sm">
                  <FaUsers className="text-emerald-500 text-[11px]" />
                  {group.membersCount || 0} Members
                </span>
              </td>

              {/* Created Date */}
              <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                {new Date(group.createdAt).toLocaleDateString()}
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex justify-center items-center gap-1.5">
                  <Link
                    to={`/admin/community/group/${group._id}`}
                    className="w-8.5 h-8.5 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="View Details"
                  >
                    <FaEye />
                  </Link>
                  <Link
                    to={`/admin/community/group/edit/${group._id}`}
                    className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
                    title="Edit Group"
                  >
                    <FaEdit />
                  </Link>
                  <button
                    onClick={() => onDelete(group)}
                    className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all shadow-sm hover:shadow hover:scale-105 active:scale-95 cursor-pointer"
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