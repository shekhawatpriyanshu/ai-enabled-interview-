import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaAt,
  FaFingerprint,
  FaKey,
  FaClock,
  FaRedo,
} from "react-icons/fa";
import { motion } from "framer-motion";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();

  const [step, setStep] = useState(1); // 1: Send OTP, 2: Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes = 300 seconds

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  const passwordRegex = /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Email must end with .com or .in");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email);
      setMessage("OTP sent successfully!");
      setTimeout(() => setMessage(""), 3000);
      setTimeLeft(300); // Reset timer to 5 minutes
      setStep(2);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (timeLeft === 0) {
      setError("OTP has expired (5-minute limit reached). Please click Resend Code.");
      return;
    }

    if (!otp.trim()) {
      setError("OTP is required");
      return;
    }

    if (otp.length !== 6 || isNaN(otp)) {
      setError("OTP must be exactly 6 digits");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (!passwordRegex.test(newPassword)) {
      setError("Password must start with uppercase, contain at least one number and special character");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(email, otp, newPassword);
      setMessage("Password successfully reset! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reset password. Please verify your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Success Popup Toast */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-600/95 backdrop-blur-xl border border-emerald-400 text-white font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-2xl shadow-emerald-500/40 flex items-center gap-3"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-200 animate-ping shrink-0" />
          <span>{message}</span>
        </motion.div>
      )}
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
          {/* Cyberpunk Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 via-purple-500 to-fuchsia-500" />

          {/* Upper Back to Login Link */}
          <div className="absolute top-4 left-5 z-10">
            <Link
              to="/login"
              className="group inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-300 transition-colors"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200 text-cyan-400 text-xs" />
              <span>Back to Login</span>
            </Link>
          </div>

          {/* Logo Badge */}
          <div className="flex justify-center mb-6 pt-3">
            <motion.div
              whileHover={{ scale: 1.12, rotate: 8 }}
              whileTap={{ scale: 0.95 }}
              className="h-20 w-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-xl shadow-indigo-500/40 ring-2 ring-cyan-400/40 cursor-pointer"
            >
              <FaShieldAlt className="text-white text-4xl drop-shadow-md" />
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
                {step === 1 ? "Account Recovery" : "Reset Password"}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-xs font-semibold text-slate-400 mt-2"
            >
              {step === 1
                ? "Enter your email address to receive an OTP code"
                : "Enter the 6-digit OTP code below"}
            </motion.p>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
              <span>{error}</span>
            </motion.div>
          )}

          {/* 5-Minute OTP Countdown Timer Badge in Step 2 */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mb-5 p-3.5 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 transition-colors ${timeLeft > 0
                ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
                : "bg-rose-500/15 border-rose-500/30 text-rose-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <FaClock className="text-sm shrink-0 text-cyan-400" />
                <span>
                  {timeLeft > 0
                    ? `OTP valid for 5 minutes (Expires in ${formatTime(timeLeft)})`
                    : "OTP Expired (5 min limit reached)"}
                </span>
              </div>
              {timeLeft === 0 && (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="text-xs font-extrabold text-cyan-400 hover:text-cyan-300 underline shrink-0 cursor-pointer"
                >
                  Resend Code
                </button>
              )}
            </motion.div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Email Input */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FaAt className="text-cyan-400 text-xs" />
                  <span>Student Email Address</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                    <FaAt className="text-sm" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Sending Code...</span>
                    </div>
                  ) : (
                    "📩 Send Recovery Code"
                  )}
                </button>
              </motion.div>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FaKey className="text-cyan-400 text-xs" />
                  <span>Verification Code (6-Digit OTP)</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                    <FaKey className="text-sm" />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl text-cyan-300 placeholder-slate-600 text-center tracking-[0.4em] text-lg font-black focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner"
                  />
                </div>
                {/* Resend OTP Button in lower part of input box */}
                <div className="flex justify-end mt-1.5">
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="text-xs font-extrabold text-cyan-400 hover:text-fuchsia-300 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 hover:underline"
                  >
                    <FaRedo className="text-[10px]" />
                    <span>Resend OTP</span>
                  </button>
                </div>
              </motion.div>

              {/* New Password */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FaFingerprint className="text-cyan-400 text-xs" />
                  <span>New Password</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                    <FaFingerprint className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="new-password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full pl-11 pr-12 py-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-cyan-300 transition-colors p-1"
                  >
                    {showPassword ? <FaEyeSlash className="text-base" /> : <FaEye className="text-base" />}
                  </button>
                </div>
              </motion.div>

              {/* Confirm Password */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <label className="block text-xs font-extrabold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                  <FaFingerprint className="text-cyan-400 text-xs" />
                  <span>Confirm Password</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-cyan-400/80 pointer-events-none">
                    <FaFingerprint className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all duration-200 shadow-inner"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <button
                  type="submit"
                  disabled={loading || timeLeft === 0}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-cyan-500 hover:from-blue-700 hover:via-indigo-700 hover:via-purple-700 hover:to-cyan-600 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Updating Password...</span>
                    </div>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </motion.div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
