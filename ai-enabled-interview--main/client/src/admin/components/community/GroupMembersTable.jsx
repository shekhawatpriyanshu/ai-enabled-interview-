import { FaUserCircle, FaUserMinus } from "react-icons/fa";

const GroupMembersTable = ({
  members = [],
  loading = false,
  onRemove,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <p className="text-gray-500">
          Loading members...
        </p>
      </div>
    );
  }

  if (!members.length) {
    return (
      <div className="bg-white rounded-xl shadow border p-10 text-center">
        <h2 className="text-lg font-semibold">
          No Members Found
        </h2>

        <p className="text-gray-500 mt-2">
          This study group has no members.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
      <table className="w-full min-w-[700px] border-collapse text-left">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Member</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Email</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Joined</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {members.map((member) => (
            <tr key={member._id} className="hover:bg-slate-50/80 transition-colors">
              <td className="px-6 py-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100">
                    <FaUserCircle className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-500">ID : {member._id}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-left">
                <p className="text-sm text-slate-600">{member.email}</p>
              </td>
              <td className="px-6 py-4 text-center text-sm text-slate-600">
                {member.createdAt ? new Date(member.createdAt).toLocaleDateString() : "-"}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-center items-center">
                  <button
                    onClick={() => onRemove(member)}
                    className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                    title="Remove Member"
                  >
                    <FaUserMinus />
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

export default GroupMembersTable;