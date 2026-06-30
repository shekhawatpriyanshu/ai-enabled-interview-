import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import useCommunity from "../../hooks/useCommunity";

import CommunitySidebar from "../../components/community/CommunitySidebar";
import GroupCard from "../../components/community/GroupCard";
import EmptyState from "../../components/community/EmptyState";

const StudyGroupsPage = () => {
  const { groups } = useCommunity();

  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const query = search.toLowerCase();

      return (
        group.name.toLowerCase().includes(query) ||
        group.description.toLowerCase().includes(query) ||
        group.owner?.name
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [groups, search]);

  return (
    <MainLayout>
      <div className="py-2">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}

          <div>
            <CommunitySidebar />
          </div>

          {/* Main Content */}

          <div className="lg:col-span-3">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              <div>

                <div className="flex items-center gap-3">

                  <Users
                    className="text-blue-600"
                    size={32}
                  />

                  <h1 className="text-3xl font-bold">
                    Study Groups
                  </h1>

                </div>

                <p className="text-gray-500 mt-2">
                  Join study groups, collaborate with learners,
                  and prepare for interviews together.
                </p>

              </div>

              <Link
                to="/community/create-group"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
              >
                <Plus size={18} />

                Create Group
              </Link>

            </div>

            {/* Search */}

            <div className="relative mb-8">

              <Search
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search study groups..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Group List */}

            {filteredGroups.length === 0 ? (
              <EmptyState
                title="No Study Groups Found"
                description="Create a study group and start learning together."
                buttonText="Create Group"
                buttonLink="/community/create-group"
              />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group._id}
                    group={group}
                  />
                ))}

              </div>
            )}

          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default StudyGroupsPage;