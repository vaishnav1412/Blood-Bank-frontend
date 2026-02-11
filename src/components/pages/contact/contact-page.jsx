import HeroComponent from "../../sections/hero/hero-component";
import ContactForm from "../../sections/form/contact-form";
import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import { contactDetails } from "../../../data/content/contact";

const ContactPage = () => {
  const ContactPageDetails = {
    hero: {
      subheadingText: "",
      headingText: "",
      classHint: "contact-page-hero",
    },
  };

  return (
    <>
      <HeaderComponent />
      <HeroComponent {...ContactPageDetails.hero} />
      <ContactForm heading={"We're to help"} buttonText={"Send Message"} />
      <ContactDetailsComponent contactDetails={contactDetails} />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default ContactPage;
