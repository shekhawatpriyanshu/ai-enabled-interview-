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
    <tr className="border-b hover:bg-gray-50 transition">

      {/* Name */}

      <td className="p-4 font-semibold">
        {user.name}
      </td>

      {/* Email */}

      <td className="p-4">
        {user.email}
      </td>

      {/* Role */}

      <td className="p-4 text-center capitalize text-slate-600 font-medium">
        {user.role}
      </td>

      {/* Verified */}

      <td className="p-4 text-center">

        {user.isVerified ? (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Verified
          </span>

        ) : (

          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
            Pending
          </span>

        )}

      </td>

      {/* Status */}

      <td className="p-4 text-center">

        {user.isBlocked ? (

          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
            Blocked
          </span>

        ) : (

          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
            Active
          </span>

        )}

      </td>

      {/* Joined */}

      <td className="p-4 text-center">

        {new Date(
          user.createdAt
        ).toLocaleDateString()}

      </td>

      {/* Actions */}

      <td className="p-4">

        <div className="flex justify-center gap-2">

          {/* View */}
          <button
            onClick={() => onView(user._id)}
            className="h-9 w-9 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition"
            title="View"
          >
            <FaEye />
          </button>

          {/* Edit */}
          <button
            onClick={() => onEdit(user._id)}
            className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition"
            title="Edit"
          >
            <FaEdit />
          </button>

          {/* Delete */}
          <button
            onClick={() => onDelete(user._id)}
            className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition"
            title="Delete"
          >
            <FaTrash />
          </button>

          {/* Block */}
          <button
            onClick={() => onBlock(user._id)}
            className={`h-9 w-9 flex items-center justify-center rounded-lg shadow-sm transition ${
              user.isBlocked
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-700 hover:bg-gray-800 text-white"
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