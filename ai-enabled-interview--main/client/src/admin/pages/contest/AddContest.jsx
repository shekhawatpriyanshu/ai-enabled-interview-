import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

      toast.success(
        res.message || "Contest created successfully."
      );

      navigate("/admin/contests");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create contest."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Create Contest
        </h1>

        <p className="mt-1 text-gray-500">
          Create a new coding contest by filling in the
          details below.
        </p>

      </div>

      {/* Form */}

      <ContestForm
        loading={loading}
        onSubmit={handleSubmit}
      />

    </div>
  );
};

export default AddContest;