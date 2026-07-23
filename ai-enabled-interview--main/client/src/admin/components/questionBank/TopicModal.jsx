import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const TopicModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || "",
        description:
          initialData?.description || "",
      });

      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name =
        "Topic name is required .";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      description:
        formData.description.trim(),
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
    });

    setErrors({});

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">

        {/* Header */}

        <div className="flex justify-between items-center border-b px-6 py-4">

          <h2 className="text-xl font-semibold">

            {initialData
              ? "Edit Topic"
              : "Add Topic"}

          </h2>

          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-500"
          >
            <FaTimes size={20} />
          </button>

        </div>

        {/* Body */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Topic Name */}

          <div>

            <label className="block font-medium mb-2">
              Topic Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Arrays"
              className={`w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name
                  ? "border-red-500"
                  : ""
              }`}
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name}
              </p>
            )}

          </div>

          {/* Description */}

          <div>

            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write topic description..."
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />

          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 pt-3 border-t">

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-5 py-2 rounded-lg border hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Topic"
                : "Create Topic"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default TopicModal;