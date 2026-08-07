import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaTrophy } from "react-icons/fa";

import ContestForm from "../../components/contest/ContestForm";
import useContest from "../../hooks/useContest";

const EditContest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    contest,
    loadContest,
    editContest,
  } = useContest();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContest(id);
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const res = await editContest(id, formData);

      toast.success(res.message || "Contest updated successfully.");
      navigate("/admin/contests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to update contest."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!contest) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-white rounded-3xl border border-slate-200 shadow-sm my-6">
        <div className="h-10 w-10 border-4 border-amber-500/20 border-t-amber-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-500">
          Loading contest details...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-200/80 pb-6">
        <button
          onClick={() => navigate("/admin/contests")}
          className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-purple-600 mb-3 transition-colors cursor-pointer"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Contests
        </button>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
            <FaTrophy />
          </div>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Edit Contest
          </span>
        </h1>
        <p className="text-sm font-semibold text-slate-500 mt-2">
          Update contest title, description, start time, end time, and challenge specifications.
        </p>
      </div>

      {/* Form Component */}
      <ContestForm
        initialData={contest}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default EditContest;