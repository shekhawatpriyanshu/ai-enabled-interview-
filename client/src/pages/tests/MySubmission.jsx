import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaTrophy,
  FaClipboardList,
} from "react-icons/fa";

import MainLayout from "../../layouts/MainLayout";
import { getMySubmissions } from "../../services/TestService";

const MySubmissions = () => {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);

      const res = await getMySubmissions();

      setSubmissions(res.submissions);
    } catch (error) {
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout showNavbar>
        <div className="flex justify-center items-center h-[70vh]">
          <h2 className="text-2xl font-semibold">
            Loading Submissions...
          </h2>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showNavbar>

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            My Test Submissions
          </h1>

          <p className="text-gray-500 mt-2">
            Review all your completed mock tests.
          </p>

        </div>

        {submissions.length === 0 ? (

          <div className="bg-white rounded-2xl shadow p-10 text-center">

            <FaClipboardList
              className="mx-auto text-6xl text-gray-300 mb-5"
            />

            <h2 className="text-2xl font-bold">
              No Submissions Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Complete your first mock test to see your history.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-2 gap-6">

            {submissions.map((submission) => (

              <div
                key={submission._id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6"
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h2 className="text-2xl font-bold">
                      {submission.test?.title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {submission.test?.difficulty}
                    </p>

                  </div>

                  <FaCheckCircle className="text-green-500 text-3xl" />

                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">

                  <div className="bg-cyan-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Score
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {submission.score}
                    </h3>

                  </div>

                  <div className="bg-green-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Percentage
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {submission.percentage}%
                    </h3>

                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Questions
                    </p>

                    <h3 className="text-2xl font-bold mt-2">
                      {submission.totalQuestions}
                    </h3>

                  </div>

                  <div className="bg-purple-50 rounded-xl p-4">

                    <p className="text-gray-500 text-sm">
                      Date
                    </p>

                    <h3 className="text-sm font-semibold mt-2">
                      {new Date(
                        submission.createdAt
                      ).toLocaleDateString()}
                    </h3>

                  </div>

                </div>

                <div className="flex justify-between items-center mt-8 border-t pt-5">

                  <div className="flex items-center gap-2 text-gray-600">

                    <FaCalendarAlt />

                    {new Date(
                      submission.createdAt
                    ).toLocaleString()}

                  </div>

                  <div className="flex items-center gap-2 text-yellow-600 font-semibold">

                    <FaTrophy />

                    Completed

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </MainLayout>
  );
};

export default MySubmissions;
