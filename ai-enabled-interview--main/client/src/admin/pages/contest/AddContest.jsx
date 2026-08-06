import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";
import toast from "react-hot-toast";

import ContestForm from "../../components/contest/ContestForm";
import useContest from "../../hooks/useContest";

const AddContest = () => {
  const navigate = useNavigate();
  const { addContest } = useContest();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await addContest(formData);

      toast.success(res.message || "Contest created successfully.");
      navigate("/admin/contests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to create contest."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-purple-600 mb-3 transition-colors cursor-pointer"
        >
          <FaArrowLeft /> Back to Contests
        </button>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
            <FaTrophy />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Create New Contest
          </span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-2">
          Design, schedule, and configure competitive programming contests for students.
        </p>
      </div>

      {/* Form Component */}
      <ContestForm loading={loading} onSubmit={handleSubmit} />
    </div>
  );
};

export default AddContest;