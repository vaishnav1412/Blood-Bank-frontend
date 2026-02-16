import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HeroComponent from "../../sections/form-hero/form-hero";
import toast from "react-hot-toast";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponentRegister from "../../sections/form/form-component-register";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import { registerDonor } from "../../../services/donorServices";
import { getErrorMessage } from "../../../utils/getErrorMessage";
import { validateDonorRegisterForm } from "../../../utils/validators/donorRegisterValidator";
import {
  DonateBloodPageDetails,
  stepDetails,
} from "../../../data/content/register";

const DonateBloodRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    bloodGroup: "",
    dob: "",
    weight: "",
    platelet: "",
    donationCount: "",
    taluk: "",
    district: "",
    mobile: "",
    whatsapp: "",
    email: "",
    reEmail: "",
    agreeToPolicy: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    const formValidationErrors = validateDonorRegisterForm(formData);

    if (Object.keys(formValidationErrors).length > 0) {
      setErrors(formValidationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const toastId = toast.loading("Sending OTP...");
    try {
      await registerDonor(formData);
      toast.success("OTP sent successfully! Check your email 📩", {
        id: toastId,
      });
      navigate("/register-otp", {
        state: { email: formData.email },
      });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderComponent />

      <HeroComponent {...DonateBloodPageDetails.hero} />
      <FormComponentRegister
        heading={"Welcome Back, Lifesaver!"}
        buttonText={"Submit"}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        loading={loading}
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

export default DonateBloodRegisterPage;
