import HeroComponent from "../../sections/hero/hero-component";
import TwoCtaComponent from "../../sections/two-cta/two-cta-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import SideBySideComponent from "../../sections/side-by-side/side-by-side-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

const HomePage = () => {
	const HomePageDetails = {
		donate_blood: {
			subheadingText: "Save Lives Today",
			headingText: "Donate Blood with Life Code",
			classHint: "side-col-image donate-blood-with-hemocell",
			paraText:
				"At Life Code, our mission is to create a life-saving bridge between blood donors and those in urgent need. We strive to make the process of finding and donating blood faster, easier, and more human-centered. By empowering local donors to register and connecting them directly with seekers, we ensure that no one faces delays in critical moments.Through real-time availability, transparent communication, and post-donation tracking, we aim to build a community where generosity meets technology — and every drop counts. Together, we are coding a future where timely blood access saves lives.",
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonText: "Donate Blood",
			buttonLink: "/donate-blood",
			buttonHave: true,
		},
		quote: {
			classHint: "quote",
			quoteText: `“The blood you donate gives someone another chance at life. One day that someone may be a close relative, a friend, a loved one—or even you.”`,
			
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
			buttonText: "Donate Blood",
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
			subheadingText: "Give the gift of life",
			headingText: "Your Blood Can Make A Difference",
			classHint: "home-page-hero",
		},
		stepsText: {
			subheadingText: "Donation Process",
			headingText: "Step-by-Step Guide to Donating Blood",
		},
	};

	const stepDetails = [
	{
		key: "donor-registration",
		stepNumber: "01",
		stepName: "Donor Registration",
		stepDescription:
			"Individuals register on the platform by providing their name, blood group, location, and contact details.",
	},
	{
		key: "visible-to-seekers",
		stepNumber: "02",
		stepName: "Visible to Blood Seekers",
		stepDescription:
			"Once registered, donor details become searchable for blood seekers based on location and blood group.",
	},
	{
		key: "seeker-contact",
		stepNumber: "03",
		stepName: "Contact by Seeker",
		stepDescription:
			"A blood seeker finds a matching donor and contacts them directly through the platform.",
	},
	{
		key: "blood-donation",
		stepNumber: "04",
		stepName: "Blood Donation",
		stepDescription:
			"The donor visits a hospital or blood bank and completes the donation process.",
	},
	{
		key: "mark-donated",
		stepNumber: "05",
		stepName: "Mark as Donated",
		stepDescription:
			"After donating, the donor marks their profile as 'Donated' on the website for accurate tracking.",
	},
	{
		key: "cooldown-period",
		stepNumber: "06",
		stepName: "3-Month Cooldown",
		stepDescription:
			"The donor’s profile is temporarily hidden from seekers for 3 months before becoming active again.",
	},
];


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
