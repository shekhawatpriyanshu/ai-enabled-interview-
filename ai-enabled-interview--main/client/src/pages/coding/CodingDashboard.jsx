import { useEffect, useState } from "react";
import { getCodingStats } from "../../services/SubmissionService";
import CodingStats from "../../components/coding/CodingStats";
import MainLayout from "../../layouts/MainLayout";

const CodingDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const data = await getCodingStats();
            setStats(data.stats);
        } catch(error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <MainLayout>
                <div className="flex h-screen items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </MainLayout>
        );
    }

    if (!stats) return null;

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto p-6 md:p-10">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">
                    Coding Profile Dashboard
                </h1>

                <CodingStats stats={stats} />

                <div className="bg-white rounded-xl shadow-sm border p-8 mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4">
                        Language Usage
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Object.entries(stats.languages).length > 0 ? (
                            Object.entries(stats.languages).map(([lang, count]) => (
                                <div key={lang} className="flex flex-col items-center p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                    <span className="font-semibold text-lg text-gray-700 capitalize">{lang}</span>
                                    <span className="text-sm text-gray-500 mt-1">{count} Submissions</span>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-gray-500 italic">No language data available yet. Start solving problems!</div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CodingDashboard;
