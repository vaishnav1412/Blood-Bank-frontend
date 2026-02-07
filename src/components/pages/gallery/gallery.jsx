import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";
import HeroComponent from "../../sections/hero/gallery-hero";
import DonationGallery from "../../sections/gallery/gallery-layout";
const Gallery = () => {
  const HomePageDetails = {
    hero: {
      classHint: "home-page-hero",
    },
  };
  return (
    <div>
      <HeaderComponent />
      <HeroComponent {...HomePageDetails.hero} />
      <DonationGallery/>
      <FooterComponent />
    </div>
  );
};

export default Gallery;
