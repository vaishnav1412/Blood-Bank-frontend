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

import Axios from "axios";

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
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.weight || formData.weight < 50)
      newErrors.weight = "Weight must be at least 50 kg";
    if (!formData.platelet)
      newErrors.platelet = "Platelet willingness is required";
    if (!formData.donationCount)
      newErrors.donationCount = "Donation count is required";
    if (!formData.taluk) newErrors.taluk = "Taluk is required";
    if (!formData.district) newErrors.district = "District is required";

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile || !mobileRegex.test(formData.mobile))
      newErrors.mobile = "Invalid mobile number";

    if (!formData.whatsapp || !mobileRegex.test(formData.whatsapp))
      newErrors.whatsapp = "Invalid WhatsApp number";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email || !emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.email !== formData.reEmail)
      newErrors.reEmail = "Emails do not match";
    if (!formData.agreeToPolicy)
      newErrors.agreeToPolicy = "You must agree to the policy.";

    return newErrors;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  const formValidationErrors = validateForm();

  if (Object.keys(formValidationErrors).length > 0) {
    setErrors(formValidationErrors);
    return;
  }

  setErrors({});
  setLoading(true);

  // ✅ Toast Loading
  const toastId = toast.loading("Sending OTP...");

  try {
    const response = await Axios.post(
      "http://localhost:5000/doner/doner-register",
      {
        name: formData.name,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        dob: formData.dob,
        weight: formData.weight,
        platelet: formData.platelet,
        donationCount: formData.donationCount,
        district: formData.district,
        taluk: formData.taluk,
        mobile: formData.mobile,
        whatsapp: formData.whatsapp,
        email: formData.email,
        reEmail: formData.reEmail,
      }
    );

    console.log(response.data);

    // ✅ Success Toast
    toast.success("OTP sent successfully! Check your email 📩", {
      id: toastId,
    });

    // ✅ Do NOT reset form immediately
    // Redirect to OTP page later
      navigate("/register-otp",{state:{email:formData.email}})
    // Example:
    // navigate("/verify-otp", { state: { email: formData.email } });

  } catch (error) {
    console.log(error);

    const message =
      error.response?.data?.message || "Registration failed. Try again.";

    // ❌ Error Toast
    toast.error(message, { id: toastId });

  } finally {
    setLoading(false);
  }
};


  const DonateBloodPageDetails = {
    quote: {
      classHint: "quote",
      quoteText: `“By donating money, you provide nourishment. By donating blood, you give the gift of life. Join us in this noble cause today!”`,
    },
    why_donate_blood: {
      subheadingText: "Donate blood today",
      headingText: "Why should you donate blood?",
      classHint: "side-col-image why-donate-blood",
      paraText: `Donating blood is a selfless act that has the power to save lives. Here are a few reasons why you should consider donating blood:
            \n― You could help save up to three lives with just one donation.
            ― Blood is always needed in emergency situations, such as natural disasters and accidents.
            ― Blood is needed for patients undergoing surgeries, cancer treatment, and other medical procedures.
            ― Blood cannot be manufactured, which means that the only source of blood is through donations from volunteers.
            ― Donating blood can also have health benefits for the donor, such as reducing the risk of heart disease and cancer.`,
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Donate Now",
      buttonLink: "/donate-blood",
      buttonHave: true,
    },
    eligiblity_criteria: {
      subheadingText: "Are you ready?",
      headingText: "Eligibility Criteria",
      classHint: "side-col-image eligibility-criteria",
      paraText: [
        `18-50 years, above 50 Kg.`,
        `Normal temperature, pulse and blood pressure.`,
        `No Respiratory Diseases`,
        `Above 12.5 g/dL Hemoglobin`,
        `No skin disease, puncture or scars`,
        `No history of transmissible disease`,
      ],
      imageUrl: "../../../assets/images/blood-donation(1).jpg",
      buttonText: "Donate Now",
      buttonLink: "/donate-blood",
      buttonHave: false,
    },
    hero: {
      subheadingText: "Donate Blood",
      headingText: "Save life by donating blood today",
      classHint: "donate-blood-page-hero",
    },
    stepsText: {
      subheadingText: "Donation Process",
      headingText: "Step-by-Step Guide to Donating Blood",
    },
  };

  const stepDetails = [
    {
      key: "register-donor",
      stepNumber: "01",
      stepName: "Register as a Donor",
      stepDescription:
        "Sign up on our platform by providing your personal and medical details to create your donor profile.",
    },
    {
      key: "listed-on-seeker-portal",
      stepNumber: "02",
      stepName: "Get Listed on Seeker Portal",
      stepDescription:
        "Once registered, your profile becomes visible to seekers who may need your blood group.",
    },
    {
      key: "contacted-by-seeker",
      stepNumber: "03",
      stepName: "Get Contacted by a Seeker",
      stepDescription:
        "Blood seekers will reach out to you based on compatibility and urgency.",
    },
    {
      key: "donate-blood",
      stepNumber: "04",
      stepName: "Donate Blood",
      stepDescription:
        "Go to the specified hospital, complete the required steps, and donate blood.",
    },
    {
      key: "mark-donated",
      stepNumber: "05",
      stepName: "Mark as Donated",
      stepDescription:
        "After donation, update your status in the platform to track your eligibility cooldown.",
    },
    {
      key: "cooldown-period",
      stepNumber: "06",
      stepName: "3-Month Cooldown",
      stepDescription:
        "You’ll become temporarily inactive for 3 months post-donation. After this period, your profile will be reactivated.",
    },
  ];

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
        loading ={loading}
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
