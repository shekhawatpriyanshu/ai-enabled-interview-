import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaLayerGroup,
  FaEdit,
  FaTrash
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

  const [loading, setLoading] =
    useState(false);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [selectedTopic, setSelectedTopic] =
    useState(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadTopics();
  }, []);

  const loadTopics = async () => {
    try {
      setLoading(true);

      await fetchTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load topics."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (
    formData
  ) => {
    try {
      await addTopic(formData);

      toast.success(
        "Topic created successfully."
      );

      setModalOpen(false);

      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create topic."
      );
    }
  };

  const handleUpdate = async (
    formData
  ) => {
    try {
      await updateTopic(
        selectedTopic._id,
        formData
      );

      toast.success(
        "Topic updated successfully."
      );

      setSelectedTopic(null);

      setModalOpen(false);

      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update topic."
      );
    }
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this topic?"
      );

    if (!confirmDelete) return;

    try {
      await removeTopic(id);

      toast.success(
        "Topic deleted successfully."
      );

      loadTopics();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete topic."
      );
    }
  };

  const filteredTopics =
    useMemo(() => {
      return topics.filter((topic) =>
        topic.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    }, [topics, search]);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Topic Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage interview topics
          </p>

        </div>

        <button
          onClick={() => {
            setSelectedTopic(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPlus />

          Add Topic
        </button>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex items-center gap-3">

            <FaLayerGroup className="text-blue-600 text-2xl" />

            <div>

              <p className="text-gray-500">
                Total Topics
              </p>

              <h2 className="text-3xl font-bold">
                {topics.length}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Topics
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search Topic..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>
      {/* Topics Table */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">#</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Topic Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Description</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Created</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">

            {loading ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-10"
                >
                  Loading Topics...
                </td>

              </tr>

            ) : filteredTopics.length === 0 ? (

              <tr>

                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500"
                >
                  No Topics Found
                </td>

              </tr>

            ) : (

              filteredTopics.map(
                (topic, index) => (

                  <tr
                    key={topic._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 font-semibold text-sm text-slate-900 text-left">
                      {topic.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-left">
                      {topic.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 text-left">
                      {new Date(topic.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedTopic(topic);
                            setModalOpen(true);
                          }}
                          className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(topic._id)}
                          className="h-9 w-9 flex items-center justify-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>

                  </tr>

                )

              )

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