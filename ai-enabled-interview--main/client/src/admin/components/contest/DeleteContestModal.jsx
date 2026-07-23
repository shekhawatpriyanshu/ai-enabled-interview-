import { FaTimes, FaTrash } from "react-icons/fa";

const DeleteContestModal = ({
  isOpen,
  contest,
  loading = false,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !contest) return null;

  const handleDelete = () => {
    onConfirm(contest._id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-4">

          <h2 className="text-xl font-semibold text-red-600">
            Delete Contest
          </h2>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes size={18} />
          </button>

        </div>

        {/* Body */}

        <div className="px-6 py-5">

          <div className="flex items-center gap-3 mb-4">

            <div className="rounded-full bg-red-100 p-3">
              <FaTrash
                className="text-red-600"
                size={22}
              />
            </div>

            <div>

              <h3 className="font-semibold">
                Are you sure?
              </h3>

              <p className="text-sm text-gray-500">
                This action cannot be undone.
              </p>

            </div>

          </div>

          <div className="rounded-lg border bg-gray-50 p-4">

            <p className="text-sm text-gray-500">
              Contest
            </p>

            <h4 className="mt-1 font-semibold">
              {contest.title}
            </h4>

            <p className="mt-2 text-sm text-gray-600">
              {contest.description}
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-5 py-2 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading
              ? "Deleting..."
              : "Delete Contest"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default DeleteContestModal;