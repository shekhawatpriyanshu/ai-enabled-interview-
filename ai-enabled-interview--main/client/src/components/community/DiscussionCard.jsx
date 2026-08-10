import { Link } from "react-router-dom";
import { Heart, MessageCircle, Calendar, User, ArrowRight, Sparkles } from "lucide-react";

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
    <div className="group bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/40 rounded-3xl p-6 sm:p-7 border border-indigo-200/90 shadow-sm hover:shadow-xl hover:scale-[1.015] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col justify-between">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 via-fuchsia-500 to-cyan-500" />

      <div className="space-y-4">
        {/* Card Header: Author Info & Tag Badge */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-500/20 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
              {discussion?.user?.name?.charAt(0)?.toUpperCase() || (
                <User size={18} className="shrink-0" />
              )}
            </div>

            <div>
              <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors break-words">
                {discussion?.user?.name || "Anonymous Preparer"}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
                <Calendar size={12} className="text-indigo-500 shrink-0" />
                <span>{new Date(discussion.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </div>

          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100/90 text-purple-800 border border-purple-200 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-2xs">
            <Sparkles size={11} className="text-purple-600 animate-pulse shrink-0" />
            <span>Discussion</span>
          </span>
        </div>

        {/* Title - Full Text */}
        <h2 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight leading-snug break-words">
          {discussion.title}
        </h2>

        {/* Content Preview - Full Text */}
        <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed bg-white/80 p-4 rounded-2xl border border-slate-200/70 shadow-2xs whitespace-normal break-words">
          {discussion.content}
        </p>

        {/* Tags Row */}
        {discussion.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {discussion.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 text-indigo-700 font-extrabold text-xs shadow-2xs hover:scale-105 transition-transform"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer Metrics & CTA Button */}
      <div className="pt-4 border-t border-indigo-100/80 mt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleLike}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-50 border border-rose-200/90 text-rose-700 text-xs font-black hover:bg-rose-100 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shadow-2xs"
          >
            <Heart size={14} className="fill-rose-500 text-rose-600 shrink-0" />
            <span>{discussion.likes?.length || 0} Likes</span>
          </button>

          <div className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-50 border border-indigo-200/90 text-indigo-700 text-xs font-black shadow-2xs">
            <MessageCircle size={14} className="text-indigo-600 shrink-0" />
            <span>{discussion.comments?.length || 0} Comments</span>
          </div>
        </div>

        <Link
          to={`/community/discussions/${discussion._id}`}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer text-center"
        >
          <span>View Discussion</span>
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
      </div>

    </div>
  );
};

export default DiscussionCard;