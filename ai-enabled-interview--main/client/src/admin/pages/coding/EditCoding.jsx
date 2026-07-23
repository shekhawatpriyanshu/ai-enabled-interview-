import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Edit Coding Problem</h1>
        <p className="text-sm text-slate-500 mt-1">
          Modify difficulty, constraints, and examples for this problem.
        </p>
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