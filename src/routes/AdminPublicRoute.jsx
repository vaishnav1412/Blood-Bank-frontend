import { Navigate, Outlet } from "react-router-dom";

const AdminPublicRoute = () => {
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminPublicRoute;
