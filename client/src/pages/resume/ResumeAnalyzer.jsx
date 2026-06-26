import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UploadResumeCard from "../../components/resume/UploadResumeCard";

import {
  uploadResume,
  analyzeResume,
} from "../../services/ResumeService";

const ResumeAnalyzer = () => {
  const [file, setFile] =
    useState(null);

  const [role, setRole] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate =
    useNavigate();

  const handleAnalyze =
    async () => {
      try {
        if (!file) {
          alert(
            "Please select a resume"
          );
          return;
        }

        if (!role) {
          alert(
            "Please enter target role"
          );
          return;
        }

        setLoading(true);

        // Upload Resume
        const formData =
          new FormData();

        formData.append(
          "resume",
          file
        );

        const uploaded =
          await uploadResume(
            formData
          );

        console.log(
          "Upload Success:",
          uploaded
        );

        const resumeId =
          uploaded.resume._id;

        // Analyze Resume
        const analysis =
          await analyzeResume(
            resumeId,
            role
          );

        console.log(
          "Analysis Success:",
          analysis
        );

        // Redirect to Report
        navigate(
          `/resume-report/${resumeId}`
        );

      } catch (error) {
  console.log("Resume Error:", error);

  console.log(
    "Backend Response:",
    error.response?.data
  );

  alert(
    error.response?.data?.message ||
    "Analysis Failed"
  );

      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-10">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-5xl font-bold text-white mb-10">
          AI Resume Analyzer
        </h1>

        <UploadResumeCard
          file={file}
          setFile={setFile}
          role={role}
          setRole={setRole}
          loading={loading}
          onAnalyze={handleAnalyze}
        />

      </div>

    </div>
  );
};

export default ResumeAnalyzer;