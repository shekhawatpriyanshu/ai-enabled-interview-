import { useEffect, useState } from "react";
import { FaAward, FaEdit, FaTrash, FaPlus, FaTimes, FaSave } from "react-icons/fa";
import useBadge from "../../hooks/useBadge";

const BadgeManagement = () => {
  const { loading, badges, getBadges, createBadge, updateBadge, deleteBadge } = useBadge();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getBadges();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleEdit = (badge) => {
    setEditingId(badge._id);
    setFormData({
      title: badge.title,
      description: badge.description,
      icon: badge.icon || "",
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", icon: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) {
      setError("Title and description are required.");
      return;
    }

    let success;
    if (editingId) {
      success = await updateBadge(editingId, formData);
    } else {
      success = await createBadge(formData);
    }

    if (success) {
      handleCancel();
      getBadges();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this badge?")) {
      const success = await deleteBadge(id);
      if (success) {
        getBadges();
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Badge Management</h1>
       
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Badge Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 h-fit">
          <h2 className="text-lg font-bold text-slate-800 mb-4">
            {editingId ? "Edit Badge" : "Create New Badge"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Badge Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. MERN Master"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe how users can earn this badge..."
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition resize-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Icon URL (Optional)
              </label>
              <input
                type="text"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="https://example.com/icon.png"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <div className="flex gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition text-sm flex items-center justify-center gap-2"
                >
                  <FaTimes /> Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
              >
                {editingId ? (
                  <>
                    <FaSave /> Update
                  </>
                ) : (
                  <>
                    <FaPlus /> Create
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Badges List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Badges Directory</h2>

          {loading && badges.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <div className="h-8 w-8 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : badges.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-sm">No badges created yet.</div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Badge</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Description</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[120px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {badges.map((badge) => (
                    <tr key={badge._id} className="hover:bg-slate-50 transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md shadow-orange-500/20 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                            {badge.icon ? (
                              <img
                                src={badge.icon}
                                alt={badge.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaAward className="text-white text-2xl drop-shadow-sm" />
                            )}
                          </div>
                          <span className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">{badge.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-2 max-w-sm">
                          {badge.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleEdit(badge)}
                            className="h-9 w-9 flex items-center justify-center bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(badge._id)}
                            className="h-9 w-9 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BadgeManagement;
