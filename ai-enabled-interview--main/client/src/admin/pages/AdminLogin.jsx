import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";

import { useAdminAuth } from "../context/AdminAuthContext";

const AdminLogin = () => {
  const navigate = useNavigate();

  const { login } = useAdminAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.email || !form.password) {
      return setError(
        "Email and Password are required."
      );
    }

    try {
      setLoading(true);

      await login(
        form.email,
        form.password
      );

      navigate("/admin");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl p-8">

        {/* Logo */}

        <div className="flex justify-center mb-6">

          <div className="h-20 w-20 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center">

            <FaUserShield className="text-white text-4xl"/>

          </div>

        </div>

        {/* Heading */}

        <h1 className="text-3xl text-center font-bold text-white">
          Admin Login
        </h1>

        <p className="text-center text-slate-300 mt-2 mb-8">
          AI Interview Platform Admin Panel
        </p>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg text-red-300 p-3 mb-5">
            {error}
          </div>
        )}

        <form
          onSubmit={submitHandler}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="shekhawatpriyanshu@gmail.com"
              className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
            />

          </div>

          {/* Password */}

          <div>

            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                className="absolute top-4 right-4 text-slate-300"
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>

          </div>

          {/* Button */}

          <button
            disabled={loading}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold hover:scale-[1.02] transition"
          >
            {loading
              ? "Signing In..."
              : "Login"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;