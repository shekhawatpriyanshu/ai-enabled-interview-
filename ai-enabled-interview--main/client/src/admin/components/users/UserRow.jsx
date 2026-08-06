import {
  FaEye,
  FaEdit,
  FaTrash,
  FaBan,
  FaCheckCircle,
} from "react-icons/fa";

const UserRow = ({
  user,
  onView,
  onEdit,
  onDelete,
  onBlock,
  onRole,
}) => {
  return (
    <tr className="hover:bg-gradient-to-r hover:from-cyan-50/60 hover:via-indigo-50/30 hover:to-purple-50/40 transition-all duration-300 group">
      {/* Name */}
      <td className="px-6 py-4.5 text-left">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <span className="font-semibold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
            {user.name}
          </span>
        </div>
      </td>

      {/* Email */}
      <td className="px-6 py-4.5 text-xs font-normal text-slate-600">
        {user.email}
      </td>

      {/* Role */}
      <td className="px-6 py-4.5 text-center text-xs font-normal">
        <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 font-medium capitalize">
          {user.role}
        </span>
      </td>

      {/* Verified */}
      <td className="px-6 py-4.5 text-center">
        {user.isVerified ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Verified
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4.5 text-center">
        {user.isBlocked ? (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Blocked
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        )}
      </td>

      {/* Joined */}
      <td className="px-6 py-4.5 text-center text-xs font-medium text-slate-500">
        {new Date(user.createdAt).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-6 py-4.5">
        <div className="flex justify-center items-center gap-1.5">
          {/* View */}
          <button
            onClick={() => onView(user._id)}
            className="w-8.5 h-8.5 rounded-xl bg-cyan-50 text-cyan-600 hover:bg-cyan-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
            title="View User"
          >
            <FaEye />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(user._id)}
            className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
            title="Edit User"
          >
            <FaEdit />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(user._id)}
            className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
            title="Delete User"
          >
            <FaTrash />
          </button>

          {/* Block / Unblock */}
          <button
            onClick={() => onBlock(user._id)}
            className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center text-xs font-medium transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer ${
              user.isBlocked
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-700 hover:text-white"
            }`}
            title={user.isBlocked ? "Unblock User" : "Block User"}
          >
            {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;