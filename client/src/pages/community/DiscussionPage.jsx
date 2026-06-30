import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import useCommunity from "../../hooks/useCommunity";

import CommunitySidebar from "../../components/community/CommunitySidebar";
import DiscussionCard from "../../components/community/DiscussionCard";
import EmptyState from "../../components/community/EmptyState";

const DiscussionsPage = () => {
  const { discussions } = useCommunity();

  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Collect all tags
  const tags = useMemo(() => {
    const uniqueTags = new Set();

    discussions.forEach((discussion) => {
      discussion.tags?.forEach((tag) => uniqueTags.add(tag));
    });

    return ["All", ...Array.from(uniqueTags)];
  }, [discussions]);

  // Filter discussions
  const filteredDiscussions = useMemo(() => {
    return discussions.filter((discussion) => {
      const matchesSearch =
        discussion.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        discussion.content
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesTag =
        selectedTag === "All" ||
        discussion.tags?.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [discussions, search, selectedTag]);

  return (
    <MainLayout>
      <div className="py-2">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar */}

          <div>
            <CommunitySidebar />
          </div>

          {/* Main */}

          <div className="lg:col-span-3">

            {/* Header */}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

              <div>

                <h1 className="text-3xl font-bold">
                  Discussions
                </h1>

                <p className="text-gray-500 mt-1">
                  Browse and participate in community discussions.
                </p>

              </div>

              <Link
                to="/community/create-discussion"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
              >
                <Plus size={18} />

                Create Discussion
              </Link>

            </div>

            {/* Search */}

            <div className="relative mb-6">

              <Search
                className="absolute left-4 top-4 text-gray-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Search discussions..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            {/* Tags */}

            <div className="flex flex-wrap gap-3 mb-8">

              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() =>
                    setSelectedTag(tag)
                  }
                  className={`px-4 py-2 rounded-full transition ${
                    selectedTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </button>
              ))}

            </div>

            {/* Discussion List */}

            {filteredDiscussions.length === 0 ? (
              <EmptyState
                title="No Discussions Found"
                description="Try changing your search or create a new discussion."
                buttonText="Create Discussion"
                buttonLink="/community/create-discussion"
              />
            ) : (
              <div className="space-y-6">

                {filteredDiscussions.map((discussion) => (
                  <DiscussionCard
                    key={discussion._id}
                    discussion={discussion}
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

export default DiscussionsPage;