// src/pages/analytics/Badges.jsx

import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import BadgeCard from "../../components/analytics/BadgeCard";
import { getBadges } from "../../services/AnalyticsService";

const Badges = () => {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = async () => {
    try {
      const res = await getBadges();

      if (res.success) {
        setBadges(res.badges);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-2 space-y-6">

        <div className="flex justify-between items-center mb-6">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              🏅 Badges
            </h2>

            <p className="text-slate-500 mb-0 mt-1">
              Earn badges by completing different milestones.
            </p>
          </div>

          <span className="bg-blue-100 text-blue-700 text-sm font-semibold px-3 py-1 rounded-full border border-blue-200">
            {badges.length} Badges
          </span>

        </div>

        {badges.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">

            <h4 className="text-lg font-bold text-slate-700">No Badges Found</h4>

            <p className="text-slate-500 mt-2">
              No badges have been created yet.
            </p>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {badges.map((badge) => (
              <BadgeCard key={badge._id} badge={badge} />
            ))}

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Badges;