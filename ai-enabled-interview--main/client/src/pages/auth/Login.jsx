import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaUserAstronaut,
  FaEye,
  FaEyeSlash,
  FaBan,
  FaAt,
  FaFingerprint,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [authError, setAuthError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  const passwordRegex = /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("blocked") === "true") {
      setIsBlocked(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthError("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    let error = "";

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
    setAuthError("");

    if (!form.email.trim() || !form.password.trim()) {
      setAuthError("Email and Password are required to sign in.");
      return;
    }

    if (errors.email || errors.password) {
      setAuthError("Please fix validation errors before submitting.");
      return;
    }

    try {
      setLoading(true);

      await login(form.email, form.password);

      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect") || "/dashboard";

      navigate(redirectUrl, { replace: true });
    } catch (err) {
      setAuthError(
        err.response?.data?.message || "Invalid email address or password. Please check your credentials and try again."
      );
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
        {isBlocked ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900/90 backdrop-blur-2xl border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden"
          >
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-3xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shadow-lg">
                <FaBan className="text-rose-400 text-4xl" />
              </div>
            </div>

            <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Account Blocked</h1>
            <p className="text-sm font-medium text-slate-400 mb-8 leading-relaxed">
              Your account has been deactivated or blocked by the administrator. Please contact support to resolve this issue.
            </p>

            <button
              onClick={() => {
                setIsBlocked(false);
                navigate("/login", { replace: true });
              }}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-2xl border border-slate-700 transition duration-200 cursor-pointer"
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
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
                <FaUserAstronaut className="text-white text-4xl drop-shadow-md" />
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
                  Login
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-xs font-semibold text-slate-400 mt-2"
              >
                Enter your credentials to access AI practice tools
              </motion.p>
            </div>

            <form onSubmit={submitHandler} className="space-y-5">
              {/* Invalid Credentials Error Banner */}
              {authError && (
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
                      <h4 className="font-extrabold text-white text-xs">Invalid Credentials</h4>
                      <p className="text-[11px] font-medium text-rose-300/90 mt-0.5">{authError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAuthError("")}
                    className="text-rose-400 hover:text-white p-1 transition-colors shrink-0 font-bold text-sm"
                  >
                    ✕
                  </button>
                </motion.div>
              )}

              {/* Email Address */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
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
                    value={form.email}
                    placeholder="student@example.com"
                    onChange={handleChange}
                    autoComplete="email"
                    className={`w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner ${errors.email ? "border-rose-500/80" : "border-slate-800"
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
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FaFingerprint className="text-cyan-400 text-xs" />
                  <span> Password</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                    <FaFingerprint className="text-sm" />
                  </div>
                  <input
                    name="password"
                    value={form.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onChange={handleChange}
                    autoComplete="current-password"
                    className={`w-full pl-11 pr-12 py-3.5 bg-slate-950/90 border rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner ${errors.password ? "border-rose-500/80" : "border-slate-800"
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

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex justify-end pt-1"
              >
                <Link
                  to="/forgot-password"
                  className="text-xs font-extrabold text-cyan-400 hover:text-fuchsia-300 transition-colors hover:underline"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </motion.div>
            </form>

            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-center mt-8 pt-4 border-t border-slate-800/80"
            >
              <p className="text-xs font-bold text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-cyan-400 font-extrabold hover:text-fuchsia-300 transition-colors hover:underline ml-1"
                >
                  Register
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Login;