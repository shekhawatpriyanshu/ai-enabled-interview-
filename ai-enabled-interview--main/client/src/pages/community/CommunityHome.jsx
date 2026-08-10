import MainLayout from "../../layouts/MainLayout";
import { Link } from "react-router-dom";
import { MessageSquare, Users, ArrowRight } from "lucide-react";

import CommunitySidebar from "../../components/community/CommunitySidebar";
import CommunityHeader from "../../components/community/CommunityHeader";
import StatsCard from "../../components/community/StatsCard";
import DiscussionList from "../../components/community/DiscussionList";
import GroupList from "../../components/community/GroupList";

const CommunityHome = () => {
  return (
    <MainLayout>

      <div className="py-2">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}

          <div className="lg:col-span-1">
            <CommunitySidebar />
          </div>

          {/* Main Content */}

          <div className="lg:col-span-3 space-y-8">

            <CommunityHeader />

            <StatsCard />

            {/* Latest Discussions */}
            <section className="space-y-4">
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                    <MessageSquare size={18} className="shrink-0" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Latest Discussions</span>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                        Live Feed
                      </span>
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">Explore questions and technical insights from peers</p>
                  </div>
                </div>

                <Link
                  to="/community/discussions"
                  className="group inline-flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  <span>View All</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>

              <DiscussionList limit={4} />
            </section>

            {/* Study Groups */}
            <section className="space-y-4">
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-3xl border border-slate-200/90 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0">
                    <Users size={18} className="shrink-0" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <span>Study Groups</span>
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                        Peer Prep
                      </span>
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">Join interactive study groups and collaborate</p>
                  </div>
                </div>

                <Link
                  to="/community/groups"
                  className="group inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-extrabold text-xs uppercase tracking-wider transition-all"
                >
                  <span>Explore Groups</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              </div>

              <GroupList limit={4} />
            </section>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default CommunityHome;