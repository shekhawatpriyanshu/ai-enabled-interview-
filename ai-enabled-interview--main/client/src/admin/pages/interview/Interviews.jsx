import { useEffect, useState } from "react";

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
  
  const[experience,setExperience]=useState("");

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
  }, [page, search, status,experience]);

  return (
    <div className="p-6 space-y-6">

      {/* Page Heading */}

      <div>
        <h1 className="text-3xl font-bold">
          Interview Management
        </h1>

        <p className="text-gray-500">
          Manage all AI interview sessions
        </p>
      </div>

      {/* Statistics */}

      <InterviewStats stats={stats} />

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

      {/* Table */}

      <InterviewTable
        interviews={interviews}
        loading={loading}
        onView={handleView}
        onDelete={handleDeleteClick}
        refresh={fetchInterviews}
      />

      {/* Pagination */}

      <Pagination
        page={page}
        pages={pagination.pages}
        setPage={setPage}
      />

      {/* View Modal */}
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

      {/* Delete Modal */}
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