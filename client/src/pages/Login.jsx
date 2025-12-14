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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 w-full max-w-md">

        <form
          onSubmit={submit}
          className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-cyan-800"
        >
          <h2 className="text-3xl font-extrabold text-white mb-6 text-center tracking-wide">
            Login to SweetShop
          </h2>

          {error && (
            <p className="bg-red-900/50 text-red-400 border border-red-700 p-3 rounded-lg mb-4 text-sm font-medium">
              {error}
            </p>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              className="w-full bg-gray-700 text-white border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 p-3 rounded-lg transition duration-200 placeholder-gray-400 text-lg"
              placeholder="Email Address"
              onChange={handleChange}
              value={form.email}
              required
            />
            <input
              type="password"
              name="password"
              className="w-full bg-gray-700 text-white border-2 border-gray-600 focus:border-cyan-500 focus:ring-cyan-500 p-3 rounded-lg transition duration-200 placeholder-gray-400 text-lg"
              placeholder="Password"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-cyan-600 text-white font-bold py-3 rounded-lg text-lg shadow-lg uppercase transition duration-300 transform hover:bg-cyan-500 active:scale-95"
          >
            Log In
          </button>

          <p className="text-sm mt-5 text-center text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 font-semibold underline underline-offset-4 transition duration-200 hover:text-cyan-300"
            >
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}