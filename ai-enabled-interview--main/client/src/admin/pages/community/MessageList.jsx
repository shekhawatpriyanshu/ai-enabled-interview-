import { useEffect, useState } from "react";
import { FaComments } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import MessageTable from "../../components/community/MessageTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";

const MessageList = () => {
  const {
    loading,
    getMessages,
    deleteMessage,
  } = useAdminCommunity();

  const [messages, setMessages] = useState([]);

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedMessage, setSelectedMessage] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {
    loadMessages();
  }, [page, search]);

  const loadMessages = async () => {
    const res = await getMessages({
      page,
      limit: 10,
      search,
    });

    if (res?.success) {
      setMessages(res.messages);
      setPages(res.pages);
    }
  };

  const openDeleteModal = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedMessage) return;

    const res = await deleteMessage(
      selectedMessage._id
    );

    if (res?.success) {
      setShowDeleteModal(false);
      setSelectedMessage(null);
      loadMessages();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-3">

          <FaComments className="text-3xl text-blue-600" />

          <div>

            <h1 className="text-3xl font-bold">
              Message Management
            </h1>

            <p className="text-gray-500">
              Manage all study group messages.
            </p>

          </div>

        </div>

      </div>

      {/* Search */}

      <SearchBar
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search messages..."
      />

      {/* Table */}

      <div className="mt-6">

        <MessageTable
          loading={loading}
          messages={messages}
          onDelete={openDeleteModal}
        />

      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-8">

        <button
          disabled={page === 1}
          onClick={() =>
            setPage((prev) => prev - 1)
          }
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-4 py-2 font-semibold">
          {page} / {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() =>
            setPage((prev) => prev + 1)
          }
          className="px-4 py-2 border rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

      {/* Delete Modal */}

      <DeleteModal
        open={showDeleteModal}
        title="Delete Message"
        message="Are you sure you want to delete this message?"
        onClose={() =>
          setShowDeleteModal(false)
        }
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default MessageList;