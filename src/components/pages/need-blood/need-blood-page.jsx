import { useState } from "react";
import HeroComponent from "../../sections/hero/hero-component";
import ThreeStepProcessComponent from "../../sections/three-step-process/three-step-process-component";
import QuoteComponent from "../../sections/quote/quote-component";
import CriteriaComponent from "../../sections/criteria/criteria-component";
import FormComponent from "../../sections/form/form-component";
import SearchBloodStockComponent from "../../sections/search-blood-stock/search-blood-stock-component";
import HeaderComponent from "../../sections/header/header-component";
import BeforeFooterCTA from "../../sections/before-footer-cta/before-footer-cta-components";
import FooterComponent from "../../sections/footer/footer-component";

import Axios from "axios";
import newUsersInsertRequest from "../../utility-functions/new-users-insert-request";

const NeedBloodPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		bloodType: "",
		message: "",
	});

	const handleSubmit = (e) => {
		e.preventDefault();

		console.log(formData);

		Axios.post("http://localhost:3001/create-need-blood", {
			name: formData.name,
			email: formData.email,
			phone: formData.phone,
			bloodType: formData.bloodType,
			message: formData.message,
		})
			.then((response) => {
				console.log("success");
				console.log(response.data);
			})
			.catch((error) => {
				console.log(error);
			});

		newUsersInsertRequest(formData, "need-blood");

		setFormData({
			name: "",
			email: "",
			phone: "",
			bloodType: "",
			message: "",
		});
	};

	const NeedBloodPageDetails = {
		quote: {
			classHint: "quote need-blood-quote",
			quoteText: `In a blood emergency? Tap below to contact our coordinator directly.`,
			buttonText: "Get Help Now",
			buttonLink: "tel:+919605368262",
			buttonHave: true,
		},
		tips_for_managing_blood_loss: {
			subheadingText: "",
			headingText: "Tips for Managing Blood Loss",
			classHint: "tips-for-managing-blood-loss",
			paraText: [
				`Stay calm and avoid any strenuous activity.`,
				`Elevate the affected area if possible to reduce blood flow.`,
				`Apply pressure to the wound to slow down or stop the bleeding.`,
				`Drink fluids such as water or sports drinks to help replenish lost fluids.`,
				`Consume foods that are high in iron and protein, such as spinach, beans, and lean meats to help replenish lost nutrients.`,
				`Consider taking iron supplements if recommended by your doctor.`,
				`Keep a record of any symptoms and changes in condition to share with medical professionals.`,
			],
			imageUrl: "../../../assets/images/blood-donation(1).jpg",
			buttonHave: false,
		},
		hero: {
			subheadingText: "",
			headingText: "",
			classHint: "hero need-blood-page-hero",
		},
		stepsText: {
	subheadingText: "Finding Blood Donors",
	headingText: "Easily connect with nearby eligible donors in just a few steps.",
}
,
		bloodStock: {
			subheadingText: "Find Blood Donors",
			headingText: "Search and connect with eligible donors in your area",
			classHint: "search-blood-stock",
		},
	};

	const stepDetails = [
	{
		key: "need-blood",
		stepNumber: "01",
		stepName: "Go to 'Need Blood' Portal",
		stepDescription:
			"No registration required. Simply visit the 'Need Blood' section to start your search.",
	},
	{
		key: "filter-donor",
		stepNumber: "02",
		stepName: "Filter Donors",
		stepDescription:
			"Select your district, taluk, and required blood group to find eligible donors near you.",
	},
	{
		key: "view-donors",
		stepNumber: "03",
		stepName: "View Eligible Donors",
		stepDescription:
			"See the names and contact details of donors who live in your taluk and are eligible to donate (3+ months since last donation).",
	},
];


	

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
			{/* <CriteriaComponent
				{...NeedBloodPageDetails.tips_for_managing_blood_loss}
			/> */}
			<BeforeFooterCTA />
			<FooterComponent />
		</>
	);
};

export default NeedBloodPage;
