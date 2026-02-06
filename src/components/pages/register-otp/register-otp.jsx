import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import { ResetEmailDetails ,ResetEmailCaptions} from "../../../data/content/register-otp";
import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import ContactForm from "../../sections/form/form-component-otp";

const RegisterOtpPage = () => {
  const [formData, setFormData] = useState({
    otp: ["", "", "", ""],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <>
      <HeaderComponent />

      <HeroComponent {...ResetEmailCaptions.hero} />
      <ContactForm
        heading={"Almost Done! Confirm Your Email"}
        buttonText={"Complete Registration"}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
      <ContactDetailsComponent contactDetails={ResetEmailDetails} />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default RegisterOtpPage;
