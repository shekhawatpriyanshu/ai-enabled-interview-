import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 text-lg">
          Loading Mock Test...
        </p>
      </div>
    );
  }

  if (!hookLoading && !test) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-lg">
          Mock Test not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">
          Edit Mock Test
        </h1>

        <p className="mt-1 text-gray-500">
          Update mock test details.
        </p>
      </div>

      {/* Form */}
      <div className="rounded-lg bg-white shadow p-6">
        <MockTestForm
          initialData={test}
          loading={loading}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default EditMockTest;