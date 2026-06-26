import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaRobot,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;

  const passwordRegex =
    /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";

    if (name === "email") {
      if (!emailRegex.test(value)) {
        error =
          "Email must end with .com or .in";
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        error =
          "Password must start with uppercase, contain a number and special character";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert(
        "Email and Password are required"
      );
      return;
    }

    if (
      errors.email ||
      errors.password
    ) {
      return;
    }

    try {
      setLoading(true);

      await login(
        form.email,
        form.password
      );

      navigate("/");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach(
          (err) => {
            const msg =
              err.msg.toLowerCase();

            if (
              msg.includes("email")
            ) {
              backendErrors.email =
                err.msg;
            }

            if (
              msg.includes("password")
            ) {
              backendErrors.password =
                err.msg;
            }
          }
        );

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
      } else {
        alert(
          error.response?.data
            ?.message ||
            "Login Failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center px-4 relative overflow-hidden">

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"></div>

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg">
              <FaRobot className="text-white text-4xl" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white">
              Welcome Back
            </h1>

            <p className="text-slate-300 mt-2">
              Continue your AI Interview Journey
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label className="text-slate-300 text-sm mb-2 block">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                placeholder="john@example.com"
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                  errors.email
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />

              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="text-slate-300 text-sm mb-2 block">
                Password
              </label>

              <div className="relative">
                <input
                  name="password"
                  value={form.password}
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password@123"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
                    errors.password
                      ? "border-red-500"
                      : "border-white/20"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-4 top-4 text-slate-300"
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-cyan-400 text-sm hover:text-cyan-300"
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-50"
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>
          </form>

        
          {/* Register Link */}
          <div className="text-center mt-8">
            <p className="text-slate-300">
              Don't have an account?

              <Link
                to="/register"
                className="text-cyan-400 font-semibold ml-2 hover:text-cyan-300"
              >
                Create Account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;