import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { FaCode, FaArrowLeft } from "react-icons/fa";

import CodingForm from "../../components/coding/CodingForm";

import {
  getProblem,
  updateProblem,
} from "../../services/codingApi";

const EditCoding = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const loadProblem = async () => {
    try {
      const { data } = await getProblem(id);
      setProblem(data.problem);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load problem."
      );
      navigate("/admin/coding");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    loadProblem();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      const { data } = await updateProblem(id, formData);
      toast.success(data.message);
      navigate("/admin/coding");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="h-10 w-10 border-4 border-cyan-500/20 border-t-cyan-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-500">
          Loading problem details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Back Navigation Button */}
      <div>
        <button
          onClick={() => navigate("/admin/coding")}
          className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-sm font-semibold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-x-1 transition-all duration-300 active:scale-95 cursor-pointer"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-300 text-indigo-500" />
          <span>Back to Coding Problems</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div className="flex-1 space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-cyan-500/20">
              <FaCode />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Edit Coding Problem
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Modify difficulty, constraints, and examples for this problem.
          </p>
        </div>
      </div>

      <CodingForm
        initialValues={problem}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default EditCoding;