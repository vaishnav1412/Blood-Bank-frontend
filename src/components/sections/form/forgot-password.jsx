import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import {
  FaEnvelope,
  FaKey,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaPaperPlane,
  FaClock,
  FaExclamationTriangle,
} from "react-icons/fa";
import "./forgot-password";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const ForgotPasswordForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false); 
  const [timer, setTimer] = useState(0);
  const [otpSent, setOtpSent] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && otpSent) {
      setResendAvailable(true);
    }
    return () => clearInterval(interval);
  }, [timer, otpSent]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "newPassword" || name === "confirmPassword") {
      setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const validateEmail = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    return newErrors;
  };

  const validateOTP = () => {
    const newErrors = {};
    if (!formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    } else if (!/^\d{6}$/.test(formData.otp)) {
      newErrors.otp = "OTP must contain only numbers";
    }
    return newErrors;
  };

  const validatePassword = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!formData.newPassword.trim()) {
      newErrors.newPassword = "Password is required";
    } else if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSendOTP = async () => {
    const emailErrors = validateEmail();
    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors);
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Sending OTP to your email...");
    try {
      const response = await axios.post(
        "http://localhost:5000/doner/send-otp",
        {
          email: formData.email,
          purpose: "password_reset",
        },
      );
      if (response.data.success) {
        console.log("OTP sent to:", formData.email);
        setOtpSent(true);
        setTimer(60); 
        setResendAvailable(false);
        setStep(2);
        toast.success(`OTP sent successfully `, {
          id: toastId,
          duration: 4000,
        });
      } else {
        toast.error(
          response.data.message || "Failed to send OTP. Please try again.",
          {
            id: toastId,
            duration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Failed to send OTP:", error);
      let errorMessage =
        "Failed to send OTP. Please check your email address or try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "Network error. Please check your connection.";
      }
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    const otpErrors = validateOTP();
    if (Object.keys(otpErrors).length > 0) {
      setErrors(otpErrors);
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Verifying OTP...");
    try {
      const response = await axios.post(
        "http://localhost:5000/doner/verify-forgot-otp",
        {
          email: formData.email,
          otp: formData.otp,
        },
      );
      if (response.data.success) {
        console.log("OTP verified successfully");
        setUserId(response.data.userId); 
        setStep(3);
        toast.success("OTP verified successfully!", {
          id: toastId,
          duration: 3000,
        });
      } else {
        setErrors({
          otp: response.data.message || "Invalid OTP. Please try again.",
        });
        toast.error(response.data.message || "Invalid OTP. Please try again.", {
          id: toastId,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("OTP verification failed:", error);
      setErrors({ otp: "Verification failed. Please try again." });

      let errorMessage = "Verification failed. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!resendAvailable) return;
     setIsResending(true);
    const toastId = toast.loading("Sending new OTP...");
    try {
      const response = await axios.post(
        "http://localhost:5000/doner/resend-otp",
        {
          email: formData.email,
        },
      );
      if (response.data.success) {
        console.log("Resending OTP to:", formData.email);
        setTimer(60);
        setResendAvailable(false);
       
        toast.success("New OTP sent successfully!", {
          id: toastId,
          duration: 3000,
        });
      } else {
        toast.error(response.data.message || "Failed to resend OTP.", {
          id: toastId,
          duration: 5000,
        });
      }
    } catch (error) {
      console.error("Failed to resend OTP:", error);
      let errorMessage = "Failed to resend OTP. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    } finally {
       setIsResending(false);
    }
  };

  const handleResetPassword = async () => {
    const passwordErrors = validatePassword();
    if (Object.keys(passwordErrors).length > 0) {
      setErrors(passwordErrors);
      return;
    }
    setIsLoading(true);
    const toastId = toast.loading("Resetting your password...");
    try {
      const response = await axios.post(
        "http://localhost:5000/doner/reset-password",
        {
          userId: userId,
          email: formData.email,
          newPassword: formData.newPassword,
          otp: formData.otp,
        },
      );
      if (response.data.success) {
        console.log("Password reset successful for:", formData.email);
        setStep(4);
        toast.success("Password reset successfully! Redirecting to login...", {
          id: toastId,
          duration: 3000,
        });
      } else {
        toast.error(
          response.data.message ||
            "Failed to reset password. Please try again.",
          {
            id: toastId,
            duration: 5000,
          },
        );
      }
    } catch (error) {
      console.error("Password reset failed:", error);
      let errorMessage = "Failed to reset password. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = "/login";
  };
  
  const renderStep = () => {
    switch (step) {
      case 1: // Email Input
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Reset Your Password
              </h3>
              <p className="text-gray-600">
                Enter your email address and we'll send you an OTP to reset your
                password.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaEnvelope className="mr-2 text-pink-500" />
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-4 pl-12 border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Security Tips */}
              <div className="bg-sky-300 border border-blue-200 rounded-xl p-4">
                <h4 className="font-bold  mb-2 flex items-center">
                  <FaShieldAlt className="mr-2  " />
                  Security Tips
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Check your spam folder if you don't see our email</li>
                  <li>• OTP will expire in 10 minutes</li>
                  <li>• Never share your OTP with anyone</li>
                </ul>
              </div>
            </div>

           <button
  onClick={handleSendOTP}
  disabled={isLoading}
  className={`relative w-full mt-6 py-4 rounded-xl font-bold transition-all duration-500 ease-in-out overflow-hidden group ${
    !isLoading
      ? `bg-gradient-to-r from-pink-600 via-pink-700 to-pink-600 bg-[length:200%_100%]
         hover:bg-[length:100%_100%] text-white shadow-lg
         hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5
         before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 
         before:via-white/20 before:to-white/0 before:translate-x-[-200%] 
         hover:before:translate-x-[200%] before:transition-transform before:duration-1000
         animate-gradient-x`
      : "bg-gradient-to-r from-pink-600/50 to-pink-700/50 text-white cursor-not-allowed"
  }`}
>
  {/* Animated background shine effect for enabled state */}
  {!isLoading && (
    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  )}
  
  <span className="relative flex items-center justify-center">
    {isLoading ? (
      <>
        <FaSpinner className="animate-spin mr-3" />
        Sending OTP...
      </>
    ) : (
      <>
        <FaPaperPlane className="mr-2 group-hover:animate-pulse" />
        <span className="relative">
          Send OTP
          {/* Underline animation */}
          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
        </span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300">↗</span>
      </>
    )}
  </span>
</button>
          </div>
        );

      case 2: // OTP Verification
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaKey className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Enter Verification Code
              </h3>
              <p className="text-gray-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-4">
              {/* OTP Input */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaKey className="mr-2 text-pink-500" />
                  6-Digit OTP *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`w-full p-4 text-center text-2xl font-bold tracking-widest border ${errors.otp ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {formData.otp.length === 6 && !errors.otp && (
                    <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500" />
                  )}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" /> {errors.otp}
                  </p>
                )}

                {/* OTP Timer */}
                <div className="mt-3 flex items-center justify-center">
                  <FaClock className="text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {timer > 0 ? (
                      <>
                        Code expires in{" "}
                        <span className="font-bold text-pink-600">
                          {timer}s
                        </span>
                      </>
                    ) : (
                      <span className="text-red-500">OTP expired</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Resend OTP */}
              <button
  onClick={handleResendOTP}
  disabled={!resendAvailable || isResending}
  className={`relative w-full py-4 rounded-xl font-medium transition-all duration-700 ease-in-out overflow-hidden group ${
    resendAvailable
      ? `bg-gradient-to-r from-sky-400 via-blue-500 to-sky-400 bg-[length:200%_100%]
         hover:bg-[length:100%_100%] text-white font-bold shadow-lg
         hover:shadow-2xl hover:shadow-blue-500/30 transform hover:-translate-y-0.5
         before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 
         before:via-white/20 before:to-white/0 before:translate-x-[-200%] 
         hover:before:translate-x-[200%] before:transition-transform before:duration-1000
         animate-gradient-x`
      : "bg-gradient-to-r from-sky-50 to-sky-100 text-slate-400 cursor-not-allowed border border-sky-200"
  }`}
>
  {/* Animated background shine effect for available state */}
  {resendAvailable && (
    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  )}
  
  <span className="relative flex items-center justify-center">
    {isResending ? (
      <>
        <FaSpinner className="animate-spin mr-2" />
        Sending new code...
      </>
    ) : resendAvailable ? (
      <>
        <FaPaperPlane className="mr-2 animate-pulse" />
        <span className="relative">
          Resend OTP
          {/* Underline animation */}
          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-300" />
        </span>
        
      </>
    ) : (
      <>
        <FaClock className="mr-2" />
        Resend OTP
      </>
    )}
  </span>
</button>

              {/* Change Email */}
             <button
  onClick={() => setStep(1)}
  className="relative w-full py-3.5 rounded-xl font-medium transition-all duration-500 ease-in-out overflow-hidden group bg-gradient-to-r from-pink-50/0 via-rose-50/0 to-pink-50/0 hover:from-pink-50/30 hover:via-rose-50/20 hover:to-pink-50/30 border border-transparent hover:border-pink-200/50"
>
  {/* Double shimmer effect */}
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-pink-100/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-rose-100/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out delay-150" />
  
  {/* Border glow effect */}
  <span className="absolute inset-0 rounded-xl border border-transparent group-hover:border-pink-300/30 transition-all duration-300" />
  
  {/* Animated dots */}
  <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300" />
  <span className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 bg-rose-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300 delay-100" />
  
  <span className="relative flex items-center justify-center text-pink-600 group-hover:text-pink-700 font-medium group-hover:font-semibold">
    {/* Left arrow with animation */}
    <span className="mr-2 transform group-hover:-translate-x-2 transition-transform duration-300 ease-out group-hover:scale-110">
      <svg 
        className="w-5 h-5 text-pink-500 group-hover:text-pink-600 transition-colors duration-300"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
    </span>
    
    {/* Text with underline */}
    <span className="relative">
      Use different email
      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500 ease-out rounded-full" />
    </span>
    
    {/* Email icon that appears on hover */}
    <span className="ml-2 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300 ease-out">
      <FaEnvelope className="w-4 h-4 text-pink-500 group-hover:animate-pulse" />
    </span>
  </span>
</button>
            </div>

         <button
  onClick={handleVerifyOTP}
  disabled={isLoading || formData.otp.length !== 6}
  className={`relative w-full mt-6 py-4 rounded-xl font-bold transition-all duration-500 ease-in-out overflow-hidden group ${
    !(isLoading || formData.otp.length !== 6)
      ? `bg-pink-600 hover:bg-pink-700 text-white shadow-lg
         hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5`
      : "bg-pink-600/70 text-white cursor-not-allowed opacity-70"
  }`}
>
  {/* White shine layer - EXACTLY like resend button */}
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  </div>
  
  {/* Optional: Add the before pseudo-element as a div */}
  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 opacity-50" />
  
  <span className="relative flex items-center justify-center">
    {isLoading ? (
      <>
        <FaSpinner className="animate-spin mr-3" />
        Verifying...
      </>
    ) : (
      <>
        <span className="relative">
          Verify OTP
          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
        </span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300">→</span>
      </>
    )}
  </span>
</button>
          </div>
        );

      case 3: // New Password
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Create New Password
              </h3>
              <p className="text-gray-600">
                Create a strong password to secure your account.
              </p>
            </div>

            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaKey className="mr-2 text-pink-500" />
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className={`w-full p-4 border ${errors.newPassword ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />{" "}
                    {errors.newPassword}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                      <span>Password strength:</span>
                      <span
                        className={`font-bold ${
                          formData.newPassword.length < 8
                            ? "text-red-500"
                            : formData.newPassword.length < 12
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {formData.newPassword.length < 8
                          ? "Weak"
                          : formData.newPassword.length < 12
                            ? "Medium"
                            : "Strong"}
                      </span>
                    </div>
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          formData.newPassword.length < 8
                            ? "bg-red-500 w-1/3"
                            : formData.newPassword.length < 12
                              ? "bg-yellow-500 w-2/3"
                              : "bg-green-500 w-full"
                        } transition-all duration-300`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <FaKey className="mr-2 text-pink-500" />
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full p-4 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all`}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <FaExclamationTriangle className="mr-1" />{" "}
                    {errors.confirmPassword}
                  </p>
                )}

                {/* Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center text-sm">
                    {formData.newPassword === formData.confirmPassword ? (
                      <span className="text-green-600 flex items-center">
                        <FaCheckCircle className="mr-1" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" /> Passwords
                        don't match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h4 className="font-bold text-gray-800 mb-2 text-sm">
                  Password Requirements:
                </h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li
                    className={
                      formData.newPassword.length >= 8 ? "text-green-600" : ""
                    }
                  >
                    • At least 8 characters long
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    • One uppercase letter (A-Z)
                  </li>
                  <li
                    className={
                      /[a-z]/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    • One lowercase letter (a-z)
                  </li>
                  <li
                    className={
                      /\d/.test(formData.newPassword) ? "text-green-600" : ""
                    }
                  >
                    • One number (0-9)
                  </li>
                  <li
                    className={
                      /[@$!%*?&]/.test(formData.newPassword)
                        ? "text-green-600"
                        : ""
                    }
                  >
                    • One special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-3" />
                  Resetting Password...
                </>
              ) : (
                <>
                  <FaShieldAlt className="mr-3" />
                  Reset Password
                </>
              )}
            </button>
          </div>
        );

      case 4: // Success
        return (
          <div className="form-step animate-fade-in text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-white text-3xl" />
            </div>

            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Password Reset Successful!
            </h3>

            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You can now log in with
              your new password.
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-green-700">
                <span className="font-bold">Security Alert:</span> If you didn't
                request this change, please contact our support team
                immediately.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-xl"
            >
              ← Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WrapperSection>
      <div className="forgot-password-wrapper bg-gradient-to-b from-white to-pink-200 md:-mt-[420px] -mt-[650px] rounded-3xl p-4 sm:p-8 lg:p-12 shadow-2xl shadow-pink-500/10">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-3">
              <span className="text-pink-600">Reset</span> Password
            </h2>
            <p className="text-gray-600">
              Follow the steps to securely reset your password
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className="flex flex-col items-center relative"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold z-10 transition-all ${
                      step >= stepNum
                        ? "bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {stepNum}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                    {stepNum === 1 && "Email"}
                    {stepNum === 2 && "OTP"}
                    {stepNum === 3 && "Password"}
                    {stepNum === 4 && "Done"}
                  </span>
                  {stepNum < 4 && (
                    <div
                      className={`absolute top-5 left-12 w-16 sm:w-20 h-0.5 ${step > stepNum ? "bg-pink-500" : "bg-gray-300"} hidden sm:block`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100">
            {renderStep()}

            {/* Additional Help */}
            {step !== 4 && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-gray-600 text-sm mb-3">
                    Need help? Contact our support team
                  </p>
                  <a
                    href="mailto:support@bloodbank.com"
                    className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                  >
                    support@bloodbank.com
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-pink-400 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start">
              <FaShieldAlt className="text-blue-500 mt-1 mr-3" />
              <div>
                <h4 className="font-bold text-blue-800 text-sm mb-1">
                  Security Notice
                </h4>
                <p className="text-blue-700 text-xs">
                  For security reasons, password reset links are only valid for
                  10 minutes. Always ensure you're on the official website
                  before entering your credentials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrapperSection>
  );
};

export default ForgotPasswordForm;
