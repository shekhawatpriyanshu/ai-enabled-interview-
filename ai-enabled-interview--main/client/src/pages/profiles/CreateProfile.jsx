import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";
import ProfileForm from "../../components/profile/ProfileForm";

import {
  createProfile,
  getProfile,
} from "../../services/ProfileService";

const CreateProfile = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkProfile();
  }, []);

  const checkProfile = async () => {
    try {
      const data = await getProfile();

      if (data.profile) {
        navigate("/profile");
        return;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    formData
  ) => {
    try {
      await createProfile(
        formData
      );

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <h2 className="mt-4 text-xl font-semibold text-blue-600">
              Checking Profile...
            </h2>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-xl p-10 text-white mb-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Create Profile
              </h1>

              <p className="mt-3 text-blue-100 text-lg">
                Build your professional developer profile and
                showcase your skills, experience and social links.
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center w-28 h-28 bg-white/20 rounded-full text-5xl">
              👤
            </div>

          </div>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          <div className="bg-slate-50 border-b px-8 py-5">
            <h2 className="text-2xl font-bold text-gray-800">
              Personal Information
            </h2>

            <p className="text-gray-500 mt-1">
              Fill in your details to create a complete profile.
            </p>
          </div>

          <div className="p-8">
            <ProfileForm
              initialData={null}
              onSubmit={handleSubmit}
            />
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default CreateProfile;