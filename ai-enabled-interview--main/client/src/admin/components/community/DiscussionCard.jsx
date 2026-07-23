import {
  FaUser,
  FaCalendarAlt,
  FaHeart,
  FaComments,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const DiscussionCard = ({
  discussion,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-xl shadow border p-5 hover:shadow-lg transition">

      {/* Header */}

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-lg font-semibold">
            {discussion.title}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-gray-500 text-sm">

            <FaUser />

            <span>
              {discussion.user?.name || "Unknown User"}
            </span>

          </div>

        </div>

        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
          {new Date(
            discussion.createdAt
          ).toLocaleDateString()}
        </span>

      </div>

      {/* Content */}

      <p className="text-gray-600 mt-4 line-clamp-3">
        {discussion.content}
      </p>

      {/* Tags */}

      {discussion.tags?.length > 0 && (

        <div className="flex flex-wrap gap-2 mt-4">

          {discussion.tags.map((tag) => (

            <span
              key={tag}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>

          ))}

        </div>

      )}

      {/* Stats */}

      <div className="grid grid-cols-3 gap-4 mt-5">

        <div className="flex items-center gap-2 text-red-500">

          <FaHeart />

          <span>
            {discussion.totalLikes || 0}
          </span>

        </div>

        <div className="flex items-center gap-2 text-green-600">

          <FaComments />

          <span>
            {discussion.totalComments || 0}
          </span>

        </div>

        <div className="flex items-center gap-2 text-gray-500">

          <FaCalendarAlt />

          <span className="text-xs">
            {new Date(
              discussion.createdAt
            ).toLocaleDateString()}
          </span>

        </div>

      </div>

      {/* Actions */}

      <div className="flex justify-end gap-3 mt-6">

        <Link
          to={`/admin/community/discussion/${discussion._id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaEye />
          View
        </Link>

        <button
          onClick={() => onDelete(discussion)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
};

export default DiscussionCard;