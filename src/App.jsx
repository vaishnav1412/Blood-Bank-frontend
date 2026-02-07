import HomePage from "./components/pages/home/home-page";
import {  Routes, Route } from "react-router-dom";
import DonerLogin from "./components/pages/doner-login/doner-login";
import ForgotEmailPage from "./components/pages/forgot-password-email/forgot-password-email";
import DonerRegister from "./components/pages/doner-register/doner-register";
import HostBloodDrivePage from "./components/pages/host-blood-drive/host-blood-drive";
import NeedBloodPage from "./components/pages/need-blood/need-blood-page";
import ContactPage from "./components/pages/contact/contact-page";
import Admin from "./components/layouts/admin";
import BloodDonerProfile from "./components/pages/blood-doner-profile/bloodDonerProfile";
import Dashboard from "./components/views/admin/dashboard";
import AdminDonateBlood from "./components/views/admin/admin-donate-blood";
import AdminNeedBlood from "./components/views/admin/admin-need-blood";
import AdminHostBloodDrive from "./components/views/admin/admin-host-blood-drive";
import AdminNeedHelp from "./components/views/admin/admin-need-help";
import ForgotOtpPage from "./components/pages/forgot-password-otp/forgot-password-otp";
import RegisterOtpPage from "./components/pages/register-otp/register-otp";
import ForgotPasswordPage from "./components/pages/forgot-password-password/forgotPasswordPassword";
import Gallery from "./components/pages/gallery/gallery";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e1e1e",
            color: "#fff",
            borderRadius: "8px",
            padding: "12px 16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            fontSize: "0.875rem",
            fontFamily: "Manrope, sans-serif",
          },

          success: {
            iconTheme: {
              primary: "#22c55e", // Tailwind green-500
              secondary: "#1e1e1e",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444", // Tailwind red-500
              secondary: "#1e1e1e",
            },
          },

          loading: {
            iconTheme: {
              primary: "#3b82f6", // Tailwind blue-500
              secondary: "#1e1e1e",
            },
          },
        }}
      />

      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/register" element={<DonerRegister />} />
        <Route path="/donate-blood" element={<DonerLogin />} />
        <Route path="/gallery" element={<Gallery/>}/>
        <Route path="/register-otp" element={<RegisterOtpPage />} />
        <Route path="/need-blood" element={<NeedBloodPage />} />
        <Route path="/contact" element={<ContactPage />} />




        <Route path="/host-blood-drive" element={<HostBloodDrivePage />} />



        
        <Route path="/doner-profile" element={<BloodDonerProfile />} />
        <Route path="/resetemail" element={<ForgotEmailPage />} />
        <Route path="/resetotp" element={<ForgotOtpPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />

        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="donate-blood" element={<AdminDonateBlood />} />
          <Route path="need-blood" element={<AdminNeedBlood />} />
          <Route path="host-blood-drive" element={<AdminHostBloodDrive />} />
          <Route path="need-help" element={<AdminNeedHelp />} />
          {/* <Route path="/redirect" element={<Navigate to="/" />} /> */}
        </Route>
      </Routes>
    </>
  );
}
