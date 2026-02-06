
import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";


export const ResetEmailDetails = [
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


    export  const ResetEmailCaptions = {
    hero: {
      subheadingText: "Got any Questions?",
      headingText: "Don't Know What to Do? Let Us Assist You.",
      classHint: "contact-page-hero",
    },
  };