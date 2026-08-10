import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PortfolioPreview from "../components/portfolio/PortfolioPreview";
import { getPublicPortfolio } from "../services/portfolioService";

const PublicPortfolio = () => {
  const { slug } = useParams();

  const [portfolio, setPortfolio] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPublicPortfolio(slug);

        setPortfolio(data.portfolio);
        setStats(data.stats);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="h-10 w-10 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading developer portfolio...
        </p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 space-y-3">
        <h2 className="text-2xl font-black text-slate-900">Portfolio Not Found 🔍</h2>
        <p className="text-slate-500 text-xs font-semibold">
          This portfolio does not exist or has not been published yet.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 overflow-hidden">
        <PortfolioPreview
          portfolio={portfolio}
        />

      </div>
    </div>
  );
};

export default PublicPortfolio;
