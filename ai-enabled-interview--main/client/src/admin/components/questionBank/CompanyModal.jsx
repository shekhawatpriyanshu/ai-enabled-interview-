import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Building2, AlignLeft, Image as ImageIcon, CheckCircle, Save, Loader2, AlertCircle } from "lucide-react";

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

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        logo: initialData.logo || "",
      });
      setErrors({});
    } else if (isOpen) {
      setFormData({
        name: "",
        description: "",
        logo: "",
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Company name is required.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-center items-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
        >
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-5 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-gray-900 dark:to-gray-800">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                <Building2 className="text-blue-500" size={24} />
                {initialData ? "Edit Company" : "Add New Company"}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {initialData ? "Update the details of this company." : "Create a new company profile."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors text-gray-500 hover:text-red-500"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" /> Company Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft"
                className={`w-full bg-gray-50 dark:bg-gray-800/50 border ${errors.name ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200 dark:border-gray-700 focus:ring-blue-500/50 focus:border-blue-500'} rounded-xl px-4 py-3 outline-none focus:ring-2 transition-all dark:text-white`}
              />
              {errors.name && (
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-red-500 text-xs font-medium mt-1 ml-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <AlignLeft size={16} className="text-indigo-500" /> Description
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a brief description of the company..."
                className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all dark:text-white resize-none"
              />
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon size={16} className="text-emerald-500" /> Logo URL
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all dark:text-white"
                  />
                </div>
                {/* Logo Preview */}
                {formData.logo && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0 w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center p-1 shadow-sm"
                  >
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-lg"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = "<div class='text-xs text-gray-400 text-center'>Invalid Image</div>";
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-2.5 font-semibold text-gray-700 dark:text-gray-300 transition-all hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={18} /> Saving...</>
                ) : initialData ? (
                  <><CheckCircle size={18} /> Update Company</>
                ) : (
                  <><Save size={18} /> Create Company</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CompanyModal;