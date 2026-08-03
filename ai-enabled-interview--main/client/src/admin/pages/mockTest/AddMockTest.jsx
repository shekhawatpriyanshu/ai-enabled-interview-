import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ArrowLeft, LayoutTemplate } from "lucide-react";

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
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate("/admin/mock-tests")}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-3">
            <LayoutTemplate className="text-blue-500" size={28} />
            Add Mock Test
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
            Design a new assessment to challenge your candidates.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
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