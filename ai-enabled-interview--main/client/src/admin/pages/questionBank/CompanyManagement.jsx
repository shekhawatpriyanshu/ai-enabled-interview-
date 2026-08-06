import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  FaPlus,
  FaSearch,
  FaBuilding,
  FaEdit,
  FaTrash,
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
  const [selectedCompany, setSelectedCompany] = useState(null);
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
        error?.response?.data?.message || "Failed to load companies."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    try {
      await addCompany(data);
      toast.success("Company created successfully.");
      setModalOpen(false);
      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to create company."
      );
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateCompany(selectedCompany._id, data);
      toast.success("Company updated successfully.");
      setSelectedCompany(null);
      setModalOpen(false);
      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to update company."
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this company?");
    if (!confirmDelete) return;

    try {
      await removeCompany(id);
      toast.success("Company deleted successfully.");
      loadCompanies();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Unable to delete company."
      );
    }
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) =>
      company.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [companies, search]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-500/30 animate-bounce">
              <FaBuilding />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Company Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Curate, organize, and manage target hiring companies for interview preparation.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCompany(null);
            setModalOpen(true);
          }}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:from-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-black transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:-translate-y-0.5 active:scale-95 text-xs whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 group"
        >
          <FaPlus className="group-hover:rotate-90 transition-transform duration-300" /> Add New Company
        </button>
      </div>

      {/* 2. STATS KPI CARD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-3xl border border-blue-200/90 hover:border-blue-400 bg-gradient-to-br from-blue-50/90 via-cyan-50/40 to-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group flex items-center justify-between cursor-pointer">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors">
              Total Companies
            </p>
            <h2 className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mt-1">
              {companies.length}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center text-xl shadow-md shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
            <FaBuilding />
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
            placeholder="Type to search companies by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all shadow-sm text-sm"
          />
        </div>
      </div>

      {/* 4. COMPANY TABLE */}
      <div className="overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
        <table className="w-full min-w-[850px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200/80">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left w-16">
                #
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-center w-24">
                Logo
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase tracking-wider text-slate-500 text-left">
                Company Name
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
                <td colSpan="6" className="py-20 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className="mt-4 text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                      Loading Companies...
                    </p>
                  </div>
                </td>
              </tr>
            ) : filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-20 text-center text-slate-400 font-bold text-xs">
                  No companies found matching your search.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, index) => (
                <tr
                  key={company._id}
                  className="hover:bg-gradient-to-r hover:from-blue-50/60 hover:via-indigo-50/30 hover:to-purple-50/40 transition-all duration-300 group"
                >
                  <td className="px-6 py-4 text-xs font-extrabold text-slate-400">
                    {index + 1}
                  </td>

                  {/* Logo */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name}
                          className="w-10 h-10 rounded-xl object-contain border border-slate-200 shadow-sm p-1 bg-white group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-md transition-all duration-300"
                          onError={(e) => {
                            e.target.src = "https://placehold.co/48x48?text=Logo";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <FaBuilding />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Name */}
                  <td className="px-6 py-4 font-black text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {company.name}
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 text-xs text-slate-600 font-medium leading-relaxed max-w-md line-clamp-2">
                    {company.description || "No description provided"}
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">
                    {new Date(company.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4">
                    <div className="flex justify-center items-center gap-1.5">
                      <button
                        onClick={() => {
                          setSelectedCompany(company);
                          setModalOpen(true);
                        }}
                        className="w-8.5 h-8.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                        title="Edit Company"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(company._id)}
                        className="w-8.5 h-8.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-110 active:scale-95 cursor-pointer"
                        title="Delete Company"
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