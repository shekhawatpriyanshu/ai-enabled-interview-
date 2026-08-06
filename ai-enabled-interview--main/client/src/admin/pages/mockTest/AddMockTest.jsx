import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutTemplate, Sparkles } from "lucide-react";

import MockTestForm from "../../../admin/components/test/MockTestForm";
import useMockTest from "../../../admin/hooks/useMockTest";

const AddMockTest = () => {
  const navigate = useNavigate();
  const { addMockTest } = useMockTest();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      await addMockTest(formData);
      toast.success("Mock Test created successfully.");
      navigate("/admin/mock-tests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create mock test."
      );
    } finally {
      setLoading(false);
    }
  };

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
              <LayoutTemplate size={22} />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Create New Mock Test
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Design a comprehensive assessment to evaluate candidate skills and domain knowledge.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />
        <div className="p-6 sm:p-8">
          <MockTestForm
            loading={loading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default AddMockTest;