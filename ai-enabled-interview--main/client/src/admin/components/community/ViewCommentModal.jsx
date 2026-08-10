import { FaTimes, FaCommentDots, FaUser, FaCalendarAlt, FaExternalLinkAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const ViewCommentModal = ({ open, comment, onClose }) => {
  if (!open || !comment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden relative z-10 animate-[scaleUp_0.2s_ease-out]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-purple-50/60 via-white to-fuchsia-50/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 to-fuchsia-500 text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/20 shrink-0">
              <FaCommentDots />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Comment Details
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Viewing user discussion comment
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 flex items-center justify-center text-sm transition-all cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-left">
          {/* User & Parent Discussion */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Author
              </span>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {comment.user?.name?.charAt(0)?.toUpperCase() || <FaUser />}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-slate-900 truncate">
                    {comment.user?.name || "Anonymous User"}
                  </p>
                  <p className="text-[10px] text-slate-500 font-bold truncate">
                    {comment.user?.email || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                Parent Discussion
              </span>
              <p className="text-xs font-black text-slate-900 truncate">
                {comment.discussion?.title || "Discussion"}
              </p>
              {comment.discussion?._id && (
                <Link
                  to={`/admin/community/discussion/${comment.discussion._id}`}
                  className="inline-flex items-center gap-1 text-[10px] font-extrabold text-indigo-600 hover:text-indigo-800 mt-1"
                >
                  <span>Open Discussion</span>
                  <FaExternalLinkAlt className="text-[9px]" />
                </Link>
              )}
            </div>
          </div>

          {/* Full Comment Text */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              Comment Text
            </span>
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 text-xs font-medium leading-relaxed whitespace-pre-wrap shadow-inner max-h-60 overflow-y-auto">
              {comment.text || "// Empty comment text"}
            </div>
          </div>

          {/* Footer Metadata */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-1">
              <FaCalendarAlt className="text-slate-400" />
              <span>Posted: {new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
              ID: {comment._id}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-2xl bg-slate-900 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-slate-800 transition active:scale-95 cursor-pointer shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCommentModal;
