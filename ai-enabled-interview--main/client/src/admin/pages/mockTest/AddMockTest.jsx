import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Add Mock Test
          </h1>

          <p className="text-gray-500 mt-1">
            Create a new mock test for students.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white shadow p-6">
        <MockTestForm
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddMockTest;