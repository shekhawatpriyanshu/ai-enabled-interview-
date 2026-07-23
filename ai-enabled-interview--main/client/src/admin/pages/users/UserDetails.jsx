import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  FaArrowLeft,
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaCheckCircle,
  FaBan,
} from "react-icons/fa";

import { getUser } from "../../services/userService";

const UserDetails = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] =
    useState(true);

  const loadUser = async () => {
    try {
      const res = await getUser(id);

      setUser(res.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-xl">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center mt-20 text-red-600">
        User Not Found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8">

          <div className="flex items-center gap-6">

            <div className="w-24 h-24 rounded-full bg-white text-blue-600 flex items-center justify-center text-5xl">

              <FaUser />

            </div>

            <div>

              <h1 className="text-3xl font-bold">
                {user.name}
              </h1>

              <p className="opacity-90">
                {user.email}
              </p>

            </div>

          </div>

        </div>

        {/* Body */}

        <div className="grid md:grid-cols-2 gap-8 p-8">

          <div className="space-y-6">

            <div className="flex items-center gap-4">

              <FaEnvelope className="text-blue-600 text-xl" />

              <div>

                <h4 className="font-semibold">
                  Email
                </h4>

                <p>{user.email}</p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <FaUserShield className="text-purple-600 text-xl" />

              <div>

                <h4 className="font-semibold">
                  Role
                </h4>

                <p className="capitalize">
                  {user.role}
                </p>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <FaCalendarAlt className="text-green-600 text-xl" />

              <div>

                <h4 className="font-semibold">
                  Joined
                </h4>

                <p>
                  {new Date(
                    user.createdAt
                  ).toLocaleString()}
                </p>

              </div>

            </div>

          </div>

          <div className="space-y-6">

            <div className="flex items-center gap-4">

              <FaCheckCircle className="text-green-600 text-xl" />

              <div>

                <h4 className="font-semibold">
                  Verification
                </h4>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user.isVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {user.isVerified
                    ? "Verified"
                    : "Not Verified"}
                </span>

              </div>

            </div>

            <div className="flex items-center gap-4">

              <FaBan className="text-red-600 text-xl" />

              <div>

                <h4 className="font-semibold">
                  Account Status
                </h4>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    user.isBlocked
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.isBlocked
                    ? "Blocked"
                    : "Active"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserDetails;