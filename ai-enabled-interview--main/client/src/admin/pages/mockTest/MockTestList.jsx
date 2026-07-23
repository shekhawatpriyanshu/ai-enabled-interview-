import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaSearch } from "react-icons/fa";

import useMockTest from "../../../admin/hooks/useMockTest";

import MockTestTable from "../../../admin/components/test/MockTestTable";
import DeleteMockTestModal from "../../../admin/components/test/DeleteMockTestModal";
import MockTestStats from "../../../admin/components/test/MockTestStats";

const ITEMS_PER_PAGE = 10;

const MockTestList = () => {
  const {
    tests,
    loading,
    loadMockTests,
    removeMockTest,
  } = useMockTest();

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [selectedTest, setSelectedTest] =
    useState(null);

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  useEffect(() => {
    loadMockTests();
  }, []);

  // Search
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      return (
        test.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        test.description
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });
  }, [tests, search]);

  // Pagination
  const totalPages = Math.ceil(
    filteredTests.length / ITEMS_PER_PAGE
  );

  const paginatedTests = filteredTests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleDeleteClick = (test) => {
    setSelectedTest(test);
    setShowDeleteModal(true);
  };

  const handleDelete = async (id) => {
    await removeMockTest(id);

    setShowDeleteModal(false);
    setSelectedTest(null);

    loadMockTests();
  };

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Mock Test Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage all mock tests.
          </p>

        </div>

        <Link
          to="/admin/mock-tests/add"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus />
          Add Mock Test
        </Link>

      </div>

      {/* Stats */}

      <MockTestStats tests={tests} />

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Mock Tests
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search by title or description..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
            {/* Table */}

      <div className="bg-white rounded-lg shadow">
        <MockTestTable
          tests={paginatedTests}
          loading={loading}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Empty State */}

      {!loading && filteredTests.length === 0 && (
        <div className="rounded-lg bg-white p-12 shadow text-center">
          <h3 className="text-xl font-semibold text-gray-700">
            No Mock Tests Found
          </h3>

          <p className="mt-2 text-gray-500">
            Try changing your search or create a new mock test.
          </p>

          <Link
            to="/admin/mock-tests/add"
            className="inline-flex items-center gap-2 mt-6 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            <FaPlus />
            Create Mock Test
          </Link>
        </div>
      )}

      {/* Pagination */}

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-semibold">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                filteredTests.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {filteredTests.length}
            </span>{" "}
            tests
          </p>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((prev) => prev - 1)
              }
              className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="flex items-center rounded border px-4 py-2 bg-gray-50">
              {currentPage} / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((prev) => prev + 1)
              }
              className="rounded border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}

      <DeleteMockTestModal
        isOpen={showDeleteModal}
        test={selectedTest}
        loading={loading}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTest(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default MockTestList;