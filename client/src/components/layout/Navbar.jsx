import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="w-full bg-gray-900 shadow-xl sticky top-0 z-20 border-b border-cyan-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="text-3xl font-extrabold text-white tracking-widest uppercase hover:text-cyan-400 transition duration-200">
            SweetShop
          </Link>

          <div className="flex items-center justify-center space-x-6">
            {user && (
              <span className="text-gray-400 text-md font-medium hidden md:inline-block">
                Welcome, <span className="text-white font-semibold">{user.name || user.email}!</span>
              </span>
            )}

            <div className="flex items-center space-x-3">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 font-medium text-sm px-3 py-1 hover:text-cyan-400 transition duration-150"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-cyan-600 text-white font-bold rounded-lg shadow-lg uppercase text-sm hover:bg-cyan-500 transition duration-150 active:scale-95"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-700 text-white font-semibold rounded-lg shadow-md uppercase text-sm hover:bg-red-600 transition duration-150 active:scale-95"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}