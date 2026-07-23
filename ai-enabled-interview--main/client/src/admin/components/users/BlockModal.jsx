import React, { useState } from "react";
import adminApi from "../../services/adminApi";

const BlockModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleBlockToggle = async () => {
    try {
      setLoading(true);
      setError("");

      await adminApi.put(
        `/users/${user._id}/block`,
        {
          isBlocked: !user.isBlocked,
        }
      );

      onSuccess?.();
      onClose();
    } catch (err) {
      setError("Failed to update block status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-96 p-6 rounded-lg shadow-lg">

        <h2 className="text-xl font-bold mb-3 text-yellow-600">
          {user?.isBlocked ? "Unblock User" : "Block User"}
        </h2>

        <p className="text-gray-600 mb-4">
          Are you sure you want to{" "}
          <b>{user?.isBlocked ? "unblock" : "block"}</b> this user?
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
            onClick={handleBlockToggle}
            className={`px-4 py-2 text-white rounded ${
              user?.isBlocked ? "bg-green-600" : "bg-yellow-600"
            }`}
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : user?.isBlocked
              ? "Unblock"
              : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlockModal;