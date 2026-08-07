import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUser,
  FaAt,
  FaFingerprint,
  FaEye,
  FaEyeSlash,
  FaRocket,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  const passwordRegex = /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSuccessMessage("");
    setGeneralError("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";

    if (name === "name") {
      if (value.trim().length < 3) {
        error = "Name must be at least 3 characters";
      }
    }

    if (name === "email") {
      if (!emailRegex.test(value)) {
        error = "Email must end with .com or .in";
      }
    }

    if (name === "password") {
      if (!passwordRegex.test(value)) {
        error = "Password must start with uppercase, contain a number and special character";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setGeneralError("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setGeneralError("All fields are required to create an account.");
      return;
    }

    if (errors.name || errors.email || errors.password) {
      setGeneralError("Please fix validation errors before submitting.");
      return;
    }

    try {
      setLoading(true);
      await register(form);
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach((err) => {
          const msg = err.msg.toLowerCase();

          if (msg.includes("name")) {
            backendErrors.name = err.msg;
          }

          if (msg.includes("email")) {
            backendErrors.email = err.msg;
          }

          if (msg.includes("password")) {
            backendErrors.password = err.msg;
          }
        });

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
        setGeneralError("Please resolve the errors highlighted below.");
      } else {
        setGeneralError(error.response?.data?.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Impressive Background Glow Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-5 left-5 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1, 1.35, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-5 right-5 w-96 h-96 bg-fuchsia-600/20 blur-3xl rounded-full pointer-events-none"
      />

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/90 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50 relative overflow-hidden"
        >
          {/* Impressive Cyberpunk Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 to-fuchsia-500" />

          {/* Logo Badge */}
          <div className="flex justify-center mb-6 pt-2">
            <motion.div
              whileHover={{ scale: 1.12, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-indigo-500/40 ring-2 ring-cyan-400/40 cursor-pointer"
            >
              <FaRocket className="text-white text-4xl drop-shadow-md" />
            </motion.div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-3xl font-black text-white tracking-tight"
            >
              <span className="bg-gradient-to-r from-cyan-300 via-indigo-200 via-purple-200 to-fuchsia-300 bg-clip-text text-transparent">
                Create Account
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs font-semibold text-slate-400 mt-2"
            >
              Start your AI Interview prep journey today
            </motion.p>
          </div>

          <form onSubmit={submitHandler} className="space-y-5">
            {/* Success Message Banner */}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 mb-2 text-emerald-300 text-xs font-bold flex items-center justify-between gap-3 shadow-lg shadow-emerald-950/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-emerald-400 text-base animate-bounce" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white text-xs">Registration Successful!</h4>
                    <p className="text-[11px] font-medium text-emerald-300/90 mt-0.5">{successMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Message Banner */}
            {generalError && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-rose-500/15 border border-rose-500/30 rounded-2xl p-3.5 mb-2 text-rose-300 text-xs font-bold flex items-center justify-between gap-3 shadow-lg shadow-rose-950/20"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0">
                    <FaExclamationTriangle className="text-rose-400 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-white text-xs">Registration Error</h4>
                    <p className="text-[11px] font-medium text-rose-300/90 mt-0.5">{generalError}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setGeneralError("")}
                  className="text-rose-400 hover:text-white p-1 transition-colors shrink-0 font-bold text-sm"
                >
                  ✕
                </button>
              </motion.div>
            )}

            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <FaUser className="text-cyan-400 text-xs" />
                <span>Full Name</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                  <FaUser className="text-sm" />
                </div>
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  placeholder="John Doe"
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner ${
                    errors.name ? "border-rose-500/80" : "border-slate-800"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.name}
                </p>
              )}
            </motion.div>

            {/* Email Address */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <FaAt className="text-cyan-400 text-xs" />
                <span>Email Address</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                  <FaAt className="text-sm" />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  placeholder="john@example.com"
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner ${
                    errors.email ? "border-rose-500/80" : "border-slate-800"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <FaFingerprint className="text-cyan-400 text-xs" />
                <span>Password</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                  <FaFingerprint className="text-sm" />
                </div>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  placeholder="Password@123"
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3.5 bg-slate-950/90 border rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner ${
                    errors.password ? "border-rose-500/80" : "border-slate-800"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                >
                  {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <button
                type="submit"
                disabled={loading || !!successMessage}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Creating Account...</span>
                  </div>
                ) : successMessage ? (
                  "✓ Account Created!"
                ) : (
                  "Create Account"
                )}
              </button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="text-center mt-8 pt-4 border-t border-slate-800/80"
          >
            <p className="text-xs font-bold text-slate-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 font-extrabold hover:text-fuchsia-300 transition-colors hover:underline ml-1"
              >
                Login
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;