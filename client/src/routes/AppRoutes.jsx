import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import CreateSweet from "../pages/admin/CreateSweet";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/create"
        element={
          <ProtectedRoute adminOnly>
            <CreateSweet />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
