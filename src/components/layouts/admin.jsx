import { Route, Routes, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Sidebar from "../sidebar/sidebar";
import PageLoader from "../common/PageLoader";
import AdminProtectedRoute from "../../routes/AdminProtectedRoute";

const Dashboard = lazy(() => import("../views/admin/dashboard"));
const UserManagement = lazy(() => import("../views/admin/user-management"));
const AdminHostBloodDrive = lazy(() => import("../views/admin/host-blood-drive"));
const GalleryManagement = lazy(() => import("../views/admin/gallery-management"));
const ContactManagement = lazy(() => import("../views/admin/contactus-management"));

export default function Admin() {
 
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-off_white min-h-screen pt-16 md:pt-0 overflow-x-hidden">  
        <div className="w-full h-full mx-auto bg-off_white px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-full">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="user-management" element={<UserManagement />} />
              <Route path="camp-management" element={<AdminHostBloodDrive />} />
              <Route path="gallery-management" element={<GalleryManagement />} />
              <Route path="contact-management" element={<ContactManagement />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </>
  );
}