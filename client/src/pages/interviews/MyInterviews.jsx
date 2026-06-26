import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getMyInterviews,
} from "../../services/InterviewService";

import InterviewCard from "../../components/interview/InterviewCard";

const MyInterviews = () => {
  const [interviews,
    setInterviews] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [totalPages,
    setTotalPages] =
    useState(1);

  const [totalInterviews,
    setTotalInterviews] =
    useState(0);

  useEffect(() => {
    loadInterviews(
      currentPage
    );
  }, [currentPage]);

  const loadInterviews =
    async (
      page = 1
    ) => {
      try {
        setLoading(true);

        const data =
          await getMyInterviews(
            page,
            10
          );

        setInterviews(
          data.interviews ||
            []
        );

        setTotalPages(
          data.totalPages ||
            1
        );

        setTotalInterviews(
          data.totalInterviews ||
            0
        );
      } catch (err) {
        console.log(err);

        setError(
          err.response?.data
            ?.message ||
            "Failed to load interviews"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <MainLayout showNavbar={false}>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-6 py-10">

        {/* Header */}
        <div className="max-w-7xl mx-auto mb-12">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>

              <h1 className="text-5xl font-bold text-blue-400 mb-3">
                My Interviews
              </h1>

              <p className="text-slate-200 text-lg">
                Track your interview sessions,
                performance and AI feedback.
              </p>

            </div>

            <Link
              to="/interviews/start"
              className="
                inline-flex
                items-center
                justify-center
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-purple-600
                px-8
                py-4
                font-semibold
                text-white
                shadow-lg
                transition-all
                duration-300
                hover:scale-105
              "
            >
              🚀 Start Interview
            </Link>

          </div>

        </div>

        {loading ? (

          <div className="flex flex-col items-center justify-center py-24">

            <div className="h-14 w-14 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>

            <p className="mt-6 text-slate-400 text-lg">
              Loading Interviews...
            </p>

          </div>

        ) : error ? (

          <div className="max-w-4xl mx-auto">

            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
              {error}
            </div>

          </div>

        ) : interviews.length === 0 ? (

          <div className="max-w-4xl mx-auto">

            <div className="rounded-[32px] border border-white/10 bg-white/5 p-16 text-center">

              <div className="text-8xl mb-6">
                🤖
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                No Interviews Yet
              </h2>

              <p className="text-slate-400">
                Start your first AI-powered interview.
              </p>

            </div>

          </div>

        ) : (

          <div className="max-w-7xl mx-auto">

            <div className="flex justify-between items-center mb-6">

              <p className="text-slate-300">
                Page{" "}
                <span className="text-cyan-400 font-bold">
                  {currentPage}
                </span>{" "}
                of{" "}
                <span className="text-cyan-400 font-bold">
                  {totalPages}
                </span>
              </p>

              <p className="text-slate-400">
                Total Interviews:{" "}
                {totalInterviews}
              </p>

            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

              {interviews.map(
                (
                  interview
                ) => (
                  <InterviewCard
                    key={
                      interview._id
                    }
                    interview={
                      interview
                    }
                  />
                )
              )}

            </div>

            {/* Pagination */}

            <div className="flex justify-center items-center gap-3 mt-10">

              <button
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev - 1
                  )
                }
                disabled={
                  currentPage ===
                  1
                }
                className="
                  px-4 py-2
                  rounded-xl
                  bg-slate-800
                  text-white
                  disabled:opacity-50
                "
              >
                Previous
              </button>

              {[
                ...Array(
                  totalPages
                ),
              ].map(
                (
                  _,
                  index
                ) => (
                  <button
                    key={
                      index
                    }
                    onClick={() =>
                      setCurrentPage(
                        index +
                          1
                      )
                    }
                    className={`px-4 py-2 rounded-xl ${
                      currentPage ===
                      index +
                        1
                        ? "bg-cyan-500 text-white"
                        : "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {index +
                      1}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage(
                    (
                      prev
                    ) =>
                      prev + 1
                  )
                }
                disabled={
                  currentPage ===
                  totalPages
                }
                className="
                  px-4 py-2
                  rounded-xl
                  bg-slate-800
                  text-white
                  disabled:opacity-50
                "
              >
                Next
              </button>

            </div>

          </div>

        )}

      </div>
    </MainLayout>
  );
};

export default MyInterviews;