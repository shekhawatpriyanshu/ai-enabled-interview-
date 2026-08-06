import { useEffect, useState } from "react";
import { FaComments, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import MessageTable from "../../components/community/MessageTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";

const MessageList = () => {
  const { loading, getMessages, deleteMessage } = useAdminCommunity();

  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const res = await deleteMessage(selectedMessage._id);

    if (res?.success) {
      setShowDeleteModal(false);
      setSelectedMessage(null);
      loadMessages();
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-amber-500/30 animate-bounce">
              <FaComments />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Message Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Monitor, review, and moderate group chat messages across study communities.
          </p>
        </div>
      </div>

      {/* 2. SEARCH BAR */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 space-y-4">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search group messages by text or sender..."
        />
      </div>

      {/* 3. MESSAGE TABLE */}
      <div>
        <MessageTable
          loading={loading}
          messages={messages}
          onDelete={openDeleteModal}
        />
      </div>

      {/* 4. PAGINATION */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-extrabold text-xs flex items-center gap-2 hover:bg-slate-100 disabled:opacity-40 transition shadow-sm active:scale-95 cursor-pointer"
          >
            <FaChevronLeft /> Previous
          </button>

          <span className="px-4 py-2 rounded-xl bg-slate-100 text-slate-800 font-black text-xs border border-slate-200 shadow-inner">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-extrabold text-xs flex items-center gap-2 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 transition shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      {/* 5. DELETE MODAL */}
      <DeleteModal
        open={showDeleteModal}
        title="Delete Message"
        message="Are you sure you want to permanently delete this group message?"
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MessageList;