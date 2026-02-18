import HeroComponent from "../../sections/hero/hero-component";
import TwoCtaComponent from "../../sections/two-cta/two-cta-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import { HomePageDetails, stepDetails } from "../../../data/content/home";

const HomePage = () => {
  return (
    <>
      <HeaderComponent />
      <HeroComponent {...HomePageDetails.hero} />
      <TwoCtaComponent />
      <ThreeStepProcessComponent
        stepsText={HomePageDetails.stepsText}
        stepDetails={stepDetails}
      />
      <SideBySideComponent {...HomePageDetails.donate_blood} />
      <QuoteComponent {...HomePageDetails.quote} />
      <SideBySideComponent {...HomePageDetails.why_donate_blood} />
      <CriteriaComponent {...HomePageDetails.eligiblity_criteria} />
      <BeforeFooterCTA />

      <FooterComponent />
    </>
  );
};

export default HomePage;
