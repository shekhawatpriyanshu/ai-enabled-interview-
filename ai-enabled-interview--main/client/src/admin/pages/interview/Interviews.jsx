import { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";

import InterviewStats from "../../components/interviews/InterviewStats";
import InterviewSearch from "../../components/interviews/InterviewsSearch";
import InterviewFilters from "../../components/interviews/InterviewsFilter";
import InterviewTable from "../../components/interviews/InterviewTable";
import Pagination from "../../components/interviews/Pagination";
import InterviewDetailsModal from "../../components/interviews/InterviewDetailsModal";
import DeleteInterviewModal from "../../components/interviews/DeleteInterviewModal";

import { useAdminAuth } from "../../context/AdminAuthContext";
import adminApi from "../../services/adminApi";

const Interviews = () => {
  const { token } = useAdminAuth();

  const [interviews, setInterviews] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [experience, setExperience] = useState("");
  const [page, setPage] = useState(1);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    page: 1,
    limit: 10,
  });

  const fetchStats = async () => {
    try {
      const { data } = await adminApi.get("/interviews/stats");
      setStats(data.stats);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.get("/interviews", {
        params: {
          page,
          search,
          status,
          experience,
          limit: 10,
        },
      });

      setInterviews(data.interviews);
      setPagination(data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (interview) => {
    try {
      setSelectedInterview(interview);
      const { data } = await adminApi.get(`/interviews/${interview._id}`);
      setFeedback(data.feedback);
      setShowDetailsModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (interview) => {
    setSelectedInterview(interview);
    setShowDeleteModal(true);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [page, search, status, experience]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-[fadeIn_0.4s_ease-out]">

      {/* 1. Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-500/30 animate-bounce">
              <FaUserGraduate />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              Interview Management
            </span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Monitor, inspect, and evaluate AI-driven interview sessions and candidate transcripts.
          </p>
        </div>
      </div>

      {/* 2. Statistics */}
      <InterviewStats stats={stats} />

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-center">
          <InterviewSearch
            value={search}
            onChange={setSearch}
          />
          <InterviewFilters
            status={status}
            setStatus={setStatus}
            experience={experience}
            setExperience={setExperience}
          />
        </div>
      </div>

      {/* 4. Table */}
      <InterviewTable
        interviews={interviews}
        loading={loading}
        onView={handleView}
        onDelete={handleDeleteClick}
        refresh={fetchInterviews}
      />

      {/* 5. Pagination */}
      <Pagination
        page={page}
        pages={pagination.pages}
        setPage={setPage}
      />

      {/* 6. View Modal */}
      <InterviewDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedInterview(null);
          setFeedback(null);
        }}
        interview={selectedInterview}
        feedback={feedback}
      />

      {/* 7. Delete Modal */}
      <DeleteInterviewModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedInterview(null);
        }}
        interview={selectedInterview}
        onSuccess={() => {
          fetchInterviews();
          fetchStats();
        }}
      />

    </div>
  );
};

export default Interviews;