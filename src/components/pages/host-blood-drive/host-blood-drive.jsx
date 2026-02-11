import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import HostBloodDrive from "../../sections/form/host-blood-drive";
import { stepDetails ,HostBloodDrivePageDetails } from "../../../data/content/camp";

const HostBloodDrivePage = () => {
  
  return (
    <>
      <HeaderComponent />
      <HeroComponent {...HostBloodDrivePageDetails.hero} />
      <HostBloodDrive />
      <ThreeStepProcessComponent
        stepsText={HostBloodDrivePageDetails.stepsText}
        stepDetails={stepDetails}
      /> 
      <SideBySideComponent {...HostBloodDrivePageDetails.benefits_host_drive} />
      <QuoteComponent {...HostBloodDrivePageDetails.quote} />
      <SideBySideComponent {...HostBloodDrivePageDetails.hosting_blood_drive} />
      <BeforeFooterCTA />
      <FooterComponent />
    </>
  );
};

export default HostBloodDrivePage;
