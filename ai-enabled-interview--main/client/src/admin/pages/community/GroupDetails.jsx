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
} from "react-icons/fa";

import toast from "react-hot-toast";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import GroupMembersTable from "../../components/community/GroupMembersTable";
import DeleteModal from "../../components/community/DeleteModal";

const GroupDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    getGroupById,
    getGroupMembers,
    removeMember,
    deleteGroup,
  } = useAdminCommunity();

  const [group, setGroup] = useState(null);

  const [members, setMembers] = useState([]);

  const [messages, setMessages] = useState([]);

  const [selectedMember, setSelectedMember] =
    useState(null);

  const [showRemoveModal, setShowRemoveModal] =
    useState(false);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

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

      const membersRes =
        await getGroupMembers(id);

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

    const res = await removeMember(
      id,
      selectedMember._id
    );

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
      <div className="flex justify-center items-center h-96">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 mb-3"
          >
            <FaArrowLeft />
            Back
          </button>

          <h1 className="text-3xl font-bold">
            {group.name}
          </h1>

          <p className="text-gray-500 mt-2">
            Study Group Details
          </p>

        </div>

        <div className="flex gap-3">

          <Link
            to={`/admin/community/group/edit/${group._id}`}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaEdit />
            Edit
          </Link>

          <button
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaTrash />
            Delete
          </button>

        </div>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white rounded-xl shadow border p-6">

          <div className="flex items-center gap-3">

            <FaUsers className="text-blue-600 text-2xl" />

            <div>

              <p className="text-gray-500">
                Members
              </p>

              <h2 className="text-3xl font-bold">
                {members.length}
              </h2>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <div className="flex items-center gap-3">

            <FaComments className="text-green-600 text-2xl" />

            <div>

              <p className="text-gray-500">
                Messages
              </p>

              <h2 className="text-3xl font-bold">
                {messages.length}
              </h2>

            </div>

          </div>

        </div>

        <div className="bg-white rounded-xl shadow border p-6">

          <div className="flex items-center gap-3">

            <FaCalendarAlt className="text-purple-600 text-2xl" />

            <div>

              <p className="text-gray-500">
                Created
              </p>

              <h2 className="text-lg font-semibold">
                {new Date(
                  group.createdAt
                ).toLocaleDateString()}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* Group Information */}

      <div className="bg-white rounded-xl shadow border p-6">

        <h2 className="text-2xl font-semibold mb-5">
          Group Information
        </h2>

        <div className="space-y-4">

          <div>

            <p className="text-gray-500">
              Name
            </p>

            <h3 className="text-xl font-semibold">
              {group.name}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Description
            </p>

            <p className="mt-2 whitespace-pre-line">
              {group.description ||
                "No description"}
            </p>

          </div>

          <div>

            <p className="text-gray-500 mb-2">
              Owner
            </p>

            <div className="flex items-center gap-3">

              <FaUserTie className="text-blue-600" />

              <div>

                <h3 className="font-semibold">
                  {group.owner?.name}
                </h3>

                <p className="text-gray-500">
                  {group.owner?.email}
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
            {/* Members */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <div className="flex justify-between items-center mb-5">

          <h2 className="text-2xl font-semibold">
            Group Members ({members.length})
          </h2>

        </div>

        <GroupMembersTable
          members={members}
          loading={pageLoading}
          onRemove={(member) => {
            setSelectedMember(member);
            setShowRemoveModal(true);
          }}
        />

      </div>

      {/* Recent Messages */}

      <div className="bg-white rounded-xl shadow border p-6 mt-8">

        <h2 className="text-2xl font-semibold mb-5">
          Recent Messages
        </h2>

        {!messages.length ? (

          <div className="text-center py-10 text-gray-500">
            No messages available.
          </div>

        ) : (

          <div className="space-y-4">

            {messages.map((message) => (

              <div
                key={message._id}
                className="border rounded-lg p-4"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold">
                      {message.sender?.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {message.sender?.email}
                    </p>

                  </div>

                  <span className="text-sm text-gray-500">
                    {new Date(
                      message.createdAt
                    ).toLocaleString()}
                  </span>

                </div>

                <div className="mt-3">

                  <p className="whitespace-pre-wrap">
                    {message.message || "-"}
                  </p>

                  {message.fileUrl && (

                    <div className="mt-3">

                      <a
                        href={message.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        📎 {message.fileName || "Attachment"}
                      </a>

                      <p className="text-xs text-gray-500 mt-1">
                        {message.fileType}
                      </p>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* Remove Member Modal */}

      <DeleteModal
        open={showRemoveModal}
        title="Remove Member"
        message={`Remove ${
          selectedMember?.name || "this member"
        } from the group?`}
        onClose={() => {
          setShowRemoveModal(false);
          setSelectedMember(null);
        }}
        onConfirm={handleRemoveMember}
      />

      {/* Delete Group Modal */}

      <DeleteModal
        open={showDeleteModal}
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? All messages belonging to this group will also be deleted."
        onClose={() =>
          setShowDeleteModal(false)
        }
        onConfirm={handleDeleteGroup}
      />

    </div>
  );
};

export default GroupDetails;