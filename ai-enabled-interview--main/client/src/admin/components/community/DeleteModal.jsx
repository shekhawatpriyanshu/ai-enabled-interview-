const DeleteModal = ({
  open,
  title = "Delete",
  message = "Are you sure?",
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">

        <h2 className="text-xl font-bold">
          {title}
        </h2>

        <p className="text-gray-600 mt-3">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">

          <button
            onClick={onClose}
            className="px-5 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteModal;