import MainLayout from "../../layouts/MainLayout";

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

            <section>

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-gray-800">
                  Latest Discussions
                </h2>

              </div>

              <DiscussionList />

            </section>

            {/* Study Groups */}

            <section>

              <div className="flex items-center justify-between mb-5">

                <h2 className="text-2xl font-bold text-gray-800">
                  Study Groups
                </h2>

              </div>

              <GroupList />

            </section>

          </div>

        </div>

      </div>

    </MainLayout>
  );
};

export default CommunityHome;