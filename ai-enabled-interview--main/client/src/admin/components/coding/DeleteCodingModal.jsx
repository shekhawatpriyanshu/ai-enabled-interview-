import React from "react";

const DeleteCodingModal = ({
  show,
  onClose,
  onConfirm,
  loading = false,
  problemTitle = "",
}) => {
  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden transform scale-100 transition-all">
          {/* Header */}
          <div className="bg-rose-600 px-6 py-4 flex items-center justify-between text-white">
            <h5 className="font-semibold text-lg">Delete Coding Problem</h5>
            <button
              type="button"
              className="text-white/80 hover:text-white transition focus:outline-none text-2xl leading-none cursor-pointer"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            <p className="text-slate-700 text-sm">
              Are you sure you want to delete this coding problem?
            </p>

            {problemTitle && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3.5 font-semibold text-sm">
                {problemTitle}
              </div>
            )}

            <p className="text-xs text-rose-500 font-medium">
              This action cannot be undone.
            </p>
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition active:scale-95 disabled:opacity-50 cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition active:scale-95 disabled:opacity-50 cursor-pointer"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteCodingModal;