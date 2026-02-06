import { useRef, useState } from "react";
import PropTypes from "prop-types";
import WrapperSection from "../wrapper-section/wrapper-section-component";

const ContactForm = ({
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  status,
  loading,
}) => {
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];
  const [error, setError] = useState("");

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

  /* ===========================
     Input Styles
  =========================== */
  const otpInputStyles = `
    w-14 h-14 text-center text-xl font-semibold
    rounded-lg border-2 outline-none
    transition-all duration-200
  `;

  return (
    <WrapperSection>
      <div className="form-wrapper w-full max-w-xl mx-auto relative mt-10 lg:-mt-32">

        {/* Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 rounded-2xl blur opacity-30"></div>

        {/* Card */}
        <div className="relative bg-gradient-to-br from-pink_super_light via-white to-pink-50 p-8 rounded-2xl shadow-xl border border-pink-100">

          {/* Heading */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {heading}
            </h3>
            <p className="text-gray-600 mt-2">
              Enter the OTP sent to your email 📩
            </p>
          </div>

          {/* OTP Form */}
          <form
            className="space-y-6 flex flex-col items-center"
            onSubmit={onSubmitOtp}
          >
            {/* OTP Inputs */}
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  ref={inputRefs[index]}
                  value={formData.otp[index] || ""}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputMode="numeric"
                  className={`${otpInputStyles} ${
                    error
                      ? "border-pink-500 ring-2 ring-pink-200"
                      : "border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200"
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-pink-600 text-sm font-semibold text-center">
                {error}
              </p>
            )}

            {/* Status Message */}
            {status && (
              <p className="text-green-600 text-sm font-semibold text-center">
                {status}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-pink-700 
              hover:from-pink-700 hover:to-pink-800 text-white font-semibold 
              rounded-lg transition-all duration-200 hover:shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying OTP..." : buttonText}
            </button>
          </form>
        </div>
      </div>
    </WrapperSection>
  );
};

/* ===========================
   ✅ PropTypes Validation
=========================== */
ContactForm.propTypes = {
  heading: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,

  formData: PropTypes.shape({
    otp: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,

  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,

  status: PropTypes.string,
  loading: PropTypes.bool,
};

/* ===========================
   ✅ Default Props
=========================== */
ContactForm.defaultProps = {
  status: "",
  loading: false,
};

export default ContactForm;
