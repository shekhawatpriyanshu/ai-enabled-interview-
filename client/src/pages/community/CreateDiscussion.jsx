import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import MainLayout from "../../layouts/MainLayout";

import DiscussionForm from "../../components/community/DiscussionForm";

const CreateDiscussion = () => {
  return (
    <MainLayout>
      <div className="py-2">

        {/* Back Button */}
        <Link
          to="/community/discussions"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Discussions
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Create Discussion
          </h1>

          <p className="text-gray-500 mt-2">
            Start a new discussion topic to ask questions or share knowledge.
          </p>
        </div>

        {/* Form */}
        <DiscussionForm />

      </div>
    </MainLayout>
  );
};

export default CreateDiscussion;