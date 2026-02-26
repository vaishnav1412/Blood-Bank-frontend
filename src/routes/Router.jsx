import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Common Components
import PageLoader from "../components/common/PageLoader";
import ScrollToTop from "../components/common/ScrollTop";

// Route Guards
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminPublicRoute from "./AdminPublicRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";

// --- LAZY LOADING (Note: Corrected spelling to 'Donor') ---
const DonorLogin = lazy(() => import("../components/pages/doner-login/doner-login"));
const ForgotEmailPage = lazy(() => import("../components/pages/forgot-password-email/forgot-password-email"));
const DonorRegister = lazy(() => import("../components/pages/doner-register/doner-register"));
const HomePage = lazy(() => import("../components/pages/home/home-page"));
const PublicHomePage = lazy(() => import("../components/pages/home-public/home-public"));
const HostBloodDrivePage = lazy(() => import("../components/pages/host-blood-drive/host-blood-drive"));

const NeedBloodPage = lazy(() => import("../components/pages/need-blood/need-blood-page"));
const BloodDonorProfile = lazy(() => import("../components/pages/blood-doner-profile/bloodDonerProfile"));
const Gallery = lazy(() => import("../components/pages/gallery/gallery"));
const ContactPage = lazy(() => import("../components/pages/contact/contact-page"));
const ContactPagePrivate = lazy(() => import("../components/pages/contact/contact-page-private"));
const RegisterOtpPage = lazy(() => import("../components/pages/register-otp/register-otp"));
const Admin = lazy(() => import("../components/layouts/admin"));
const AdminLogin = lazy(() => import("../components/pages/admin-login/admin-login"));
const ChatBot = lazy(() => import("../components/pages/chat-bot/chat-bot"));
const NotFound = lazy(() => import("../components/pages/not-found/not-found"));

const AppRouter = () => {
  return (
    <>
      {/* ChatBot loads independently in the background */}
      <Suspense fallback={null}>
        <ChatBot />
      </Suspense>

      {/* Scrolls to top on route change */}
      <ScrollToTop />

      {/* Main Application Routes */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* --- Public Routes --- */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <PublicHomePage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <DonorRegister />
              </PublicRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <DonorLogin />
              </PublicRoute>
            }
          />
          <Route
            path="/register-otp"
            element={
              <PublicRoute>
                <RegisterOtpPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotEmailPage />
              </PublicRoute>
            }
          />
          
          {/* --- Accessible to Everyone (No Auth Guard needed) --- */}
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/need-blood" element={<NeedBloodPage />} />
          <Route path="/host-blood-drive" element={<HostBloodDrivePage />} />
          
          {/* Contact Pages */}
          <Route
            path="/contact"
            element={
              <PublicRoute>
                <ContactPage />
              </PublicRoute>
            }
          />
          <Route
            path="/contact-private"
            element={
              <ProtectedRoute>
                <ContactPagePrivate />
              </ProtectedRoute>
            }
          />

          {/* --- Protected Routes (Require Login) --- */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donor-profile"
            element={
              <ProtectedRoute>
                <BloodDonorProfile />
              </ProtectedRoute>
            }
          />

          {/* --- Admin Routes --- */}
          <Route path="/admin-login" element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
          <Route path="/admin/*" element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>} />

          {/* --- 404 Not Found --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
};

export default AppRouter;