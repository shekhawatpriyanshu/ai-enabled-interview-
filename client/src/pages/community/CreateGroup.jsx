import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import GroupForm from "../../components/community/GroupForm";

const CreateGroup = () => {
  return (
    <MainLayout>
      <div className="py-2">

        {/* Back Button */}
        <Link
          to="/community/groups"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Study Groups
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Study Group
          </h1>

          <p className="text-gray-500 mt-2">
            Create a study group to collaborate, prepare for interviews, and
            learn together.
          </p>
        </div>

        {/* Form */}
        <GroupForm />

      </div>
    </MainLayout>
  );
};

export default CreateGroup;