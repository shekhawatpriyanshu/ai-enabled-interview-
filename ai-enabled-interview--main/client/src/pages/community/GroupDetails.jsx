import { useMemo, useState } from "react";
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
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const { id } = useParams();

  const {
    groups,
    joinStudyGroup,
    activeMembers,
    loading,
  } = useCommunity();

  const { user } = useAuth();

  const group = useMemo(() => {
    return groups.find((item) => item._id === id);
  }, [groups, id]);

  if (loading && !group) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold text-slate-600 animate-pulse">
            Loading Study Group...
          </h2>
        </div>
      </MainLayout>
    );
  }

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

                <button
                  onClick={() => setIsMembersModalOpen(true)}
                  className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors focus:outline-none"
                  title="View group members"
                >
                  <Users size={18} />
                  <span><strong>{group.members?.length || 0}</strong> Members</span>
                </button>

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

      {/* Members Modal */}
      {isMembersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Group Members</h3>
                  <p className="text-xs text-slate-500">{group.members?.length || 0} members joined</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMembersModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full p-2 transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body / Members List */}
            <div className="max-h-[350px] overflow-y-auto px-6 py-4 space-y-3.5 custom-scrollbar">
              {group.members && group.members.length > 0 ? (
                group.members.map((member, idx) => {
                  const memberIdStr = member._id?.toString() || member.toString();
                  const isOwner = (group.owner?._id || group.owner) === memberIdStr;
                  const isActive = activeMembers?.some((mId) => mId?.toString() === memberIdStr);
                  
                  return (
                    <div key={memberIdStr || idx} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-2xl transition">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {(member.name || "U")[0].toUpperCase()}
                          </div>
                          {isActive && (
                            <span 
                              className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white animate-pulse" 
                              title="Online"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 text-sm">{member.name || "Unknown User"}</span>
                            {isOwner && (
                              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-200">
                                Owner
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-500 block mt-0.5">{member.email || "No email available"}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-500 text-sm">
                  No members found in this group.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsMembersModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm px-5 py-2.5 rounded-2xl transition shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default GroupDetails;