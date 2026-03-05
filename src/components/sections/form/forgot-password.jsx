import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  FaEnvelope,
  FaKey,
  FaCheckCircle,
  FaSpinner,
  FaShieldAlt,
  FaPaperPlane,
  FaClock,
  FaExclamationTriangle,
  FaArrowLeft,
  FaLock,
  
} from "react-icons/fa";
import {
  sendForgotOtp,
  verifyForgotOtp,
  resetForgotPassword,
} from "../../../services/donorServices";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import "./forgot-password.scss";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { useNavigate } from "react-router-dom";

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
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();

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
      setFormData((prev) => ({ ...prev, [name]: value }));
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
      const response = await sendForgotOtp(formData.email);
      if (response.success) {
        setOtpSent(true);
        setTimer(60);
        setResendAvailable(false);
        setStep(2);
        toast.success(`OTP sent successfully to ${formData.email}`, {
          id: toastId,
          duration: 4000,
        });
      } else {
        toast.error(
          response.message || "Failed to send OTP. Please try again.",
          {
            id: toastId,
            duration: 5000,
          }
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
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
      const response = await verifyForgotOtp(formData.email, formData.otp);
      if (response.success) {
        console.log("OTP verified successfully");
        setUserId(response.userId);
        setStep(3);
        toast.success("OTP verified successfully!", {
          id: toastId,
          duration: 3000,
        });
      } else {
        setErrors({
          otp: response.message || "Invalid OTP. Please try again.",
        });
        toast.error(response.message || "Invalid OTP. Please try again.", {
          id: toastId,
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!resendAvailable) return;
    setIsResending(true);
    const toastId = toast.loading("Sending new OTP...");
    try {
      const response = await sendForgotOtp(formData.email);

      if (response.success) {
        setTimer(60);
        setResendAvailable(false);

        toast.success("New OTP sent successfully!", { id: toastId });
      } else {
        toast.error(response.message || "Failed to resend OTP.", {
          id: toastId,
          duration: 5000,
        });
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
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
      const response = await resetForgotPassword({
        userId,
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });
      if (response.success) {
        console.log("Password reset successful for:", formData.email);
        setStep(4);
        toast.success("Password reset successfully! Redirecting to login...", {
          id: toastId,
          duration: 3000,
        });
      } else {
        toast.error(
          response.message || "Failed to reset password. Please try again.",
          {
            id: toastId,
            duration: 5000,
          }
        );
      }
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  const getPasswordStrength = () => {
    const password = formData.newPassword;
    if (!password) return { strength: 0, label: "", color: "" };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    if (score <= 2) return { strength: 33, label: "Weak", color: "from-rose-500 to-rose-600" };
    if (score <= 4) return { strength: 66, label: "Medium", color: "from-amber-500 to-amber-600" };
    return { strength: 100, label: "Strong", color: "from-emerald-500 to-emerald-600" };
  };

  const renderStep = () => {
    switch (step) {
      case 1: // Email Input
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-8">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <FaEnvelope className="text-white text-3xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Reset Your Password
              </h3>
              <p className="text-slate-600">
                Enter your email address and we'll send you a 6-digit code to reset your password.
              </p>
            </div>

            <div className="space-y-5">
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'email' ? 'opacity-30' : ''}`}></div>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full p-4 pl-12 border-2 bg-white/90 backdrop-blur-sm ${
                      errors.email 
                        ? "border-rose-400 focus:border-rose-600" 
                        : focusedField === 'email'
                        ? "border-pink-400 shadow-lg shadow-pink-100"
                        : "border-slate-300 hover:border-pink-300"
                    } rounded-xl focus:ring-0 transition-all duration-300`}
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                  <FaEnvelope className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'email' ? 'text-pink-500' : 'text-slate-400'
                  }`} />
                </div>
                {errors.email && (
                  <p className="error-message text-rose-600 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Security Tips */}
              <div className="relative mt-6">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                    <FaShieldAlt className="text-pink-500" />
                    Security Tips
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                      Check your spam folder if you don't see our email
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                      OTP will expire in 10 minutes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                      Never share your OTP with anyone
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className={`relative w-full mt-8 py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                !isLoading
                  ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed opacity-70"
              }`}
            >
              {!isLoading && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wide">Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="group-hover:animate-pulse" />
                    <span className="relative">
                      Send OTP
                      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        );

      case 2: // OTP Verification
        const passwordStrength = getPasswordStrength();
        
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-8">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <FaKey className="text-white text-3xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Enter Verification Code
              </h3>
              <p className="text-slate-600">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-pink-600">{formData.email}</span>
              </p>
            </div>

            <div className="space-y-5">
              {/* OTP Input */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'otp' ? 'opacity-30' : ''}`}></div>
                <div className="relative">
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('otp')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full p-4 text-center text-2xl font-bold tracking-[0.5em] border-2 bg-white/90 backdrop-blur-sm ${
                      errors.otp 
                        ? "border-rose-400 focus:border-rose-600" 
                        : focusedField === 'otp'
                        ? "border-pink-400 shadow-lg shadow-pink-100"
                        : "border-slate-300 hover:border-pink-300"
                    } rounded-xl focus:ring-0 transition-all duration-300`}
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                  />
                  {formData.otp.length === 6 && !errors.otp && (
                    <FaCheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500 animate-bounce" />
                  )}
                </div>
                {errors.otp && (
                  <p className="error-message text-rose-600 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.otp}
                  </p>
                )}

                {/* OTP Timer */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                  <FaClock className={`${timer > 0 ? 'text-pink-500' : 'text-rose-500'} animate-pulse`} />
                  <span className="text-slate-600">
                    {timer > 0 ? (
                      <>
                        Code expires in{" "}
                        <span className="font-bold text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">
                          {timer}s
                        </span>
                      </>
                    ) : (
                      <span className="text-rose-500 font-medium">OTP expired</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Resend OTP */}
              <button
                onClick={handleResendOTP}
                disabled={!resendAvailable || isResending}
                className={`relative w-full py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                  resendAvailable
                    ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                    : "bg-gradient-to-r from-slate-200 to-slate-300 text-slate-500 cursor-not-allowed opacity-70"
                }`}
              >
                {resendAvailable && (
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                )}

                <span className="relative flex items-center justify-center gap-2">
                  {isResending ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span className="tracking-wide">Sending new code...</span>
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className={resendAvailable ? "group-hover:animate-pulse" : ""} />
                      <span className="relative">
                        {resendAvailable ? "Resend OTP" : "Resend OTP"}
                        {resendAvailable && (
                          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                        )}
                      </span>
                    </>
                  )}
                </span>
              </button>

              {/* Change Email */}
              <button
                onClick={() => setStep(1)}
                className="relative w-full py-3.5 rounded-xl font-medium transition-all duration-500 overflow-hidden group bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border border-pink-200 hover:border-pink-300"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-pink-200/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <span className="relative flex items-center justify-center gap-2 text-pink-600 group-hover:text-pink-700 font-medium">
                  <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform duration-300" />
                  <span className="relative">
                    Use different email
                    <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-pink-400 to-purple-400 transition-all duration-500" />
                  </span>
                  <FaEnvelope className="opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-300" />
                </span>
              </button>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={isLoading || formData.otp.length !== 6}
              className={`relative w-full mt-6 py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                !(isLoading || formData.otp.length !== 6)
                  ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed opacity-70"
              }`}
            >
              {!(isLoading || formData.otp.length !== 6) && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wide">Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    <span className="relative">
                      Verify OTP
                      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        );

      case 3: // New Password
        const strength = getPasswordStrength();
        
        return (
          <div className="form-step animate-fade-in">
            <div className="text-center mb-8">
              <div className="relative inline-flex mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
                  <FaLock className="text-white text-3xl" />
                </div>
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Create New Password
              </h3>
              <p className="text-slate-600">
                Create a strong password to secure your account
              </p>
            </div>

            <div className="space-y-5">
              {/* New Password */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'newPassword' ? 'opacity-30' : ''}`}></div>
                <div className="relative">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('newPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full p-4 pl-12 border-2 bg-white/90 backdrop-blur-sm ${
                      errors.newPassword 
                        ? "border-rose-400 focus:border-rose-600" 
                        : focusedField === 'newPassword'
                        ? "border-pink-400 shadow-lg shadow-pink-100"
                        : "border-slate-300 hover:border-pink-300"
                    } rounded-xl focus:ring-0 transition-all duration-300`}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                  <FaLock className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'newPassword' ? 'text-pink-500' : 'text-slate-400'
                  }`} />
                </div>
                {errors.newPassword && (
                  <p className="error-message text-rose-600 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.newPassword}
                  </p>
                )}

                {/* Password Strength Indicator */}
                {formData.newPassword && (
                  <div className="mt-3 password-strength">
                    <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                      <span>Password strength:</span>
                      <span className={`font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${strength.color} text-white`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${strength.color} transition-all duration-500`}
                        style={{ width: `${strength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative group">
                <div className={`absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 ${focusedField === 'confirmPassword' ? 'opacity-30' : ''}`}></div>
                <div className="relative">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full p-4 pl-12 border-2 bg-white/90 backdrop-blur-sm ${
                      errors.confirmPassword 
                        ? "border-rose-400 focus:border-rose-600" 
                        : focusedField === 'confirmPassword'
                        ? "border-pink-400 shadow-lg shadow-pink-100"
                        : "border-slate-300 hover:border-pink-300"
                    } rounded-xl focus:ring-0 transition-all duration-300`}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                  />
                  <FaKey className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedField === 'confirmPassword' ? 'text-pink-500' : 'text-slate-400'
                  }`} />
                </div>
                {errors.confirmPassword && (
                  <p className="error-message text-rose-600 text-xs mt-2 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {errors.confirmPassword}
                  </p>
                )}

                {/* Match Indicator */}
                {formData.confirmPassword && (
                  <div className="mt-2 flex items-center text-xs ml-1">
                    {formData.newPassword === formData.confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <FaCheckCircle className="text-emerald-500" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1">
                        <FaExclamationTriangle className="text-rose-500" /> Passwords don't match
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="relative mt-4">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
                <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-pink-100 shadow-lg">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-pink-500 to-purple-500 rounded-full"></div>
                    <FaShieldAlt className="text-pink-500" />
                    Password Requirements
                  </h4>
                  <ul className="text-xs text-slate-600 space-y-2">
                    {[
                      { text: "At least 8 characters long", test: formData.newPassword?.length >= 8 },
                      { text: "One uppercase letter (A-Z)", test: /[A-Z]/.test(formData.newPassword) },
                      { text: "One lowercase letter (a-z)", test: /[a-z]/.test(formData.newPassword) },
                      { text: "One number (0-9)", test: /\d/.test(formData.newPassword) },
                      { text: "One special character (@$!%*?&)", test: /[@$!%*?&]/.test(formData.newPassword) },
                    ].map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${req.test ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span className={req.test ? 'text-emerald-600' : 'text-slate-600'}>
                          {req.text}
                        </span>
                        {req.test && <FaCheckCircle className="text-emerald-500 text-[10px]" />}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={isLoading}
              className={`relative w-full mt-6 py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                !isLoading
                  ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed opacity-70"
              }`}
            >
              {!isLoading && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wide">Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <FaShieldAlt className="group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative">
                      Reset Password
                      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </div>
        );

      case 4: // Success
        return (
          <div className="form-step animate-fade-in text-center">
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-xl success-icon">
                <FaCheckCircle className="text-white text-4xl" />
              </div>
            </div>

            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-4">
              Password Reset Successful!
            </h3>

            <p className="text-slate-600 mb-8">
              Your password has been successfully reset. You can now log in with your new password.
            </p>

            <div className="relative mb-8">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-200 to-green-200 rounded-lg blur opacity-50"></div>
              <div className="relative bg-white/90 backdrop-blur-sm p-5 rounded-lg border border-emerald-100 shadow-lg">
                <div className="flex items-start gap-3">
                  <FaShieldAlt className="text-emerald-500 mt-1 flex-shrink-0" />
                  <p className="text-sm text-emerald-700 text-left">
                    <span className="font-bold">Security Alert:</span> If you didn't request this change, please contact our support team immediately.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleBackToLogin}
              className="relative w-full py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-2xl hover:shadow-emerald-500/30 transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2">
                <FaArrowLeft />
                Back to Login
              </span>
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <WrapperSection>
      <div className="forgot-password-wrapper w-full max-w-xl mx-auto relative md:-mt-[490px] -mt-[650px]">
        {/* Animated gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 rounded-3xl blur-xl opacity-75 animate-gradient-xy"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Main Card */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm p-8 lg:p-12 rounded-3xl shadow-2xl border border-white/50">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex justify-between items-center relative">
              {[1, 2, 3, 4].map((stepNum) => (
                <div key={stepNum} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                      step >= stepNum
                        ? "bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-200 scale-110"
                        : "bg-white border-2 border-slate-200 text-slate-400"
                    } ${step === stepNum ? 'ring-4 ring-pink-200 animate-pulse' : ''}`}
                  >
                    {step > stepNum ? <FaCheckCircle className="text-white" /> : stepNum}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= stepNum ? 'text-pink-600' : 'text-slate-400'}`}>
                    {stepNum === 1 && "Email"}
                    {stepNum === 2 && "OTP"}
                    {stepNum === 3 && "Password"}
                    {stepNum === 4 && "Done"}
                  </span>
                </div>
              ))}
              
              {/* Progress Line */}
              <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 -z-0">
                <div 
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
                  style={{ width: `${(step - 1) * 33.33}%` }}
                />
              </div>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-pink-100">
            {renderStep()}

            {/* Additional Help */}
            {step !== 4 && (
              <div className="mt-8 pt-6 border-t border-pink-100">
                <div className="text-center">
                  <p className="text-slate-500 text-sm mb-3">
                    Need help? Contact our support team
                  </p>
                  <a
                    href="mailto:support@bloodbank.com"
                    className="text-pink-600 hover:text-purple-600 font-medium text-sm transition-colors duration-200 hover:underline decoration-2 underline-offset-2"
                  >
                    support@bloodbank.com
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-6 relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-200 to-purple-200 rounded-lg blur opacity-50"></div>
            <div className="relative bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-pink-100 shadow-lg">
              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-pink-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm mb-1">
                    Security Notice
                  </h4>
                  <p className="text-slate-600 text-xs">
                    For security reasons, this reset link is only valid for 10 minutes. 
                    Always ensure you're on the official website before entering your credentials.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WrapperSection>
  );
};

export default ForgotPasswordForm;