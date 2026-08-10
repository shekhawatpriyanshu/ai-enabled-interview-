import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaThumbsUp,
  FaCommentDots,
  FaCalendarAlt,
  FaComments,
  FaTag,
  FaEdit,
} from "react-icons/fa";
import toast from "react-hot-toast";

import AdminCommunityService from "../../services/AdminCommunityService";
import useAdminCommunity from "../../hooks/useAdminCommunity";
import EditDiscussionModal from "../../components/community/EditDiscussionModal";

const DiscussionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateDiscussion } = useAdminCommunity();

  const [loading, setLoading] = useState(true);
  const [discussion, setDiscussion] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchDiscussion();
  }, [id]);

  const fetchDiscussion = async () => {
    try {
      setLoading(true);
      const res = await AdminCommunityService.getDiscussionById(id);

      if (res.data.success) {
        setDiscussion(res.data.discussion);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (discussionId, updatedData) => {
    const res = await updateDiscussion(discussionId, updatedData);
    if (res?.success) {
      toast.success("Discussion updated successfully!");
      setShowEditModal(false);
      fetchDiscussion();
    }
  };


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Discussion & Comments...
        </p>
      </div>
    );
  }

  if (!discussion) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3 m-6">
        <FaComments className="text-4xl text-slate-300" />
        <h3 className="text-lg font-black text-slate-900">Discussion Not Found</h3>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-indigo-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. BACK BUTTON & HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-purple-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Community
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            {discussion.title}
          </h1>
        </div>

        <button
          onClick={() => setShowEditModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <FaEdit /> Edit Discussion
        </button>
      </div>


      {/* 2. MAIN DISCUSSION CARD */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        {/* Author & Meta Row */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-purple-50 px-3.5 py-1.5 rounded-full border border-purple-100 text-purple-700">
            <FaUser /> {discussion.user?.name || "Anonymous User"}
          </div>

          <div className="flex items-center gap-2 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-100 text-rose-700">
            <FaThumbsUp /> {discussion.totalLikes || 0} Likes
          </div>

          <div className="flex items-center gap-2 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-100 text-cyan-700">
            <FaCommentDots /> {discussion.totalComments || 0} Comments
          </div>

          <div className="flex items-center gap-2 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 text-slate-600">
            <FaCalendarAlt /> {new Date(discussion.createdAt).toLocaleString()}
          </div>
        </div>

        {/* Discussion Content */}
        <p className="text-slate-800 text-sm font-medium leading-relaxed whitespace-pre-line">
          {discussion.content}
        </p>

        {/* Tags */}
        {discussion.tags?.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {discussion.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-extrabold flex items-center gap-1 shadow-sm"
              >
                <FaTag className="text-[10px]" /> #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3. COMMENTS LIST SECTION */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
            <FaCommentDots className="text-purple-600" />
            Comments
            <span className="text-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold px-3 py-0.5 rounded-full shadow-sm">
              {discussion.comments?.length || 0}
            </span>
          </h2>
        </div>

        {!discussion.comments || discussion.comments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FaCommentDots className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-sm">No Comments Yet</p>
            <p className="text-slate-400 text-xs mt-1">Be the first to join the conversation.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussion.comments.map((comment) => (
              <div
                key={comment._id}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/80 via-purple-50/20 to-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-purple-500/20 group-hover:scale-110 transition-transform shrink-0">
                      {comment.user?.name ? comment.user.name.charAt(0).toUpperCase() : <FaUser />}
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                        {comment.user?.name || "Anonymous User"}
                      </h3>
                      <p className="text-xs text-slate-500 font-semibold">
                        {comment.user?.email || "-"}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <FaCalendarAlt className="text-[10px]" />
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 group-hover:border-purple-200 transition-all shadow-xs">
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-line">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      <EditDiscussionModal
        open={showEditModal}
        discussion={discussion}
        onClose={() => setShowEditModal(false)}
        onSave={handleUpdate}
      />
    </div>
  );
};

export default DiscussionDetails;