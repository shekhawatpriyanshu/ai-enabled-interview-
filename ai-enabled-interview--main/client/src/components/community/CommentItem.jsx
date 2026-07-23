import { User, Calendar } from "lucide-react";

const CommentItem = ({ comment }) => {
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">

        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
          {comment?.user?.name ? (
            comment.user.name.charAt(0).toUpperCase()
          ) : (
            <User size={18} />
          )}
        </div>

        <div>
          <h4 className="font-semibold text-gray-800">
            {comment?.user?.name || "Anonymous"}
          </h4>

          <div className="flex items-center gap-1 text-sm text-gray-500">
            <Calendar size={14} />
            {formatDate(comment?.createdAt)}
          </div>
        </div>

      </div>

      {/* Comment */}
      <p className="text-gray-700 whitespace-pre-wrap leading-7">
        {comment.text}
      </p>

    </div>
  );
};

export default CommentItem;