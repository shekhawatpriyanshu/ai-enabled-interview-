import { useState } from "react";
import { PORTFOLIO_TEMPLATES } from "./templatesData";
import { FaCheck, FaSearch, FaPalette } from "react-icons/fa";

const TemplateSelector = ({ selectedTemplate, onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Modern & Tech", "Minimal & Clean", "Cyber & Dark", "Professional", "Creative", "Specialized"];

  const filteredTemplates = PORTFOLIO_TEMPLATES.filter((tpl) => {
    const matchesCategory = activeCategory === "All" || tpl.category === activeCategory;
    const matchesSearch = tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) || tpl.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FaPalette className="text-indigo-600" /> Choose Portfolio Template
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Select from 50+ professionally designed developer templates. Real-time live update!
          </p>
        </div>

        {/* Search */}
        <div className="relative min-w-[220px]">
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search 50 templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-md"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Templates Grid (50 Options) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-[420px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-300">
        {filteredTemplates.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <div
              key={tpl.id}
              onClick={() => onSelectTemplate(tpl.id)}
              className={`group relative rounded-2xl p-3 cursor-pointer transition-all duration-200 border flex flex-col justify-between h-32 ${
                isSelected
                  ? "ring-2 ring-indigo-600 border-indigo-600 shadow-xl scale-[1.03]"
                  : "border-slate-200 hover:border-indigo-400 hover:shadow-md"
              } bg-gradient-to-br ${tpl.bg}`}
            >
              <div className="flex items-start justify-between gap-1">
                <span className={`text-[10px] font-black tracking-tight line-clamp-1 ${tpl.text}`}>
                  {tpl.name}
                </span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 shadow-md">
                    <FaCheck />
                  </span>
                )}
              </div>

              {tpl.badge && (
                <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs w-fit">
                  {tpl.badge}
                </span>
              )}

              <div className={`mt-2 h-1.5 rounded-full bg-gradient-to-r ${tpl.accent}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector;
