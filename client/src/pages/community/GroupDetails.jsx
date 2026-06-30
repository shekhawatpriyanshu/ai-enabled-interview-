import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  User,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import useCommunity from "../../hooks/useCommunity";
import { useAuth } from "../../context/AuthContext";

import ChatWindow from "../../components/community/ChatWindow";
import ChatInput from "../../components/community/ChatInput";
import EmptyState from "../../components/community/EmptyState";

const GroupDetails = () => {
  const { id } = useParams();

  const {
    groups,
    joinStudyGroup,
  } = useCommunity();

  const { user } = useAuth();

  const group = useMemo(() => {
    return groups.find((item) => item._id === id);
  }, [groups, id]);

  if (!group) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto py-8 px-4">
          <EmptyState
            title="Study Group Not Found"
            description="The requested study group could not be found."
            buttonText="Back to Groups"
            buttonLink="/community/groups"
          />
        </div>
      </MainLayout>
    );
  }

  const isMember =
    group.members?.some(
      (member) =>
        (member._id || member).toString() === user?._id
    ) || false;

  return (
    <MainLayout>
      <div className="py-2">

        {/* Back */}
        <Link
          to="/community/groups"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Study Groups
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl border shadow-sm p-8 mb-8">

          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">

            <div>

              <h1 className="text-3xl font-bold">
                {group.name}
              </h1>

              <p className="text-gray-600 mt-4 leading-7">
                {group.description}
              </p>

              <div className="flex flex-wrap gap-6 mt-6">

                <div className="flex items-center gap-2 text-gray-600">
                  <User size={18} />
                  Owner:
                  <strong>{group.owner?.name}</strong>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <Users size={18} />
                  {group.members?.length || 0} Members
                </div>

              </div>

            </div>

            <div>

              {!isMember && (
                <button
                  onClick={() =>
                    joinStudyGroup(group._id)
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
                >
                  Join Group
                </button>
              )}

              {isMember && (
                <span className="inline-block bg-green-100 text-green-700 px-5 py-3 rounded-lg font-semibold">
                  Joined
                </span>
              )}

            </div>

          </div>

        </div>

        {/* Chat */}

        {isMember ? (
          <div className="space-y-6">

            <ChatWindow
              groupId={group._id}
              currentUserId={user._id}
            />

            <ChatInput
              groupId={group._id}
            />

          </div>
        ) : (
          <EmptyState
            title="Join this Study Group"
            description="You need to join this study group before accessing the chat."
          />
        )}

      </div>
    </MainLayout>
  );
};

export default GroupDetails;