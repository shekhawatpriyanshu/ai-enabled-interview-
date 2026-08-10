import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaSave, FaSpinner, FaTag, FaFolder } from "react-icons/fa";

const EditDiscussionModal = ({ open, discussion, onClose, onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (discussion) {
      setTitle(discussion.title || "");
      setContent(discussion.content || "");
      setCategory(discussion.category || "General");
      setTags(Array.isArray(discussion.tags) ? discussion.tags.join(", ") : discussion.tags || "");
      setError("");
    }
  }, [discussion]);

  if (!open || !discussion) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Discussion title is required.");
      return;
    }
    if (!content.trim()) {
      setError("Discussion content is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const cleanedTags = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onSave(discussion._id, {
        title: title.trim(),
        content: content.trim(),
        category,
        tags: cleanedTags,
      });

      onClose();
    } catch (err) {
      setError(err.message || "Failed to update discussion.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-xl w-full overflow-hidden relative z-10 animate-[scaleUp_0.2s_ease-out]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-indigo-50/60 via-white to-cyan-50/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20 shrink-0">
              <FaEdit />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Edit Discussion Thread
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Update topic title, content, category, and tags
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

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left max-h-[75vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Discussion title..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all shadow-inner"
            />
          </div>

          {/* Category & Tags Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <FaFolder className="text-indigo-500 text-xs" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all cursor-pointer shadow-inner"
              >
                <option value="General">General</option>
                <option value="Interview Prep">Interview Prep</option>
                <option value="System Design">System Design</option>
                <option value="Algorithms">Algorithms</option>
                <option value="Web Development">Web Development</option>
                <option value="Career Guidance">Career Guidance</option>
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block flex items-center gap-1.5">
                <FaTag className="text-purple-500 text-xs" /> Tags (comma separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, nodejs, algorithms..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Content Body
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter discussion body content..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 outline-none transition-all shadow-inner resize-none scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            />

          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-700 font-extrabold text-xs uppercase tracking-wider hover:bg-slate-50 transition active:scale-95 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-xs" />
                  <span>Save Discussion</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiscussionModal;
