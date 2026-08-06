import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaLayerGroup,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import TopicModal from "../../components/questionBank/TopicModal";
import useQuestion from "../../hooks/useQuestion";

const TopicManagement = () => {
  const {
    topics,
    fetchTopics,
    addTopic,
    updateTopic,
    removeTopic,
  } = useQuestion();

  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);
      await fetchTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load topics."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData) => {
    try {
      await addTopic(formData);
      toast.success("Topic created successfully.");
      setModalOpen(false);
      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create topic."
      );
    }
  };

  const handleUpdate = async (formData) => {
    try {
      await updateTopic(selectedTopic._id, formData);
      toast.success("Topic updated successfully.");
      setSelectedTopic(null);
      setModalOpen(false);
      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update topic."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this topic?");
    if (!confirmDelete) return;

    try {
      await removeTopic(id);
      toast.success("Topic deleted successfully.");
      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to delete topic."
      );
    }
  };

  const filteredTopics = useMemo(() => {
    return topics.filter((topic) =>
      topic.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [topics, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-indigo-600 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-bounce">
              <FaLayerGroup />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Topic Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Curate, organize, and manage technical topic domains for question banks.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedTopic(null);
            setModalOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 group"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" /> Add New Topic
        </button>
      </div>

      {/* 2. STATS KPI CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-purple-200/90 hover:border-purple-400 bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-purple-600 transition-colors">
              Total Topics
            </p>
            <h2 className="text-3xl font-black bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent mt-1">
              {topics.length}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-500 to-pink-500 text-white flex items-center justify-center text-xl shadow-md shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <FaLayerGroup />
          </div>
        </div>
      </div>

      {/* 3. SEARCH CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/90 hover:border-purple-300 transition-all duration-300 shadow-xl p-5 space-y-4">
        <div className="relative flex items-center">
          <div className="absolute left-3.5 text-slate-400 flex items-center justify-center pointer-events-none">
            <FaSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Type to search topics by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-sm"
          />
        </div>
      </div>

      {/* 4. TOPICS TABLE */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-16">
                #
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Topic Name
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Description
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center">
                Created Date
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 border-4 border-purple-500/30 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Loading Topics...
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredTopics.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-20 text-center text-slate-400 font-bold text-xs">
                  No topics found matching your search.
                </td>
              </tr>
            ) : (
              filteredTopics.map((topic, index) => (
                <tr
                  key={topic._id}
                  className="hover:bg-gradient-to-r hover:from-purple-50/60 hover:via-indigo-50/30 hover:to-cyan-50/40 transition-all duration-300 group"
                >
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform shrink-0">
                        <FaLayerGroup />
                      </div>
                      <p className="font-black text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                        {topic.name}
                      </p>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium leading-relaxed max-w-md line-clamp-2">
                    {topic.description || "No description provided"}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                    {new Date(topic.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedTopic(topic);
                          setModalOpen(true);
                        }}
                        className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                        title="Edit Topic"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(topic._id)}
                        className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                        title="Delete Topic"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Topic Modal */}
      <TopicModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedTopic(null);
        }}
        loading={loading}
        initialData={selectedTopic}
        onSubmit={(data) => {
          if (selectedTopic) {
            handleUpdate(data);
          } else {
            handleCreate(data);
          }
        }}
      />
    </div>
  );
};

export default TopicManagement;