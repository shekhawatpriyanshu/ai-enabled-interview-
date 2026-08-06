import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaEdit,
  FaUsers,
  FaUserTie,
  FaComments,
  FaCalendarAlt,
  FaTrash,
  FaLayerGroup,
  FaInfoCircle,
} from "react-icons/fa";
import toast from "react-hot-toast";

import useAdminCommunity from "../../hooks/useAdminCommunity";
import GroupMembersTable from "../../components/community/GroupMembersTable";
import DeleteModal from "../../components/community/DeleteModal";

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { getGroupById, getGroupMembers, removeMember, deleteGroup } = useAdminCommunity();

  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadGroup();
  }, [id]);

  const loadGroup = async () => {
    try {
      setPageLoading(true);
      const groupRes = await getGroupById(id);

      if (groupRes?.success) {
        setGroup(groupRes.group);
        setMessages(groupRes.recentMessages || []);
      }

      const membersRes = await getGroupMembers(id);

      if (membersRes?.success) {
        setMembers(membersRes.members);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load group");
    } finally {
      setPageLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    const res = await removeMember(id, selectedMember._id);

    if (res?.success) {
      toast.success("Member removed");
      setShowRemoveModal(false);
      loadGroup();
    }
  };

  const handleDeleteGroup = async () => {
    const res = await deleteGroup(id);

    if (res?.success) {
      toast.success("Group deleted");
      navigate("/admin/community/groups");
    }
  };

  if (pageLoading || !group) {
    return (
      <div className="flex flex-col items-center justify-center py-28">
        <div className="h-10 w-10 border-4 border-emerald-500/30 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
          Loading Group Information...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out] max-w-6xl mx-auto">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-500 hover:text-emerald-600 mb-3 transition-colors cursor-pointer"
          >
            <FaArrowLeft /> Back to Groups
          </button>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/30 animate-bounce">
              <FaLayerGroup />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {group.name}
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Study Group Details, Member Roster, and Activity Logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/admin/community/group/edit/${group._id}`}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <FaEdit /> Edit Group
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <FaTrash /> Delete Group
          </button>
        </div>
      </div>

      {/* 2. KEY STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Members */}
        <div className="rounded-3xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-emerald-600 transition-colors">
              Total Members
            </p>
            <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-1">
              {members.length}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 text-white flex items-center justify-center text-xl shadow-md shadow-emerald-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <FaUsers />
          </div>
        </div>

        {/* Messages */}
        <div className="rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-amber-600 transition-colors">
              Recent Messages
            </p>
            <h2 className="text-3xl font-black bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mt-1">
              {messages.length}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-xl shadow-md shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <FaComments />
          </div>
        </div>

        {/* Created Date */}
        <div className="rounded-3xl border border-purple-200/90 bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-purple-600 transition-colors">
              Created Date
            </p>
            <h2 className="text-lg font-black text-slate-900 mt-2">
              {new Date(group.createdAt).toLocaleDateString()}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
            <FaCalendarAlt />
          </div>
        </div>
      </div>

      {/* 3. GROUP INFORMATION */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 relative overflow-hidden space-y-6">
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500" />

        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaInfoCircle className="text-emerald-600" /> Group Overview
        </h2>

        <div className="grid md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Group Name</p>
              <h3 className="text-lg font-black text-slate-900 mt-1">{group.name}</h3>
            </div>

            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Description</p>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed mt-1 bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {group.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Group Owner</p>
              <div className="flex items-center gap-3 bg-indigo-50/70 p-4 rounded-2xl border border-indigo-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
                  <FaUserTie />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900">{group.owner?.name || "Owner"}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{group.owner?.email || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. MEMBERS TABLE */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaUsers className="text-emerald-600" />
          Group Members
          <span className="text-xs bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold px-3 py-0.5 rounded-full shadow-sm">
            {members.length}
          </span>
        </h2>

        <GroupMembersTable
          members={members}
          loading={pageLoading}
          onRemove={(member) => {
            setSelectedMember(member);
            setShowRemoveModal(true);
          }}
        />
      </div>

      {/* 5. RECENT MESSAGES */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/90 p-6 sm:p-8 space-y-6">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
          <FaComments className="text-amber-600" /> Recent Activity Messages
        </h2>

        {!messages.length ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <FaComments className="text-3xl text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 font-bold text-sm">No Messages Posted Yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className="rounded-2xl border border-slate-200/90 bg-gradient-to-br from-slate-50/80 via-amber-50/20 to-white p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group space-y-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-sm text-slate-900 group-hover:text-amber-600 transition-colors">
                      {message.sender?.name || "Group Member"}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">{message.sender?.email || "-"}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-100 group-hover:border-amber-200 transition-all">
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                    {message.message || "-"}
                  </p>

                  {message.fileUrl && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        📎 {message.fileName || "View Attachment"}
                      </a>
                      <span className="text-[10px] text-slate-400 uppercase font-extrabold px-2 py-0.5 bg-slate-100 rounded">
                        {message.fileType}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* REMOVE & DELETE MODALS */}
      <DeleteModal
        open={showRemoveModal}
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.name || "this member"} from the group?`}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemoveMember}
      />

      <DeleteModal
        open={showDeleteModal}
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? All messages belonging to this group will also be permanently deleted."
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteGroup}
      />
    </div>
  );
};

export default GroupDetails;