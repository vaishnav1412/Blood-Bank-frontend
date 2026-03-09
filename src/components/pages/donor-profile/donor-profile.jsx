import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import DonerProfile from "../../sections/doner-profile/donerProfile";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";
import {
  DonateBloodPageDetails,
  stepDetails,
} from "../../../data/content/userProfile";
const BloodDonerProfile = () => {
  return (
    <>
      <HeaderComponent />
      <HeroComponent {...DonateBloodPageDetails.hero} />
      <DonerProfile />
      <ThreeStepProcessComponent
        stepsText={DonateBloodPageDetails.stepsText}
        stepDetails={stepDetails}
      />
      <CriteriaComponent
        {...DonateBloodPageDetails.tips_for_managing_blood_loss}
      />
      <QuoteComponent {...DonateBloodPageDetails.quote} />
      <FooterComponent />
    </>
  );
};

export default BloodDonerProfile;
