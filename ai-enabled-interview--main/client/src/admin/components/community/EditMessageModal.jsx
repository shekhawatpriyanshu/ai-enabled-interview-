import { useState, useEffect } from "react";
import { FaTimes, FaEdit, FaSave, FaSpinner } from "react-icons/fa";

const EditMessageModal = ({ open, message, onClose, onSave }) => {
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (message) {
      setText(message.message || "");
      setError("");
    }
  }, [message]);

  if (!open || !message) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Message content cannot be empty.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await onSave(message._id, text.trim());
      onClose();
    } catch (err) {
      setError(err.message || "Failed to update message.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden relative z-10 animate-[scaleUp_0.2s_ease-out]">
        {/* Top Accent Bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-br from-amber-50/60 via-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/20 shrink-0">
              <FaEdit />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Edit Group Message
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Modify message text for content moderation
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold animate-pulse">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
              Message Text
            </label>
            <textarea
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter updated message content..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs font-semibold text-slate-800 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none transition-all shadow-inner resize-none"
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
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FaSave className="text-xs" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMessageModal;
