

import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getProfile,
  deleteProfile,
} from "../../services/ProfileService";

const Profile = () => {
  const [profile, setProfile] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login", {
      replace: true,
    });
  };

  const fetchProfile =
    async () => {
      try {
        const data =
          await getProfile();

        setProfile(
          data.profile
        );
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

  const handleDelete =
    async () => {
      const confirmDelete =
        window.confirm(
          "Delete profile?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteProfile();

        alert(
          "Profile deleted successfully"
        );

        setProfile(null);

        navigate("/profile");
      } catch (error) {
        console.log(error);
      }
    };
    const githubUrl = profile?.github
  ? profile.github.startsWith("http")
    ? profile.github
    : `https://${profile.github}`
  : "#";

const linkedinUrl = profile?.linkedin
  ? profile.linkedin.startsWith("http")
    ? profile.linkedin
    : `https://${profile.linkedin}`
  : "#";

  if (loading)
    
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[70vh]">
          <h1 className="text-2xl font-bold text-blue-600">
            Loading...
          </h1>
        </div>
      </MainLayout>
    );

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">
          My Profile
        </h1>

        {/* Action Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
          <div className="flex flex-wrap gap-4">

            <Link
              to="/profile/create"
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                profile
                  ? "bg-gray-400 pointer-events-none"
                  : "bg-green-600 hover:bg-green-700 hover:scale-105"
              }`}
            >
              Create Profile
            </Link>

            <Link
              to="/profile/edit"
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                !profile
                  ? "bg-gray-400 pointer-events-none"
                  : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
              }`}
            >
              Edit Profile
            </Link>

            <button
              onClick={
                handleDelete
              }
              disabled={!profile}
              className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                !profile
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 hover:scale-105"
              }`}
            >
              Delete Profile
            </button>

            <button
              onClick={
                handleLogout
              }
              className="px-6 py-3 rounded-xl font-semibold text-white bg-black hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              Logout
            </button>

          </div>
        </div>

        {profile ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* Banner */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 h-40"></div>

            <div className="px-8 pb-8">

              {/* Profile Header */}
              <div className="-mt-16 flex flex-col items-center">

                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white">
                  {profile.avatar ? (
                   <img
  src={`http://localhost:3000/${profile.avatar.replace(/\\/g, "/")}`}
  alt="avatar"
  className="w-full h-full object-cover"
/>
                  ) : (
                    <div className="w-full h-full bg-blue-100 flex items-center justify-center text-4xl font-bold text-blue-700">
                      {profile.user?.name
                        ?.charAt(
                          0
                        )
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                <h2 className="mt-4 text-3xl font-bold text-gray-800">
                  {
                    profile.user
                      ?.name
                  }
                </h2>

                <p className="text-gray-500">
                  {
                    profile.user
                      ?.email
                  }
                </p>

                <span className="mt-3 px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {
                    profile.user
                      ?.role
                  }
                </span>

              </div>

              {/* Info Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-10">

                <div className="bg-slate-50 p-5 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-blue-600">
                    Bio
                  </h3>

                  <p className="text-gray-700">
                    {profile.bio ||
                      "Not Added"}
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-blue-600">
                    Location
                  </h3>

                  <p className="text-gray-700">
                    {profile.location ||
                      "Not Added"}
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-blue-600">
                    College
                  </h3>

                  <p className="text-gray-700">
                    {profile.college ||
                      "Not Added"}
                  </p>
                </div>

                <div className="bg-slate-50 p-5 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg mb-2 text-blue-600">
                    Experience
                  </h3>

                  <p className="text-gray-700">
                    {profile.experience ||
                      "Not Added"}
                  </p>
                </div>

              </div>

              {/* Skills */}
              <div className="mt-8 bg-slate-50 p-5 rounded-xl shadow-sm">
                <h3 className="font-bold text-lg mb-3 text-blue-600">
                  Skills
                </h3>

                <div className="flex flex-wrap gap-3">
                  {profile.skills
                    ?.length >
                  0 ? (
                    profile.skills.map(
                      (
                        skill,
                        index
                      ) => (
                        <span
                          key={
                            index
                          }
                          className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-medium"
                        >
                          {
                            skill
                          }
                        </span>
                      )
                    )
                  ) : (
                    <p className="text-gray-500">
                      No skills
                      added
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links */}
             {/* Social Links */}
<div className="mt-8 grid md:grid-cols-2 gap-4">

  {profile.github && (
    <a
      href={githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-gray-900 text-white text-center py-4 rounded-xl hover:bg-black transition"
    >
      GitHub
    </a>
  )}

  {profile.linkedin && (
    <a
      href={linkedinUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-blue-600 text-white text-center py-4 rounded-xl hover:bg-blue-700 transition"
    >
      LinkedIn
    </a>
  )}

</div>

            </div>

          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">

            <div className="text-7xl mb-5">
              👤
            </div>

            <h2 className="text-3xl font-bold text-gray-800">
              No Profile Found
            </h2>

            <p className="text-gray-500 mt-3 text-lg">
              Click Create Profile to
              get started.
            </p>

            <Link
              to="/profile/create"
              className="inline-block mt-6 px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
            >
              Create Profile
            </Link>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Profile;