
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import DonerProfile from "../../sections/doner-profile/donerProfile";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import HeaderComponent from "../../sections/header/header-component";
import FooterComponent from "../../sections/footer/footer-component";





const BloodDonerProfile = () => {
    

    

    const DonateBloodPageDetails = {
        quote: {
            classHint: "quote",
            quoteText: `“Your profile reflects your power to save lives. Stay committed, stay ready—be someone's lifeline.”`,
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
            subheadingText: "",
            headingText: "",
            classHint: "donate-blood-page-hero",
        },
        stepsText: {
            subheadingText: "Donation Process",
            headingText: "Step-by-Step Guide to Donating Blood",
        },
         tips_for_managing_blood_loss: {
	subheadingText: "Tips for Managing Blood Loss",
	headingText: "Take Care After Experiencing Blood Loss",
	paraText: [
		"Stay hydrated—drink plenty of water, juice, or electrolyte-rich fluids.",
		"Eat iron-rich foods like leafy greens, red meat, lentils, and fortified cereals.",
		"Include vitamin C in your meals to help absorb iron more effectively.",
		"Get adequate rest—avoid physical exertion until you feel fully recovered.",
		"Monitor for symptoms like dizziness, fatigue, or shortness of breath and seek medical attention if needed.",
		"Avoid alcohol and smoking during the recovery period.",
		"Track your hemoglobin levels if advised by a healthcare professional.",
	],
classHint:"ide-col-image tips-for-managing-blood-loss",},};
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
]



    return (
        <>
            <HeaderComponent />

            <HeroComponent {...DonateBloodPageDetails.hero} />
           <DonerProfile/>
            <ThreeStepProcessComponent
                stepsText={DonateBloodPageDetails.stepsText}
                stepDetails={stepDetails}
            />
           <CriteriaComponent {...DonateBloodPageDetails.tips_for_managing_blood_loss} />
            
            <QuoteComponent {...DonateBloodPageDetails.quote} />
           
            <FooterComponent />
        </>
    );
};

export default BloodDonerProfile;
