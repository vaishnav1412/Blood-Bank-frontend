import { FaPhoneAlt, FaMapMarkerAlt,FaEnvelope,FaPhone,FaWhatsapp, } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export  const contactDetails = [
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


  export const contactInfo = [
    {
      icon: <FaPhone className="text-xl" />,
      title: "Call Us",
      details: "+91 98765 43210",
      subtitle: "24/7 Emergency Helpline",
      action: "tel:+919876543210",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: <FaWhatsapp className="text-xl" />,
      title: "WhatsApp",
      details: "+91 98765 43210",
      subtitle: "Quick response guaranteed",
      action: "https://wa.me/919876543210",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <FaEnvelope className="text-xl" />,
      title: "Email Us",
      details: "help@bloodbank.com",
      subtitle: "Response within 2 hours",
      action: "mailto:help@bloodbank.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <FaMapMarkerAlt className="text-xl" />,
      title: "Visit Us",
      details: "123 Blood Center, City",
      subtitle: "Open 8 AM - 8 PM",
      action: "#locations",
      color: "from-purple-500 to-pink-500"
    }
  ];

  export const subjects = [
    "Blood Donation Query",
    "Become a Donor",
    "Emergency Request",
    "Organize Blood Drive",
    "Volunteer Opportunity",
    "General Inquiry",
    "Technical Support",
    "Partnership"
  ];