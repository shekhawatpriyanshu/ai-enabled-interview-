import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import GroupForm from "../../components/community/GroupForm";

const CreateGroup = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link
            to="/community/groups"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold mb-8 transition-colors bg-white/50 px-4 py-2 rounded-full shadow-sm hover:bg-white"
          >
            <ArrowLeft size={18} />
            Back to Study Groups
          </Link>

          {/* Form */}
          <GroupForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateGroup;