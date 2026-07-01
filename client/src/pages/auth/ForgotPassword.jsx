import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
} from "react-icons/fa";

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

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in)$/;
  const passwordRegex = /^[A-Z](?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{7,}$/;

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
      setMessage("Verification code sent! Please check your email (or server log).");
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
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to reset password. Please verify your OTP.");
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
            <h1 className="text-3xl font-bold text-white">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="text-slate-300 mt-2 text-sm">
              {step === 1
                ? "Enter your email to receive a password reset verification code"
                : "Enter the 6-digit OTP code and select your new password"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-300 text-sm">
              {message}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-slate-300 text-sm mb-2 block">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-5">
              {/* OTP */}
              <div>
                <label className="text-slate-300 text-sm mb-2 block">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-center tracking-widest text-lg font-bold"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="text-slate-300 text-sm mb-2 block">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-slate-300"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-slate-300 text-sm mb-2 block">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.02] transition duration-300 shadow-lg disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Links */}
          <div className="mt-8 flex items-center justify-between">
            <Link
              to="/login"
              className="text-cyan-400 font-semibold hover:text-cyan-300 flex items-center text-sm"
            >
              <FaArrowLeft className="mr-2" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
