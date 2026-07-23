import { useState } from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

import { useAdminAuth } from "../../context/AdminAuthContext";
import adminApi from "../../services/adminApi";

const DeleteInterviewModal = ({
  isOpen,
  onClose,
  interview,
  onSuccess,
}) => {
  const { token } = useAdminAuth();

  const [loading, setLoading] = useState(false);

  if (!isOpen || !interview) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);

      await adminApi.delete(`/interviews/${interview._id}`);

      onSuccess?.();

      onClose();
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message ||
          "Failed to delete interview."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}

        <div className="flex items-center justify-between border-b p-5">

          <div className="flex items-center gap-3">

            <FaExclamationTriangle className="text-red-500 text-2xl" />

            <h2 className="text-xl font-bold">
              Delete Interview
            </h2>

          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes />
          </button>

        </div>

        {/* Body */}

        <div className="p-6">

          <p className="text-gray-700">
            Are you sure you want to delete this interview?
          </p>

          <div className="mt-5 rounded-lg bg-gray-100 p-4">

            <p>
              <strong>Candidate:</strong>{" "}
              {interview.user?.name}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {interview.user?.email}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {interview.role}
            </p>

          </div>

          <p className="mt-5 text-sm text-red-600">
            This action cannot be undone.
          </p>

        </div>

        {/* Footer */}

        <div className="border-t p-5 flex justify-end gap-3">

          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteInterviewModal;