import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import {
  NeedBloodPageDetails,
  stepDetails,
} from "../../../data/content/need-blood";

const NeedBloodPage = () => {
  return (
    <>
      <HeaderComponent />
      <HeroComponent {...NeedBloodPageDetails.hero} />
      <SearchBloodStockComponent {...NeedBloodPageDetails.bloodStock} />
      <QuoteComponent {...NeedBloodPageDetails.quote} />
      <ThreeStepProcessComponent
        stepsText={NeedBloodPageDetails.stepsText}
        stepDetails={stepDetails}
      />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default NeedBloodPage;
