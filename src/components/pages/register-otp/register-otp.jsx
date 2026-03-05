import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import HeroComponent from "../../sections/hero/hero-component";
import {
  ResetEmailDetails,
  ResetEmailCaptions,
} from "../../../data/content/register-otp";

import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import ContactForm from "../../sections/form/form-component-otp";
import { verifyRegisterOtp,resendRegisterOtp } from "../../../services/donorServices";

const RegisterOtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Email passed from registration page
  const email = location.state?.email;

  

  const [formData, setFormData] = useState({
    otp: ["", "", "", ""],
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  /* ===========================
     OTP Submit Handler
  =========================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Email not found. Please register again.");
      navigate("/register");
      return;
    }

    const otpValue = formData.otp.join("");

    if (otpValue.length !== 4) {
      toast.error("Please enter full 4-digit OTP");
      return;
    }

    if (loading) return;

    setLoading(true);

    const toastId = toast.loading("Verifying OTP...");

    try {
       await verifyRegisterOtp(email, otpValue);
      toast.success("OTP Verified Successfully 🎉", { id: toastId });
      setStatus("Registration completed! Password sent to your email.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      const message =
        error.response?.data?.message || "OTP verification failed.";

      toast.error(message, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
  if (!email) return;

  const toastId = toast.loading("Resending OTP...");

  try {
    await resendRegisterOtp(email);
    toast.success("OTP resent successfully!", { id: toastId });

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to resend OTP",
      { id: toastId }
    );
  }
};

  return (
    <>
      <HeaderComponent />

      <HeroComponent {...ResetEmailCaptions.hero} />

      <ContactForm
        heading={"Almost Done! Confirm Your Email"}
        buttonText={"Complete Registration"}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        status={status}
        resendOtp={handleResendOtp}
      />

      <ContactDetailsComponent contactDetails={ResetEmailDetails} />

      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default RegisterOtpPage;
