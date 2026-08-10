import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { generatePortfolio, publishPortfolio } from "../services/portfolioService";
import PortfolioPreview from "../components/portfolio/PortfolioPreview";
import TemplateSelector from "../components/portfolio/TemplateSelector";
import API from "../api/axios";
import toast from "react-hot-toast";

const PortfolioGenerator = () => {
    const location = useLocation();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [publishing, setPublishing] = useState(false);
    const [portfolio, setPortfolio] = useState(location.state?.portfolio || null);
    const [stats, setStats] = useState(location.state?.stats || null);
    const [publicUrl, setPublicUrl] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (location.state?.portfolio) {
            setPortfolio(location.state.portfolio);
        }
    }, [location.state]);


    const handleSelectTemplate = async (templateId) => {
        if (portfolio) {
            const updated = { ...portfolio, template: templateId };
            setPortfolio(updated);
            try {
                await API.put("/portfolio/update", { template: templateId });
                toast.success("Live published site template updated!");
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleGenerate = async () => {
        if (!file) {
            setError("Please upload your resume (.pdf or .docx)");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await generatePortfolio(file);

            setPortfolio(data.portfolio);
            setStats(data.stats);
            toast.success("Portfolio generated successfully!");
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Failed to generate portfolio"
            );
        } finally {
            setLoading(false);
        }
    };


    const handlePublish = async () => {
        try {
            setPublishing(true);
            const res = await publishPortfolio(portfolio?.template);
            if (res.success) {
                setPublicUrl(window.location.origin + res.url);
                toast.success("Portfolio published online with your selected template!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to publish portfolio");
        } finally {
            setPublishing(false);
        }
    };


    const handleDownloadHTML = () => {
        if (!portfolio) return;
        const container = document.getElementById("portfolio-preview-container");
        const content = container ? container.innerHTML : "";
        const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.personal?.name || "Developer"} - Portfolio</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 p-8">
  <div class="max-w-4xl mx-auto bg-white rounded-3xl p-8 border shadow-xl">
    ${content}
  </div>
</body>
</html>`;

        const blob = new Blob([fullHtml], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(portfolio.personal?.name || "portfolio").toLowerCase().replace(/\s+/g, "-")}-portfolio.html`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success("Portfolio HTML downloaded!");
    };

    const handleDownloadPDF = () => {
        window.print();
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 relative overflow-hidden print:hidden">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

                <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent text-center">
                    Portfolio Generator
                </h1>


                <p className="text-slate-500 text-sm font-semibold mt-2 text-center">
                    Upload your resume and we'll automatically build, format, and showcase your developer portfolio.
                </p>


                <div className="mt-8 border-2 border-dashed border-indigo-200 rounded-3xl p-8 sm:p-12 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all">
                    <input
                        type="file"
                        accept=".pdf,.docx"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="hidden"
                        id="resume-file-input"
                    />

                    <label
                        htmlFor="resume-file-input"
                        className="cursor-pointer inline-flex flex-col items-center justify-center space-y-3"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-2xl shadow-md">
                            📄
                        </div>
                        <span className="text-sm font-bold text-slate-800">
                            {file ? file.name : "Click to select your resume (.pdf, .docx)"}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                            Supported formats: PDF, Word DOCX
                        </span>
                    </label>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleGenerate}
                            disabled={loading || !file}
                            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider hover:opacity-95 disabled:opacity-40 transition shadow-lg shadow-indigo-500/25 active:scale-95 cursor-pointer"
                        >
                            {loading ? "Generating Portfolio..." : "🚀 Generate Portfolio"}
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-4 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                        {error}
                    </div>
                )}
            </div>

            {portfolio && (
                <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6 print:hidden">
                        <div>
                            <h2 className="text-2xl font-black text-slate-900">
                                Portfolio Preview 🎉
                            </h2>
                            <p className="text-xs font-semibold text-slate-500 mt-1">
                                Review, edit, publish, or download your portfolio.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2.5">
                            <a
                                href="/portfolio/editor"
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition border border-slate-200"
                            >
                                ✏️ Edit
                            </a>
                            <button
                                onClick={handleDownloadPDF}
                                className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-xs border border-indigo-200 transition cursor-pointer"
                            >
                                🖨️ PDF
                            </button>
                            <button
                                onClick={handleDownloadHTML}
                                className="px-4 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-extrabold text-xs border border-purple-200 transition cursor-pointer"
                            >
                                📥 HTML
                            </button>
                            <button
                                onClick={handlePublish}
                                disabled={publishing}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer"
                            >
                                {publishing ? "Publishing..." : "🌐 Publish Online"}
                            </button>
                        </div>
                    </div>

                    {publicUrl && (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
                            <span>Your public portfolio is live at:</span>
                            <a
                                href={publicUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="underline font-black text-emerald-900 break-all"
                            >
                                {publicUrl}
                            </a>
                        </div>
                    )}

                    {/* 50 Template Selection Bar */}
                    <div className="print:hidden">
                        <TemplateSelector
                            selectedTemplate={portfolio.template || "modern"}
                            onSelectTemplate={handleSelectTemplate}
                        />
                    </div>

                    <div id="portfolio-preview-container" className="rounded-2xl border border-slate-200 p-2 sm:p-6 bg-white">
                        <PortfolioPreview portfolio={portfolio} />
                    </div>


                </div>
            )}
        </div>
    );

};

export default PortfolioGenerator;