import { useEffect, useState } from "react";
import { FaLayerGroup } from "react-icons/fa";

import useAdminCommunity from "../../hooks/useAdminCommunity";

import GroupTable from "../../components/community/GroupTable";
import SearchBar from "../../components/community/SearchBar";
import DeleteModal from "../../components/community/DeleteModal";

const GroupList = () => {
  const {
    loading,
    getGroups,
    deleteGroup,
  } = useAdminCommunity();

  const [groups, setGroups] = useState([]);

  const [page, setPage] = useState(1);

  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState("");

  const [selectedGroup, setSelectedGroup] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {
    loadGroups();
  }, [page, search]);

  const loadGroups = async () => {
    const response = await getGroups({
      page,
      limit: 10,
      search,
    });

    if (response?.success) {
      setGroups(response.groups);
      setPages(response.pages);
    }
  };

  const openDeleteModal = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedGroup) return;

    const response = await deleteGroup(
      selectedGroup._id
    );

    if (response?.success) {
      setShowDeleteModal(false);
      setSelectedGroup(null);
      loadGroups();
    }
  };

  return (
    <div className="p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div className="flex items-center gap-3">

          <FaLayerGroup className="text-3xl text-purple-600" />

          <div>

            <h1 className="text-3xl font-bold">
              Study Group Management
            </h1>

            <p className="text-gray-500">
              Manage all community study groups.
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
        placeholder="Search study groups..."
      />

      {/* Table */}

      <div className="mt-6">

        <GroupTable
          groups={groups}
          loading={loading}
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
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? All associated messages will also be deleted."
        onClose={() =>
          setShowDeleteModal(false)
        }
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default GroupList;