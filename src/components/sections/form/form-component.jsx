import { useEffect, useState } from "react";
import "./form-component-styles.scss";
import { FaSpinner } from "react-icons/fa";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { labelStyles ,inputStyles } from "../../../data/style/style";
import PropTypes from "prop-types";

const FormComponent = ({
  fields,
  heading,
  buttonText,
  formData,
  setFormData,
  handleSubmit,
  error,
  loading,
  rememberMe,
  setRememberMe,
}) => {
  const [focusedFields, setFocusedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Remember Me Logic
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
  }, [rememberMe, formData.email]);

  const handleFocus = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setFocusedFields((prev) => ({ ...prev, [field]: false }));
  };

  
  return (
    <WrapperSection>
      {/* Main Wrapper */}
      <div className="form-wrapper w-full max-w-xl mx-auto relative md:-mt-[420px] -mt-32">

        {/* Glow Border */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 rounded-2xl blur opacity-30"></div>

        {/* Form Card */}
        <div className="relative bg-gradient-to-br from-pink_super_light via-white to-pink-50 p-8 rounded-2xl shadow-xl border border-pink-100">

          {/* Heading */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-800">
              {heading}
            </h3>
            <p className="text-gray-600 mt-2">
              Welcome back! Please login to continue
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="relative">

                {/* Input */}
                <input
                  type={
                    field.type === "password"
                      ? showPassword
                        ? "text"
                        : "password"
                      : field.type
                  }
                  name={field.name}
                  id={field.name}
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [field.name]: e.target.value,
                    })
                  }
                  onFocus={() => handleFocus(field.name)}
                  onBlur={() => handleBlur(field.name)}
                  placeholder=" "
                  className={inputStyles}
                />

                {/* Floating Label */}
                <label
                  htmlFor={field.name}
                  className={`${labelStyles} ${
                    formData[field.name] || focusedFields[field.name]
                      ? "text-xs -top-2 bg-white px-1 text-pink-600 font-medium"
                      : "top-3.5 text-base text-gray-500"
                  }`}
                >
                  {field.placeholder}
                </label>

                {/* Show/Hide Password */}
                {field.type === "password" && (
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-pink-600 cursor-pointer hover:text-pink-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </span>
                )}

                {/* Error Messages */}
                {error?.emailError && field.name === "email" && (
                  <p className="text-pink-600 text-sm mt-1">
                    {error.emailError}
                  </p>
                )}

                {error?.passwordError && field.name === "password" && (
                  <p className="text-pink-600 text-sm mt-1">
                    {error.passwordError}
                  </p>
                )}
              </div>
            ))}

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 accent-pink-600"
                />
                Remember me
              </label>

              <a
                href="/forgot-password"
                className="text-pink-600 font-medium hover:underline"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
           <button
  type="submit"
  disabled={loading}
  className={`relative w-full py-4 rounded-xl font-bold transition-all duration-500 ease-in-out overflow-hidden group ${
    !loading
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
  {!loading && (
    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
  )}
  
  <span className="relative flex items-center justify-center">
    {loading ? (
      <>
        <FaSpinner className="animate-spin mr-3" />
        Submitting...
      </>
    ) : (
      <>
        <span className="relative">
          {buttonText}
          {/* Underline animation */}
          <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
        </span>
        <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-opacity duration-300">→</span>
      </>
    )}
  </span>
</button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-600 pt-4 border-t border-pink-100">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-pink-600 font-semibold hover:underline"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </WrapperSection>
  );
};


/* =======================
   Prop Validation
======================= */

FormComponent.propTypes = {
  heading: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,

  // Fields array (dynamic inputs)
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      required: PropTypes.bool,
    })
  ).isRequired,

  // Form state object
  formData: PropTypes.object.isRequired,

  // State setter functions
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,

  // Error object (optional)
  error: PropTypes.shape({
    emailError: PropTypes.string,
    passwordError: PropTypes.string,
  }),

  // Loading state
  loading: PropTypes.bool,

  // Remember Me state
  rememberMe: PropTypes.bool.isRequired,
  setRememberMe: PropTypes.func.isRequired,
};

/* =======================
   Default Props
======================= */

FormComponent.defaultProps = {
  loading: false,
  error: {},
};

export default FormComponent;
