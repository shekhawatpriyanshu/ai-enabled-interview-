import { useState } from "react";
import toast from "react-hot-toast";

const StatusToggle = ({ id, status, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    try {
      setLoading(true);
      await onToggle(id);
      toast.success(
        `Problem ${status ? "Deactivated" : "Activated"} Successfully`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update status."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200 active:scale-95 disabled:opacity-60 cursor-pointer ${
        status
          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
      }`}
      onClick={handleToggle}
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
          Updating...
        </span>
      ) : status ? (
        "Active"
      ) : (
        "Inactive"
      )}
    </button>
  );
};

export default StatusToggle;