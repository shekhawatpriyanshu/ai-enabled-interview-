import React, { useState } from "react";
import adminApi from "../../services/adminApi";

const DeleteModal = ({ isOpen, onClose, userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError("");

      await adminApi.delete(`/users/${userId}`);

      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-bold mb-3 text-red-600">
          Delete User
        </h2>

        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;