import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import DiscussionForm from "../../components/community/DiscussionForm";

const CreateDiscussion = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/community/discussions"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-8 transition-colors bg-white/50 px-4 py-2 rounded-full shadow-sm hover:bg-white"
          >
            <ArrowLeft size={18} />
            Back to Discussions
          </Link>

          {/* Form */}
          <DiscussionForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateDiscussion;