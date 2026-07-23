import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaRobot,
  FaEye,
  FaEyeSlash,
  FaBan,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showPassword, setShowPassword] =
    useState(false);

  const [isBlocked, setIsBlocked] = useState(false);

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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("blocked") === "true") {
      setIsBlocked(true);
    }
  }, []);

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

      if (error.response?.data?.isBlocked) {
        setIsBlocked(true);
        return;
      }

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
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 blur-3xl rounded-full"
      ></motion.div>

      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"
      ></motion.div>

      <div className="relative w-full max-w-md">
        {isBlocked ? (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="flex justify-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="h-20 w-20 rounded-2xl bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center shadow-lg"
              >
                <FaBan className="text-white text-4xl" />
              </motion.div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">Account Blocked</h1>
            
            <p className="text-slate-300 mb-8 leading-relaxed">
              Your account has been deactivated or blocked by the administrator. If you believe this is an error or wish to request activation, please contact our support team.
            </p>

            <button
              onClick={() => {
                setIsBlocked(false);
                navigate("/login", { replace: true });
              }}
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 py-3 rounded-xl transition font-medium"
            >
              Back to Login
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl"
          >

            {/* Logo */}
            <div className="flex justify-center mb-6">
              <motion.div
                whileHover={{ scale: 1.15, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
                className="h-20 w-20 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg cursor-pointer"
              >
                <FaRobot className="text-white text-4xl" />
              </motion.div>
            </div>

            {/* Heading */}
            <div className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="text-4xl font-bold text-white"
              >
                Welcome Back
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-slate-300 mt-2"
              >
                Continue your LeetChef Journey
              </motion.p>
            </div>

            <form
              onSubmit={submitHandler}
              className="space-y-5"
            >

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                <label className="text-slate-300 text-sm mb-2 block">
                  Email Address
                </label>

                <input
                  name="email"
                  type="email"
                  value={form.email}
                  placeholder="john@example.com"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200 ${
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
              </motion.div>

              {/* Password */}
              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
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
                    className={`w-full px-4 py-3 rounded-xl bg-white/10 border text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200 ${
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
                    className="absolute right-4 top-4 text-slate-300 hover:text-white transition duration-200"
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
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex justify-end"
              >
                <Link
                  to="/forgot-password"
                  className="text-cyan-400 text-sm hover:text-cyan-300 transition duration-200"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg disabled:opacity-50 cursor-pointer"
                >
                  {loading
                    ? "Signing In..."
                    : "Sign In"}
                </motion.button>
              </motion.div>
            </form>

          
            {/* Register Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="text-center mt-8"
            >
              <p className="text-slate-300">
                Don't have an account?

                <Link
                  to="/register"
                  className="text-cyan-400 font-semibold ml-2 hover:text-cyan-300 transition duration-200"
                >
                  Create Account
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