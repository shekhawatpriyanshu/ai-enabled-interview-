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
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200"
        >
          {/* Top Multi-Color Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

          {/* Header */}
          <div className="flex-shrink-0 px-6 sm:px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 mt-2">
            <div>
              <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base shadow-md group hover:rotate-6 hover:scale-110 transition-transform duration-300">
                  <Building2 size={20} />
                </div>
                {initialData ? "Edit Company" : "Add New Company"}
              </h2>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                {initialData ? "Update the profile details of this target company." : "Create a new target company profile for interviews."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-400 hover:rotate-90 transition-all duration-300 cursor-pointer shadow-sm"
              title="Close Modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Company Name */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 size={16} className="text-indigo-600" /> Company Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Google, Microsoft, Amazon"
                className={`w-full bg-slate-50 border ${
                  errors.name ? "border-rose-400 focus:ring-rose-500/50" : "border-slate-200 hover:border-purple-300 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                } rounded-2xl px-4 py-3 outline-none transition-all font-semibold text-slate-800 text-sm shadow-xs`}
              />
              {errors.name && (
                <motion.p initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="text-rose-500 text-xs font-bold mt-1 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.name}
                </motion.p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <AlignLeft size={16} className="text-purple-600" /> Description
              </label>
              <textarea
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a brief overview or interview pattern notes..."
                className="w-full bg-slate-50 border border-slate-200 hover:border-purple-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-slate-800 text-sm resize-none shadow-xs"
              />
            </div>

            {/* Logo URL */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <ImageIcon size={16} className="text-cyan-600" /> Logo URL
              </label>
              <div className="flex gap-4 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-slate-50 border border-slate-200 hover:border-cyan-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all font-semibold text-slate-800 text-sm shadow-xs"
                  />
                </div>
                {/* Logo Preview */}
                {formData.logo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-shrink-0 w-14 h-14 rounded-2xl border border-slate-200 bg-white overflow-hidden flex items-center justify-center p-1.5 shadow-sm hover:scale-105 hover:shadow-md transition-all duration-300 cursor-pointer"
                  >
                    <img
                      src={formData.logo}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-xl"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = "<div class='text-[10px] font-bold text-slate-400 text-center'>Invalid</div>";
                      }}
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white hover:bg-slate-100 hover:shadow-md hover:-translate-y-0.5 px-6 py-2.5 font-extrabold text-slate-600 transition-all duration-300 text-xs active:scale-95 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 px-6 py-2.5 font-black text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-xs active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <><Loader2 className="animate-spin" size={16} /> Saving...</>
                ) : initialData ? (
                  <><CheckCircle size={16} /> Update Company</>
                ) : (
                  <><Save size={16} /> Create Company</>
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