import { useState } from "react";

const PortfolioForm = ({ portfolio, onChange, onSave, saving }) => {
  const [formData, setFormData] = useState(portfolio || {});

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    if (onChange) onChange(updated);
  };

  const handlePersonalChange = (key, value) => {
    const updatedPersonal = { ...(formData.personal || {}), [key]: value };
    handleChange("personal", updatedPersonal);
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(",").map((s) => s.trim());
    handleChange("skills", skillsArray);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
      <h3 className="text-lg font-black text-slate-900 border-b pb-3">Edit Portfolio Info</h3>

      <div className="space-y-4">
        <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Personal Information</h4>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700">Full Name</label>
            <input
              type="text"
              value={formData.personal?.name || ""}
              onChange={(e) => handlePersonalChange("name", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Title / Headline</label>
            <input
              type="text"
              value={formData.personal?.title || ""}
              onChange={(e) => handlePersonalChange("title", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Email</label>
            <input
              type="email"
              value={formData.personal?.email || ""}
              onChange={(e) => handlePersonalChange("email", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">Location</label>
            <input
              type="text"
              value={formData.personal?.location || ""}
              onChange={(e) => handlePersonalChange("location", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">GitHub Link</label>
            <input
              type="text"
              value={formData.personal?.github || ""}
              onChange={(e) => handlePersonalChange("github", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-700">LinkedIn Link</label>
            <input
              type="text"
              value={formData.personal?.linkedin || ""}
              onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
              className="mt-1 w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Professional Summary</h4>
        <textarea
          rows={4}
          value={formData.summary || ""}
          onChange={(e) => handleChange("summary", e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase text-indigo-600 tracking-wider">Skills (Comma Separated)</h4>
        <input
          type="text"
          value={(formData.skills || []).join(", ")}
          onChange={handleSkillsChange}
          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-indigo-700 active:scale-95 transition shadow-lg shadow-indigo-500/20 cursor-pointer"
      >
        {saving ? "Saving Changes..." : "💾 Save Portfolio"}
      </button>
    </form>
  );
};

export default PortfolioForm;
