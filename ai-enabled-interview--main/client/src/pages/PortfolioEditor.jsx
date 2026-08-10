import { useState, useEffect } from "react";
import PortfolioForm from "../components/portfolio/PortfolioForm";
import PortfolioPreview from "../components/portfolio/PortfolioPreview";
import TemplateSelector from "../components/portfolio/TemplateSelector";
import API from "../api/axios";
import toast from "react-hot-toast";

const PortfolioEditor = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await API.get("/portfolio/me");
        if (data.success && data.portfolio) {
          setPortfolio(data.portfolio);
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to load portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleSave = async (updatedData) => {
    try {
      setSaving(true);
      const { data } = await API.put("/portfolio/update", updatedData);
      if (data.success) {
        setPortfolio(data.portfolio);
        setStats(data.stats);
        toast.success("Portfolio updated successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save portfolio edits.");
    } finally {
      setSaving(false);
    }
  };

  const handleSelectTemplate = (templateId) => {
    if (portfolio) {
      const updated = { ...portfolio, template: templateId };
      setPortfolio(updated);
      toast.success("Template changed! Click Save to publish changes.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-black text-slate-500 uppercase tracking-wider">
          Loading Portfolio Editor...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-md">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Portfolio Live Editor</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Customize your details or choose from 50 developer template themes below.
          </p>
        </div>
      </div>

      <TemplateSelector
        selectedTemplate={portfolio?.template || "modern"}
        onSelectTemplate={handleSelectTemplate}
      />

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5">
          <PortfolioForm
            portfolio={portfolio}
            onChange={(updated) => setPortfolio(updated)}
            onSave={handleSave}
            saving={saving}
          />
        </div>

        <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-md">
          <h3 className="text-xs font-black uppercase text-indigo-600 tracking-wider mb-4 border-b pb-2">
            Live Portfolio Preview
          </h3>
          <PortfolioPreview portfolio={portfolio} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioEditor;

