
import HeroComponent from "../../sections/hero/hero-component";
import ForgotPasswordForm from "../../sections/form/forgot-password";
import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import { ResetEmailCaptions, ResetEmailDetails } from "../../../data/content/forgot";

const ForgotEmailPage = () => {
  
  return (
    <>
      <HeaderComponent />
      <HeroComponent {...ResetEmailCaptions.hero} />
      <ForgotPasswordForm />
      <ContactDetailsComponent contactDetails={ResetEmailDetails} />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default ForgotEmailPage;