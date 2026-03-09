import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaSpinner, FaCheckCircle } from "react-icons/fa";
import WrapperSection from "../../wrapper-section/wrapper-section-component";
import "./form-component-otp.scss";
const OtpForm = ({
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  status,
  loading,
  resendOtp,
}) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [error, setError] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  /* ===========================
     OTP Change Handler
  =========================== */
  const handleOtpChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...formData.otp];
    newOtp[index] = value;

    setFormData({ ...formData, otp: newOtp });

    // Remove error when typing
    if (error) setError("");

    // Auto focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  /* ===========================
     Backspace Handler
  =========================== */
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !formData.otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  /* ===========================
     Submit Validation
  =========================== */
  const onSubmitOtp = (e) => {
    e.preventDefault();

    const otpValue = formData.otp.join("");

    if (!otpValue) {
      setError("OTP is required.");
      return;
    }

    if (otpValue.length !== 4) {
      setError("Please enter the complete 4-digit OTP.");
      return;
    }

    setError("");
    handleSubmit(e);
  };

  useEffect(() => {
    if (!isResendDisabled) return;

    if (resendTimer === 0) {
      setIsResendDisabled(false);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer, isResendDisabled]);

  /* ===========================
     Input Styles
  =========================== */
  const otpInputStyles = `
    w-16 h-16 text-center text-2xl font-bold
    rounded-xl border-2 outline-none
    transition-all duration-300
  `;

  return (
    <WrapperSection>
      <div className="form-wrapper w-full max-w-md mx-auto relative -mt-[480px] lg:-mt-[480px]">
        {/* Animated gradient background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-600 rounded-2xl blur-xl opacity-75 animate-gradient-xy"></div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Card */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/50">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-400 rounded-b-full"></div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-pink-200/50 transform hover:scale-105 transition-transform duration-300">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent mb-2">
              {heading}
            </h3>
            <p className="text-slate-600">
              Enter the 4-digit code sent to your email
            </p>
            <p className="text-sm text-slate-500 mt-1">
              We've sent it to{" "}
              <span className="text-pink-600 font-medium">your email</span>
            </p>
          </div>

          {/* OTP Form */}
          <form
            className="space-y-8 flex flex-col items-center"
            onSubmit={onSubmitOtp}
          >
            {/* OTP Inputs */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative group">
                  <input
                    type="text"
                    maxLength={1}
                    ref={inputRefs[index]}
                    value={formData.otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(null)}
                    inputMode="numeric"
                    className={`${otpInputStyles} ${
                      error
                        ? "border-rose-400 shadow-lg shadow-rose-100"
                        : focusedIndex === index
                          ? "border-pink-400 shadow-lg shadow-pink-100 scale-105"
                          : formData.otp[index]
                            ? "border-pink-300 bg-gradient-to-br from-white to-pink-50"
                            : "border-slate-300 hover:border-pink-300"
                    }`}
                  />
                  {/* Animated glow effect on focus */}
                  {focusedIndex === index && (
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl blur opacity-30 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message text-rose-600 text-sm font-medium flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-lg">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </div>
            )}

            {/* Status Message */}
            {status && (
              <div className="text-emerald-600 text-sm font-medium flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-lg">
                <FaCheckCircle className="text-emerald-500" />
                {status}
              </div>
            )}

            {/* Resend OTP Link */}
            <div className="text-center">
              <button
                type="button"
                disabled={isResendDisabled}
                onClick={() => {
                  resendOtp();
                  setResendTimer(60); // Reset timer
                  setIsResendDisabled(true);
                }}
                className={`text-sm transition-colors duration-200 ${
                  isResendDisabled
                    ? "text-slate-400 cursor-not-allowed"
                    : "text-pink-600 hover:text-purple-600"
                }`}
              >
                {isResendDisabled ? (
                  <>
                    Resend OTP in{" "}
                    <span className="font-semibold text-pink-500">
                      {resendTimer}s
                    </span>
                  </>
                ) : (
                  <>
                    Didn't receive code?{" "}
                    <span className="font-medium hover:underline">
                      Resend OTP
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full py-4 px-6 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                !loading
                  ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed opacity-70"
              }`}
            >
              {/* Animated background shine effect */}
              {!loading && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span className="tracking-wide">Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    <span className="relative">
                      {buttonText}
                      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>

            {/* Back to Login Link */}
            <div className="text-center pt-4 border-t border-pink-100 w-full">
              <a
                href="/login"
                className="text-sm text-slate-600 hover:text-pink-600 transition-colors duration-200 flex items-center justify-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </WrapperSection>
  );
};

/* ===========================
   ✅ PropTypes Validation
=========================== */
OtpForm.propTypes = {
  heading: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  formData: PropTypes.shape({
    otp: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  status: PropTypes.string,
  loading: PropTypes.bool,
  resendOtp: PropTypes.func,
};

/* ===========================
   ✅ Default Props
=========================== */
OtpForm.defaultProps = {
  status: "",
  loading: false,
};

export default OtpForm;
