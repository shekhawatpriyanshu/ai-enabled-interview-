import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Edit3 } from "lucide-react";

import MockTestForm from "../../components/test/MockTestForm";
import useMockTest from "../../../admin/hooks/useMockTest";

const EditMockTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    loading: hookLoading,
    test,
    loadMockTest,
    editMockTest,
  } = useMockTest();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMockTest(id);
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await editMockTest(id, formData);

      toast.success("Mock Test updated successfully.");

      navigate("/admin/mock-tests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to update mock test."
      );
    } finally {
      setLoading(false);
    }
  };

  if (hookLoading && !test) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Loading Mock Test...
        </p>
      </div>
    );
  }

  if (!hookLoading && !test) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-200/90 shadow-xl space-y-3">
        <h2 className="text-xl font-extrabold text-rose-600">
          Mock Test Not Found
        </h2>
        <button
          onClick={() => navigate("/admin/mock-tests")}
          className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 transition-all cursor-pointer"
        >
          Back to Mock Tests
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8"
    >
      {/* Header section */}
      <div className="flex items-center gap-4 border-b border-slate-200/80 pb-6">
        <button 
          onClick={() => navigate("/admin/mock-tests")}
          className="group p-2.5 bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 transition-all text-slate-500 hover:text-indigo-600 cursor-pointer"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-300" />
        </button>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-xl shadow-lg shadow-purple-500/30 animate-pulse">
              <Edit3 size={22} />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Edit Mock Test
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Update assessment title, duration, questions repository, and guidelines.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />
        <div className="p-6 sm:p-8">
          <MockTestForm
            initialData={test}
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default EditMockTest;