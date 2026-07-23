import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBackendUrl } from "../../api/config";

import MainLayout from "../../layouts/MainLayout";
import ProfileForm from "../../components/profile/ProfileForm";

import {
  getProfile,
  updateProfile,
} from "../../services/ProfileService";

const EditProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();

      if (!data.profile) {
        navigate("/profile/create");
        return;
      }

      setProfile(data.profile);
    } catch (error) {
      navigate("/profile/create");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateProfile(formData);

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

            <h1 className="mt-4 text-xl font-semibold text-blue-600">
              Loading Profile...
            </h1>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-xl p-8 text-white mb-8">

          <div className="flex flex-col md:flex-row items-center gap-6">

            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white">

              {profile?.avatar ? (
                <img
                  src={`${getBackendUrl()}/${profile.avatar.replace(
                    /\\/g,
                    "/"
                  )}`}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-700">
                  {profile?.user?.name?.charAt(0)}
                </div>
              )}

            </div>

            <div>
              <h1 className="text-4xl font-bold">
                Edit Profile
              </h1>

              <p className="text-blue-100 mt-2">
                Update your personal information,
                skills, social links and profile image.
              </p>
            </div>

          </div>

        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8">

          <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Profile Information
            </h2>

            
          </div>

          <ProfileForm
            initialData={profile}
            onSubmit={handleSubmit}
          />

        </div>
      </div>
    </MainLayout>
  );
};

export default EditProfile;