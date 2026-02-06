import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";

import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";
import ContactForm from "../../sections/form/form-component-otp";
import Axios from "axios";

import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";

const ForgotOtpPage = () => {
   const [formData, setFormData] = useState({
    otp: ["", "", "", ""],
});

    const handleSubmit = (e) => {
        e.preventDefault();

       
    };

    const ResetEmailCaptions = {
        hero: {
            subheadingText: "Got any Questions?",
            headingText: "Don't Know What to Do? Let Us Assist You.",
            classHint: "contact-page-hero",
        },
    };


 

    const ResetEmailDetails = [
        {
            key: "phone",
            stepNumber: <FaPhoneAlt />,
            stepName: "Phone",
            stepDescription: "(+91)-984-623-4567",
            stepUrl: "tel:+919846234567",
        },
        {
            key: "email",
            stepNumber: <MdEmail />,
            stepName: "Email",
            stepDescription: "help@lifecode.com",
            stepUrl: "mailto:help@lifecode.com",
        },
        {
            key: "address",
            stepNumber: <FaMapMarkerAlt />,
            stepName: "Address",
            stepDescription: "Kannur, kerala, Indian",
            stepUrl: "https://g.co/kgs/8Mt7Nh5",
        },
    ];

    return (
        <>
            <HeaderComponent />

            <HeroComponent {...ResetEmailCaptions .hero} />
            <ContactForm 
                heading={"Enter the OTP Sent to Your Email"}
                buttonText={"Verify OTP"}
                handleSubmit={handleSubmit}
                formData={formData}
                setFormData={setFormData}/>
            
            <ContactDetailsComponent contactDetails={ResetEmailDetails} />
            <BeforeFooterCTA />
            <FooterComponent />
        </>
    );
};

export default 	ForgotOtpPage;
