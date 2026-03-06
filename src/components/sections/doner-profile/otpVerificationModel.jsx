import { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaKey,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import toast from "react-hot-toast";
import {
  verifyForgotOtp,
  sendForgotOtp,
  resetForgotPassword,
} from "../../../services/donorServices";

const OtpVerificationModal = ({
  showModal,
  onClose,
  email,
  userId,
  onSuccess,
}) => {
  const [step, setStep] = useState(1); // 1: OTP, 2: New Password
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "",
    color: "",
  });

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  useEffect(() => {
    let interval;
    if (timer > 0 && step === 1) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  // Reset state when modal opens
  useEffect(() => {
    if (showModal) {
      setStep(1);
      setOtp(["", "", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setTimer(60);
      setErrors({});
    }
  }, [showModal]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Clear error
    if (errors.otp) {
      setErrors((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const validateOtp = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setErrors({ otp: "Please enter complete 6-digit OTP" });
      return false;
    }
    if (!/^\d{6}$/.test(otpString)) {
      setErrors({ otp: "OTP must contain only numbers" });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const newErrors = {};
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword =
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculatePasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ score: 0, label: "", color: "" });
      return;
    }

    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;

    if (score <= 2) {
      setPasswordStrength({
        score: 33,
        label: "Weak",
        color: "from-red-500 to-red-600",
      });
    } else if (score <= 4) {
      setPasswordStrength({
        score: 66,
        label: "Medium",
        color: "from-yellow-500 to-yellow-600",
      });
    } else {
      setPasswordStrength({
        score: 100,
        label: "Strong",
        color: "from-green-500 to-green-600",
      });
    }
  };

  useEffect(() => {
    calculatePasswordStrength(newPassword);
  }, [newPassword]);

  const handleVerifyOtp = async () => {
    if (!validateOtp()) return;

    setIsLoading(true);
    const toastId = toast.loading("Verifying OTP...");

    try {
      const response = await verifyForgotOtp(email, otp.join(""));
      if (response.success) {
        toast.success("OTP verified successfully!", { id: toastId });
        setStep(2);
      } else {
        setErrors({ otp: response.message || "Invalid OTP" });
        toast.error(response.message || "Invalid OTP", { id: toastId });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0) return;

    setIsResending(true);
    const toastId = toast.loading("Resending OTP...");

    try {
      const response = await sendForgotOtp(email);
      if (response.success) {
        setTimer(60);
        toast.success("New OTP sent successfully!", { id: toastId });
      } else {
        toast.error(response.message || "Failed to resend OTP", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP", {
        id: toastId,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return;

    setIsLoading(true);
    const toastId = toast.loading("Resetting password...");

    try {
      const response = await resetForgotPassword({
        userId,
        email,
        otp: otp.join(""),
        newPassword,
      });

      if (response.success) {
        toast.success("Password reset successfully!", { id: toastId });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        toast.error(response.message || "Failed to reset password", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className="bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm rounded-3xl w-full max-w-md shadow-2xl border border-white/50 animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top bar */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                {step === 1 ? (
                  <FaKey className="text-white text-lg" />
                ) : (
                  <FaShieldAlt className="text-white text-lg" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {step === 1 ? "Verify OTP" : "Reset Password"}
                </h3>
                <p className="text-white/80 text-xs mt-1">
                  {step === 1
                    ? `Enter the 6-digit code sent to ${email}`
                    : "Create a new strong password"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {step === 1 ? (
            /* Step 1: OTP Verification */
            <div className="space-y-6">
              {/* OTP Inputs */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Enter 6-Digit OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:ring-0 outline-none transition-all ${
                        errors.otp
                          ? "border-red-400 focus:border-red-500"
                          : "border-gray-200 focus:border-pink-400"
                      }`}
                      maxLength={1}
                      inputMode="numeric"
                    />
                  ))}
                </div>
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                    <FaExclamationTriangle />
                    {errors.otp}
                  </p>
                )}
              </div>

              {/* Timer & Resend */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FaClock
                    className={timer > 0 ? "text-pink-600" : "text-red-500"}
                  />
                  <span>
                    {timer > 0 ? (
                      <>
                        Code expires in{" "}
                        <span className="font-bold text-pink-600">
                          {timer}s
                        </span>
                      </>
                    ) : (
                      <span className="text-red-500">Code expired</span>
                    )}
                  </span>
                </div>

                <button
                  onClick={handleResendOtp}
                  disabled={timer > 0 || isResending}
                  className="text-sm font-medium text-pink-600 hover:text-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isResending ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Resend Code"
                  )}
                </button>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FaCheckCircle />
                    Verify OTP
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Step 2: New Password */
            <div className="space-y-5">
              {/* New Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`w-full p-3 pr-10 border-2 rounded-xl focus:ring-0 outline-none transition-all ${
                      errors.newPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-pink-400"
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>

                {/* Password Strength */}
                {newPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Strength:</span>
                      <span
                        className={`font-bold bg-gradient-to-r ${passwordStrength.color} text-transparent bg-clip-text`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${passwordStrength.color} transition-all duration-500`}
                        style={{ width: `${passwordStrength.score}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full p-3 pr-10 border-2 rounded-xl focus:ring-0 outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500"
                        : "border-gray-200 focus:border-pink-400"
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-xl border border-pink-200">
                <h4 className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-2">
                  <FaShieldAlt className="text-pink-600" />
                  Password Requirements
                </h4>
                <ul className="space-y-1 text-xs">
                  {[
                    "At least 8 characters long",
                    "One uppercase letter (A-Z)",
                    "One lowercase letter (a-z)",
                    "One number (0-9)",
                    "One special character (@$!%*?&)",
                  ].map((req, i) => {
                    let met = false;
                    if (i === 0) met = newPassword.length >= 8;
                    if (i === 1) met = /[A-Z]/.test(newPassword);
                    if (i === 2) met = /[a-z]/.test(newPassword);
                    if (i === 3) met = /\d/.test(newPassword);
                    if (i === 4) met = /[@$!%*?&]/.test(newPassword);

                    return (
                      <li
                        key={i}
                        className={`flex items-center gap-2 ${
                          met ? "text-green-600" : "text-gray-500"
                        }`}
                      >
                        {met ? (
                          <FaCheckCircle className="text-green-500 text-xs" />
                        ) : (
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                        )}
                        {req}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Error Messages */}
              {(errors.newPassword || errors.confirmPassword) && (
                <div className="text-red-500 text-xs space-y-1">
                  {errors.newPassword && (
                    <p className="flex items-center gap-1">
                      <FaExclamationTriangle />
                      {errors.newPassword}
                    </p>
                  )}
                  {errors.confirmPassword && (
                    <p className="flex items-center gap-1">
                      <FaExclamationTriangle />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {/* Reset Button */}
              <button
                onClick={handleResetPassword}
                disabled={isLoading || !newPassword || !confirmPassword}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-3 rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Resetting...
                  </>
                ) : (
                  <>
                    <FaShieldAlt />
                    Reset Password
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationModal;