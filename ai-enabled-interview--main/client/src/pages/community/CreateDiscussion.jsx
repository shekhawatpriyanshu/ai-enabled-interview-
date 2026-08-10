import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import DiscussionForm from "../../components/community/DiscussionForm";

const CreateDiscussion = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 text-slate-800 min-h-screen py-6 px-4 sm:px-6 lg:px-8 relative animate-[fadeIn_0.4s_ease-out]">
        {/* Floating Ambient Color Spheres */}
        <div className="absolute -top-10 left-10 w-96 h-96 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-96 h-96 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          {/* Back Button */}
          <Link
            to="/community/discussions"
            className="group inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-indigo-600 font-extrabold text-xs uppercase tracking-wider transition-all duration-200 hover:-translate-x-1 shadow-sm cursor-pointer"
          >
            <ArrowLeft size={16} className="text-indigo-600 shrink-0 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Discussions</span>
          </Link>

          {/* Form */}
          <DiscussionForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDiscussion;