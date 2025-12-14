import { useState } from "react";
import { loginUser } from "../services/auth.api";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      return setError("All fields are required");
    }

    try {
      const res = await loginUser(form);
      login(res.data);
      if (res.data.user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const message = err.response?.data?.message || "An unexpected error occurred.";
      setError(message);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <div className="p-8 w-full max-w-md">

        <form
          onSubmit={submit}
          className="bg-white p-8 rounded-xl shadow-2xl border border-pink-100"
        >
          <h2 className="text-3xl font-extrabold text-pink-700 mb-6 text-center">
            Welcome Back!
          </h2>

          {error && (
            <p className="bg-red-100 text-red-600 border border-red-300 p-3 rounded-lg mb-4 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 p-3 rounded-lg transition duration-200 placeholder-gray-500 text-lg"
              placeholder="Email Address"
              onChange={handleChange}
              value={form.email}
              required
            />
            <input
              type="password"
              name="password"
              className="w-full border-2 border-pink-200 focus:border-pink-500 focus:ring-pink-500 p-3 rounded-lg transition duration-200 placeholder-gray-500 text-lg"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-pink-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg transition duration-300 transform active:scale-95"
          >
            Log In
          </button>

          <p className="text-sm mt-5 text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-pink-600 font-semibold underline underline-offset-2 transition duration-200"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}