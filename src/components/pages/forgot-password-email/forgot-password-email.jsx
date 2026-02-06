import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import ContactForm from "../../sections/form/contact-form";
import ContactDetailsComponent from "../../sections/details/details-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

import Axios from "axios";

import { FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";

const ForgotEmailPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		reason: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(formData);

		Axios.post("http://localhost:3001/create-need-help", {
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			reason: formData.reason,
			message: formData.message,
		})
			.then((response) => {
				console.log("success");
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});

		newUsersInsertRequest(formData, "need-help");

		setFormData({
			name: "",
			email: "",
			phone: "",
			reason: "",
			message: "",
		});
	};

	const ResetEmailCaptions = {
		hero: {
			subheadingText: "Got any Questions?",
			headingText: "Don't Know What to Do? Let Us Assist You.",
			classHint: "contact-page-hero",
		},
	};


	const fields = [
		
		{ key: "email", name: "email", type: "email", placeholder: "Email", required: true },
		
	];

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
			<ContactForm fields={fields}
				heading={"We’ll Help You Get Back In"}
				buttonText={"Get OTP"}
				handleSubmit={handleSubmit}
				formData={formData}
				setFormData={setFormData}/>
			
			<ContactDetailsComponent contactDetails={ResetEmailDetails} />
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default 	ForgotEmailPage;
