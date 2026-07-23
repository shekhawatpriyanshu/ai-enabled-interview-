import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

const CompanyModal = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  initialData = null,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        logo: initialData.logo || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        logo: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      return alert("Company name is required.");
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl">

        {/* Header */}

        <div className="flex justify-between items-center p-5 border-b">

          <h2 className="text-xl font-semibold">
            {initialData
              ? "Edit Company"
              : "Add Company"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <FaTimes />
          </button>

        </div>

        {/* Form */}

        <form
          onSubmit={handleSubmit}
          className="p-5 space-y-5"
        >

          {/* Company Name */}

          <div>

            <label className="block font-medium mb-2">
              Company Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Google"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block font-medium mb-2">
              Description
            </label>

            <textarea
              rows={4}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Company Description..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Logo */}

          <div>

            <label className="block font-medium mb-2">
              Logo URL
            </label>

            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

          </div>

          {/* Preview */}

          {formData.logo && (
            <div>

              <label className="block font-medium mb-2">
                Preview
              </label>

              <img
                src={formData.logo}
                alt="Company Logo"
                className="w-20 h-20 rounded-lg border object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />

            </div>
          )}

          {/* Footer */}

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              {loading
                ? "Saving..."
                : initialData
                ? "Update Company"
                : "Create Company"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default CompanyModal;