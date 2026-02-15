import { Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Dashboard from "../views/admin/dashboard";
import UserManagement from "../views/admin/user-management";
import AdminHostBloodDrive from "../views/admin/host-blood-drive";

export default function Admin() {
  
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-off_white min-h-screen pt-16 md:pt-0 overflow-x-hidden">
        <div className="w-full h-full mx-auto bg-off_white px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-full">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="camp-management" element={<AdminHostBloodDrive />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </div>
      </div>
    </>
  );
}
