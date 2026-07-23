import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAdminAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h2 className="text-xl font-semibold">
          Loading...
        </h2>
      </div>
    );
  }

  // Check token
  const token = localStorage.getItem("adminToken");

  if (!token || !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  // Extra security
  if (
    admin.role !== "admin" &&
    admin.role !== "super_admin"
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;