import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaBuilding,
  FaEdit,
  FaTrash
} from "react-icons/fa";

import CompanyModal from "../../components/questionBank/CompanyModal";
import useQuestion from "../../hooks/useQuestion";

const CompanyManagement = () => {
  const {
    companies,
    fetchCompanies,
    addCompany,
    updateCompany,
    removeCompany,
  } = useQuestion();

  const [loading, setLoading] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);

  const [selectedCompany, setSelectedCompany] =
    useState(null);

  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);

      await fetchCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await addCompany(data);

      toast.success(
        "Company created successfully."
      );

      setModalOpen(false);

      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to create company."
      );
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateCompany(
        selectedCompany._id,
        data
      );

      toast.success(
        "Company updated successfully."
      );

      setSelectedCompany(null);

      setModalOpen(false);

      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to update company."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this company?"
      );

    if (!confirmDelete) return;

    try {
      await removeCompany(id);

      toast.success(
        "Company deleted successfully."
      );

      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Unable to delete company."
      );
    }
  };

  const filteredCompanies =
    useMemo(() => {

      return companies.filter(
        (company) =>
          company.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [companies, search]);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Company Management
          </h1>

          <p className="text-gray-500 mt-1">
            Manage interview companies
          </p>

        </div>

        <button
          onClick={() => {
            setSelectedCompany(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Add Company
        </button>

      </div>

      {/* Statistics */}

      <div className="grid md:grid-cols-3 gap-5">

        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex items-center gap-3">

            <FaBuilding className="text-blue-600 text-2xl" />

            <div>

              <p className="text-gray-500">
                Total Companies
              </p>

              <h2 className="text-3xl font-bold">
                {companies.length}
              </h2>

            </div>

          </div>

        </div>

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-slate-700">
            Search Companies
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3 text-slate-400 flex items-center justify-center pointer-events-none">
              <FaSearch className="w-4 h-4" />
            </div>
            <input
              type="text"
              placeholder="Search Company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition shadow-sm"
            />
          </div>
        </div>
      </div>
      {/* Company Table */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">#</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Logo</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Company</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Description</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-left">Created</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center w-[180px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">

            {loading ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10"
                >
                  Loading Companies...
                </td>

              </tr>

            ) : filteredCompanies.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-10 text-gray-500"
                >
                  No Companies Found
                </td>

              </tr>

            ) : (

              filteredCompanies.map(
                (company, index) => (

                  <tr
                    key={company._id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="px-6 py-4 text-sm text-slate-500 font-medium text-left">
                      {index + 1}
                    </td>
                    {/* Logo */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.name}
                            className="w-10 h-10 rounded-lg object-contain border border-slate-200"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/48x48?text=Logo";
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                            <FaBuilding />
                          </div>
                        )}
                      </div>
                    </td>
                    {/* Name */}
                    <td className="px-6 py-4 font-semibold text-sm text-slate-900 text-left">
                      {company.name}
                    </td>
                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-slate-600 text-left">
                      {company.description || "-"}
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-sm text-slate-600 text-left">
                      {new Date(company.createdAt).toLocaleDateString()}
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedCompany(company);
                            setModalOpen(true);
                          }}
                          className="h-9 w-9 flex items-center justify-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm transition active:scale-95 cursor-pointer"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(company._id)}
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

      {/* Company Modal */}

      <CompanyModal

        isOpen={modalOpen}

        onClose={() => {

          setModalOpen(false);

          setSelectedCompany(null);

        }}

        loading={loading}

        initialData={selectedCompany}

        onSubmit={(data) => {

          if (selectedCompany) {

            handleUpdate(data);

          } else {

            handleCreate(data);

          }

        }}

      />

    </div>

  );

};

export default CompanyManagement;