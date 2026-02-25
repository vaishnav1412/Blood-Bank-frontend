import { useEffect, useState } from "react";
import { FaSpinner, FaGoogle } from "react-icons/fa";
import WrapperSection from "../wrapper-section/wrapper-section-component";
import { labelStyles, inputStyles } from "../../../data/style/style";
import "./form-component-login.scss";
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
  onGoogleLogin,
}) => {
  const [focusedFields, setFocusedFields] = useState({});
  const [showPassword, setShowPassword] = useState(false);

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
      <div className="form-wrapper w-full max-w-xl mx-auto relative md:-mt-[490px] -mt-36">
        {/* Animated gradient background */}
        <div className="absolute -inset-0 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-600 rounded-2xl blur-xl opacity-75 animate-gradient-xy"></div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <div className="absolute top-0 -left-4 w-24 h-24 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-24 h-24 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-20 w-24 h-24 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        {/* Form Card */}
        <div className="relative bg-gradient-to-br from-white via-white/95 to-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/50">
          {/* Decorative top bar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-pink-600 to-purple-400 rounded-b-full"></div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-400 bg-clip-text text-transparent">
              {heading}
            </h3>
            <p className="text-gray-600 mt-3 text-sm tracking-wide">
              Welcome back! Please login to your account
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.key} className="relative group">
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
                  className={`${inputStyles} transition-all duration-300 border-2 ${
                    error[`${field.name}Error`]
                      ? "border-pink-400 focus:border-pink-600"
                      : focusedFields[field.name]
                      ? "border-pink-400 shadow-lg shadow-pink-100"
                      : "border-slate-400 hover:border-slate-500"
                  }`}
                />

                {/* Floating Label */}
                <label
                  htmlFor={field.name}
                  className={`${labelStyles} transition-all duration-200 ${
                    formData[field.name] || focusedFields[field.name]
                      ? "text-xs -top-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text font-medium px-1"
                      : "top-3.5 text-base text-gray-500"
                  }`}
                >
                  {field.placeholder}
                </label>

                {/* Show/Hide Password */}
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-pink-600 hover:text-purple-600 focus:outline-none transition-all duration-200 hover:scale-105"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                )}

                {/* Error Messages */}
                {error?.[`${field.name}Error`] && (
                  <p className="error-message text-rose-600 text-xs mt-1.5 ml-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-rose-600 rounded-full"></span>
                    {error[`${field.name}Error`]}
                  </p>
                )}
              </div>
            ))}

            {/* Remember Me + Forgot */}
            <div className="flex items-center justify-between text-sm pt-2">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500 transition-all duration-200 cursor-pointer"
                  />
                  <div className="absolute inset-0 bg-pink-200 rounded opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                </div>
                <span className="group-hover:text-gray-900 transition-colors duration-200">Remember me</span>
              </label>

              <a
                href="/forgot-password"
                className="text-pink-600 hover:text-purple-600 font-medium transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`relative w-full py-4 rounded-xl font-bold transition-all duration-500 overflow-hidden group ${
                !loading
                  ? "bg-gradient-to-r from-pink-600 via-purple-500 to-pink-600 bg-[length:200%_100%] hover:bg-[length:100%_100%] text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/30 transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-gradient-to-r from-pink-400 to-purple-400 text-white cursor-not-allowed"
              }`}
            >
              {/* Animated background shine */}
              {!loading && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}

              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-3" />
                    <span className="tracking-wide">Submitting...</span>
                  </>
                ) : (
                  <>
                    <span className="relative">
                      {buttonText}
                      <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-white/70 transition-all duration-300" />
                    </span>
                    <span className="ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>

            {/* Divider */}
            <div className="relative py-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray">Or continue with</span>
              </div>
            </div>

            {/* Google Login Button */}
            <button
              type="button"
              onClick={onGoogleLogin}
              className="w-full py-3.5 px-4 rounded-xl border-2 border-gray bg-white hover:bg-slate-50 text-slate-700 font-medium transition-all duration-300 group hover:shadow-lg hover:shadow-slate-400/50 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
            >
              <FaGoogle className="text-pink-600 text-lg group-hover:scale-110 transition-transform duration-300" />
              <span className="group-hover:text-slate-900">Sign in with Google</span>
            </button>

            {/* Signup Link */}
            <p className="text-center text-sm text-gray-500 pt-4 border-t border-gray-100">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-pink-600 hover:text-purple-600 font-semibold transition-all duration-200 hover:underline decoration-2 underline-offset-2"
              >
                Create account
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
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      required: PropTypes.bool,
    })
  ).isRequired,
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object,
  loading: PropTypes.bool,
  rememberMe: PropTypes.bool.isRequired,
  setRememberMe: PropTypes.func.isRequired,
  onGoogleLogin: PropTypes.func,
};

/* =======================
   Default Props
======================= */

FormComponent.defaultProps = {
  loading: false,
  error: {},
  onGoogleLogin: () => {},
};

export default FormComponent;