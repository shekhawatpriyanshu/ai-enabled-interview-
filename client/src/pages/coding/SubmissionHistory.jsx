import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";
import SubmissionTable from "../../components/coding/SubmissionTable";

import { getMySubmissions } from "../../services/CodingService";

const SubmissionHistory = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const res = await getMySubmissions();

      setSubmissions(res.submissions);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to load submissions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout showNavbar={false}>

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Submission History
        </h1>

        <p className="text-gray-500 mt-2">
          View all your coding submissions.
        </p>

      </div>

      {loading ? (

        <div className="bg-white rounded-2xl shadow-md p-12 text-center">

          <h2 className="text-xl font-semibold">
            Loading submissions...
          </h2>

        </div>

      ) : submissions.length === 0 ? (

        <div className="bg-white rounded-2xl shadow-md p-12 text-center">

          <h2 className="text-2xl font-semibold text-gray-700">
            No submissions found.
          </h2>

          <p className="text-gray-500 mt-3">
            Solve a coding problem to see your
            submissions here.
          </p>

        </div>

      ) : (

        <SubmissionTable
          submissions={submissions}
        />

      )}

    </MainLayout>
  );
};

export default SubmissionHistory;