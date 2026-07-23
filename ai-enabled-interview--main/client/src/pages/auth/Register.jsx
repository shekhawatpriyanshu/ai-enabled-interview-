import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);

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
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {
      alert("All fields are required");
      return;
    }

    if (
      errors.name ||
      errors.email ||
      errors.password
    ) {
      return;
    }

    try {
      setLoading(true);

      const data = await register(form);

      alert(
        data.message ||
          "Registration Successful"
      );

      navigate("/login");
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        const backendErrors = {};

        error.response.data.errors.forEach(
          (err) => {
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
          }
        );

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));
      } else {
        alert(
          error.response?.data?.message ||
            "Registration Failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          x: [0, 40, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"
      ></motion.div>

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"
      ></motion.div>

      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8"
        >

          <div className="text-center mb-8">
            <motion.div
              whileHover={{ scale: 1.15, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg cursor-pointer"
            >
              🚀
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="text-4xl font-bold text-white mt-5"
            >
              Create Account
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-slate-300 mt-2"
            >
              Start your LeetChef Journey
            </motion.p>
          </div>

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <label className="text-slate-200 text-sm block mb-2">
                Full Name
              </label>

              <input
                name="name"
                type="text"
                value={form.name}
                placeholder="John Doe"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200 ${
                  errors.name
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />

              {errors.name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <label className="text-slate-200 text-sm block mb-2">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                placeholder="john@example.com"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200 ${
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
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="text-slate-200 text-sm block mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                placeholder="Password@123"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition duration-200 ${
                  errors.password
                    ? "border-red-500"
                    : "border-white/20"
                }`}
              />

              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </motion.div>

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
                className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 shadow-lg disabled:opacity-50 cursor-pointer"
              >
                {loading
                  ? "Creating Account..."
                  : "Create Account"}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-6 text-center"
          >
            <p className="text-slate-300">
              Already have an account?

              <Link
                to="/login"
                className="text-cyan-400 ml-2 font-semibold hover:text-cyan-300 transition duration-200"
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