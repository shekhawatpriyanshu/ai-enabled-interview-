import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8">

          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-3xl shadow-lg">
              🚀
            </div>

            <h1 className="text-4xl font-bold text-white mt-5">
              Create Account
            </h1>

            <p className="text-slate-300 mt-2">
              Start your AI Interview Journey
            </p>
          </div>

          <form
            onSubmit={submitHandler}
            className="space-y-5"
          >
            {/* Name */}
            <div>
              <label className="text-slate-200 text-sm block mb-2">
                Full Name
              </label>

              <input
                name="name"
                type="text"
                value={form.name}
                placeholder="John Doe"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
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
            </div>

            {/* Email */}
            <div>
              <label className="text-slate-200 text-sm block mb-2">
                Email Address
              </label>

              <input
                name="email"
                type="email"
                value={form.email}
                placeholder="john@example.com"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
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
              <label className="text-slate-200 text-sm block mb-2">
                Password
              </label>

              <input
                name="password"
                type="password"
                value={form.password}
                placeholder="Password@123"
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-cyan-500 hover:scale-105 transition duration-300 disabled:opacity-50"
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-300">
              Already have an account?

              <Link
                to="/login"
                className="text-cyan-400 ml-2 font-semibold"
              >
                Login
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;