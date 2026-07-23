import { Link } from "react-router-dom";
import { Heart, MessageCircle, Calendar, User } from "lucide-react";

import useCommunity from "../../hooks/useCommunity";

const DiscussionCard = ({ discussion }) => {
  const { toggleLikeDiscussion } = useCommunity();

  const handleLike = async () => {
    try {
      await toggleLikeDiscussion(discussion._id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md hover:scale-[1.01] transition-all duration-300 p-6">

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/10 text-white flex items-center justify-center font-semibold text-lg">
          {discussion?.user?.name?.charAt(0)?.toUpperCase() || (
            <User size={18} />
          )}
        </div>

        <div>
          <h3 className="font-semibold text-slate-800">
            {discussion?.user?.name || "Anonymous"}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar size={13} className="text-slate-400" />
            {new Date(discussion.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-xl font-bold text-slate-800 mb-3 hover:text-cyan-600 transition duration-200">
        {discussion.title}
      </h2>

      {/* Content */}
      <p className="text-slate-600 text-sm line-clamp-3 mb-5 leading-relaxed">
        {discussion.content}
      </p>

      {/* Tags */}
      {discussion.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {discussion.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 rounded-full bg-cyan-50/60 border border-cyan-100 text-cyan-700 font-semibold text-xs transition duration-200 hover:bg-cyan-100/80"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">

        <div className="flex gap-5">

          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-medium text-sm transition"
          >
            <Heart size={16} className="fill-current text-rose-500/10 hover:fill-rose-500" />

            <span>
              {discussion.likes?.length || 0}
            </span>
          </button>

          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-sm">
            <MessageCircle size={16} />

            <span>
              {discussion.comments?.length || 0}
            </span>
          </div>

        </div>

        <Link
          to={`/community/discussions/${discussion._id}`}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-sm font-semibold text-sm transition-all duration-200 hover:scale-[1.02] inline-flex items-center"
        >
          View Discussion
        </Link>

      </div>

    </div>
  );
};

export default DiscussionCard;