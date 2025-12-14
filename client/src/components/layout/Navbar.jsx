import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-pink-600 shadow-lg sticky top-0 z-10">
      <Link to="/" className="text-3xl font-extrabold text-white tracking-wider">
        SweetShop
      </Link>

      <div className="flex items-center space-x-6">
        {user && user.role === 'admin' && (
          <Link 
            to="/admin/dashboard" 
            className="text-yellow-300 font-semibold text-lg uppercase transition duration-150"
          >
            Admin Dashboard
          </Link>
        )}
        
        {user && (
          <span className="text-white text-md font-medium hidden sm:inline">
            Hello, {user.name || user.email}!
          </span>
        )}

        {!user ? (
          <>
            <Link 
              to="/login" 
              className="text-white text-md font-medium py-1 transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-yellow-400 text-pink-700 font-bold rounded-lg shadow-md uppercase text-sm transition duration-150"
            >
              Register
            </Link>
          </>
        ) : (
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-400 text-white font-semibold rounded-lg shadow-md uppercase text-sm transition duration-150"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}