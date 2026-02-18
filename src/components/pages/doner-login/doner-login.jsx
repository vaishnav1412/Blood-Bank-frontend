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
import { loginDonor } from "../../../services/donorServices";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import toast from "react-hot-toast";

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
      setFormData((prev) => ({ ...prev, email: savedEmail }));
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

    return {
      emailError,
      passwordError,
      isValid: !emailError && !passwordError,
    };
  }, [formData.email, formData.password]);

  // Handle form submission
  const handleSubmit = async (e) => {

  e.preventDefault();
  if (loading) return;

  const { emailError, passwordError, isValid } = validateForm();
  setError({ emailError, passwordError });

  if (!isValid) return;
  const toastId = toast.loading("Logging in...");
  setLoading(true);

  try {

    const data = await loginDonor(formData.email, formData.password);
    toast.success("Login successful!", { id: toastId });

    localStorage.setItem("token", data.token);
    localStorage.setItem("donor", JSON.stringify(data.donor));

    navigate("/home");

    setFormData((prev) => ({ ...prev, password: "" }));
    
  } catch (err) {

   toast.error(getErrorMessage(err), { id: toastId });

  } finally {
    setLoading(false);
  }
};

  const handleInputChange = useCallback(
    (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (error[`${name}Error`]) {
        setError((prev) => ({
          ...prev,
          [`${name}Error`]: "",
        }));
      }
    },
    [error],
  );

  const toggleRememberMe = useCallback(() => {
    setRememberMe((prev) => !prev);
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
        setFormData={setFormData} 
        onInputChange={handleInputChange} 
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
