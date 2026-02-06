import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  DonateBloodPageDetails,
  stepDetails,
  fields,
} from "../../../data/content/login";
import HeroComponent from "../../sections/form-hero/form-hero";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import axios from "axios";
import toast from "react-hot-toast";

// Constants that won't change
const API = import.meta.env.VITE_API_URL;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DonateBloodPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    emailError: "",
    passwordError: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Load remembered email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Save email to localStorage when rememberMe changes
  useEffect(() => {
    if (rememberMe && formData.email) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else if (!rememberMe) {
      localStorage.removeItem("rememberedEmail");
    }
  }, [rememberMe, formData.email]);

  // Validate form function - useCallback because it's used in dependency array
  const validateForm = useCallback(() => {
    const emailError = !formData.email.trim() 
      ? "Email is required." 
      : !EMAIL_REGEX.test(formData.email) 
        ? "Enter a valid email." 
        : "";

    const passwordError = !formData.password.trim() 
      ? "Password is required." 
      : formData.password.length < 6 
        ? "Password must be at least 6 characters." 
        : "";

    return { emailError, passwordError, isValid: !emailError && !passwordError };
  }, [formData.email, formData.password]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Validate form
    const { emailError, passwordError, isValid } = validateForm();
    setError({ emailError, passwordError });

    if (!isValid) return;

    const toastId = toast.loading("Logging in...");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/doner/login`, {
        email: formData.email.trim(),
        password: formData.password,
      });

      toast.success("Login successful!", { id: toastId });

      // Store token and user data
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("donor", JSON.stringify(response.data.donor));

      // Redirect to profile
      navigate("/doner-profile");

      // Reset password field for security
      setFormData(prev => ({ ...prev, password: "" }));

    } catch (err) {
      // Handle different error types
      const status = err.response?.status;
      let message = "Login failed. Please try again.";

      if (status === 401) {
        message = "Invalid email or password.";
      } else if (status === 404) {
        message = "User not found.";
      } else if (status >= 500) {
        message = "Server error. Please try again later.";
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      }

      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (error[`${name}Error`]) {
      setError(prev => ({
        ...prev,
        [`${name}Error`]: ""
      }));
    }
  }, [error]);

  // Toggle remember me
  const toggleRememberMe = useCallback(() => {
    setRememberMe(prev => !prev);
  }, []);

  return (
    <>
      <HeaderComponent />
      <HeroComponent {...DonateBloodPageDetails.hero} />
      <FormComponent
        fields={fields}
        heading={"Welcome Back, Lifesaver!"}
        buttonText={loading ? "Logging in..." : "Login"}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData} // Keep this for FormComponent's internal use
        onInputChange={handleInputChange} // New prop for better control
        error={error}
        loading={loading}
        rememberMe={rememberMe}
        setRememberMe={toggleRememberMe}
      />
      <ThreeStepProcessComponent
        stepsText={DonateBloodPageDetails.stepsText}
        stepDetails={stepDetails}
      />
      <CriteriaComponent {...DonateBloodPageDetails.eligiblity_criteria} />
      <SideBySideComponent {...DonateBloodPageDetails.why_donate_blood} />
      <QuoteComponent {...DonateBloodPageDetails.quote} />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default DonateBloodPage;