import { FaExclamationTriangle } from "react-icons/fa";

const DeleteMockTestModal = ({
  isOpen,
  test,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !test) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <div className="rounded-full bg-red-100 p-3">
            <FaExclamationTriangle className="text-xl text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Delete Mock Test
            </h2>

            <p className="text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-gray-700">
            Are you sure you want to delete
          </p>

          <p className="mt-2 rounded bg-gray-100 p-3 font-semibold text-gray-900">
            {test.title}
          </p>

          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <p>
              Questions :{" "}
              <strong>{test.questions?.length || 0}</strong>
            </p>

            <p>
              Duration :{" "}
              <strong>{test.duration} min</strong>
            </p>

            <p>
              Difficulty :{" "}
              <strong>{test.difficulty}</strong>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(test._id)}
            className="rounded-md bg-red-600 px-4 py-2 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteMockTestModal;