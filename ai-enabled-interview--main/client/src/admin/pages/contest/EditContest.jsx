import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

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

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadContest(id);
  }, [id]);

  const handleSubmit = async (
    formData
  ) => {
    try {
      setLoading(true);

      const res =
        await editContest(
          id,
          formData
        );

      toast.success(
        res.message ||
          "Contest updated successfully."
      );

      navigate(
        "/admin/contests"
      );
    } catch (error) {
      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update contest."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!contest) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">
          Loading contest...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          Edit Contest
        </h1>

        <p className="mt-1 text-gray-500">
          Update contest details.
        </p>

      </div>

      {/* Form */}

      <ContestForm
        initialData={contest}
        loading={loading}
        onSubmit={
          handleSubmit
        }
      />

    </div>
  );
};

export default EditContest;