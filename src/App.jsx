import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { toastOptions } from "./config/toastConfig";
//user part
import DonerLogin from "./components/pages/doner-login/doner-login";
import ForgotEmailPage from "./components/pages/forgot-password-email/forgot-password-email";
import DonerRegister from "./components/pages/doner-register/doner-register";

import HomePage from "./components/pages/home/home-page";
import PublicHomePage from "./components/pages/home-public/home-public";

import HostBloodDrivePage from "./components/pages/host-blood-drive/host-blood-drive";
import NeedBloodPage from "./components/pages/need-blood/need-blood-page";
import BloodDonerProfile from "./components/pages/blood-doner-profile/bloodDonerProfile";
import Gallery from "./components/pages/gallery/gallery";
import ContactPage from "./components/pages/contact/contact-page";
import RegisterOtpPage from "./components/pages/register-otp/register-otp";
import Admin from "./components/layouts/admin";
//admin part
import AdminLogin from "./components/pages/admin-login/admin-login";

import ChatBot from "./components/pages/chat-bot/chat-bot";


import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
     <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={12}
  toastOptions={toastOptions}
/>
<ChatBot/>
      <Routes>
      
        
        <Route exact path="/" element={<PublicRoute><PublicHomePage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><DonerRegister /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><DonerLogin /></PublicRoute>} />

        
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/register-otp" element={<RegisterOtpPage />} />
        <Route path="/need-blood" element={<NeedBloodPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/host-blood-drive" element={<HostBloodDrivePage />} />
        <Route path="/forgot-password" element={<ForgotEmailPage />} />
        
        <Route exact path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/doner-profile" element={<ProtectedRoute><BloodDonerProfile /></ProtectedRoute>} />

        <Route path="/admin-login" element={<AdminLogin/>}/>
        <Route path="/admin/*" element={<Admin />} />
       
          
       
      </Routes>
    </>
  );
}
