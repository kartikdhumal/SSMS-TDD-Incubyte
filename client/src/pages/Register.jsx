import { useState } from "react";
import { registerUser } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);
      const res = await registerUser(form);
      login(res.data);
      navigate("/");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-800"
        >
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">
            Create Sweet Account
          </h2>

          {error && (
            <p className="bg-red-900/50 text-red-400 border border-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              className="w-full bg-gray-700 text-white border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 p-3 rounded-lg transition duration-200 placeholder-gray-400 text-lg"
              onChange={handleChange}
              value={form.name}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full bg-gray-700 text-white border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 p-3 rounded-lg transition duration-200 placeholder-gray-400 text-lg"
              onChange={handleChange}
              value={form.email}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              className="w-full bg-gray-700 text-white border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 p-3 rounded-lg transition duration-200 placeholder-gray-400 text-lg"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 font-bold py-3 rounded-lg text-lg shadow-lg uppercase transition duration-300 transform active:scale-95 ${loading
                ? "bg-cyan-800 text-gray-400 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-500"
              }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-center mt-5 text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-cyan-400 font-semibold underline underline-offset-4 transition duration-200 hover:text-cyan-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}