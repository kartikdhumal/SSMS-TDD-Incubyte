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
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="p-8 w-full max-w-md">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-2xl border border-pink-100"
        >
          <h2 className="text-3xl font-extrabold text-pink-700 mb-6 text-center">
            Create Sweet Account
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 border border-red-300 p-3 rounded-lg mb-4 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              name="name"
              placeholder="Full Name"
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 p-3 rounded-lg transition duration-200 placeholder-gray-500 text-lg"
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 p-3 rounded-lg transition duration-200 placeholder-gray-500 text-lg"
              onChange={handleChange}
              required
            />

            <input
              name="password"
              type="password"
              placeholder="Password (min 6 chars)"
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 p-3 rounded-lg transition duration-200 placeholder-gray-500 text-lg"
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 font-bold py-3 rounded-lg text-lg shadow-lg transition duration-300 transform active:scale-95 ${loading
                ? "bg-pink-300 text-white cursor-not-allowed"
                : "bg-pink-600 text-white hover:bg-pink-700"
              }`}
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-sm text-center mt-5 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-pink-600 font-semibold underline underline-offset-2 transition duration-200"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}