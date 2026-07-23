import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "react-router-dom";

import {
  getAnalysis,
} from "../../services/ResumeService";

const ResumeReport = () => {
  const { id } =
    useParams();

  const [analysis, setAnalysis] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAnalysis();
  }, []);

  const loadAnalysis =
    async () => {
      try {
        const data =
          await getAnalysis(id);

        setAnalysis(
          data.analysis
        );
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading Report...
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Report Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold text-white mb-10">
          Resume Report
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <h2 className="text-white text-xl mb-3">
              ATS Score
            </h2>

            <p className="text-6xl font-bold text-cyan-400">
              {analysis.atsScore}%
            </p>
          </div>

          <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
            <h2 className="text-white text-xl mb-3">
              Keyword Match
            </h2>

            <p className="text-4xl font-bold text-purple-400">
              {
                analysis.keywordMatch
                  ?.matched
              }
              /
              {
                analysis.keywordMatch
                  ?.total
              }
            </p>
          </div>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl text-white mb-4">
            Skills Match
          </h2>

          <div className="flex flex-wrap gap-3">

            {analysis.skillsMatch?.map(
              (
                skill,
                index
              ) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        <div className="mt-8">

          <h2 className="text-2xl text-white mb-4">
            Missing Skills
          </h2>

          <div className="flex flex-wrap gap-3">

            {analysis.missingSkills?.map(
              (
                skill,
                index
              ) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300"
                >
                  {skill}
                </span>
              )
            )}

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <Card
            title="Resume Summary"
            content={
              analysis.resumeSummary
            }
          />

          <Card
            title="Experience Analysis"
            content={
              analysis.experienceAnalysis
            }
          />

          <Card
            title="Projects Analysis"
            content={
              analysis.projectsAnalysis
            }
          />

          <Card
            title="Suggestions"
            content={analysis.suggestions?.join(
              ", "
            )}
          />

        </div>

      </div>

    </div>
  );
};

const Card = ({
  title,
  content,
}) => (
  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">

    <h2 className="text-xl text-white mb-4">
      {title}
    </h2>

    <p className="text-slate-300">
      {content}
    </p>

  </div>
);

export default ResumeReport;