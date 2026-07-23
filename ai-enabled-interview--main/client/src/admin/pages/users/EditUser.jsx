import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../../services/userService";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    role: "user",
    isVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await getUser(id);
        const data = res.user;

        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
          isVerified: data.isVerified,
        });

        setLoading(false);
      } catch (err) {
        setError("Failed to fetch user data");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Toggle verification
  const toggleVerify = () => {
    setUser({ ...user, isVerified: !user.isVerified });
  };

  // Validate form
  const validate = () => {
    if (!user.name.trim()) return "Name is required";
    if (!user.email.trim()) return "Email is required";

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(user.email)) return "Invalid email format";

    return null;
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      await updateUser(id, user);

      setSuccess("User updated successfully!");

      setTimeout(() => {
        navigate("/admin/users");
      }, 1000);
    } catch (err) {
      setError("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user.name) return <p>Loading user...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium">Role</label>
          <input
            type="text"
            name="role"
            value={user.role}
            disabled
            className="w-full border p-2 rounded bg-gray-100 capitalize cursor-not-allowed"
          />
        </div>

        {/* Verify */}
        <div className="flex items-center gap-2">
          <label className="font-medium">Verified:</label>
          <button
            type="button"
            onClick={toggleVerify}
            className={`px-3 py-1 rounded text-white ${
              user.isVerified ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {user.isVerified ? "Verified" : "Unverified"}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update User"}
        </button>
      </form>
    </div>
  );
};

export default EditUser;